const assert = require('assert');
const plzPort = require('plz-port');
const cp = require('child_process');

const path = './test/agreed.json5';
plzPort().then((port) => {
  const proc = cp.exec(`${process.cwd()}/bin/agreed-server.js --port ${port} --path ${path}`);
  setTimeout(() => {
    const result = cp.execSync(`${process.cwd()}/bin/agreed-client.js --port ${port} --path ${path}`).toString();
    console.log(result);
    assert(result.indexOf('✔ pass') >= 0);
    proc.kill();

    setTimeout(() => {
      process.exit(0);
    }, 500);
  }, 1000);
});

plzPort().then((port) => {
  const proc = cp.exec(`${process.cwd()}/bin/agreed-server.js --port ${port} --path ${path} --default-headers " { 'access-control-allow-origin': '*' } "`);
  setTimeout(() => {
    const result = cp.execSync(`${process.cwd()}/bin/agreed-client.js --port ${port} --path ${path}`).toString();
    console.log(result);
    assert(result.indexOf('✔ pass') >= 0);
    proc.kill();

    setTimeout(() => {
      process.exit(0);
    }, 500);
  }, 1000);
});
