module.exports = {
  consulOption: {
    server: {
      host: '10.10.0.12',
      port: 8500,
      promisify: true, // 是否使用 promise 风格
      secure: false, // 是否启用https
    },
    register: true,
    client: {
      name: 'cmdWork', // 服务每次
      id: 'cmdWork', // 服务Id，可以与名称一致
      tags: ['cmdWork'], // 标签信息
      address: '172.16.0.39', // 服务地址
      port: 3001, // 服务端口号
      check: {
        http: 'http://172.16.0.39:3001/health', // http服务地址
        interval: '5s', // 健康检测轮询时间
        timeout: '10s', // 超时时间
        status: 'critical', // 初始化服务状态
      },
    },
    serviceList: [
      // 服务发现列表
      {
        referName: 'plutusCore', // 引用名，后续可用 app.services.referName 访问服务
        service: 'plutus-core', // 服务id
      },
      {
        referName: 'plutusGeneral',
        service: 'plutus-general',
      },
    ],
  },
};
