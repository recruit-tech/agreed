const assert = require('assert');
const plzPort = require('plz-port');
const cp = require('child_process');
const http = require('http');

const path = './test/agreed.json5';
plzPort().then((port) => {
  const proc = cp.exec(`${process.cwd()}/bin/agreed-ui.js --port ${port} --path ${path}`);
  setTimeout(() => {
    http.get(`http://localhost:${port}`, (response) => {
      let body = ''
      response.on('data', (d) => body += d);
      response.on('end', () => {
        assert(body.includes("Agreed UI"))
        proc.kill('SIGHUP');
        process.exit(0);
      });
    });
  }, 10000)
});
