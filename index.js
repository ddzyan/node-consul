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
  const result = await consul.getServiceList();
  res.statusCode = 200;
  res.end(JSON.stringify(result));
});

app.get('/healthState', async (req, res) => {
  const result = await consul.getHealthState('passing');
  res.statusCode = 200;
  res.end(JSON.stringify(result));
});

app.get('/create', async (req, res) => {
  await consul.createClient();
  res.statusCode = 200;
  res.end('ok');
});

const server = http.createServer(app);

server.listen(3001, async () => {
  console.log('服务启动成功 prot 3001');
});
