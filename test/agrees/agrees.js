module.exports = [
  {
    request: {
      path: '/hoge/fuga',
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
  './hoge/foo.json',
  './foo/bar.yaml',
  {
    request: require('./qux/request.json'),
    response: require('./qux/response.json'),
  },
  {
    request: {
      path: '/path/:id',
      method: 'GET',
      // value for test client
      values: {
        id: 'yosuke',
      },
    },
    response: {
      headers: {
        'x-csrf-token': 'csrf-token', 
      },
      body: {
        // :id is for request value
        message: 'hello {:id}',
      },
    },
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
      // if no method then GET
      path: '/nyan/:id',
      query: {
        meta: "{:meta}",
      },
      // value for test client
      values: {
        id: 'yosuke',
        meta: false,
      },
    },
    response: {
      headers: {
        'x-csrf-token': 'csrf-token', 
      },
      body: {
        // :id is for request value
        message: 'hello {:id}, {:meta}',
      },
    },
  },
  {
    request: {
      path: '/embed/from/response/:id',
      method: 'POST',
      query: {
        meta: "{:meta}",
      },
      body: {
        message: '{:message}'
      },
      // value for test client
      values: {
        id: 'yosuke',
        meta: false,
        message: 'this is a message',
      },
    },
    response: {
      headers: {
        'x-csrf-token': 'csrf-token', 
      },
      body: {
        // embed template from response values
        image: '{:image}',
        topics: '{:topics}',
        message: 'hello {:id} {:meta} {:message}',
      },
      values: {
        image: 'http://imgfp.hotp.jp/SYS/cmn/images/front_002/logo_hotopepper_264x45.png',
        topics: [ 
          { 
            a: 'a' 
          }, { 
            b: 'b'
          } 
        ],
      }
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
      path: '/list/:index',
      method: 'GET',
      values: {
        index: 1
      }
    },
    response: {
      body: {
        result : '{:list[:index]}'
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
  {
    request: {
      path: '/useschema/withstring/:index',
      method: 'GET',
      values: {
        index: 1
      }
    },
    response: {
      body: {
        result : '{:list[:index]}'
      },
      schema: './schema/hi.json',
      values: {
        list: [
          'hello',
          'hi',
          'dunke',
        ]
      }
    },
  },
  {
    request: {
      path: '/headers/:index',
      method: 'GET',
      headers: {
        'x-token': '{:token}', 
        'x-api-key': '{:apiKey}', 
      },
      values: {
        index: 2,
        token: 'nyan',
        apiKey: 'nyaaan'
      },
    },
    response: {
      body: {
        result : '{:list[:index]} {:token} {:apiKey}'
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
  {
    request: {
      path: '/headers/:index',
      method: 'GET',
      values: {
        index: 1,
      },
    },
    response: {
      body: {
        result : '{:list[:index]}'
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
  {
    request: {
      path: '/headers/test/:index',
      method: 'GET',
      headers: {
        'x-test-token': '{:xTestToken}'
      },
      values: {
        index: 1,
        xTestToken: 'fdajfdsaoijfdoajofdjaoj',
      },
    },
    response: {
      body: {
        result : '{:list[:index]}'
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
