const test = require('eater/runner').test;
const assert = require('power-assert');
const toRegexp = require(`${process.cwd()}/lib/template/toRegexp`);

test('toRegexp: template string to Regexp', () => {
  const regexp = toRegexp('foo {:id}');
  assert('foo bar baz'.match(regexp));
});

test('toRegexp: template string to Regexp not match', () => {
  const regexp = toRegexp('bar {:id}');
  assert('foo bar baz'.match(regexp) === null);
});

test('toRegexp: template {:foo.aaa}', () => {
  const regexp = toRegexp('foo {:id.aaa} baz');
  assert('foo bar baz'.match(regexp));
});
