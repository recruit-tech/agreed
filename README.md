# <img src="https://recruit-tech.github.io/agreed/media/logo-with-text.svg" width="300" />

[![Build Status](https://travis-ci.org/recruit-tech/agreed.svg?branch=master)](https://travis-ci.org/recruit-tech/agreed)


agreed is Consumer Driven Contract tool with JSON mock server.

agreed has 3 features.

1. Create contract file as json(json5/yaml/etc) file
1. mock server for frontend development.
1. test client for backend development

# Install

```
$ npm install agreed -g
```

# Usage

## Usage as Frontend Mock Server

- Create agreed file (this file is used as a contract between frontend and backend)

```javascript
// save as agreed.js
module.exports = [
  {
    request: {
      path: '/user/:id',
      method: 'GET',
      query: {
        q: '{:someQueryStrings}',
      },
      values: {
        id: 'yosuke',
        someQueryStrings: 'foo'
      },
    },
    response: {
      headers: {
        'x-csrf-token': 'csrf-token', 
      },
      body: {
        message: '{:greeting} {:id} {:someQueryStrings}',
        images: '{:images}',
        themes: '{:themes}',
      },
      values: {
        greeting: 'hello',
        images: [
          'http://example.com/foo.jpg',
          'http://example.com/bar.jpg',
        ],
        themes: {
          name: 'green',
        },
      }
    },
  },
]
```

- Run server

```
$ agreed-server --path ./agreed.js --port 3010
```

- curl to the mock server

```
$ curl http://localhost:3000/user/yosuke?q=foo
{
  "message": "hello yosuke foo",
  "images": [
    "http://example.com/foo.jpg",
    "http://example.com/bar.jpg"
  ],
  "themes": {
    "name": "green"
  }
}
```

## Usage as Backend test client

- Run test client for confirm response

```
$ agreed-client --path ./agreed.js --port 3030 --host example.com
```

