'use strict';

module.exports =  (obj) => {
  const isContentJSON = obj.headers && obj.headers['Content-Type'] && obj.headers['Content-Type'].indexOf('application/json') >= 0;
  return isContentJSON || typeof obj.body === 'object'
};
