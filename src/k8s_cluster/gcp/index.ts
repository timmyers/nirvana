import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import GKECluster from './gke';

interface Options {
  machineType: string;
  maxNodeCount: number;
}

class GCPK8SCluster extends pulumi.ComponentResource {
  public k8sProvider: k8s.Provider;

  public constructor(name: string, {
    machineType,
    maxNodeCount,
  }: Options, opts?: pulumi.ComponentResourceOptions) {
    super('nirvana:gcp-k8s-cluster', name, { }, opts);

    const cluster = new GKECluster('gke-cluster', {
      machineType,
      maxNodeCount,
    }, this);

    this.k8sProvider = cluster.k8sProvider;

    this.registerOutputs({
      k8sProvider: this.k8sProvider,
    });
  }
}

export default GCPK8SCluster;
