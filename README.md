[![Build Status](https://secure.travis-ci.org/logicalparadox/drip.png)](http://travis-ci.org/logicalparadox/drip)

# Drip

An EventEmitter alternative for nodejs and the browser that supports namespaces and wildcards.

* See the [documentation](http://logicalparadox.github.com/drip).

#### Features

- blazing fast _(try the benchmarks)_
- delimeted/namespaced events &amp; wildcards
- support for [node.js](http://nodejs.org) and the browser
- extensively used in [qualiancy's](http://qualiancy.com) production environment

#### Installation

The `drip` package is available through [npm](http://npmjs.org). It is recommended
that you add it to your project's `package.json`.

```bash
npm install drip
```

## Tests

Tests are writting in [Mocha](http://github.com/visionmedia/mocha) using 
the [Chai](http://chaijs.com) `expect` BDD assertion library. To make sure you 
have that installed, clone this repo, install dependacies using `npm install`.

    $ npm test

## Contributors

Interested in contributing? Fork to get started. Contact [@logicalparadox](http://github.com/logicalparadox) 
if you are interested in being regular contributor.

* Jake Luer ([@logicalparadox](http://github.com/logicalparadox))

## License

(The MIT License)

Copyright (c) 2011 Jake Luer <jake@alogicalparadox.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
