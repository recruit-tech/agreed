#!/usr/bin/env node

const minimist = require('minimist');
const execArgv = minimist(process.execArgv);
const argv = minimist(process.argv.slice(2));
const colo = require('colo');
const agreedClient = require('agreed-client');

function showHelp() {
  console.log(`
    agreed-client [--path agreed path file (required)][--port request server port default 80][--host request server host default localhost][--scheme request server scheme default http]
    agreed-client --path ./agreed.js --port 4000 --host example.com --scheme http
  `);
  process.exit(0);
}

if (argv.help) {
  showHelp();
}

if (argv.version) {
  const pack = require('../package.json');
  console.log(pack.version);
  process.exit(0);
}

if (!argv.path) {
  console.error(colo.red('[agreed-client]: --path option is required'));
  showHelp();
}

agreedClient(argv);
