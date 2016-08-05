'use strict';

module.exports =  (obj) => {
  const isContentJSON = obj.headers && obj.headers['Content-Type'] === 'application/json';
  return isContentJSON || typeof obj.body === 'object'
};
