const Context = require(`${process.cwd()}/lib/context.js`);
const test = require('eater/runner').test;
const http = require('http');

test('smoke(context): check instantiation', () => {
  const context = new Context({ path: 'test/agrees/agrees.js' });

  const req = {
    url: '/hoge/fuga',
    method: 'GET',
    query: {
      q: 'foo'
    },
  };


  const res = {
    statusCode : 0,
    headers: [],
    body: '',
    setHeader: function(key, value) {
      this.headers.push({ [key]: value });
    },
    end: function(object) {
      this.body = object;
    }
  };

  context.useMiddleware(req, res);
});
