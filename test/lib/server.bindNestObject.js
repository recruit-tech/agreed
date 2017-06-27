'use strict';

const agreedServer = require('../helper/server.js');
const test = require('eater/runner').test;
const http = require('http');
const AssertStream = require('assert-stream');
const assert = require('power-assert');
const mustCall = require('must-call');

test('server: check bindNestObject', () => {
  const server = agreedServer({
    path: 'test/agrees/agrees.json5',
    port: 0,
  });

  server.on('listening', () => {
    const body = {
      time: {
        start: 1234,
        end: 3456
      }
    };

    const postData = JSON.stringify(body);
    const options = {
      host: 'localhost',
      method: 'POST',
      path: '/test/bind/nest/object',
      port: server.address().port,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (d) => data += d);
      res.on('end', mustCall(() => {
        const result = JSON.parse(data);
        console.log(result)
      }));
      server.close();
    }).on('error', console.error);

    req.write(postData);

    req.end();
  });
});


