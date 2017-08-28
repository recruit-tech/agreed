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
        path: '/test/arrayreqs/agreed/values',
        query: {
          'year_months[]': '{:yearMonths}'
        },
      },
      response: {
        body: '{arraify:yearMonths}',
        funcs: {
          arraify: (yearMonths) => yearMonths.map((yearMonth) => yearMonth.substring(0, 4))
        }
      },
    }],
    port: 0,
  });

  server.on('listening', () => {
    const options = {
      host: 'localhost',
      method: 'GET',
      path: '/test/arrayreqs/agreed/values?year_months[]=201708&year_months[]=201709&year_months[]=201810',
      port: server.address().port,
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (d) => data += d);
      res.on('end', mustCall(() => {
        const result = JSON.parse(data);
        assert.deepStrictEqual(result, [ '2017', '2017', '2018' ]);
      }));
      server.close();
    }).on('error', console.error);

    req.end();
  });
});
