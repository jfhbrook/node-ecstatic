/*jslint indent: 2, maxlen: 80, node: true */
'use strict';
var env = process.env, customProxy = 'ecstatic_proxy';
Object.keys(process.env).forEach(function unconfigureProxies(key) {
  if (key === customProxy) { return; }
  if (key.match(/_proxy$/i)) {
    delete process.env[key];
    // ^-- it has to be "delete": a shortcut of
    //     env.http_proxy = env.ecstatic_proxy
    //     resulted in having "undefined" (as string) in env.http_proxy.
    return;
  }
});
customProxy = env[customProxy];
if (customProxy) {
  env.http_proxy = customProxy;
  env.https_proxy = customProxy;
}
