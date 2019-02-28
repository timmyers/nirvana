
import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

interface Options {

};

class K8SJenkins extends pulumi.ComponentResource  {
  constructor(name: string, { } : Options,  opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:gke-jenkins", name, { }, opts);

    const defaultOpts = { parent: this }

    const ns = new k8s.core.v1.Namespace("jenkins", {
      metadata: { 
        name: "jenkins",
      }
    }, { parent: this });

    const jenkins = new k8s.helm.v2.Chart("jenkins", {
      namespace: "jenkins",
      repo: "stable",
      chart: "jenkins",
      version: "0.32.8",
      values: {
        Master: {
          ServiceType: "NodePort",
          ServicePort: 80,
          AdminUser: 'admin',
          AdminPassword: 'admin',
          UseSecurity: true,
          InstallPlugins: [
            "kubernetes:1.14.5",
            "workflow-aggregator:2.6",
            "credentials-binding:1.17",
            "git:3.9.3",
            "workflow-job:2.31",
            "blueocean:1.11.1"
          ]
        },
        rbac: {
          install: true
        }
      }
    }, {
      ...defaultOpts,
      dependsOn: [ns]
    });
  }
}

export { K8SJenkins }
