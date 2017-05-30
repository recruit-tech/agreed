// eater:only
'use strict';
const assert = require('assert');
const cp = require('child_process');
const agreedServer = require('agreed-server');
const test = require('eater/runner').test;

const path = './test/agreed.json5';

const server = agreedServer({
  path: './test/agreed.json5',
  port: 0,
});


server.on('listening', () => {
  const result = cp.execSync(`node ${process.cwd()}/bin/agreed-client.js --port ${server.address().port} --path ${path}`).toString();
  assert(result.indexOf('✔ pass') >= 0);
  server.close();
});
