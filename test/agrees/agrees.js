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
]
