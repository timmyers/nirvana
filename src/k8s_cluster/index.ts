
import * as pulumi from '@pulumi/pulumi';
import GCPK8SCluster from './gcp';
import { K8SExternalDNS } from './k8s_external_dns';
import { K8SCertManager } from './k8s_cert_manager';
import K8SIngressNginx from './k8s_ingress_nginx';
import K8SOpsView from './k8s_ops_view';

interface Options {
  gcp?: any
  externalDns?: any
  certManager?: any
  ingressNginx?: any
  opsView?: any
};

class K8SCluster extends pulumi.ComponentResource  {
  constructor(name: string, { 
    gcp,
    externalDns,
    certManager,
    ingressNginx,
    opsView,
  } : Options,  opts?: pulumi.ComponentResourceOptions) {
    super('nirvana:k8s-cluster', name, { }, opts);

    const defaultOpts = { parent: this }

    if (gcp !== undefined) {
      const clusterUnused = new GCPK8SCluster('gcp-k8s-cluster', gcp, defaultOpts);
    }

    if (externalDns !== undefined) {
      const externalDnsResourceIgnored = new K8SExternalDNS('external-dns', externalDns, defaultOpts);
    }

    if (certManager !== undefined) {
      const certManagerResourceIgnored = new K8SCertManager('cert-manager', certManager, defaultOpts);
    }

    if (ingressNginx !== undefined) {
      const nginxIngressIgnored = new K8SIngressNginx('ingress-nginx', ingressNginx, defaultOpts);
    }

    if (opsView !== undefined) {
      const opsViewIgnored = new K8SOpsView('opsview', opsView, defaultOpts);
    }
    
    // if (prometheus === undefined || prometheus) {
    //   const prometheusIgnored = new K8SPrometheus('prometheus', { 
    //     hostName: 'grafana.tmye.me',
    //     gcp: true,
    //     nginxIngress: true,
    //   }, defaultOpts);
    // }

    this.registerOutputs();
  }
}

export default K8SCluster;
