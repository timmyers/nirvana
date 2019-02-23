
import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

interface Options {

};

class K8SCertManager extends pulumi.ComponentResource  {
  constructor(name: string, { } : Options,  opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:gke-cert-manager", name, { }, opts);

    const defaultOpts = { parent: this }

    const ns = new k8s.core.v1.Namespace("cert-manager", {
      metadata: { 
        name: "cert-manager",
        labels: {
          "certmanager.k8s.io/disable-validation": "true"
        }
      }
    }, { parent: this });

    const certManager = new k8s.helm.v2.Chart("cert-manager", {
      namespace: "cert-manager",
      repo: "stable",
      chart: "cert-manager",
      version: "0.5.2"
    }, {
      ...defaultOpts,
      dependsOn: [ns]
    });

    const issuer = new k8s.yaml.ConfigFile("letsencrypt-issuer", {
      file: `${__dirname}/letsencrypt-issuer.yml`
    }, {
      ...defaultOpts,
      dependsOn: [ns]
    });
  }
}

export { K8SCertManager }
