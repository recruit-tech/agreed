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
  require('./hoge/foo.json'),
  require('./foo/bar.yaml'),
  {
    request: require('./qux/request.json'),
    response: require('./qux/response.json'),
  },
  {
    request: {
      url: '/path/:id',
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
]
