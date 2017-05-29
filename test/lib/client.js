'use strict';

const agreedServer = require('../helper/server.js');
const Client = require(`${process.cwd()}/lib/client.js`);
const test = require('eater/runner').test;
const AssertStream = require('assert-stream');
const assert = require('power-assert');
const mustCall = require('must-call');
const isEmpty = require('is-empty');
const { ClientRequest } = require('http');

test('feat(client): support single agree file', () => {
  const client = new Client({
    path: 'test/agrees/hoge/foo.json'
  });

  const agrees = client.getAgreement();
  
  assert(Array.isArray(agrees));
});

test('feat(client): check setup', () => {
  const client = new Client({
    path: 'test/agrees/hoge/foo.json'
  });
  const agrees = client.getAgreement();
  agrees.forEach((agree) => {
    const { options, content, contentLength } = client.setup(agree);
    assert.deepEqual(options, { 
      path: '/hoge/foo',
      method: 'POST',
      headers: { 'Content-Length': 23, 'Content-Type': 'application/json' },
      host: 'localhost',
      port: 80 
    });
    assert.equal(content, '{"message":"foobarbaz"}');
    assert.equal(contentLength, 23);
  });
});

test('feat(client): check createRequest', () => {
  const client = new Client({
    path: 'test/agrees/hoge/foo.json'
  });
  const agrees = client.getAgreement();
  agrees.forEach((agree) => {
    const setting = client.setup(agree);
    const request = client.createRequest(setting);
    request.abort();
    assert(request instanceof ClientRequest);
  });
});

test('feat(client): check createRequests', () => {
  const client = new Client({
    path: 'test/agrees/hoge/foo.json'
  });
  const agrees = client.getAgreement();
  const requests = client.createRequests(agrees);
  requests.forEach((request) => {
    request.abort();
    assert(request instanceof ClientRequest);
  });
});

test('feat(client): check request to server', () => {
  const server = agreedServer({
    path: 'test/agrees/agrees.js',
    port: 0,
  });
  server.on('listening', () => {
    const client = new Client({ 
      path: 'test/agrees/agrees.js', 
      port: server.address().port 
    });

    const agrees = client.getAgreement();

    const requests = client.createRequests(agrees);
    let finishedCount = 0;
    requests.map((request, i) => {
      request.end();
      request.on('response', mustCall((response) => {
        client.checkResponse(response, agrees[i]).on('result', mustCall((result) => {
          assert(isEmpty(result.diff));
          finishedCount++;
          if (finishedCount === requests.length) {
            server.close();
          }
        }));
      }));
    });
  });
});


