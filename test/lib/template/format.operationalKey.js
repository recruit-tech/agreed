'use strict';

const test = require('eater/runner').test;
const format = require(`${process.cwd()}/lib/template/format`);
const assert = require('power-assert');

test('format: {randomInt:id}', () => {
  const result = format({ id: '{randomInt:id}' }, { id: '1-10000' });
  assert(result.id >= 1);
  assert(result.id <= 10000);
});

test('format: {randomInt:id} but no range', () => {
  const result = format({ id: '{randomInt:id}' }, { id: 1 });
  // default value is over 1
  assert(result.id > 1);
  assert(result.id <= Number.MAX_SAFE_INTEGER);
});

test('format: {randomInt:id} but range 1000-100', () => {
  const result = format({ id: '{randomInt:id}' }, { id: '1000-100' });
  assert(result.id >= 0);
  assert(result.id <= 1000);
});

test('format: {parseInt:id}', () => {
  const result = format({ id: '{parseInt:id}' }, { id: '10000' });
  assert.deepStrictEqual(result.id, 10000);
});

test('format: {unixtime:time}', () => {
  const unixtime = parseInt(Date.now() / 1000);
  const result = format({ time: '{unixtime:time}' }, { time: '10000' });
  assert(result.time >= unixtime);
});

test('format: {sum:a,b}', () => {
  const sum = (a, b) => a + b;
  const result = format({ sum: '{sum:a,b}' }, { a: 1, b: 2 }, { sum: sum });
  assert.strictEqual(result.sum, 3);
});

test('format: {sub:a,b}', () => {
  const result = format({ sub: '{sub:a,b}' }, { a: 1, b: 2 }, { sub: './test/agrees/sub.js', basedir: process.cwd() });
  assert.strictEqual(result.sub, -1);
});

test('format: {sub:a,b} but response is array', () => {
  const result = format({ sub: '{sub:a,b}' }, { a: 1, b: 2 }, { sub: (a, b) => [ a - b, a + b, a * b, a / b ], basedir: process.cwd() });
  assert.deepStrictEqual(result.sub, [ -1, 3, 2, 0.5 ]);
});

test('format: {sub:a.0,a.1}', () => {
  const result = format({ sub: '{sub:a.0,a.1}' }, { a: [0, 4] }, { sub: (a, b) => a - b, basedir: process.cwd() });
  assert.strictEqual(result.sub, -4 );
});
