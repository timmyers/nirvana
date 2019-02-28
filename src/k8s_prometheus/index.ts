
import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

interface Options {
  gcp?: boolean
};

class K8SPrometheus extends pulumi.ComponentResource  {
  constructor(name: string, { } : Options,  opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:k8s-prometheus", name, { }, opts);

    const defaultOpts = { parent: this }

    const ns = new k8s.core.v1.Namespace("prometheus", {
      metadata: { name: "prometheus" }
    }, { parent: this });

    const prometheus = new k8s.helm.v2.Chart("prometheus", {
      namespace: "prometheus",
      repo: "stable",
      chart: "prometheus-operator",
      version: "2.2.7",
      values: { 
      }
    }, defaultOpts);
  }
}

export { K8SPrometheus }
