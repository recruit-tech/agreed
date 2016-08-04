const Writable = require('stream').Writable;
const diff = require('./diff');

class CheckBodyStream extends Writable {
  constructor(options) {
    super(options);
    this.data = '';
    this.result;
    this.on('finish', () => {
      switch (typeof this.expect) {
        case 'object':
          this.result = diff(this.expect, JSON.parse(this.data));
          break;
        default:
          this.result = diff(this.expect, this.data) || {};
          break;
      }
      this.emit('checked', this.result);
    });
  }

  expect(obj) {
    this.expect = obj;
  }

  _write(chunk, encoding, callback) {
    this.data += chunk;
    callback();
  }
}

module.exports = CheckBodyStream;
