"use strict";

const Writable = require("stream").Writable;
const diff = require("./diff");
const schemaValidator = require("./schemaValidator");

class CheckBodyStream extends Writable {
  constructor(options) {
    super(options);
    this.data = "";
    this.result = {};
    this.on("finish", () => {
      if (typeof this.expect === "object") {
        if (this.data.length === 0) {
          this.result.body = this.data;
          this.result.error = "empty body";
          this.emit("checked", this.result);
          return;
        }
        try {
          this.data = JSON.parse(this.data);
        } catch (e) {
          this.result.body = this.data;
          this.result.error = "broken json: " + e;
          this.emit("checked", this.result);
          return;
        }
        this.result.body = this.data;
        this.result.diff = diff(this.expect, this.data);
      } else {
        this.result.body = this.data;
        this.result.diff = diff(this.expect, this.data) || {};
      }

      if (this.expectSchema) {
        const validatedResult = schemaValidator(this.data, this.expectSchema);
        const errors = validatedResult.errors;
        if (errors.length > 0) {
          this.result.schemaErrors = errors;
        }
      }

      this.emit("checked", this.result);
    });
  }

  expect(obj) {
    this.expect = obj;
  }

  schema(obj) {
    this.expectSchema = obj;
  }

  _write(chunk, encoding, callback) {
    this.data += chunk;
    callback();
  }
}

module.exports = CheckBodyStream;
