/*jslint indent: 2, maxlen: 80, node: true */
'use strict';
Object.keys(process.env).forEach(function unconfigureProxies(key) {
  if (key.match(/_proxy$/i)) { return delete process.env[key]; }
});
