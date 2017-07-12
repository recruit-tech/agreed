'use strict';
const test = require('eater/runner').test;
const assert = require('assert');
const agreedServer = require('../');
const AssertStream = require('assert-stream');
const http = require('http');
const mustCall = require('must-call');

test('notify option', () => {
  const { app, createServer, notifier } = agreedServer({
    port: 0,
    path: './test/agreedNotify.json5'
  });

  const server = createServer(app);

  server.on('listening', () => {
    const port = server.address().port;
    const options = {
      host: 'localhost',
      method: 'GET',
      path: '/users/123',
      port: port,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    http.get(options, (res) => {
      server.close();
      const assertStream = new AssertStream();
      assertStream.expect({
        message: 'hello 123'
      });
      res.pipe(assertStream);
    });
  });

  notifier.on('message', mustCall((data) => {
    assert.deepStrictEqual({
      message: 'hello 123'
    }, data);
  }));

});

