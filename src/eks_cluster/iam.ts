import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

class EKSServiceRole extends pulumi.ComponentResource  {
  readonly role: pulumi.Output<aws.iam.Role>;

  constructor(name: string, parent: pulumi.Resource, opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:eks-service-role", name, {}, { parent, ...opts });

    const defaultOpts = { parent: this }

    const rolePolicy = pulumi.output(aws.iam.getPolicyDocument({
      statements: [{
        actions: ["sts:AssumeRole"],
        principals: [{
          identifiers: ["eks.amazonaws.com"],
          type: "Service",
        }],
      }],
    }));

    const role = new aws.iam.Role("eks-service", {
      assumeRolePolicy: rolePolicy.apply(p => p.json),
    }, defaultOpts)

    const serviceAttachment = new aws.iam.RolePolicyAttachment("service", {
      policyArn: 'arn:aws:iam::aws:policy/AmazonEKSServicePolicy',
      role: role,
    }, defaultOpts);

    const clusterAttachment = new aws.iam.RolePolicyAttachment("cluster", {
      policyArn: 'arn:aws:iam::aws:policy/AmazonEKSClusterPolicy',
      role: role,
    }, defaultOpts);

    this.role = pulumi.all([
      role.arn, 
      serviceAttachment.id,
      clusterAttachment.id,
    ]).apply(() => role);

    this.registerOutputs({ role: this.role });
  }
}

export { EKSServiceRole }
