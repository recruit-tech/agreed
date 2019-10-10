# Agreed Server
[![Build Status](https://travis-ci.org/recruit-tech/agreed-server.svg?branch=add_travis)](https://travis-ci.org/recruit-tech/agreed-server)

[Agreed](https://www.npmjs.com/package/agreed-core) mock server

`agreed-server` is a mock server based on `agreed`.
This module provides CLI executable command and 2 programmable interface.
If you want to use `agreed` as mock, you would be better to install `agreed-server`.

# Install

```
$ npm install agreed-server --save-dev
```

# Basic Usage

Usage as CLI

```
$ agreed-server --path ./test/agreed.json --port 10101
```

Usage as programming

```js
const agreedServer = require('agreed-server');

const server = agreedServer({
  path: 'agreed/agreed.json',
  port: 3001,
  static: './static', // serve files from ./static
  staticPrefixPath: '/public',
}).createServer();
```

# Advanced Usage

Usage as Express pure server

```js
const agreedServer = require('agreed-server');

const { app, createServer } = agreedServer({
  path: 'agreed/agreed.json',
  port: 3001,
  static: './static', // serve files from ./static
  staticPrefixPath: '/public',
  middlewares: [
    logger,
    perfTool,
    secureHeaders,
  ],
  defaultRequestHeaders: {
    'x-forwarded-for': 'nginx'
  },
  defaultResponseHeaders: {
    'access-control-allow-origin': '*'
  },
});

app.use(someGoodMiddleware);
app.use((err, req, res, next) => {
  res.statusCode = 500;
  res.send(`Error is occurred : ${err}, you should see log`);
});
const server = createServer(app);
```

## notifier

Usage as notification event

### agreed file

```js
module.exports = [
  {
    request: {
      path: '/messages',
      method: 'POST',
      body: {
        message: '{:message}'
      },
      values: {
        message: 'test',
      },
    },
    response: {
      body: {
        result : '{:message}'
      },
      values: {
        message: 'test',
      },
      // add notify property for notification
      notify: {
        body: {
          message: 'message! {:message}'
        }
      }
    },
  },
]
```


```js
const agreedServer = require('agreed-server');

const { app, createServer, notifier } = agreedServer({
  path: 'agreed/agreed.json',
  port: 3001,
  static: './static', // serve files from ./static
  staticPrefixPath: '/public',
  middlewares: [
    logger,
    perfTool,
    secureHeaders,
  ],
  defaultRequestHeaders: {
    'x-forwarded-for': 'nginx'
  },
  defaultResponseHeaders: {
    'access-control-allow-origin': '*'
  },
});

notifier.on('message', (data) => {
  console.log(data) // { message: 'message! hoge' }
});

app.use(someGoodMiddleware);
app.use((err, req, res, next) => {
  res.statusCode = 500;
  res.send(`Error is occurred : ${err}, you should see log`);
});
const server = createServer(app);
```
