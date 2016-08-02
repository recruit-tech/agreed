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

