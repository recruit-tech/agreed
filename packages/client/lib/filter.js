'use strict';

module.exports = (agrees, filter) => {
  var result = agrees;
  if (!filter) {
    return result;
  }

  if (filter.path) {
    result = result.filter((agree) => {
      return agree.request.path.indexOf(filter.path) === 0;
    });
  }

  if (filter.method) {
    result = result.filter((agree) => {
      return agree.request.method === filter.method;
    });
  }

  return result;
};
