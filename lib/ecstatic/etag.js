module.exports = function (stat, weakEtag) {
  var etag = JSON.stringify([stat.ino, stat.size, stat.mtime].join('-'));
  if (weakEtag) {
    etag = 'W/' + etag;
  }
  return etag;
}
