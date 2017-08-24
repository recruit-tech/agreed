'use strict';

const agreedServer = require('../helper/server.js');
const test = require('eater/runner').test;
const http = require('http');
const AssertStream = require('assert-stream');
const assert = require('power-assert');
const mustCall = require('must-call');

test('server: check custom function', () => {
  const server = agreedServer({
    agrees: [{
      request: {
        path: '/test/custom/agreed/values',
        query: {
          a: '{:a}',
          b: '{:b}',
          c: '{:c}',
        },
        values: {
          a: 1,
          b: 2,
          c: 3,
        },
      },
      response: {
        body: {
          sum: '{sum:a,b,c}',
        },
        funcs: {
          sum: (a, b, c) => parseInt(a) + parseInt(b) + parseInt(c)
        }
      },
    }],
    port: 0,
  });

  server.on('listening', () => {
    const options = {
      host: 'localhost',
      method: 'GET',
      path: '/test/custom/agreed/values?a=1&b=2&c=4',
      port: server.address().port,
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (d) => data += d);
      res.on('end', mustCall(() => {
        const result = JSON.parse(data);
        assert.strictEqual(result.sum, 7);
      }));
      server.close();
    }).on('error', console.error);

    req.end();
  });
});

test('server: check custom function with array response', () => {
  const server = agreedServer({
    agrees: [{
      request: {
        path: '/test/custom/agreed/values',
        query: {
          a: '{:a}',
          b: '{:b}',
          c: '{:c}',
        },
        values: {
          a: 1,
          b: 2,
          c: 3,
        },
      },
      response: {
        body: {
          sum: '{sum:a,b,c}',
        },
        funcs: {
          sum: (a, b, c) => {
            var A = parseInt(a);
            var B = parseInt(b);
            var C = parseInt(c);
            return [ A + B + C, A * B * C, A - B - C ];
          }
        }
      },
    }],
    port: 0,
  });

  server.on('listening', () => {
    const options = {
      host: 'localhost',
      method: 'GET',
      path: '/test/custom/agreed/values?a=20&b=30&c=40',
      port: server.address().port,
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (d) => data += d);
      res.on('end', mustCall(() => {
        const result = JSON.parse(data);
        assert.deepStrictEqual(result.sum, [ 90, 24000, -50]);
      }));
      server.close();
    }).on('error', console.error);

    req.end();
  });
});

