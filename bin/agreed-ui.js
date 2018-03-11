#!/usr/bin/env node
const spawn = require('child_process').spawn
const minimist = require('minimist')
const colo = require('colo')
const execArgv = minimist(process.execArgv)
const argv = minimist(process.argv.slice(2))

function showHelp(exitcode) {
  console.log(`
    agreed-ui [--path agreed path file (required)][--port request server port default 3000]
    agreed-ui build [--path agreed path file (required)]
    agreed-ui --path ./agreed.js --port 4000
    agreed-ui build --path ./agreed.js
  `)
  process.exit(exitcode)
}

const command = argv['_'][0] || 'start'

if (argv.help || command === 'help') {
  showHelp(0)
}

if (argv.version || command === 'version') {
  const pack = require('../package.json')
  console.log(pack.version)
  process.exit(0)
}

if (!argv.path) {
  console.error(colo.red('[agreed-ui]: --path option is required'))
  showHelp(1)
}

const child = spawn('npm', [
  'run',
  command,
  '--',
  `--path=${argv.path}`,
  `--port=${argv.port || 3000}`,
])

child.stdout.on('data', function(data) {
  process.stdout.write(data)
})

child.stderr.on('data', function(data) {
  process.stdout.write(data)
})
