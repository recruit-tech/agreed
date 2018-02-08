'use strict';

const agreedServer = require('../helper/server.js');
const Client = require(`${process.cwd()}/lib/client.js`);
const test = require('eater/runner').test;
const assert = require('power-assert');
const mustCall = require('must-call');
const isEmpty = require('is-empty');

test('feat(client): check broken response - 1', () => {
  const server = agreedServer({
    agrees: [
      {
        request: {
          path: '/content',
        },
        response: {
          status: 204,
        },
      },
    ],
    port: 0,
  });

  server.on('listening', () => {
    const client = new Client({
      agrees: [
        {
          request: {
            path: '/content',
          },
          response: {
            body: {
              id: 1,
            },
          },
        },
      ],
      port: server.address().port
    });

    const agrees = client.getAgreement();

    const requests = client.createRequests(agrees);
    let finishedCount = 0;
    requests.map((request, i) => {
      request.end();
      request.on('response', mustCall((response) => {
        client.checkResponse(response, agrees[i]).on('result', mustCall((result) => {
          assert(result.error.length > 0);
          finishedCount++;
          if (finishedCount === requests.length) {
            server.close();
          }
        }));
      }));
    });
  });
});

test('feat(client): check broken response - 2', () => {
  const server = agreedServer({
    agrees: [
      {
        request: {
          path: '/content',
        },
        response: {
          headers: {
            'Content-Type': 'application/octet-stream'
          },
          body: "{broken:'json'",
        },
      },
    ],
    port: 0,
  });

  server.on('listening', () => {
    const client = new Client({
      agrees: [
        {
          request: {
            path: '/content',
          },
          response: {
            body: {
              id: 1,
            },
          },
        },
      ],
      port: server.address().port
    });

    const agrees = client.getAgreement();

    const requests = client.createRequests(agrees);
    let finishedCount = 0;
    requests.map((request, i) => {
      request.end();
      request.on('response', mustCall((response) => {
        client.checkResponse(response, agrees[i]).on('result', mustCall((result) => {
          assert(result.error.length > 0);
          finishedCount++;
          if (finishedCount === requests.length) {
            server.close();
          }
        }));
      }));
    });
  });
});
