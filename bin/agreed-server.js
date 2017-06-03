#!/usr/bin/env node

const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
const path = require('path');
const colo = require('colo');
const JSON5 = require('json5');
const agreedServer = require('../');

function showHelp(exitcode) {
  console.log(`
    agreed-server [--path agreed path file (required)] [--port server port default 3000] [--static static file path] [--static-prefix-path static serve path prefix] [--default-response-headers default response headers object] [--default-request-headers default request headers object]
    agreed-server --path ./agreed.js --port 4000
    agreed-server --path ./agreed.js --port 4000 --static ./static --stati-prefix-path /public --default-response-headers "{ 'access-control-allow-origin': '*' }" --default-request-headers "{ 'x-jwt-token': 'foobarbaz' }"
  `);
  process.exit(exitcode);
}

if (argv.help) {
  showHelp(0);
}

if (argv.version) {
  const pack = require('../package.json');
  console.log(pack.version);
  process.exit(0);
}

if (!argv.path) {
  console.error(colo.red('[agreed-server]: --path option is required'));
  showHelp(1);
}

if (argv['default-response-headers']) {
  argv.defaultResponseHeaders = JSON5.parse(argv['default-response-headers']);
}

if (argv['default-request-headers']) {
  argv.defaultRequestHeaders = JSON5.parse(argv['default-request-headers']);
}

agreedServer(argv).createServer();
