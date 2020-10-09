## 简介

使用 nodejs 注册 consul，并且根据 serviceName 获取健康服务列表，过滤信息提取健康的服务地址。

### 使用

consul docker 部署

```shell
$ docker run -d \
-p 8500:8500 \
--name consul \
--volume ./consul:/consul/data \
-e CONSUL_BIND_INTERFACE='eth0' \
consul:latest agent -server -ui -bind=0.0.0.0 -client=0.0.0.0 -bootstrap-expect=1
```

```shell
$ node ./index.js
```
