import * as pulumi from '@pulumi/pulumi';
import axios from 'axios';

class NameComProvider implements pulumi.dynamic.ResourceProvider {
  public async create(inputs: any) {
    const nameServers = inputs.nameServers.map((ns: string) => {
      console.log(ns);
      if (ns[ns.length - 1] == '.') {
        return ns.substr(0, ns.length - 1)
      }
      return ns
    })

    try {
      const response = await axios.post(`https://api.name.com/v4/domains/${inputs.domainName}:setNameservers`, 
        JSON.stringify({ nameservers: nameServers }), 
        {
          auth: {
            username: 'myerstm',
            password: process.env.NAME_COM_KEY || '',
          }
        },
      );

      // console.log(response);

      return {
        id: inputs.domainName,
        success: response.status == 200
      }
    }
    catch (err) {
      // console.log(err)
      throw err;
    }
  }

  // public async update(id: pulumi.ID, olds: any, news: any) { 
  //   const nameServers = news.nameServers.map((ns: string) => {
  //     console.log(ns);
  //     if (ns[ns.length - 1] == '.') {
  //       return ns.substr(0, ns.length - 1)
  //     }
  //     return ns
  //   })

  //   try {
  //     const response = await axios.post(`https://api.name.com/v4/domains/${news.domainName}:setNameservers`, 
  //       JSON.stringify({ nameservers: nameServers }), 
  //       {
  //         auth: {
  //           username: 'myerstm',
  //           password: process.env.NAME_COM_KEY || '',
  //         }
  //       },
  //     );

  //     console.log(response);
  //   }
  //   catch (err) {
  //     console.log(err)
  //     throw err;
  //   }
  // }

  public async delete(id: pulumi.ID, props: any) { 
    await axios.post(`https://api.name.com/v4/domains/${props.domainName}:setNameservers`, 
      JSON.stringify({ nameservers: [] }),
      {
        auth: {
          username: 'myerstm',
          password: process.env.NAME_COM_KEY || '',
        }
      },
    );
  }

}

interface NameComNameserversOptions {
  domainName: pulumi.Input<string>,
  nameServers: pulumi.Input<string[]>,
};


class NameComNameservers extends pulumi.dynamic.Resource {
  private static provider = new NameComProvider();

  constructor(name: string, options: NameComNameserversOptions) {
    super(NameComNameservers.provider, name, options, undefined)
  }
}

export { NameComNameservers }
