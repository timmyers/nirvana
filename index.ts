import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { AWSK8SCluster } from './src/eks_cluster';
import { GCPK8SCluster } from './src/gcp_cluster';
import { K8SHelloWorld } from './src/k8s_hello_world';
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

  const helloWorld = new K8SHelloWorld("hello-world", {
    k8sProvider: cluster.k8sProvider,
  }, undefined);

})()


