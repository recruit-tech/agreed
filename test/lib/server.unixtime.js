'use strict';

const agreedServer = require('../helper/server.js');
const test = require('eater/runner').test;
const http = require('http');
const AssertStream = require('assert-stream');
const assert = require('power-assert');
const mustCall = require('must-call');

test('server: check unixtime', () => {
  const server = agreedServer({
    path: 'test/agrees/agrees.json5',
    port: 0,
  });

  server.on('listening', () => {
    const options = {
      host: 'localhost',
      method: 'GET',
      path: '/test/unixtime/agreed/values',
      port: server.address().port,
    };
    const req = http.request(options, (res) => {
      let data = '';
      const currentUnix = parseInt(Date.now() / 1000);
      res.on('data', (d) => data += d);
      res.on('end', mustCall(() => {
        const result = JSON.parse(data);
        console.log(currentUnix)
        console.log(result)
        assert(result.unixtime >= currentUnix);
      }));
      server.close();
    }).on('error', console.error);

    req.end();
  });
});
