import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';

interface Options {
  project: pulumi.Input<string>;
}

class GCPIdentity extends pulumi.ComponentResource {
  public infraCISecret: pulumi.Output<string>;

  public constructor(name: string, { project }: Options, opts?: pulumi.ComponentResourceOptions) {
    super('nirvana:gcp-identity', name, { }, opts);

    const defaultOpts = { parent: this };

    const infraCI = new gcp.serviceAccount.Account('infra', {
      project,
      accountId: 'infra-ci',
      displayName: 'Infrastructure CI account',
    }, defaultOpts);

    const roles = [
      'roles/container.admin',
      'roles/iam.serviceAccountUser',
      'roles/compute.instanceAdmin',
    ];

    const infraCiRolesIgnored = roles.map(role => new gcp.projects.IAMMember(role, {
      project,
      role,
      member: infraCI.email.apply(email => `serviceAccount:${email}`),
    }, defaultOpts));

    const infraCiKey = new gcp.serviceAccount.Key('infra', { 
      serviceAccountId: infraCI.name,
    }, defaultOpts);

    this.infraCISecret = infraCiKey.privateKey.apply(key => (
      JSON.parse(Buffer.from(key, 'base64').toString('ascii'))
    ));

    // Print key
    // this.infraCISecret.apply(i => console.log(JSON.stringify(i)))

    this.registerOutputs({
      infraCISecret: this.infraCISecret,
    });
  }
}

export default GCPIdentity;
