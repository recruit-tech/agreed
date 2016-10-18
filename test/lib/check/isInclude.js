'use strict';

const test = require('eater/runner').test;
const isInclude = require(`${process.cwd()}/lib/check/isInclude`);
const assert = require('power-assert');

test('isInclude: check object is include', () => {
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

  const is = isInclude(small, large);
  assert(is);
});

test('isInclude: check nested object is include', () => {
  const small = {
    abc: 'abc',
    def: '{:aaa}',
    ghi: '{:hoo}',
  };

  const large = {
    abc: 'abc',
    def: { a: '123' },
    ghi: 1,
    jkl: 'aaaaa',
  };

  const is = isInclude(small, large);
  assert(is);
});

test('isInclude: check nested array is include', () => {
  const small = {
    abc: 'abc',
    def: '{:aaa}',
    ghi: '{:hoo}',
    jkl: '{:array}',
  };

  const large = {
    abc: 'abc',
    def: { a: '123' },
    ghi: 1,
    jkl: [],
  };

  const is = isInclude(small, large);
  assert(is);
});

test('isInclude: check large value is empty string', () => {
  const small = {
    abc: 'abc',
    def: '{:aaa}',
    ghi: '{:hoo}',
    jkl: '{:array}',
  };

  const large = {
    abc: 'abc',
    def: { a: '123' },
    ghi: 0,
    jkl: '',
  };

  const is = isInclude(small, large);
  assert(is);
});

test('isInclude: false, check large value is empty string', () => {
  const small = {
    abc: 'abc',
    def: '{:aaa}',
    ghi: '{:hoo}',
    jkl: '{:array}',
  };

  const large = {
    abc: 'abc',
    def: { a: '123' },
    ghi: null,
    jkl: undefined,
  };

  const is = isInclude(small, large);
  assert(!is);
});
