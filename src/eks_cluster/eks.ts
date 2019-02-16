import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { EKSVPC } from './vpc';
import { EKSServiceRole } from './iam';
import { Subnet } from '@pulumi/aws/ec2';

interface EKSClusterOptions {
  serviceRole: EKSServiceRole,
  vpc: EKSVPC,
};

class EKSCluster extends pulumi.ComponentResource  {
  cluster: pulumi.Output<aws.eks.Cluster>;
  kubeconfig: pulumi.Output<any>;

  constructor(name: string, { serviceRole, vpc } : EKSClusterOptions, parent: pulumi.Resource, opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:eks-cluster", name, {}, { parent, ...opts });

    const defaultOpts = { parent: this }
    
    // This is confusing
    const publicSubnetIDs = vpc.publicSubnets.apply(s => s.map(s => s.id))
    const privateSubnetIDs = vpc.privateSubnets.apply(s => s.map(s => s.id))

    const subnetIDs = pulumi.all([publicSubnetIDs, privateSubnetIDs]).apply(([pub, priv]) => {
      return [...pub, ...priv];
    });

    subnetIDs.apply(s => console.log(s));

    const cluster = new aws.eks.Cluster("cluster", {
      name: "nirvana",
      roleArn: serviceRole.role.apply(r => r.arn),
      vpcConfig: {
        securityGroupIds: [],
        subnetIds: subnetIDs,
      }
    }, defaultOpts);

    const kubeconfig = pulumi.all([cluster.name, cluster.endpoint, cluster.certificateAuthority])
      .apply(([clusterName, clusterEndpoint, clusterCertificateAuthority]) => {
        return {
          apiVersion: "v1",
          clusters: [{
            cluster: {
              server: clusterEndpoint,
              "certificate-authority-data": clusterCertificateAuthority.data,
            },
            name: "kubernetes",
          }],
          contexts: [{
            context: {
              cluster: "kubernetes",
              user: "aws",
            },
            name: "aws",
          }],
          "current-context": "aws",
          kind: "Config",
          users: [{
            name: "aws",
            user: {
              exec: {
                apiVersion: "client.authentication.k8s.io/v1alpha1",
                command: "aws-iam-authenticator",
                args: ["token", "-i", clusterName],
              },
            },
          }],
        };
      });

    this.cluster = cluster.id.apply(() => cluster);
    this.kubeconfig = kubeconfig.apply(() => kubeconfig);

    this.registerOutputs({ 
      cluster: this.cluster,
      kubeconfig: this.kubeconfig,
    });
  }
}

export { EKSCluster }
