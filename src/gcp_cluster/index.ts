import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import { GKECluster } from './gke'
import { GKEExternalDNS } from './external_dns'
import { K8SCertManager } from '../k8s_cert_manager'

interface Options {
  machineType: string
  externalDns?: boolean
  certManager?: boolean
};

class GCPK8SCluster extends pulumi.ComponentResource  {
  k8sProvider: k8s.Provider;

  constructor(name: string, { 
    machineType, 
    externalDns, 
    certManager, 
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


    this.registerOutputs({
      k8sProvider: this.k8sProvider,
    })
  }
}

export { GCPK8SCluster }
