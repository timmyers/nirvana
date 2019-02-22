
import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

interface Options {

};

class K8SCertManager extends pulumi.ComponentResource  {
  constructor(name: string, { } : Options,  opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:gke-cert-manager", name, { }, opts);

    const defaultOpts = { parent: this }

    const certManager = new k8s.helm.v2.Chart("cert-manager", {
      namespace: "kube-system",
      repo: "stable",
      chart: "cert-manager",
      version: "0.6.5"
    });
  }
}

export { K8SCertManager }
