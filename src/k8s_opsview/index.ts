
import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

interface Options {

};

class K8SOpsView extends pulumi.ComponentResource  {
  constructor(name: string, { } : Options,  opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:k8s-opsview", name, { }, opts);

    const defaultOpts = { parent: this }

    const opsView = new k8s.yaml.ConfigGroup("opsview", {
      files: `${__dirname}/manifests/*.yml`
    }, defaultOpts);

    // The ingress must be created after the deployment so health check is picked up
    // const deployment = opsView.getResource("apps/v1/Deployment", "kube-ops-view")

    // const opsViewIngress = new k8s.yaml.ConfigFile("opsview", {
    //   file: `${__dirname}/ingress.yml`
    // }, {
    //   ...defaultOpts,
    //   dependsOn: [deployment]
    // });
  }
}

export { K8SOpsView }
