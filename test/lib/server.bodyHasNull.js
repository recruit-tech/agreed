'use strict';

const agreedServer = require('../helper/server.js');
const { test } = require('eater/runner');
const http = require('http');
const AssertStream = require('assert-stream');
const assert = require('power-assert');
const mustCall = require('must-call');

test('server: check post to list', () => {
  const server = agreedServer({
    path: 'test/agrees/agrees.json5',
    port: 0,
  });

  server.on('listening', () => {
    const body = { 
      test: null
    };
    const bodyString = JSON.stringify(body);
    const options = {
      host: 'localhost',
      method: 'POST',
      path: '/test/agreed/use/null/obj',
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
        const expected = { results: null };
        assert.deepStrictEqual(actual, expected);
      }));
      server.close();
    })).on('error', console.error);

    req.write(bodyString);

    req.end();
  });
});

