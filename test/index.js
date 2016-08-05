const client = require('../index');
const server = require('agreed-server');
const test = require('eater/runner').test;
const plzPort = require('plz-port');

test('client: ', () => {
  plzPort().then((port) => {
    const app = server({
      path: './test/agreed_server.json5',
      port: port,
    });

    app.on('listening', () => {
      client({
        path: './test/agreed.json5',
        port: port,
      }).then(() => {
        app.close();
      });
    });
  });

});
