const Consul = require('consul');

class ConsulConfig {
  constructor() {
    const serviceName = 'proxy-manager';

    this.consul = Consul({
      host: '10.10.0.12',
      port: 8500,
      //secure: false, // 是否启用https
      promisify: true, // 是否使用promise 放个
    });

    this.consul.agent.service
      .register({
        name: serviceName, // 服务每次
        id: serviceName, // 服务Id，可以与名称一致
        tags: serviceName, // 标签信息
        address: '172.16.0.39', // 服务地址
        port: 3001, // 服务端口号
        check: {
          http: 'http://172.16.0.39:3001/health', // http服务地址
          interval: '5s', // 健康检测轮询时间
          timeout: '10s', // 超时时间
          status: 'critical', // 初始化服务状态
        },
      })
      .then(result => {
        console.log(`${serviceName} 注册成功`, result);
      })
      .catch(err => {
        console.error('consul 注册失败', err);
        throw err;
      });
  }
}

module.exports = ConsulConfig;
