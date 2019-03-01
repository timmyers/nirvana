import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

interface Options {
  hostName: string;
  gcp?: boolean;
  nginxIngress?: boolean;
}

class K8SPrometheus extends pulumi.ComponentResource {
  public constructor(name: string, {
    hostName,
    nginxIngress,
  }: Options, opts?: pulumi.ComponentResourceOptions) {
    super('nirvana:k8s-prometheus', name, { }, opts);

    const defaultOpts = { parent: this };

    const prometheusIgnored = new k8s.helm.v2.Chart('prometheus', {
      repo: 'stable',
      chart: 'prometheus-operator',
      version: '2.2.7',
      values: {
        grafana: {
          ingress: {
            enabled: nginxIngress,
            hosts: [hostName],
            annotations: nginxIngress ? {
              'kubernetes.io/ingress.class': 'nginx',
              'certmanager.k8s.io/cluster-issuer': 'letsencrypt-prod',
              'certmanager.k8s.io/acme-http01-edit-in-place': 'true',
            } : {},
            tls: [{
              secretName: 'grafna-tmye-me-tls',
              hosts: [hostName],
            }],
          },
        },
      },
    }, defaultOpts);

    this.registerOutputs();
  }
}

export default K8SPrometheus;
