import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import * as path from 'path';

class K8SOpsView extends pulumi.ComponentResource {
  public constructor(name: string, settingsIgnored: {}, opts?: pulumi.ComponentResourceOptions) {
    super('nirvana:k8s-opsview', name, { }, opts);

    const defaultOpts = { parent: this };

    const opsViewIgnored = new k8s.yaml.ConfigGroup('opsview', {
      files: path.relative(process.cwd(), `${__dirname}/manifests/*.yml`),
    }, defaultOpts);
  }
}

export default K8SOpsView;
