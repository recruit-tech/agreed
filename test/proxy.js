'use strict';
const test = require('eater/runner').test;
const assert = require('assert');
const agreedServer = require('../');
const AssertStream = require('assert-stream');
const http = require('http');

test('proxy option', () => {
  const proxyServer = agreedServer({
    path: './test/agreedProxy',
    port: 0,
  }).createServer();

  proxyServer.on('listening', () => {
    const proxyPort = proxyServer.address().port;
    const server = agreedServer({
      path: './test/agreed',
      port: 0,
      proxy: `127.0.0.1:${proxyPort}`,
    }).createServer();

    server.on('listening', () => {
      const port = server.address().port;
      const options = {
        host: 'localhost',
        method: 'GET',
        path: '/test/proxy',
        port: port,
      };
      http.get(options, (res) => {
        proxyServer.close();
        server.close();
        const assertStream = new AssertStream();
        assertStream.expect({
          message: 'hello proxy'
        });
        res.pipe(assertStream);
      });
    });
  });
});

test('proxy prefix proxy path option', () => {
  const proxyServer = agreedServer({
    path: './test/agreedProxy',
    port: 0,
  }).createServer();

  proxyServer.on('listening', () => {
    const proxyPort = proxyServer.address().port;
    const server = agreedServer({
      path: './test/agreed',
      port: 0,
      proxy: `127.0.0.1:${proxyPort}`,
      proxyPrefixPath: '/proxy'
    }).createServer();

    server.on('listening', () => {
      const port = server.address().port;
      const options = {
        host: 'localhost',
        method: 'GET',
        path: '/proxy/test/proxy',
        port: port,
      };
      http.get(options, (res) => {
        proxyServer.close();
        server.close();
        const assertStream = new AssertStream();
        assertStream.expect({
          message: 'hello proxy'
        });
        res.pipe(assertStream);
      });
    });
  });
});

