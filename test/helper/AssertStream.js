const Writable = require('stream').Writable;
const assert = require('power-assert');
const mustCall = require('must-call');

class AssertStream extends Writable {
  constructor(options) {
    super(options);
    this.result = '';
    this.on('finish', mustCall(() => {
      switch (typeof this.expect) {
        case 'string':
        case 'number':
          assert(this.expect === this.result);
          break;
        case 'object':
          assert.deepEqual(this.expect, JSON.parse(this.result));
          break;
      }
    }));
  }

  expect(obj) {
    this.expect = obj;
  }

  _write(chunk, encoding, callback) {
    this.result += chunk;
    callback();
  }
}

module.exports = AssertStream;
