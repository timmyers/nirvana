import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import { GKECluster } from './gke'
import { GKEExternalDNS } from './external_dns'
import { K8SCertManager } from '../k8s_cert_manager'
import { K8SPrometheus } from '../k8s_prometheus'

interface Options {
  machineType: string
  externalDns?: boolean
  certManager?: boolean
  prometheus?: boolean
};

class GCPK8SCluster extends pulumi.ComponentResource  {
  k8sProvider: k8s.Provider;

  constructor(name: string, { 
    machineType, 
    externalDns, 
    certManager, 
    prometheus,
  } : Options, opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:gcp-k8s-cluster", name, { }, opts);

    const cluster = new GKECluster("gke-cluster", {
      machineType,
    }, this)

    this.k8sProvider = cluster.k8sProvider;
  
    const defaultOpts = {
      parent: this,
      providers: { kubernetes: this.k8sProvider }
    } 

    if (externalDns == undefined || externalDns) {
      const externalDnsResource = new GKEExternalDNS("external-dns", {}, defaultOpts);
    }
    if (certManager == undefined || certManager) {
      const certManagerResource = new K8SCertManager("cert-manager", {}, defaultOpts);
    }
    if (prometheus == undefined || prometheus) {
      const prometheus = new K8SPrometheus("prometheus", { gcp: true }, defaultOpts);
    }


    this.registerOutputs({
      k8sProvider: this.k8sProvider,
    })
  }
}

export { GCPK8SCluster }
