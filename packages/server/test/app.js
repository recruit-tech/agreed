'use strict';
const test = require('eater/runner').test;
const assert = require('assert');
const agreedServer = require('../');
const AssertStream = require('assert-stream');
const http = require('http');

test('agreed-server: instance app', () => {
  const { app, createServer } = agreedServer({
    path: './test/agreed',
    port: '0',
  });

  const server = createServer(app);
  server.on('listening', () => {
    const port = server.address().port;
    const options = {
      host: 'localhost',
      method: 'GET',
      path: '/shops/test',
      port: port,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    http.get(options, (res) => {
      server.close();
      const assertStream = new AssertStream();
      assertStream.expect({
        message: 'shop test'
      });
      res.pipe(assertStream);
    });
  });
});

test('agreed-server: call foobarbaz', () => {
  const { app, createServer } = agreedServer({
    path: './test/agreed',
    port: '0',
    callNextWhenNotFound: true
  });

  app.use('/foobarbaz', (req, res, next) => {
    res.send('hello middleware');
  });

  const server = createServer(app);
  server.on('listening', () => {
    const port = server.address().port;
    const options = {
      host: 'localhost',
      method: 'GET',
      path: '/foobarbaz',
      port: port,
    };
    http.get(options, (res) => {
      server.close();
      const assertStream = new AssertStream();
      assertStream.expect('hello middleware');
      res.pipe(assertStream);
    });
  });
});

