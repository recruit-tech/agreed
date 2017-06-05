agreed-core
====================
[![Build Status](https://travis-ci.org/recruit-tech/agreed-core.svg?branch=master)](https://travis-ci.org/recruit-tech/agreed-core)
[![codecov](https://codecov.io/gh/recruit-tech/agreed-core/branch/master/graph/badge.svg)](https://codecov.io/gh/recruit-tech/agreed-core)

agreed is Consumer Driven Contract tool with JSON mock server.

agreed has 3 features.

1. Create contract file as json(json5/yaml/etc) file
1. mock server for frontend development.
1. test client for backend development

`agreed-core` is a library to create test client and mock server. `agreed-core` provide the following features.

1. json5/yaml require hook, you can write require('foo.json5') / require('bar.yaml') using agreed-core/register.
1. server middleware, agreed-core provides express/pure node http middleware.
1. test client, agreed-core provides response check.

# Install

```
$ npm install agreed-core --dev
```

# Usage

## Usage as Frontend Mock Server

- Create agreed file (this file is used as a contract between frontend and backend)

```javascript
module.exports = [
  {
    request: {
      path: '/user/:id',
      method: 'GET',
      query: {
        q: '{:someQueryStrings}',
        index: '{:index}',
      },
      values: {
        id: 'yosuke',
        someQueryStrings: 'bye',
        index: 2,
      },
    },
    response: {
      headers: {
        'x-csrf-token': 'csrf-token', 
      },
      body: {
        // hello yosuke bye
        message: '{:greeting} {:id} {:someQueryStrings}',
        // http://example.com/baz.jpg 
        image: '{:images[:index]}',
        themes: [
          // { name: 'green' }
          {
            name: '{:themes.0.name}'
          },
          // { name: 'blue' }, { name: 'red' }
          '{:themes.1-last}'
        ],
      },
      // you can write json schema
      // schema: {
      //   type: 'object',
      //   properties: {
      //     message: { type: 'string' },
      //     image: { type: 'string' },
      //     themes: { 
      //       type: 'array',
      //       items: { 
      //         type: 'object',
      //         properties: {
      //           name: { type: 'string' }
      //         }
      //       }
      //     }
      //   }
      // },
      values: {
        greeting: 'hello',
        images: [
          'http://example.com/foo.jpg',
          'http://example.com/bar.jpg',
          'http://example.com/baz.jpg',
        ],
        themes: [
          {
            name: 'green',
          },
          {
            name: 'blue',
          },
          {
            name: 'red',
          },
        ]
      }
    },
  },
]
```

- Create server

We support express, pure node.js and any other frameworks can use agreed.

```javascript
'use strinct';
const express = require('express');
const bodyParser = require('body-parser');
const Agreed = require('agreed-core');
const agreed = new Agreed();
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

```
$ node server.js
```

- call server from client

```
$ curl http://localhost:3000/user/alice?q=foo
{ 
  "message": "hello alice foo",
  "images": [
    "http://example.com/foo.jpg",
    "http://example.com/bar.jpg"
  ],
  "themes": {
    "name": "green",
  },
}
```

## Usage as Backend test client

agreed can be test client.

- Reuse agreed file

```javascript
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

- Create test client 

```javascript
'use strinct';
const Agreed = require('agreed-core');
const agreed = new Agreed();
const client = agreed.createClient({
  path: './agreed/file/agreed.js',
  host: 'example.com',
  port: 12345,
});

// Get Agreements as array.
const agrees = client.getAgreement();

// request to servers.
// in this case, GET example.com:12345/user/yosuke?q=foo
const responses = client.executeAgreement(agrees);

// Check response object.
client.checkResponse(responses, agrees).then((diffs) => {
  // if the response is mismatched to agreed response,
  // you can get diff.
  // but if no difference, you can get empty object {}
  diffs.forEach((diff) => {
    if (Object.keys(diff).length > 0) {
      console.error('your request does not matched: ', diff);
    }
  });
});
```


# APIs

## Agreement

### how to define API specs

Agreement file can be written in JSON5/YAML/JavaScript format. You can choose your favorite format.

- JSON5 example

```javascript
[
  {
    "request": {
      "path": '/hoge/fuga',
      "method": 'GET',
      // you can write query
      "query": {
        "q": 'foo',
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
  {
    "request": {
      // you can write regexp path, 
      // match /users/yosuke
      "path": '/users/:id',
      "method": 'GET',
    },
    response: {
      // embed path :id to your response body 
      // if request path /users/yosuke
      // return { "message": "hello yosuke" }
      body: {
        message: 'hello {:id}',
      },
    },
  },
  // you can write json file
  // see test/agrees/hoge/foo.json
  './hoge/foo.json',
  // you can write yaml file
  // see test/agrees/foo/bar.yaml
  './foo/bar.yaml',
  // you can separate request/response json
  {
    request: './qux/request.json',
    response: './qux/response.json',
  },
  {
    request: {
      path: '/path/:id',
      method: 'POST',
      // query embed data, any query is ok.
      query: {
        meta: "{:meta}",
      },
      body: {
        message: "{:message}"
      },
      // value for test client
      values: {
        id: 'yosuke',
        meta: true,
        message: 'foobarbaz'
      },
    },
    response: {
      headers: {
        'x-csrf-token': 'csrf-token', 
      },
      body: {
        // :id is for request value
        message: 'hello {:id}, {:meta}, {:message}',
      },
    },
  },
  {
    request: {
      path: '/images/:id',
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
  {
    request: {
      path: '/useschema/:index',
      method: 'GET',
      values: {
        index: 1
      }
    },
    response: {
      body: {
        result : '{:list[:index]}'
      },
      // you can write json schema
      schema: {
        type: 'object',
        properties: {
          result: {
            type: 'string'
          }
        },
      },
      values: {
        list: [
          'hello',
          'hi',
          'dunke',
        ]
      }
    },
  },
]
```

