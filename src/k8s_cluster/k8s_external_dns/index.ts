import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

export interface K8SExternalDNSOptions {
  dnsProvider: string;
  domainFilter: string;
  upsertOnly: boolean;
}

class K8SExternalDNS extends pulumi.ComponentResource {
  public constructor(name: string, {
    dnsProvider,
    domainFilter,
    upsertOnly,
  }: K8SExternalDNSOptions, opts?: pulumi.ComponentResourceOptions) {
    super('nirvana:k8s-external-dns', name, { }, opts);

    if (dnsProvider === undefined) {
      throw new Error('dnsProvider is undefined!');
    }
    if (domainFilter === undefined) {
      throw new Error('domainFilter is undefined!');
    }

    const defaultOpts = { parent: this };

    const fileName = 'external-dns.yml';
    const externalDNSIgnored = new k8s.yaml.ConfigFile(fileName, {
      file: `${__dirname}/${fileName}`,
      transformations: [(y) => {
        if (y.kind === 'Deployment') {
          y.spec.template.spec.containers[0].args.push(`--domain-filter=${domainFilter}`);
          y.spec.template.spec.containers[0].args.push(`--provider=${dnsProvider}`);

          if (upsertOnly) {
            y.spec.template.spec.containers[0].args.push('--policy=upsert-only');
          }

          // Things specific to cloudflare provider
          if (dnsProvider === 'cloudflare') {
            y.spec.template.spec.containers[0].args.push('--cloudflare-proxied');

            y.spec.template.spec.containers[0].env = [{ // eslint-disable-line no-param-reassign
              name: 'CF_API_EMAIL',
              valueFrom: {
                secretKeyRef: {
                  name: 'cloudflare',
                  key: 'email',
                },
              },
            }, {
              name: 'CF_API_KEY',
              valueFrom: {
                secretKeyRef: {
                  name: 'cloudflare',
                  key: 'apiKey',
                },
              },
            }];
          }
        }
      }],
    }, defaultOpts);

    if (dnsProvider === 'cloudflare') {
      if (process.env.CLOUDFLARE_EMAIL === undefined
          || process.env.CLOUDFLARE_APIKEY === undefined) {
        throw new Error('CLOUDFLARE_EMAIL or CLOUDFLARE_APIKEY env var undefined');
      }

      const cloudflareSecretIgnored = new k8s.core.v1.Secret('cloudflare', {
        metadata: { name: 'cloudflare' },
        type: 'Opaque',
        stringData: {
          email: process.env.CLOUDFLARE_EMAIL,
          apiKey: process.env.CLOUDFLARE_APIKEY,
        },
      }, defaultOpts);
    }

    this.registerOutputs();
  }
}

export default K8SExternalDNS;
