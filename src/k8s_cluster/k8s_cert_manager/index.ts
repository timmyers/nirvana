
import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

class K8SCertManager extends pulumi.ComponentResource {
  public constructor(name: string, settingsIgnored: {}, opts?: pulumi.ComponentResourceOptions) {
    super('nirvana:k8s-cert-manager', name, { }, opts);

    const defaultOpts = { parent: this };

    const certManagerIgnored = new k8s.helm.v2.Chart('cert-manager', {
      repo: 'stable',
      chart: 'cert-manager',
      version: '0.5.2',
    }, defaultOpts);

    const issuerIgnored = new k8s.yaml.ConfigFile('letsencrypt-issuer', {
      file: `${__dirname}/letsencrypt-issuer.yml`,
    }, defaultOpts);
  }
}

export { K8SCertManager }
