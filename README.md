agreed
====================

agreed is Consumer Driven Contract tool with JSON mock server.

agreed has 3 features.

1. Create contract file as json(json5/yaml/etc) file
1. test utility for frontend development.
1. test client for backend development

# Install

```
$ npm install agreed-core --dev
```

# Usage

1. Create agreed.js file

```javascript
module.exports = [
  {
    request: {
      url: '/hoge/fuga',
      method: 'GET',
      query: {
        q: 'foo',
      },
    },
    response: {
      headers: {
        'x-csrf-token': 'csrf-token', 
      },
      body: {
        message: 'hello world',
      },
    },
  },
]
```

2. Create server structure

```javascript
'use strinct';
const express = require('express');
const bodyParser = require('body-parser');
const agreed = require('agreed-core');
const app = express();

app.use(bodyParser.json());

app.use(agreed.middleware({
  path: './agreed/file/agreed.js',
}));

app.use((err, req, res, next) => {
  res.statusCode = 500;
  res.send(`Error is occurred : ${err}`);
});
app.listen(3000);

```

3. call server

```
$ curl http://localhost:3000/hoge/fuga?q=foo
{ "message": "hello world" }
```

That's it.

