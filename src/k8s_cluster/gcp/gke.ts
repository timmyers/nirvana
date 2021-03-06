import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import * as k8s from '@pulumi/kubernetes';

interface Options {
  machineType: string;
  maxNodeCount: number;
  stackDriver: boolean;
}

class GKECluster extends pulumi.ComponentResource {
  public cluster: pulumi.Output<gcp.container.Cluster>;

  public k8sProvider: k8s.Provider;

  public constructor(name: string, {
    machineType,
    maxNodeCount,
    stackDriver,
  }: Options,
  parent: pulumi.Resource, opts?: pulumi.ComponentResourceOptions) {
    super('nirvana:gke-cluster', name, {}, { parent, ...opts });

    const defaultOpts = { parent: this };

    const cluster = new gcp.container.Cluster('cluster', {
      minMasterVersion: '1.11.7-gke.4',
      nodePools: [
        {
          name: 'default',
          initialNodeCount: 2,
          autoscaling: {
            minNodeCount: 1,
            maxNodeCount,
          },
          nodeConfig: {
            machineType,
            diskSizeGb: 30,
            diskType: 'pd-standard',
            oauthScopes: [
              'https://www.googleapis.com/auth/compute',
              'https://www.googleapis.com/auth/devstorage.read_only',
              'https://www.googleapis.com/auth/logging.write',
              'https://www.googleapis.com/auth/monitoring',
              'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
            ],
          },
          management: {
            autoRepair: true,
            autoUpgrade: true,
          },
        },
      ],
      loggingService: stackDriver ? 'logging.googleapis.com/kubernetes' : 'none',
      monitoringService: stackDriver ? 'monitoring.googleapis.com/kubernetes' : 'none',
      // ipAllocationPolicy: {
      //   clusterIpv4CidrBlock: '10.128.0.0/20',
      // },
      addonsConfig: {
        horizontalPodAutoscaling: { disabled: true },
        kubernetesDashboard: { disabled: true },
        httpLoadBalancing: { disabled: false },
        networkPolicyConfig: { disabled: true },
      },
    }, {
      // protect: true
      ...defaultOpts,
    });

    const k8sConfig = pulumi
      .all([cluster.name, cluster.endpoint, cluster.masterAuth])
      .apply(([contextNameIgnored, endpoint, auth]) => {
        const context = `${gcp.config.project}_${gcp.config.zone}_${name}`;
        return `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${auth.clusterCaCertificate}
    server: https://${endpoint}
  name: ${context}
contexts:
- context:
    cluster: ${context}
    user: ${context}
  name: ${context}
current-context: ${context}
kind: Config
preferences: {}
users:
- name: ${context}
  user:
    auth-provider:
      config:
        cmd-args: config config-helper --format=json
        cmd-path: gcloud
        expiry-key: '{.credential.token_expiry}'
        token-key: '{.credential.access_token}'
      name: gcp
`;
      });


    // Create admin role binding so we can create other role bindings
    const adminClusterRoleBinding = new k8s.rbac.v1beta1.ClusterRoleBinding('admin', {
      roleRef: {
        name: 'cluster-admin',
        apiGroup: 'rbac.authorization.k8s.io',
        kind: 'ClusterRole',
      },
      subjects: [
        {
          kind: 'User',
          name: 'TimMyers09@gmail.com',
        },
      ],
    }, {
      ...defaultOpts,
      provider: new k8s.Provider('k8s-internal', {
        kubeconfig: k8sConfig,
      }, defaultOpts),
    });

    // Wait for cluster and admin role
    this.cluster = pulumi.all([
      cluster.id, 
      adminClusterRoleBinding.id,
    ]).apply(() => cluster);

    this.k8sProvider = new k8s.Provider('k8s', {
      kubeconfig: adminClusterRoleBinding.id.apply(() => k8sConfig),
    }, defaultOpts);

    this.registerOutputs({
      cluster: this.cluster,
      k8sProvider: this.k8sProvider,
    });
  }
}

export default GKECluster;
