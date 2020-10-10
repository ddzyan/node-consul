## 简介

使用 nodejs 在 consul 完成服务注册和发现，并且使用 fabio 完成负载均衡和反向代理。

### 使用

#### 前提部署

consul docker 部署

```shell
$ docker run -d \
-p 8500:8500 \
--name consul \
--volume ./consul:/consul/data \
-e CONSUL_BIND_INTERFACE='eth0' \
consul:latest agent -server -ui -bind=0.0.0.0 -client=0.0.0.0 -bootstrap-expect=1
```

创建 fabio 配置文件 fabio.properties

```
# 配置 consul 服务地址
registry.consul.addr = 10.10.0.12:8500
registry.consul.register.addr = 10.10.0.12:9998
metrics.target = stdout
```

```shell
$ docker run -d --name fabio -p 9999:9999 -p 9998:9998 -v $PWD/fabio/fabio.properties:/etc/fabio/fabio.properties fabiolb/fabio
```

```shell
$ node ./index.js
```

#### 启动

请修改 config 配置信息中的服务 ip 地址

```shell
$ yarn

$ yarn start
```

#### 测试

安装 vsCode `REST Client` 插件，修改`test.http`中的 ip 地址，就可以直接点击测试路由功能
