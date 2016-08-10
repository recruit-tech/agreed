const validate = require('jsonschema').validate;

module.exports = (target, schema) => {
  return validate(target, schema);
};
