
import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

interface Options {
  k8sProvider: k8s.Provider,
};

class K8SOpsView extends pulumi.ComponentResource  {
  // deployment: pulumi.Output<k8s.extensions.v1beta1.Deployment>
  
  constructor(name: string, { k8sProvider } : Options, parent: pulumi.Resource | undefined , opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:gke-external-dns", name, { }, { parent, ...opts});

    const defaultOpts = { parent: this }

    // GCP
    const opsView = new k8s.helm.v2.Chart("opsview", {
      chart: "kube-ops-view",
      repo: "stable",
      version: "0.7.0",
      values: {
        service: {
          type: "LoadBalancer"
        },
        ingress: {
          enabled: true,
          host: "k8slb.tmye.me",
        },
        rbac: {
          create: true
        }
      }
    }, {
      providers: {
        kubernetes: k8sProvider,
      }
    });

    // this.deployment = externalDNS.getResource("extensions/v1beta1/Deployment", "external-dns").apply(r => r);
  }
}

export { K8SOpsView }
