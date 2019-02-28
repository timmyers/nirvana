import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import * as path from 'path';

interface Options {

};

class K8SArgo extends pulumi.ComponentResource  {
  constructor(name: string, { } : Options,  opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:gke-argo", name, { }, opts);

    const defaultOpts = { parent: this }

    const ns = new k8s.core.v1.Namespace("argo", {
      metadata: { name: "argo" }
    }, { parent: this });

    const nscd = new k8s.core.v1.Namespace("argocd", {
      metadata: { name: "argocd" }
    }, { parent: this });

    const argo = new k8s.yaml.ConfigGroup("argo", {
      files: path.relative(process.cwd(), `${__dirname}/manifests/*.yml`)
    }, {
      ...defaultOpts,
      dependsOn: [ns, nscd]
    });
  }
}

export { K8SArgo }
