'use strict';

const Server = require(`${process.cwd()}/lib/server.js`);

const AssertStream = require('assert-stream');
const test = require('eater/runner').test;
const http = require('http');
const assert = require('power-assert');
const mustCall = require('must-call');

test('feat(middleware): http GET API', () => {
  const agreedServer = new Server({ path: 'test/agrees/agrees.js' });
  const server = http.createServer((req, res) => {
    agreedServer.useMiddleware(req, res);
  }).listen(0);

  server.on('listening', () => {
    const port = server.address().port;
    http.get('http://localhost:' + port + '/hoge/fuga?q=foo', (res) => {
      const assert = new AssertStream();
      assert.expect({"message":"hello world"});
      res.pipe(assert);
      server.close();
    });
  });
});

test('feat(middleware): http PORT API', (done) => {
  const agreedServer = new Server({ path: 'test/agrees/agrees.js' });
  const server = http.createServer((req, res) => {
    agreedServer.useMiddleware(req, res);
  }).listen(0);


  server.on('listening', () => {
    const port = server.address().port;
    const postData = JSON.stringify({
      message: 'foobarbaz',
      abc: 'foobarbaz',
    });
    const options = {
      host: 'localhost',
      method: 'POST',
      path: '/hoge/abc',
      port: port,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    const req = http.request(options, (res) => {
      const assert = new AssertStream();
      assert.expect({"message":"hello post"});
      res.pipe(assert);
      server.close();
    });

    req.write(postData);
    req.end();
  });
});

test('error (middleware): http GET 404 API when nullish', (done) => {
  const agreedServer = new Server({ path: 'test/agrees/agrees.js' });
  const server = http.createServer((req, res) => {
    agreedServer.useMiddleware(req, res);
  }).listen(0);


  server.on('listening', () => {
    const port = server.address().port;
    const options = {
      host: 'localhost',
      method: 'GET',
      path: '/headers/null',
      port: port,
    };
    const req = http.request(options, (res) => {
      server.close();
      assert(res.statusCode === 404);
      let content = '';
      res.on('data', (chunk) => content += chunk);
      res.on('end', () => console.log(content));
    });

    req.end();
  });
});

test('error (middleware): http GET 404 API when nullish headers', (done) => {
  const agreedServer = new Server({ path: 'test/agrees/agrees.js' });
  const server = http.createServer((req, res) => {
    agreedServer.useMiddleware(req, res);
  }).listen(0);


  server.on('listening', () => {
    const port = server.address().port;
    const options = {
      host: 'localhost',
      method: 'GET',
      path: '/headers/test/1',
      headers: {
        'x-test-token': 'null',
      },
      port: port,
    };
    const req = http.request(options, (res) => {
      server.close();
      assert(res.statusCode === 404);
      let content = '';
      res.on('data', (chunk) => content += chunk);
      res.on('end', () => console.log(content));
    });

    req.end();
  });
});

test('feat(middleware): http notfound called next', (done) => {
  const agreedServer = new Server({ 
    path: 'test/agrees/agrees.js',
    callNextWhenNotFound: true,
  });
  const server = http.createServer((req, res) => {
    agreedServer.useMiddleware(req, res, mustCall(() => {
      done();
    }));
  }).listen(0);

  server.on('listening', () => {
    const port = server.address().port;
    http.get('http://localhost:' + port + '/foobarbaz');
  });
});
