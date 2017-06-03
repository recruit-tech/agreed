'use strict';
const test = require('eater/runner').test;
const assert = require('assert');
const agreedServer = require('../');
const AssertStream = require('assert-stream');
const http = require('http');

test('www_urlencoded option', () => {
  const server = agreedServer({
    path: './test/agreed',
    port: 0,
  }).createServer();

  server.on('listening', () => {
    const port = server.address().port;
    const options = {
      host: 'localhost',
      method: 'POST',
      path: '/urlencoded/test',
      port: port,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
    };
    const request = http.request(options, (res) => {
      server.close();
      const assertStream = new AssertStream();
      assertStream.expect({
        message: 'hello wwwurlencoded'
      });
      res.pipe(assertStream);
    });
    request.write('foo=bar&bar=baz&hoge=fuga');
    request.end();
  });
});

