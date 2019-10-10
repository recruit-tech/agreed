#!/usr/bin/env node

const minimist = require('minimist');
const execArgv = minimist(process.execArgv);
const argv = minimist(process.argv.slice(2));
const colo = require('colo');
const agreedClient = require('../index.js');
const JSON5 = require('json5');

function showHelp(exitcode) {
  console.log(`
    agreed-client [--path agreed path file (required)][--port request server port default 80][--host request server host default localhost][--scheme request server scheme default http][--default-request-headers request default headers]
    agreed-client --path ./agreed.js --port 4000
    agreed-client --path ./agreed.js --port 4000 --host example.com --scheme http --default-request-headers "{ 'x-auth-token': 'fugafuga' }"
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
  console.error(colo.red('[agreed-client]: --path option is required'));
  showHelp(1);
}

if (argv['default-request-headers']) {
  argv.defaultRequestHeaders = JSON5.parse(argv['default-request-headers']);
}

const { client, agrees, reporter } = agreedClient(argv);
client.requestPromise(agrees).then(reporter).catch((e) => {
  console.error(e);
  process.exit(1);
});
