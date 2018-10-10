module.exports = [{
  request: {
    path: '/ts-messages',
    method: 'POST',
    body: {
      message: '{:message}'
    },
    values: {
      message: 'test'
    }
  }, 
  response: {
    body: {
      result: '{:message}'
    },
    values: {
      message: 'test'
    },
  },
}];
