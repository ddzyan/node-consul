const express = require('express');
const ConsulConfig = require('./lib/Consul');

const app = express();
const http = require('http');

const consul = new ConsulConfig();

app.get('/health', (req, res) => {
  res.statusCode = 200;
  res.end('ok');
});

app.get('/serviceList', async (req, res) => {
  console.log('serviceList');
  const result = await consul.getServiceList();
  res.statusCode = 200;
  res.end(JSON.stringify(result));
});

app.get('/healthState', async (req, res) => {
  const result = await consul.getHealthState('passing');
  res.statusCode = 200;
  res.end(JSON.stringify(result));
});

app.get('/deregister', async (req, res) => {
  const id = req.query.id;

  await consul.deregister(id);

  res.statusCode = 200;
  res.end('ok');
});

app.get('/bulkRegister', async (req, res) => {
  const promiseArr = [];
  for (let i = 0; i < 10; i++) {
    promiseArr.push(consul.createClient(i));
  }

  await Promise.all(promiseArr);
  res.statusCode = 200;
  res.end('ok');
});

app.get('/bulkDeregister', async (req, res) => {
  const promiseArr = [];
  for (let i = 0; i < 10; i++) {
    await consul.deregister(`cmdWork-${i}`);
  }
  await Promise.all(promiseArr);
  res.statusCode = 200;
  res.end('ok');
});

app.get('/getHealthService', async (req, res) => {
  const name = req.query.name;
  const serviceList = [];
  const result = await consul.getHealthService(name);
  for (const service of result) {
    const { Service, Checks } = service;
    const { Address, Port } = Service;

    for (const check of Checks) {
      if (check.Status === 'passing' && check.CheckID !== 'serfHealth') {
        serviceList.push({
          ip: Address,
          port: Port,
        });
      }
    }
  }

  res.statusCode = 200;
  res.end(JSON.stringify(serviceList));
});

const server = http.createServer(app);

server.listen(3001, async () => {
  console.log('服务启动成功 prot 3001');
});
