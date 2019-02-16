import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';


class EKSVPC extends pulumi.ComponentResource  {
  vpc: pulumi.Output<aws.ec2.Vpc>;
  publicSubnets: pulumi.Output<aws.ec2.Subnet[]>
  privateSubnets: pulumi.Output<aws.ec2.Subnet[]>

  constructor(name: string, parent: pulumi.Resource, opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:eks-vpc", name, {}, { parent, ...opts });

    const defaultOpts = { parent: this }

    const vpc = new aws.ec2.Vpc("vpc", {
      cidrBlock: "10.0.0.0/16",
      tags: {
        Name: "nirvana"
      }
    }, defaultOpts)

    const numAZs = 2;
    const getAZNames = (async () => {
      const azs = await aws.getAvailabilityZones() 
      return azs.names.slice(0, numAZs)
    })()

    const publicSubnets = (async () => {
      const azNames = await getAZNames;
      // console.log('public:', azNames)

      return azNames.map((az, i) => new aws.ec2.Subnet(`public-${i}`, {
        vpcId: vpc.id,
        cidrBlock: `10.0.${i}.0/24`,
        availabilityZone: az,
        tags: {
          Name: `nirvana-public-${i}`,
          Tier: "public"
        },
      }, defaultOpts));
    })()

    const privateSubnets = (async () => {
      const azNames = await getAZNames;
      // console.log('private:', azNames)

      return azNames.map((az, i) => new aws.ec2.Subnet(`private-${numAZs + i}`, {
        vpcId: vpc.id,
        cidrBlock: `10.0.${numAZs + i}.0/24`,
        availabilityZone: az,
        tags: {
          Name: `nirvana-private-${numAZs + i}`,
          Tier: "private"
        },
      }, defaultOpts));
    })()

    const publicSubnetIDs = pulumi.output(publicSubnets).apply(s => s.map(s => s.id))
    const privateSubnetIDs = pulumi.output(privateSubnets).apply(s => s.map(s => s.id))

    this.vpc = pulumi.all([vpc.id, publicSubnetIDs, privateSubnetIDs]).apply(() => vpc);

    this.publicSubnets = publicSubnetIDs.apply(() => publicSubnets)
    this.privateSubnets = privateSubnetIDs.apply(() => privateSubnets)

    this.registerOutputs({ 
      vpc: this.vpc,
      publicSubnets: this.publicSubnets,
      privateSubnets: this.privateSubnets,
    });
  }
}

export { EKSVPC }
