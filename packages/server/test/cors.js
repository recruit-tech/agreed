'use strict';
const test = require('eater/runner').test;
const assert = require('assert');
const agreedServer = require('../');
const http = require('http');

test('cors option', () => {
  const server = agreedServer({
    path: './test/agreed',
    port: '0',
    cors: true,
  }).createServer();

  server.on('listening', () => {
    const port = server.address().port;
    const url = `http://localhost:${port}/cors/test`

    const preflight = http.request(url, { method: 'OPTIONS' }, (res) => {
      assert.strictEqual(res.headers['access-control-allow-origin'], '*');
      assert.strictEqual(res.headers['access-control-allow-methods'], 'GET,HEAD,PUT,PATCH,POST,DELETE');
      assert.strictEqual(res.statusCode, 204);

      const post = http.request(url, { method: 'POST' }, (res) => {
        server.close();
        assert.strictEqual(res.headers['access-control-allow-origin'], '*');
      });
      post.write('');
      post.end();
    });
    preflight.write('');
    preflight.end();
  });
});