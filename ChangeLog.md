2015/03/27 Version 0.7.1
- Treat ENOTDIR as 404 (same as ENOENT)

2015/03/18 Version 0.7.0
- Add support for specifying default content-type (as an alternative to application/octet-stream)
- Use url-join for autoIndex route, fixes windows problems

2015/03/01 Version 0.6.1
- Fix handleError fall-through with directory listings

2015/02/16 Version 0.6.0
- Fix for pathname decoding in windows
- Fix for hrefs in directory listings
- Add ability to turn off setting of Server header
- Remove extraneous call to res.end (handled by stream pipe)
- Remove tests from npm package due to jenkins bug
- Start a ChangeLog.md
