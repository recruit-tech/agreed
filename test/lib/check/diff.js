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

test('diff: check object', () => {
  const small = {
    abc: 'abc {:test}',
    def: '{:aaa}',
    ghi: 1,
  };

  const large = {
    abc: 'aaa test',
    def: 'aaa',
    ghi: 'aaaaa',
  };

  const d = diff(small, large);
  assert.deepEqual(d, {
    abc: ['abc {:test}', 'aaa test'],
    ghi: [1, 'aaaaa'],
  });
});

test('diff: check rest array string', () => {
  const small = {
    abc: 'abc {:test}',
    def: '{:aaa}',
    ghi: [
      {
        a: '{:ghi.0.a}',
        c: '{:ghi.0.c}',
        e: '{:ghi.0.e}'
      },
      '{:ghi.1-last}'
    ],
  };

  const large = {
    abc: 'abc test',
    def: 'aaa',
    ghi: [
      {
        a: 'b',
        c: 'd',
        e: 'e'
      },
    ],
  };

  const d = diff(small, large);
  assert.deepEqual(d, {});
});

test('diff: check value included null', () => {
  const small = {
    abc: 'abc',
    def: '{:aaa}',
    ghi: 1,
  };

  const large = {
    abc: 'abc',
    def: null,
    ghi: 1,
  };

  const d = diff(small, large);
  assert.deepEqual(d, {});
});
