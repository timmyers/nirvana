import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import axios from 'axios';
import * as fs from 'fs';
import * as tar from 'tar';
import * as path from 'path';

interface Options {

};

class K8SKubeStateMetrics extends pulumi.ComponentResource  {
  constructor(name: string, { } : Options,  opts?: pulumi.ComponentResourceOptions) {
    super("nirvana:k8s-kubestatemetrics", name, { }, opts);

    const defaultOpts = { parent: this }

    const latestVersion = (async () => {
      const release = await axios.get('https://api.github.com/repos/kubernetes/kube-state-metrics/releases/latest');
      const tag = release.data.tag_name;

      if (!fs.existsSync(`${__dirname}/${tag}`)) {
        console.log('Getting latest version');

        const tarAddress = `https://github.com/kubernetes/kube-state-metrics/archive/${tag}.tar.gz`;
        const file = await axios.get(tarAddress, {
          responseType: 'arraybuffer'
        });
        const tarFileName = `${__dirname}/code.tar.gz`
        await new Promise((res, rej) => {
          fs.writeFile(tarFileName, Buffer.from(file.data), () => {
            fs.mkdir(`${__dirname}/${tag}`, () => res())
          });
        })
        await tar.x({
          cwd: `${__dirname}/${tag}`,
          file: tarFileName,
          strip: 2,
          filter: (path, entry) => path.indexOf('/kubernetes/') != -1 && path.indexOf('/vendor/') == -1
        })
        await new Promise((res, rej) => fs.unlink(tarFileName, () => res()))
      }

      const metrics = new k8s.yaml.ConfigGroup("kubestatemetrics", {
        files: `${__dirname}/${tag}/*.yaml`,
        files: path.relative(process.cwd(), `${__dirname}/${tag}/*.yml`)
      }, defaultOpts);

      this.registerOutputs()
    })();
  }
}

export { K8SKubeStateMetrics }
