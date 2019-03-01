import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

class K8SExternalDNS extends pulumi.ComponentResource {
  public constructor(name: string, settingsIgnored: {}, opts?: pulumi.ComponentResourceOptions) {
    super('nirvana:k8s-external-dns', name, { }, opts);

    const defaultOpts = { parent: this };

    const fileName = 'external-dns.yml';
    const externalDNSIgnored = new k8s.yaml.ConfigFile(fileName, {
      file: `${__dirname}/${fileName}`,
    }, defaultOpts);

    this.registerOutputs();
  }
}

export default K8SExternalDNS;
