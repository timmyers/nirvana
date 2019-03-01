import GCPK8SCluster from './gcp_cluster';
import { K8SOpsView } from './k8s_opsview';
import { K8SIngress } from './k8s_ingress';
import { GCPDNSZone } from './gcp_dns_zone';
import { NameComNameservers } from './name_com_nameservers';
import { GCPIdentity } from './identity/gcp';
import parseConfig from './config';

(async () => {
  const nameServersIgnored = new NameComNameservers('tmye.me', {
    domainName: 'tmye.me',
    nameServers: [
      'gina.ns.cloudflare.com.',
      'rajeev.ns.cloudflare.com.',
    ],
  });

  const gcpIdentityIgnored = new GCPIdentity('infra', {
    project: 'nirvana-232117',
  });

  await parseConfig();

  // const dnsZone = new GCPDNSZone('tmye.me', {
  //   dnsName: 'tmye.me.',
  // });
  // const nameServersGCPIgnored = new NameComNameservers('tmye.me', {
  //   domainName: 'tmye.me',
  //   nameServers: dnsZone.dnsZone.apply(d => d.nameServers),
  // });


  // gcpIdentity.infraCISecret.apply(s => console.log(JSON.stringify(s)));

  // const cluster = new GCPK8SCluster('cluster', {
  //   machineType: 'g1-small',
  //   externalDns: true,
  //   certManager: true,
  //   prometheus: false,
  //   nginxIngress: true,
  // });

  // const defaultOpts = {
  //   providers: {
  //     kubernetes: cluster.k8sProvider,
  //   },
  // };


  // // const jenkins = new K8SJenkins('jenkins', {}, defaultOpts);

  // const ingressIgnored = new K8SIngress('ingress', {}, {
  //   ...defaultOpts,
  //   // dependsOn: [opsView, jenkins]
  //   // dependsOn: [opsViewIgnored]
  // });

  // const argo = new K8SArgo('argo', {}, defaultOpts);
})();
