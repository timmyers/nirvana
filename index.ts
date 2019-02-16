import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { AWSK8SCluster } from './src/eks_cluster';


(async () => {
  const cluster = new AWSK8SCluster("cluster");
})()


