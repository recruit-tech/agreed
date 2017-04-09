# Agreed Server
[![Build Status](https://travis-ci.org/recruit-tech/agreed-server.svg?branch=add_travis)](https://travis-ci.org/recruit-tech/agreed-server)

[Agreed](https://www.npmjs.com/package/agreed-core) mock server

# Install

```
$ npm install agreed-server --save
```

# Usage

```js
const agreedServer = require('agreed-server');

agreedServer({
  path: 'agreed/agreed.json',
  port: 3001,
  static: './static', // serve files from ./static
  staticPrefixPath: '/public',
});
```

