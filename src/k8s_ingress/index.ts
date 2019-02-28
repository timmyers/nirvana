
import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

interface Options {

};

class K8SIngress extends pulumi.ComponentResource  {
  constructor(name: string, { } : Options,  opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:k8s-ingress", name, { }, opts);

    const defaultOpts = { parent: this }

    const ingress = new k8s.extensions.v1beta1.Ingress("ingress", {
      metadata: {
        name: "tmye-me",
        annotations: {
          "external-dns.alpha.kubernetes.io/ttl": "10",
          "certmanager.k8s.io/cluster-issuer": "letsencrypt-prod",
          "certmanager.k8s.io/acme-http01-edit-in-place": "true",
        }
      },
      spec: {
        rules: [{
          host: "opsview.tmye.me",
          http: {
            paths: [{
              backend: {
                serviceName: "kube-ops-view",
                servicePort: 80
              }
            }]
          }
        // }, {
        //   host: "jenkins.tmye.me",
        //   http: {
        //     paths: [{
        //       backend: {
        //         serviceName: "jenkins",
        //         servicePort: 80
        //       }
        //     }]
        //   }
        }],
        tls: [
          {
            secretName: "tmye-me-tls",
            hosts: [
              "opsview.tmye.me",
              "jenkins.tmye.me"
            ]
          }
        ]
      }
    }, defaultOpts)
  }
}

export { K8SIngress }
