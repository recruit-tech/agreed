"use strict";
// eater:only
const test = require("eater/runner").test;
const checker = require(`${process.cwd()}/lib/check/checker`);
const assert = require("power-assert");

test('checker[body]: check { key: "foo" }, { key: "bar" } returns similarity: 1 ', () => {
  const entryBody = {
    key: "foo"
  };

  const requestBody = {
    key: "bar"
  };

  assert.deepEqual(checker.body(entryBody, requestBody), {similarity: 1});
});

test('checker[body]: check nested objects returns similarity: 3/4', () => {
  const entryBody = {
    key: "foo",
    key2:{
      key2_1: "bar",
      key2_2: "baz"
    }
  };

  const requestBody = {
    key: "foo",
    key2:{
      key2_1: "bar"
    }
  };

  assert.deepEqual(checker.body(entryBody, requestBody), {similarity: 3/4});
});

test('checker[body]: check nested objects returns similarity: 5/6', () => {
  const entryBody = {
    key: "foo",
    key2:{
      key2_1: "bar",
      key2_2: {
        key2_2_1: "baz",
        key2_2_2: "bazbaz"
      }
    }
  };

  const requestBody = {
    key: "foo",
    key2:{
      key2_1: "bar",
      key2_2: {
        key2_2_1: "baz",
      }
    }
  };

  assert.deepEqual(checker.body(entryBody, requestBody), {similarity: 5/6});
});

test('checker[body]: check nested objects returns similarity: 1/6', () => {
  const entryBody = {
    key: "foo",
    key2:{
      key2_1: "bar",
      key2_2: {
        key2_2_1: "baz",
        key2_2_2: "bazbaz"
      }
    }
  };

  const requestBody = {
    key: "foo"
  };

  assert.deepEqual(checker.body(entryBody, requestBody), {similarity: 1/6});
});