'use strict';
const agreedClient = require('../index');
const agreedServer = require('agreed-server');
const assert = require('assert');
const test = require('eater/runner').test;

test('client: getAgreement', () => {
  const { client } = agreedClient({
    path: './test/agreed.json5',
    port: 0,
  });
  const agrees = client.getAgreement();
  assert(agrees);
});

test('client: requestPromise', () => {
  const server = agreedServer({
    path: './test/agreed.json5',
    port: 0,
  }).createServer();
  server.on('listening', () => {
    const { client } = agreedClient({
      path: './test/agreed.json5',
      port: server.address().port,
    });
    const agrees = client.getAgreement();
    client.requestPromise(agrees).then((results) => {
      assert(results.length === 2);
      server.close();
    });
  });
});

