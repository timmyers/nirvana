import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';

interface GCPDNSZoneOptions {
  dnsName: string,
};

class GCPDNSZone extends pulumi.ComponentResource  {
  dnsZone: pulumi.Output<gcp.dns.ManagedZone>

  constructor(name: string, { dnsName } : GCPDNSZoneOptions, parent: pulumi.Resource | undefined, opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:gcp-dns-zone", name, { }, opts);

    const defaultOpts = { parent: this }

    const dnsZone = new gcp.dns.ManagedZone("zone", {
      dnsName,
      description: `Managed zone for ${dnsName}`
    }, defaultOpts)

    this.dnsZone = dnsZone.nameServers.apply(() => dnsZone);

    this.registerOutputs({
      dnsZone: this.dnsZone
    })
  }
}

export { GCPDNSZone }
