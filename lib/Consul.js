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
   * @description 创建多个 client 连接 consul
   * @returns {void}
   */
  async createClient() {
    for (let i = 0; i < 10; i++) {
      await this.consul.agent.service.register({
        name: 'cmdWork', // 服务名称可以不唯一，可以通过 name 获取批量服务信息
        id: `cmdWork-${i}`, // 服务Id必须唯一
        tags: ['cmdWork'], // 标签信息
        address: '172.16.0.39', // 服务地址
        port: 3001, // 服务端口号
        check: {
          http: 'http://172.16.0.39:3001/health', // 服务地址
          interval: '5s', // 健康检测轮询时间
          timeout: '10s', // 超时时间
          status: 'critical', // 初始化服务状态
        },
      });
    }
  }
}

module.exports = ConsulConfig;
