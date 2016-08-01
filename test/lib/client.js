const agreedServer = require('../helper/server.js');
const Client = require(`${process.cwd()}/lib/client.js`);
const test = require('eater/runner').test;
const AssertStream = require('assert-stream');
const assert = require('power-assert');
const plzPort = require('plz-port');
const mustCall = require('must-call');

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

      const agrees = require('../agrees/agrees.js');

      const promises = client.executeAgreement(agrees);
      Promise.all(promises).then(mustCall((responses) => {
        server.close();
        responses.forEach((res, i) => {
          const assertStream = new AssertStream();
          assertStream.expect(agrees[i].response.body);
          res.pipe(assertStream);
          assert(res.statusCode === agrees[i].response.status);
        });
      }));
    });
  });
});
