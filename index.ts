import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { AWSK8SCluster } from './src/eks_cluster';
import { GCPK8SCluster } from './src/gcp_cluster';
import { K8SOpsView } from './src/k8s_opsview';
import { K8SCertManager } from './src/k8s_cert_manager';
import { K8SArgo } from './src/k8s_argo';
import { K8SKubeStateMetrics } from './src/k8s_kube_state_metrics';
import { GCPDNSZone } from './src/gcp_dns_zone'
import { NameComNameservers } from './src/name_com_nameservers'


(async () => {
  const dnsZone = new GCPDNSZone("tmye.me", {
    dnsName: "tmye.me."
  });

  const cluster = new GCPK8SCluster("cluster", {
    machineType: 'g1-small'
  });

  const nameServers = new NameComNameservers("tmye.me", {
    domainName: "tmye.me",
    nameServers: dnsZone.dnsZone.apply(d => d.nameServers)
  });

  const defaultOpts = {
    providers: {
      kubernetes: cluster.k8sProvider
    }
  };

  const opsView = new K8SOpsView("opsview", {}, defaultOpts);
  const certManager = new K8SCertManager("cert-manager", {}, defaultOpts);

  const argo = new K8SArgo("argo", {}, defaultOpts);

  const metrics = new K8SKubeStateMetrics("kubestatemetrics", {}, {
    providers: {
      kubernetes: cluster.k8sProvider
    }
  });

})()


