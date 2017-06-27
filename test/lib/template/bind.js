'use strict';

const test = require('eater/runner').test;
const bind = require(`${process.cwd()}/lib/template/bind`);
const assert = require('power-assert');

test('bind: { key: "{:value}" }, { key: "foo" } => { value: "foo" }', () => {
  const result = bind({ key: "{:value}" }, { key: "foo" });
  assert.deepEqual(result, {value: "foo"});
});

test('bind: { key: { foo: "{:value}" }, { key: { foo: "foo"} } => { value: "foo" }', () => {
  const result = bind({ key: { foo: "{:value}" }}, { key: { foo: "foo" }});
  assert.deepEqual(result, {value: "foo"});
});

test('bind: { key: { foo: "{:value}" }, { key: { foo: null } } => { value: null }', () => {
  const result = bind({ key: { foo: "{:value}" }}, { key: { foo: null }});
  assert.deepEqual(result, {value: null });
});

test('bind: { key: { foo: "{:value.foo}" }, { key: { value: { foo: 12345 } } } => { value: { foo: 12345 } }', () => {
  const result = bind({ key: { foo: "{:value.foo}" }}, { key: { value: { foo: 12345 } } });
  assert.deepEqual(result, {value: { foo: 12345 } });
});

test('bind: { key: { foo: "{:value.foo.bar.0.baz}" }, { key: { value: { foo: { bar: [ { baz : 12345 } ] } } } } => { value: { foo: { bar: [ { baz: 12345 } ] } } }', () => {
  const result = bind({ key: { foo: "{:value.foo.bar.0.baz}" } }, { key: { value: { foo: { bar: [ { baz : 12345 } ] } } } });
  const expect = { value: { foo: { bar: [ { baz: 12345 } ] } } };
  assert.deepStrictEqual(result, expect);
});
