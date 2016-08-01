const test = require('eater/runner').test;
const plzPort = require('plz-port');
const agreedServer = require('../');
const AssertStream = require('assert-stream');
const http = require('http');

test('agreed-core: call server', () => {
  plzPort().then((port) => {
    const server = agreedServer({
      path: './test/agreed',
      port: port,
    });

    server.on('listening', () => {
      http.get(`http://localhost:${port}/users/yosuke`, (res) => {
        server.close();
        const assertStream = new AssertStream();
        assertStream.expect({
          message: 'hello yosuke'
        });
        res.pipe(assertStream);
      });
    });
  });
});
