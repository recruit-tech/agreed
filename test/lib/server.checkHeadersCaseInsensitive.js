'use strict';

const agreedServer = require('../helper/server.js');
const test = require('eater/runner').test;
const http = require('http');
const AssertStream = require('assert-stream');
const plzPort = require('plz-port');
const assert = require('power-assert');
const mustCall = require('must-call');

test('server: check headers when case insensitive', () => {
  const server = agreedServer({
    path: 'test/agrees/agrees.json5',
    port: 0,
  });

  server.on('listening', () => {
    const options = {
      host: 'localhost',
      method: 'GET',
      path: '/test/case/insensitive/headers',
      port: server.address().port,
      headers: {
        'This-Headers-Should-Be-Lower-Case': 'true',
      }
    };
    const req = http.request(options, (res) => {
      const assert = new AssertStream();
      assert.expect({"message":"hello case insensitive headers"});
      res.pipe(assert);
      server.close();
    }).on('error', console.error);

    req.end();
  });
});

test('server: check headers when case insensitive', () => {
  const server = agreedServer({
    path: 'test/agrees/agrees.json5',
    port: 0,
  });

  server.on('listening', () => {
    const options = {
      host: 'localhost',
      method: 'GET',
      path: '/test/case/insensitive/headers',
      port: server.address().port,
      headers: {
        'THIS-HEADERS-SHOULD-BE-LOWER-CASE': 'true',
      }
    };
    const req = http.request(options, (res) => {
      const assert = new AssertStream();
      assert.expect({"message":"hello case insensitive headers"});
      res.pipe(assert);
      server.close();
    }).on('error', console.error);

    req.end();
  });
});

