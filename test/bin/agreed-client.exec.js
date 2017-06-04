'use strict';
const assert = require('assert');
const cp = require('child_process');
const agreedServer = require('agreed-server');

const path = './test/agreed.json5';

const server = agreedServer({
  path: './test/agreed.json5',
  port: 0,
}).createServer();


server.on('listening', () => {
  setTimeout(() => {
    process.exit(0);
  }, 500);
  const exec = `${process.cwd()}/bin/agreed-client.js --port ${server.address().port} --path ${path}`;
  const proc = cp.exec(exec);
  let data = '';
  proc.on('data', (d) => data += d);
  proc.on('end', () => {
    assert(data.indexOf('✔ pass') >= 0);
    server.close();
    proc.kill();
  });
});
