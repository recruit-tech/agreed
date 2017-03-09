'use strict';
const test = require('eater/runner').test;
const plzPort = require('plz-port');
const agreedServer = require('../');
const AssertStream = require('assert-stream');
const http = require('http');
const assert = require('assert');

test('agreed-core: call server', () => {
  plzPort().then((port) => {
    const server = agreedServer({
      path: './test/agreed',
      port: port,
    });

    server.on('listening', () => {
      http.get(`http://localhost:${port}/users/yosuke`, (res) => {
        server.close();
        const assertStream = new AssertStream();
        assertStream.expect({
          message: 'hello yosuke'
        });
        res.pipe(assertStream);
      });
    });
  });
});

test('pass middlewares option', () => {
  plzPort().then((port) => {
    const server = agreedServer({
      path: './test/agreed',
      port: port,
      middlewares: [
        (req, res, next) => {
          res.set({"access-control-allow-origin": "*"});
          next();
        }
      ]
    });

    server.on('listening', () => {
      http.get(`http://localhost:${port}/users/yosuke`, (res) => {
        server.close();
        assert.deepEqual(res.headers["access-control-allow-origin"], "*");
      });
    });
  });
});

