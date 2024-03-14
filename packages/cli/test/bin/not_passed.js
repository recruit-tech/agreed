const assert = require('assert');
const plzPort = require('plz-port');
const cp = require('child_process');

const pass = './test/agreed.json5';
const not_pass = './test/not_passed.json5';
plzPort().then((port) => {
  const proc = cp.exec(`${process.cwd()}/bin/agreed-server.js --port ${port} --path ${not_pass}`);
  setTimeout(() => {
    const result = cp.execSync(`${process.cwd()}/bin/agreed-client.js --port ${port} --path ${pass}`).toString();
    assert(result.indexOf('✗ fail') >= 0);
    proc.kill();

    setTimeout(() => {
      process.exit(0);
    }, 500);
  }, 10000);
});

