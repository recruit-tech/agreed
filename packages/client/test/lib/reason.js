'use strict';

const reason = require(`${process.cwd()}/lib/reason`);
const test = require('eater/runner').test;

test('reporter: show reason', () => {
  const diff = {
    hoge: [ '{:aaa}', undefined ],
    ghi: [ 1, 2 ], 
    foo: { 
      b: { 
        fff: [{
          a: 'hello {:aa}'
        }, 'aaa'] 
      } 
    } 
  };

  reason.diff(diff);
});
