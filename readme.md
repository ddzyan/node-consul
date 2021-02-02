## 简介

nodejs 在 consul 完成服务注册和发现，并且使用 fabio 完成负载均衡和反向代理。

fabio 会从 consul 注册表中获取健康的服务，根据服务注册时的 tag 配置自动创建自己的路由，当接收到请求后自动去做负载均衡，支持的负载均衡模式为 权重模式

### consul

一个提供服务发现，健康检测，K/V 存储，支持分布式高可用多数据中心

### faibo

简单配置能够让 consul 部署的应用快速支持 http 的负载均衡路由

## 环境配置

### consul 部署

```shell
$ docker run -d \
-p 8500:8500 \
--name consul \
-v $PWD/consul:/consul/data \
-e CONSUL_BIND_INTERFACE='eth0' \
consul:latest agent -server -ui -bind=0.0.0.0 -client=0.0.0.0 -bootstrap-expect=1
```

open url :http://localhost:8500/ui/dc1/services

### fabio

创建配置文件 ./fabio/fabio.properties

```
registry.consul.addr = 10.10.0.12:8500
registry.consul.register.addr = 10.10.0.12:9998
metrics.target = stdout
```

```shell
$ docker run -d --name fabio -p 9999:9999 -p 9998:9998 -v $PWD/fabio/fabio.properties:/etc/fabio/fabio.properties fabiolb/fabio
```

open url: localhost:9998

## 服务关联

请修改仓库中的 config 配置信息的服务 ip 地址

```shell
$ yarn

$ yarn start
```

### 测试

安装 vsCode `REST Client` 插件，修改`test.http`中的 ip 地址，就可以直接点击测试路由功能
