const Consul = require('consul');
const { consulOption } = require('../config');

class ConsulConfig {
  constructor() {
    this.consul = Consul(consulOption.server);

    if (consulOption.register) {
      this.consul.agent.service
        .register(consulOption.client)
        .then(() => {
          console.log('注册成功');
        })
        .catch(err => {
          console.error('consul 注册失败', err);
          throw err;
        });
    }
  }

  /**
   * @description 获得service 列表
   * @returns {Promise<Array>} res
   */
  async getServiceList() {
    const result = await this.consul.agent.service.list();
    return result;
  }

  /**
   * @description Returns the checks in a given state.
   * @param {string} state passing, warning, critical
   */
  async getHealthState(state) {
    const result = await this.consul.health.state(state);
    return result;
  }

  /**
   * @description 返回指定服务名称的健康服务列表
   * @param {string} serviceName 服务名称
   * @returns {Promise<Array>} list
   */
  async getHealthService(serviceName) {
    const res = await this.consul.health.service(serviceName);
    return res;
  }

  /**
   * @description 创建多个 client 连接 consul
   * @param {number} number 创建的client数量
   * @returns {Promise<void>}
   */
  async createClient(number) {
    await this.consul.agent.service.register({
      name: 'cmdWork', // 服务名称可以不唯一，可以通过 name 获取批量服务信息
      id: `cmdWork-${number}`, // 服务Id必须唯一
      tags: [`urlprefix-${consulOption.prefix}`], // 标签信息
      meta: {
        describe: 'commP',
      },
      address: consulOption.client.address, // 服务地址
      port: consulOption.client.port, // 服务端口号
      check: consulOption.client.check,
    });
  }

  /**
   * @description 根据 id 删除服务
   * @param {string} serverId 服务id，此为唯一标志
   * @returns {Promise<void>}
   */
  async deregister(serverId) {
    await this.consul.agent.service.deregister(serverId);
  }
}

module.exports = ConsulConfig;
