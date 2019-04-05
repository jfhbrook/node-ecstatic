'use strict';

const mime = require('mime');
const charset = require('charset');


exports.define = mappings => mime.define(mappings, true);

exports.getType = (file, defaultValue) => mime.getType(file) || defaultValue;

exports.lookupCharset = contentType => charset(contentType) || 'utf8';
