#!/usr/bin/env node

const minimist = require('minimist');
const argv = minimist(process.argv.slice(2), {
  string: [
    'path',
    'port',
    'static',
    'static-prefix-path',
    'default-response-headers',
    'default-request-headers',
    'proxy',
    'proxy-prefix-path',
    'typed-cache-path'
  ],
  boolean: ['help', 'version', 'logging', 'strict', 'hot', 'cors'],
  alias: {
    l: 'logging'
  },
  default: {
    hot: true
  }
});
const path = require('path');
const colo = require('colo');
const JSON5 = require('json5');
const url = require('url');
const agreedServer = require('../');

const usage = `
Usage: agreed-server --path <path> [options]

Options:
  --help                             Shows the usage and exits.
  --version                          Shows version number and exits.
  --path <path>                      Agreed file path. Required.
  --port <port>                      Server port. Default 3000.
  --static <path>                    Static file path.
  --static-prefix-path <prefix>      Static serve path prefix.
  --default-response-headers <json>  Default response headers object.
  --default-request-headers <json>   Default request headers object.
  --proxy <hostname>                 Proxy host.
  --proxy-prefix-path <prefix>       Proxy server path prefix.
  -l, --logging                      Logs requests in console.
  --cors                             Enable CORS.
  --strict                           Run strict mode.
  --hot                              Hot Replacement agree files. Default true
  --typed-cache-path                 Create Cached JSON to improve agreed typed performance.

Examples:
  agreed-server --path ./agreed.js --port 4000
  agreed-server --path ./agreed.js --port 4000 \\
                --static ./static --stati-prefix-path /public \\
                --default-response-headers "{ 'access-control-allow-origin': '*' }" \\
                --default-request-headers "{ 'x-jwt-token': 'foobarbaz' }"
  agreed-server --path ./agreed.js --port 4000 \\
                --proxy example.com \\
                --proxy-prefix-path /proxy
  agreed-server --path ./agreed.js --port 4000 \\
                --typed-cache-path ./.agreed.json
`.trim();

function showHelp(exitcode) {
  console.log(usage);
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
