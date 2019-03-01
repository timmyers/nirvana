
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
      repo: "stable",
      chart: "prometheus-operator",
      version: "2.2.7",
      values: { 
        grafana: {
          // ingress: {
          //   enabled: true,
          //   hosts: ["grafana.tmye.me"]
          // },
          service: {
            type: "LoadBalancer"
          }
        }
      }
    }, defaultOpts);
  }
}

export { K8SPrometheus }
