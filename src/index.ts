import * as dotenv from 'dotenv';
import { GCPDNSZone } from './gcp_dns_zone';
import { NameComNameservers } from './name_com_nameservers';
import parseConfig from './config';

// Load env var file
dotenv.config();

(async () => {
  const nameServersIgnored = new NameComNameservers('tmye.me', {
    domainName: 'tmye.me',
    nameServers: [
      'gina.ns.cloudflare.com.',
      'rajeev.ns.cloudflare.com.',
    ],
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
})();
