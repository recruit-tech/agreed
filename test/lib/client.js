'use strict';

const agreedServer = require('../helper/server.js');
const Client = require(`${process.cwd()}/lib/client.js`);
const test = require('eater/runner').test;
const AssertStream = require('assert-stream');
const assert = require('power-assert');
const plzPort = require('plz-port');
const mustCall = require('must-call');
const isEmpty = require('is-empty');

test('feat(client): check request to server', () => {
  plzPort().then((port) => {
    const server = agreedServer({
      path: 'test/agrees/agrees.js',
      port: port,
    });
    server.on('listening', () => {
      const client = new Client({ 
        path: 'test/agrees/agrees.js', 
        port: port 
      });

      const agrees = client.getAgreement();

      const promises = client.executeAgreement(agrees);
      client.checkResponse(promises, agrees).then((results) => {
        results.forEach((result) => {
          assert(isEmpty(result));
        });
        server.close();
      });
    });
  });
});
