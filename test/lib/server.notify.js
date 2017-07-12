'use strict';

const agreedServer = require('../helper/server.notify.js');
const { test } = require('eater/runner');
const http = require('http');
const AssertStream = require('assert-stream');
const assert = require('power-assert');
const mustCall = require('must-call');

test('server: check notify', () => {
  const { server, notifier } = agreedServer({
    path: 'test/agrees/notify.js',
    port: 0,
  });

  server.on('listening', () => {
    const body = { message: 'hoge' };
    const bodyString = JSON.stringify(body);
    const options = {
      host: 'localhost',
      method: 'POST',
      path: '/messages',
      port: server.address().port,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': bodyString.length
      },
    };
    const req = http.request(options, mustCall((res) => {
      let data = '';
      res.on('data', (d) => data += d);
      res.on('end', mustCall(() => {
        const actual = JSON.parse(data);
        const expected = { result: 'hoge' };
        assert.deepStrictEqual(actual, expected);
      }));
      server.close();
    })).on('error', console.error);

    notifier.on('message2', mustCall((actual) => {
      const expected = { message: 'message! hoge' };
      assert.deepStrictEqual(actual, expected);
    }));

    req.write(bodyString);

    req.end();
  });
});

test('server: check notify default message', () => {
  const { server, notifier } = agreedServer({
    path: 'test/agrees/notify.js',
    port: 0,
  });

  server.on('listening', () => {
    const body = { message: 'hoge' };
    const bodyString = JSON.stringify(body);
    const options = {
      host: 'localhost',
      method: 'POST',
      path: '/messages2',
      port: server.address().port,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': bodyString.length
      },
    };
    const req = http.request(options, mustCall((res) => {
      let data = '';
      res.on('data', (d) => data += d);
      res.on('end', mustCall(() => {
        const actual = JSON.parse(data);
        const expected = { result: 'hoge' };
        assert.deepStrictEqual(actual, expected);
      }));
      server.close();
    })).on('error', console.error);

    notifier.on('message', mustCall((actual) => {
      const expected = { message: 'message2 hoge' };
      assert.deepStrictEqual(actual, expected);
    }));

    req.write(bodyString);

    req.end();
  });
});
