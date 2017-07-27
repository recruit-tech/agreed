'use strict';

const agreedServer = require('../helper/server.js');
const test = require('eater/runner').test;
const http = require('http');
const AssertStream = require('assert-stream');

test('server: `path` option can be directory index', () => {
  const server = agreedServer({
    path: 'test/agrees',
    port: 0,
  });

  server.on('listening', () => {
    const postData = JSON.stringify({
      message: 'foobarbaz',
    }); 
    const options = { 
      host: 'localhost',
      method: 'POST',
      path: '/hoge/abc',
      port: server.address().port,
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
