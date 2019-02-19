import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

interface K8SHelloWorldOptions {
  k8sProvider: k8s.Provider,
};

class K8SHelloWorld extends pulumi.ComponentResource  {

  constructor(name: string, { k8sProvider } : K8SHelloWorldOptions, parent: pulumi.Resource | undefined, opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:k8s-hello-world", name, { }, opts);

    const defaultOpts = { parent: this }

    const nginxLabels = { app: "nginx" };
    const nginxDeployment = new k8s.apps.v1.Deployment("nginx-deployment", {
        spec: {
            selector: { matchLabels: nginxLabels },
            replicas: 2,
            template: {
                metadata: { labels: nginxLabels },
                spec: {
                    containers: [{
                        resources: {
                          requests: {
                            cpu: "10m"
                          }
                        },
                        name: "nginx",
                        image: "nginx:1.7.9",
                        ports: [{ containerPort: 80 }]
                    }],
                },
            },
        },
    }, {
      ...defaultOpts,
      provider: k8sProvider,
    });

    const nginxService = new k8s.core.v1.Service("nginx-service", {
      metadata: {
        name: "nginx",
        annotations: {
          "external-dns.alpha.kubernetes.io/hostname": "k8s.tmye.me."
        }
      },
      spec: {
        ports: [
          {
            protocol: "TCP",
            port: 80
          }
        ],
        selector: {
          app: "nginx"
        },
        type: "LoadBalancer",
      }
    }, {
      ...defaultOpts,
      provider: k8sProvider,
    });

    const nginxLB = new k8s.extensions.v1beta1.Ingress("nginx-ingress", {
      metadata: {
        name: "nginx"
      },
      spec: {
        rules: [
          {
            host: "k8slb.tmye.me",
            http: {
              paths: [
                {
                  backend: {
                    serviceName: "nginx",
                    servicePort: 80
                  }
                }
              ]
            }
          }
        ]
      }
    }, {
      ...defaultOpts,
      provider: k8sProvider,
    });
  }
}

export { K8SHelloWorld }
