import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { AWSK8SCluster } from './src/eks_cluster';
import { GCPK8SCluster } from './src/gcp_cluster';
import { K8SOpsView } from './src/k8s_opsview';
import { K8SArgo } from './src/k8s_argo';
import { GCPDNSZone } from './src/gcp_dns_zone'
import { NameComNameservers } from './src/name_com_nameservers'


(async () => {
  // const cluster = new AWSK8SCluster("cluster");
  const cluster = new GCPK8SCluster("cluster");

  const dnsZone = new GCPDNSZone("tmye.me", {
    dnsName: "tmye.me."
  }, undefined)

  const nameServers = new NameComNameservers("tmye.me", {
    domainName: "tmye.me",
    nameServers: dnsZone.dnsZone.apply(d => d.nameServers)
  });

  const opsView = new K8SOpsView("opsview", {}, {
    providers: {
      kubernetes: cluster.k8sProvider
    }
  });

  const argo = new K8SArgo("argo", {}, {
    providers: {
      kubernetes: cluster.k8sProvider
    }
  });
})()


