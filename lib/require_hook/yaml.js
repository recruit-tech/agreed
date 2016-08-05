'use strict';

const EXTENSIONS = ['.yaml', '.yml'];
const YAML = require('yamljs');
const hook = require('./hook');

module.exports = () => hook(YAML.parse, EXTENSIONS);
