'use strict';
const agreedClient = require('../index');
const agreedServer = require('agreed-server');
const test = require('eater/runner').test;

test('client: smoke', () => {
  const server = agreedServer({
    path: './test/agreed_server.json5',
    port: 0,
  }).createServer();

  server.on('listening', () => {
    const { client, agrees, reporter } = agreedClient({
      path: './test/agreed.json5',
      port: server.address().port,
    });
    client.requestPromise(agrees).then(reporter).then(() => {
      server.close();
    });
  });
});
