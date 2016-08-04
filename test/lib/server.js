const agreedServer = require('../helper/server.js');
const test = require('eater/runner').test;
const http = require('http');
const AssertStream = require('assert-stream');
const plzPort = require('plz-port');
const assert = require('power-assert');

test('server: POST API', (done) => {
  plzPort().then((port) => {
    const server = agreedServer({
      path: 'test/agrees/agrees.js',
      port: port,
    });

    server.on('listening', () => {
      const postData = JSON.stringify({
        message: 'foobarbaz',
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
      }).on('error', console.error);

      req.write(postData);
      req.end();
    });
  });
});


test('server: PUT API', (done) => {
  plzPort().then((port) => {
    const server = agreedServer({
      path: 'test/agrees/agrees.js',
      port: port,
    });

    server.on('listening', () => {
      const postData = JSON.stringify({
        a: 'b',
        c: 'd',
      });
      const options = {
        host: 'localhost',
        method: 'PUT',
        path: '/foo/aaa',
        port: port,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };
      const req = http.request(options, (res) => {
        const assert = new AssertStream();
        assert.expect("hello put");
        res.pipe(assert);
        server.close();
      }).on('error', console.error);

      req.write(postData);
      req.end();
    });
  });
});

test('server: DELETE API', (done) => {
  plzPort().then((port) => {
    const server = agreedServer({
      path: 'test/agrees/agrees.json5',
      port: port,
    });

    server.on('listening', () => {
      const options = {
        host: 'localhost',
        method: 'DELETE',
        path: '/qux/fuga',
        port: port,
      };
      const req = http.request(options, (res) => {
        assert(res.statusCode === 204);
        server.close();
      }).on('error', console.error);
      req.end();
    });
  });
});

test('server: GET with :id ', (done) => {
  plzPort().then((port) => {
    const server = agreedServer({
      path: 'test/agrees/agrees.js',
      port: port,
    });

    server.on('listening', () => {
      const options = {
        host: 'localhost',
        method: 'GET',
        path: '/path/fuga',
        port: port,
      };
      const req = http.request(options, (res) => {
        assert(res.statusCode === 200);
        const assertStream = new AssertStream();
        assertStream.expect({ message: "hello fuga" });
        res.pipe(assertStream);
        server.close();
      }).on('error', console.error);
      req.end();
    });
  });
});

test('server: POST with :id ', (done) => {
  plzPort().then((port) => {
    const server = agreedServer({
      path: 'test/agrees/agrees.js',
      port: port,
    });

    server.on('listening', () => {
      const postData = JSON.stringify({
        message: 'foobarbaz',
      });
      const options = {
        host: 'localhost',
        method: 'POST',
        path: '/path/fuga?meta=fooo',
        port: port,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };
      const req = http.request(options, (res) => {
        assert(res.statusCode === 200);
        const assertStream = new AssertStream();
        assertStream.expect({ message: "hello fuga, fooo, foobarbaz" });
        res.pipe(assertStream);
        server.close();
      }).on('error', console.error);
      req.write(postData);
      req.end();
    });
  });
});

test('server: check response when expect is filled', (done) => {
  plzPort().then((port) => {
    const server = agreedServer({
      path: 'test/agrees/agrees.js',
      port: port,
    });

    server.on('listening', () => {
      const postData = JSON.stringify({
        message: 'foobarbaz',
      });
      const options = {
        host: 'localhost',
        method: 'POST',
        path: '/embed/from/response/fuga?meta=true',
        port: port,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };
      const req = http.request(options, (res) => {
        assert(res.statusCode === 200);
        const assertStream = new AssertStream();
        assertStream.expect({ 
          message: "hello fuga true foobarbaz",
          image: 'http://imgfp.hotp.jp/SYS/cmn/images/front_002/logo_hotopepper_264x45.png',
          topics: [ 
            { 
              a: 'a' 
            }, { 
              b: 'b'
            } 
          ],
        });
        res.pipe(assertStream);
        server.close();
      }).on('error', console.error);
      req.write(postData);
      req.end();
    });
  });
});
