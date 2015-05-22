2015/05/22 Version 0.8.0
- Add ability to define custom mime-types, inline or with Apache .types file
- Test against express ^4.12.3 and union ^0.4.4
- Run tests with tap ^1.0.3
- Fix newline asserts to work with windows
- Add license attribute to package.json
- Elaborate contribution guidelines

2015/05/09 Version 0.7.6
- Fix double encoding in directory listings

2015/05/07 Version 0.7.5
- Fix HTML reflection vulnerability in certain error handlers

2015/04/17 Version 0.7.4
- Fix sort ordering in directory listings

2015/04/13 Version 0.7.3
- Close fstream if/when res closes, fixes potential fd leak

2015/04/05 Version 0.7.2
- Correctly handle req.statusCode in recursive calls; do not inherit upstream res.statusCode

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
