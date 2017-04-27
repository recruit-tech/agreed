'use strict';

const test = require('eater/runner').test;
const checker = require(`${process.cwd()}/lib/check/checker`);
const assert = require('power-assert');

test('checker[checkNullish]: check type { key: "foo" }, { key: "bar" } doest not have error ', () => {
  const obj1 = {
    key: "foo",
  };

  const obj2 = {
    key: 'bar',
  };

  assert(checker.checkNullish(obj1, obj2).error === undefined);
});

test('checker[checkNullish]: check type { key: "undefined" }, { key: "foo" } has error because undefined is nullish  ', () => {
  const obj1 = {
    key: "undefined",
  };

  const obj2 = {
    key: 'foo',
  };

  assert(checker.checkNullish(obj1, obj2).error === 'Request value has nullish strings undefined in key');
});

test('checker[checkNullish]: check type { key: "null" }, { key: "foo" } has error because null is nullish  ', () => {
  const obj1 = {
    key: "null",
  };

  const obj2 = {
    key: 'foo',
  };

  assert(checker.checkNullish(obj1, obj2).error === 'Request value has nullish strings null in key');
});

test('checker[checkNullish]: check type { key: "123" }, { key: 1 } does not have error', () => {
  const obj1 = {
    key: "123",
  };

  const obj2 = {
    key: 1,
  };

  assert(checker.checkNullish(obj1, obj2).error === undefined);
});

test('checker[checkNullish]: check type { key: 1 }, { key: "3" } does not have error ', () => {
  const obj1 = {
    key: 1,
  };

  const obj2 = {
    key: '3',
  };

  assert(checker.checkNullish(obj1, obj2).error === undefined);
});

test('checker[checkNullish]: check nested type does not have error ', () => {
  const obj1 = {
    key: {
      foo: 'test'
    },
  };

  const obj2 = {
    foo: 'hoge',
  };

  assert(checker.checkNullish(obj1, obj2).error === undefined);
});

test('checker[checkNullish]: check nested type does not have error ', () => {
  const obj1 = {
    key: {
      foo: {
        bar: 'null'
      }
    },
  };

  const obj2 = {
    bar: 'hoge',
  };

  assert(checker.checkNullish(obj1, obj2).error === 'Request value has nullish strings null in bar');
});

