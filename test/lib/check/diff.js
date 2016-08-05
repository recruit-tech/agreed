'use strict';

const test = require('eater/runner').test;
const diff = require(`${process.cwd()}/lib/check/diff`);
const assert = require('power-assert');

test('diff: check object is equal', () => {
  const small = {
    abc: 'abc',
    def: '{:aaa}',
    ghi: 1,
  };

  const large = {
    abc: 'abc',
    def: 'aaa',
    ghi: 1,
    jkl: 'aaaaa',
  };

  const d = diff(small, large);
  assert.deepEqual(d, {});
});

test('diff: check object not equality', () => {
  const small = {
    abc: 'abc',
    def: '{:aaa}',
    ghi: 1,
  };

  const large = {
    abc: 'abc',
    def: 'aaa',
    ghi: 2,
    jkl: 'aaaaa',
  };

  const d = diff(small, large);
  assert.deepEqual(d, { ghi: [1, 2]});
});

test('diff: check object not deep equality', () => {
  const small = {
    abc: 'abc',
    def: '{:aaa}',
    hoge: '{:aaa}',
    fuga: '{:aaa}',
    ghi: 1,
    foo: {
      aa: '123',
      b: {
        fff: {
          a: 'hello {:aa}'
        }
      }
    }
  };

  const large = {
    abc: 'abc',
    def: 'aaa',
    fuga: {
      abc: '123',
    },
    ghi: 2,
    jkl: 'aaaaa',
    foo: {
      aa: '123',
      b: {
        fff: 'aaa'
      }
    }
  };

  const d = diff(small, large);
  assert.deepEqual(d, { 
    hoge: [ '{:aaa}', undefined ],
    ghi: [ 1, 2 ], 
    foo: { 
      b: { 
        fff: [{
          a: 'hello {:aa}'
        }, 'aaa'] 
      } 
    } 
  });
});
