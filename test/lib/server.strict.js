'use strict';

const agreedServer = require('../helper/server.js');
const test = require('eater/runner').test;
const http = require('http');
const assert = require('power-assert');
const mustCall = require('must-call');

test('server: check strict mode - status code', () => {
  const server = agreedServer({
    agrees: [
      {
        request: {
          path: '/test/agreed/:id',
          values: {
            id: 1,
          },
        },
        response: {
          body: {
            id: 1,
          },
        },
      },
      {
        request: {
          path: '/test/agreed/:id',
          values: {
            id: 2,
          },
        },
        response: {
          body: {
            id: 2,
          },
        },
      },
    ],
    port: 0,
    strict: true,
  });

  server.on('listening', () => {
    const options = {
      host: 'localhost',
      method: 'GET',
      path: '/test/agreed/1',
      port: server.address().port,
    };
    const req = http.request(options, (res) => {
      assert.strictEqual(res.statusCode, 500);
      res.resume();
      server.close();
    }).on('error', console.error);

    req.end();
  });
});

test('server: check strict mode - message', () => {
  const server = agreedServer({
    agrees: [
      {
        request: {
          path: '/test/agreed/:id',
          values: {
            id: 1,
          },
        },
        response: {
          body: {
            id: 1,
          },
        },
      },
      {
        request: {
          path: '/test/agreed/:id',
          values: {
            id: 2,
          },
        },
        response: {
          body: {
            id: 2,
          },
        },
      },
    ],
    port: 0,
    strict: true,
  });

  server.on('listening', () => {
    const options = {
      host: 'localhost',
      method: 'GET',
      path: '/test/agreed/1',
      port: server.address().port,
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', mustCall(() => {
        const result = JSON.parse(data);
        assert.strictEqual(result.message, 'Ambiguous Request');
      }));
      server.close();
    }).on('error', console.error);

    req.end();
  });
});

test('server: check strict mode - candidates', () => {
  const server = agreedServer({
    agrees: [
      {
        request: {
          path: '/test/agreed/:id',
          values: {
            id: 1,
          },
        },
        response: {
          body: {
            id: 1,
          },
        },
      },
      {
        request: {
          path: '/test/agreed/:id',
          values: {
            id: 2,
          },
        },
        response: {
          body: {
            id: 2,
          },
        },
      },
      {
        request: {
          path: '/test/agreed/3',
        },
        response: {},
      },
    ],
    port: 0,
    strict: true,
  });

  server.on('listening', () => {
    const options = {
      host: 'localhost',
      method: 'GET',
      path: '/test/agreed/1',
      port: server.address().port,
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', mustCall(() => {
        const result = JSON.parse(data);
        assert.strictEqual(result.candidates.length, 2);
      }));

      server.close();
    }).on('error', console.error);

    req.end();
  });
});
