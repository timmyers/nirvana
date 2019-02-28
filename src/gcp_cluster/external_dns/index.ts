import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';


interface Options {
};

class GKEExternalDNS extends pulumi.ComponentResource  {
  constructor(name: string, { } : Options, opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:gke-external-dns", name, { }, opts);

    const defaultOpts = { parent: this }

    const fileName = `external-dns.yml`;
    const externalDNS = new k8s.yaml.ConfigFile(fileName, {
      file: `${__dirname}/${fileName}`,
    }, defaultOpts);
  }
}

export { GKEExternalDNS }
