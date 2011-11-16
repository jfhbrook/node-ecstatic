# Ecstatic

*A simple static file server middleware that works with both Express and Flatiron*

# Example:

```js
var union = require("union"),
    express = require("express"),
    expressStatic = express.static(__dirname + '/public'),
    ecstatic = require("./ecstatic")(__dirname + '/public');

union.createServer({
  before: [
    ecstatic
  ]
}).listen(8080);

express.createServer(ecstatic).listen(8081);

console.log("union: localhost:8080");
console.log("express: localhost:8081");
```

## API:

### ecstatic(folder);

Pass ecstatic a folder, and it will return your middleware!

### middleware(req, res, next);

This works more or less as you'd expect.

## Tests:

Currently, the "test" consists of an example. You can run it with:

    npm test

If you can successfully hit the following urls it's working:

* <http://localhost:8080/turtle.png>
* <http://localhost:8080/hello.txt>
* <http://localhost:8081/turtle.png>
* <http://localhost:8081/hello.txt>

## Contributing:

This project's current implementation is extremely simplistic. If you find that it's not cutting the mustard: Please! Send a pull request! Or, at least, file an issue.

## License:

MIT/X11.
