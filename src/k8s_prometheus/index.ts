
import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

interface Options {
  gcp?: boolean
};

class K8SPrometheus extends pulumi.ComponentResource  {
  constructor(name: string, { } : Options,  opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:k8s-prometheus", name, { }, opts);

    const defaultOpts = { parent: this }

    const prometheus = new k8s.helm.v2.Chart("prometheus", {
      namespace: "prometheus",
      repo: "stable",
      chart: "prometheus",
      version: "8.7.1",
      values: { }
    }, defaultOpts);
  }
}

export { K8SPrometheus }
