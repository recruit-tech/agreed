'use strict';

const fs = require('fs');
const compile = require('./compile');

module.exports = (parse, extensions) => {
  extensions.forEach((ext) => {
    delete require.extensions[ext];
    require.extensions[ext] = (module, file) => { 
      const agree = parse(fs.readFileSync(file).toString('utf-8'));
      compile(module, file, agree);
    };
  });
};

