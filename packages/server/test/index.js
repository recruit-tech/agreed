'use strict';
const test = require('eater/runner').test;
const assert = require('assert');
const agreedServer = require('../');
const AssertStream = require('assert-stream');
const http = require('http');

test('agreed-server: call server', () => {
  const server = agreedServer({
    path: './test/agreed',
    port: '0',
  }).createServer();

  server.on('listening', () => {
    const port = server.address().port;
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

test('agreed-server: static server', () => {
  const server = agreedServer({
    path: './test/agreed',
    static: './test/static',
    staticPrefixPath: '/public',
    port: '0',
  }).createServer();

  server.on('listening', () => {
    const port = server.address().port;
    http.get(`http://localhost:${port}/public/test.jpg`, (res) => {
      server.close();
      assert.strictEqual(res.headers['content-type'], 'image/jpeg');
      assert.strictEqual(res.statusCode, 200);
    });
  });
});

test('agreed-server: static server without prefix', () => {
  const server = agreedServer({
    path: './test/agreed',
    static: './test/static',
    port: '0',
  }).createServer();

  server.on('listening', () => {
    const port = server.address().port;
    http.get(`http://localhost:${port}/test.jpg`, (res) => {
      server.close();
      assert.strictEqual(res.headers['content-type'], 'image/jpeg');
      assert.strictEqual(res.statusCode, 200);
    });
  });
});

test('pass middlewares option', () => {
  const server = agreedServer({
    path: './test/agreed',
    port: 0,
    middlewares: [
      (req, res, next) => {
        res.set({"access-control-allow-origin": "*"});
        next();
      }
    ]
  }).createServer();

  server.on('listening', () => {
    const port = server.address().port;
    http.get(`http://localhost:${port}/users/yosuke`, (res) => {
      server.close();
      assert.deepEqual(res.headers["access-control-allow-origin"], "*");
    });
  });
});

test('pass defaultResponseHeaders option', () => {
  const server = agreedServer({
    path: './test/agreed',
    port: 0,
    defaultResponseHeaders: {
      'access-control-allow-origin': '*'
    }
  }).createServer();

  server.on('listening', () => {
    const port = server.address().port;
    http.get(`http://localhost:${port}/users/yosuke`, (res) => {
      server.close();
      assert.deepEqual(res.headers["access-control-allow-origin"], "*");
    });
  });
});

test('pass defaultRequestHeaders option', () => {
  const server = agreedServer({
    path: './test/agreed',
    port: 0,
    defaultRequestHeaders: {
      'x-jwt-token': 'testtesttest'
    }
  }).createServer();

  server.on('listening', () => {
    const port = server.address().port;
    const options = {
      host: 'localhost',
      method: 'GET',
      path: '/users/header/yosuke',
      port: port,
      headers: {
        'Content-Type': 'application/json',
        'x-jwt-token': 'testtesttest'
      }
    };
    http.get(options, (res) => {
      server.close();
      const assertStream = new AssertStream();
      assertStream.expect({
        message: 'hello yosuke'
      });
      res.pipe(assertStream);
    });
  });
});

