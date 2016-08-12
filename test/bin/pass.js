const assert = require('assert');
const plzPort = require('plz-port');
const cp = require('child_process');

const path = './test/agreed.json5';
plzPort().then((port) => {
  const proc = cp.exec(`node ${process.cwd()}/bin/agreed-server.js --port ${port} --path ${path}`);
  setTimeout(() => {
    const result = cp.execSync(`node ${process.cwd()}/bin/agreed-client.js --port ${port} --path ${path}`).toString();
    console.log(result);
    assert(result.indexOf('✔ pass') >= 0);
    proc.kill();

    process.exit(0);
  }, 1000);
});
