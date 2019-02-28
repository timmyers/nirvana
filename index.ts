import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { AWSK8SCluster } from './src/eks_cluster';
import { GCPK8SCluster } from './src/gcp_cluster';
import { K8SOpsView } from './src/k8s_opsview';
import { K8SJenkins } from './src/k8s_jenkins';
import { K8SIngress } from './src/k8s_ingress';
import { K8SArgo } from './src/k8s_argo';
import { K8SKubeStateMetrics } from './src/k8s_kube_state_metrics';
import { GCPDNSZone } from './src/gcp_dns_zone'
import { NameComNameservers } from './src/name_com_nameservers'
import { GCPIdentity } from './src/identity/gcp';


(async () => {
  const dnsZone = new GCPDNSZone("tmye.me", {
    dnsName: "tmye.me."
  });

  const nameServers = new NameComNameservers("tmye.me", {
    domainName: "tmye.me",
    nameServers: dnsZone.dnsZone.apply(d => d.nameServers)
  });

  const gcpIdentity = new GCPIdentity("infra", {
    project: 'nirvana-232117'
  })

  // gcpIdentity.infraCISecret.apply(s => console.log(JSON.stringify(s)));

  // const cluster = new GCPK8SCluster("cluster", {
  //   machineType: 'g1-small',
  //   externalDns: true,
  //   certManager: true,
  //   prometheus: false,
  // });

  // const defaultOpts = {
  //   providers: {
  //     kubernetes: cluster.k8sProvider
  //   }
  // };

  // const opsView = new K8SOpsView("opsview", {}, defaultOpts);
  // // const jenkins = new K8SJenkins("jenkins", {}, defaultOpts);

  // const ingress = new K8SIngress("ingress", {}, {
  //   ...defaultOpts,
  //   // dependsOn: [opsView, jenkins]
  //   dependsOn: [opsView]
  // })

  // const argo = new K8SArgo("argo", {}, defaultOpts);

  // const metrics = new K8SKubeStateMetrics("kubestatemetrics", {}, {
  //   providers: {
  //     kubernetes: cluster.k8sProvider
  //   }
  // });

})()


