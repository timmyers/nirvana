import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

interface EKSWorkerGroupOptions {
};

class EKSWorkerGroup extends pulumi.ComponentResource  {

  constructor(name: string, { } : EKSWorkerGroupOptions, parent: pulumi.Resource, opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:eks-worker-group", name, {}, { parent, ...opts });

    const defaultOpts = { parent: this }
   
    const eksWorkerAmi = aws.getAmi({
      filters: [{
          name: "name",
          values: [ "amazon-eks-node-*" ],
      }],
      mostRecent: true,
      owners: [ "602401143452" ], // Amazon
    }).then((
      r => r.imageId
    ));
  }
}

export { EKSWorkerGroup }

