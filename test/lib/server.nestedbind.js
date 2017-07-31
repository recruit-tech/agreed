'use strict';

const agreedServer = require('../helper/server.js');
const test = require('eater/runner').test;
const http = require('http');
const AssertStream = require('assert-stream');
const assert = require('power-assert');
const mustCall = require('must-call');

test('server: check parseInt', () => {
  const server = agreedServer({
    path: 'test/agrees/agrees.json5',
    port: 0,
  });

  server.on('listening', () => {
    const body = { 
      time: { start: 1, end: 3, 'break': { start: 2, end: 5 } },
      members: [
        {
          id: 1
        },
        {
          id: 2
        }
      ]
    };
    const bodyStr = JSON.stringify(body);
    const options = {
      host: 'localhost',
      method: 'POST',
      path: '/test/bind/nest/object',
      port: server.address().port,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': bodyStr.length,
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (d) => data += d);
      res.on('end', mustCall(() => {
        const result = JSON.parse(data);
        const expected = { 
          time: { start: 1, end: 3 }, 
          "break": { start: 2, end: 5 }, 
          members: [ { id: 1 }, { id: 2 } ] 
        };
        assert.deepStrictEqual(result, expected);
      }));
      server.close();
    }).on('error', console.error);

    req.write(bodyStr);
    req.end();
  });
});



