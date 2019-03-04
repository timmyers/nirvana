import * as readYaml from 'read-yaml';
import K8SCluster from '../k8s_cluster';
import GCPIdentity from '../identity/gcp';

const parseConfig = async (): Promise<void> => {
  const config: any = await new Promise((req, rej) => {
    readYaml('../infrastructure.yml', (err: Error, data: any) => {
      if (err) rej(err);
      req(data);
    });
  });

  config.forEach((item: any) => {
    if ('cluster' in item) {
      const { cluster } = item;
      const clusterIgnored = new K8SCluster(cluster.name, cluster);
    } else if ('identity' in item) {
      const { identity } = item;
      const identityIgnored = new GCPIdentity('infra', identity.gcp);
    }
  });
};

export default parseConfig;
