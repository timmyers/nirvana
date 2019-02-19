import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';


interface Options {
  k8sProvider: k8s.Provider,
};

class GKEExternalDNS extends pulumi.ComponentResource  {
  deployment: pulumi.Output<k8s.extensions.v1beta1.Deployment>
  
  constructor(name: string, { k8sProvider } : Options, parent: pulumi.Resource, opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:gke-external-dns", name, { }, { parent, ...opts});

    const defaultOpts = { parent: this }

    const externalDNS = new k8s.yaml.ConfigFile("external-dns", {
      file: `${__dirname}/external-dns.yml`
    }, {
      ...defaultOpts,
      providers: {
        kubernetes: k8sProvider,
      }
    });

    this.deployment = externalDNS.getResource("extensions/v1beta1/Deployment", "external-dns").apply(r => r);
  }
}

export { GKEExternalDNS }
