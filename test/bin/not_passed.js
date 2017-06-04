const assert = require('assert');
const plzPort = require('plz-port');
const cp = require('child_process');

const pass = './test/agreed.json5';
const not_pass = './test/not_passed.json5';
plzPort().then((port) => {
  const proc = cp.exec(`${process.cwd()}/node_modules/.bin/agreed-server --port ${port} --path ${not_pass}`);
  setTimeout(() => {
    const result = cp.execSync(`${process.cwd()}/node_modules/.bin/agreed-client --port ${port} --path ${pass}`).toString();

    console.log(result);
    assert(result.indexOf('✗ fail') >= 0);
    proc.kill();

    setTimeout(() => {
      process.exit(0);
    }, 500);
  }, 1000);
});

