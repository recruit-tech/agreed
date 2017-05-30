'use strict';
const agreedClient = require('../index');
const server = require('agreed-server');
const test = require('eater/runner').test;

test('client: smoke', () => {
  const app = server({
    path: './test/agreed_server.json5',
    port: 0,
  });

  app.on('listening', () => {
    const { client, agrees, requestPromise, reporter } = agreedClient({
      path: './test/agreed.json5',
      port: app.address().port,
    });
    client.checkResponse(responses, agrees).then(reporter(agrees)).then(() => {
      app.close();
    });
  });
});
