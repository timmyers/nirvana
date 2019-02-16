import * as pulumi from '@pulumi/pulumi';
import { EKSVPC } from './vpc';
import { EKSServiceRole } from './iam';
import { EKSCluster } from './eks';
import { EKSWorkerGroup } from './asg';

class AWSK8SCluster extends pulumi.ComponentResource  {

  constructor(name: string, opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:aws-k8s-cluster", name, { }, opts);

    const serviceRole = new EKSServiceRole("eks-iam", this)
    const vpc = new EKSVPC("eks-vpc", this);
    const workerGroup = new EKSWorkerGroup("eks-worker-group", {}, this)

    const cluster = new EKSCluster("eks-cluster", {
      serviceRole,
      vpc,
    }, this)
  }
}

export { AWSK8SCluster }
