import * as readYaml from 'read-yaml';
import K8SCluster from '../k8s_cluster';

const parseConfig = async () => {
  const config: any = await new Promise((req, rej) => {
    readYaml('../config.yml', (err: Error, data: any) => {
      if (err) rej(err);
      req(data);
    })
  });
  
  config.forEach((item: any) => {
    if (item.hasOwnProperty('cluster')) {
      const cluster: any = item.cluster;
      const clusterUnused = new K8SCluster(cluster.name, cluster)
    }
  });
}

export default parseConfig;
