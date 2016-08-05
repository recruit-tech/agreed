#!/usr/bin/env node

const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
const path = require('path');
const colo = require('colo');
const agreedServer = require('agreed-server');

function showHelp() {
  console.log(`
    agreed-server [--path agreed path file (required)] [--port server port default 3000]
    agreed-server --path ./agreed.js --port 4000
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
  console.error(colo.red('[agreed-server]: --path option is required'));
  showHelp();
}

agreedServer(argv);
