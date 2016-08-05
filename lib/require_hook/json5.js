'use strict';

const EXTENSIONS = ['.json', '.json5'];
const JSON5 = require('json5');
const hook = require('./hook');

module.exports = () => hook(JSON5.parse, EXTENSIONS);
