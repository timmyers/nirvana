import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

interface Options {
  loadBalancer?: boolean;
}

class K8SIngressNginx extends pulumi.ComponentResource {
  public constructor(name: string, { loadBalancer }: Options, opts?: pulumi.ComponentResourceOptions) {
    super('nirvana:k8s-ingress-nginx', name, { }, opts);

    const defaultOpts = { parent: this };

    const nginxIgnored = new k8s.helm.v2.Chart('ingress', {
      repo: 'stable',
      chart: 'nginx-ingress',
      version: '1.3.1',
      values: {
        controller: {
          service: {
            type: loadBalancer ? 'LoadBalancer' : 'NodePort',
          },
          kind: loadBalancer ? 'Deployment' : 'DaemonSet',
          daemonset: {
            useHostPort: !loadBalancer,
          },
          hostNetwork: !loadBalancer,
        },
        defaultBackend: {
          resources: {
            limits: {
              cpu: '50m',
              memory: '50Mi',
            },
            requests: {
              cpu: '10m',
              memory: '10Mi',
            },
          },
        },
      },
    }, defaultOpts);
  }
}

export default K8SIngressNginx;
