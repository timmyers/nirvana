
import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';

interface Options {
  project: pulumi.Input<string>,
};

class GCPIdentity extends pulumi.ComponentResource  {
  infraCISecret: pulumi.Output<string>

  constructor(name: string, { project } : Options,  opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:gcp-identity", name, { }, opts);

    const infraCI = new gcp.serviceAccount.Account("infra", {
      project,
      accountId: "infra-ci",
      displayName: "Infrastructure CI account"
    });

    const roles = [
      "roles/container.clusterAdmin",
      "roles/iam.serviceAccountUser",
      "roles/compute.instanceAdmin"
    ];
    
    const infraCiRoles = roles.map(role => new gcp.projects.IAMMember(role, {
      project,
      role,
      member: infraCI.email.apply(email => `serviceAccount:${email}`),
    }));

    const infraCiKey = new gcp.serviceAccount.Key("infra", { 
      serviceAccountId: infraCI.name
    })

    this.infraCISecret = infraCiKey.privateKey.apply(key => (
      JSON.parse(Buffer.from(key, "base64").toString("ascii")))
    );

    this.registerOutputs({
      infraCISecret: this.infraCISecret
    });
  }
}

export { GCPIdentity }
