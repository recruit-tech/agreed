'use strict';

const test = require('eater/runner').test;
const schemaValidator = require(`${process.cwd()}/lib/check/schemaValidator`);
const assert = require('power-assert');

test('schema: check object is satisfied type', () => {
  const object = {
    abc: 'abc',
    def: 'def',
    ghi: 1,
  };

  const schema = {
    type: 'object',
    properties: {
      abc: {
        type: 'string'
      },
      def: {
        type: 'string'
      },
      ghi: {
        type: 'number'
      },
    }
  };

  const result = schemaValidator(object, schema);
  assert(result.errors.length === 0);
});

test('schema: check object is not satisfied type', () => {
  const object = {
    abc: 'abc',
    def: 'def',
    ghi: '1',
  };

  const schema = {
    type: 'object',
    properties: {
      abc: {
        type: 'string'
      },
      def: {
        type: 'string'
      },
      ghi: {
        type: 'number'
      },
    }
  };

  const result = schemaValidator(object, schema);
  assert(result.errors.length === 1);
  assert(result.errors[0].stack === 'instance.ghi is not of a type(s) number');
});

