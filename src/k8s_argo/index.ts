
import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

interface Options {

};

class K8SArgo extends pulumi.ComponentResource  {
  constructor(name: string, { } : Options,  opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:gke-argo", name, { }, opts);

    const defaultOpts = { parent: this }

    const ns = new k8s.core.v1.Namespace("argo", {
      metadata: { name: "argo" }
    }, { parent: this });

    const argo = new k8s.yaml.ConfigGroup("argo", {
      files: `${__dirname}/manifests/*.yml`
    }, {
      ...defaultOpts,
      dependsOn: [ns]
    });
  }
}

export { K8SArgo }
