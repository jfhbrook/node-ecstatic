'use strict';

const mime = require('mime');
const charset = require('charset');


exports.define = mappings => mime.define(mappings, true);

let customGetType = (file, defaultValue) => null;  // eslint-disable-line no-unused-vars

exports.setCustomGetType = (fn) => { customGetType = fn; };

exports.getType = (file, defaultValue) => (
  customGetType(file, defaultValue) ||
  mime.getType(file) ||
  defaultValue
);

exports.lookupCharset = contentType => charset(contentType) || 'utf8';
