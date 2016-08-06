'use strict';

const test = require('eater/runner').test;
const assert = require('power-assert');
const hasTemplate = require(`${process.cwd()}/lib/template/hasTemplate`).hasTemplate;
const hasTemplateWithAnyString = require(`${process.cwd()}/lib/template/hasTemplate`).hasTemplateWithAnyString;

test('hasTemplate: check template has {:id}', () => {
  const has = hasTemplate('foo {:id}');
  assert(has);
});

test('hasTemplate: check template has not {:id}', () => {
  const has = hasTemplate('foo {id}');
  assert(!has);
});

test('hasTemplateWithAnyString: check template has not foo {:id}', () => {
  const has = hasTemplateWithAnyString('foo {:id}');
  assert(has);
});

test('hasTemplateWithAnyString: check template has not foo {:id}', () => {
  const has = hasTemplateWithAnyString('{:id}');
  assert(!has);
});

