import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import * as path from 'path';

interface Options {

};

class K8SOpsView extends pulumi.ComponentResource  {
  constructor(name: string, { } : Options,  opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:k8s-opsview", name, { }, opts);

    const defaultOpts = { parent: this }

    const opsView = new k8s.yaml.ConfigGroup("opsview", {
      files: path.relative(process.cwd(), `${__dirname}/manifests/*.yml`)
    }, defaultOpts);
  }
}

export { K8SOpsView }
