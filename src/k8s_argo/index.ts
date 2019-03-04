import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import * as path from 'path';

class K8SArgo extends pulumi.ComponentResource {
  public constructor(name: string, settingsIgnored: {}, opts?: pulumi.ComponentResourceOptions) {
    super('nirvana:gke-argo', name, { }, opts);

    const defaultOpts = { parent: this };

    const ns = new k8s.core.v1.Namespace('argo', {
      metadata: { name: 'argo' },
    }, defaultOpts);

    const nscd = new k8s.core.v1.Namespace('argocd', {
      metadata: { name: 'argocd' },
    }, defaultOpts);

    const argoIgnored = new k8s.yaml.ConfigGroup('argo', {
      files: path.relative(process.cwd(), `${__dirname}/manifests/*.yml`),
    }, {
      ...defaultOpts,
      dependsOn: [ns, nscd],
    });
  }
}

export default K8SArgo
