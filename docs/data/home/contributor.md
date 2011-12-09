---
  title: For Contributors
  weight: 10
  render-file: false
---

## Developing

Please avoid making changes to the `dist` versions of drip if you are developing in the browser. All
changes to the library are to be made to `lib/drip.js` and then packaged for the browser using the `make`
command.

      make

## Testing

Tests are written in BDD style on [mocha test framework](http://visionmedia.github.com/mocha/) using
the [chai assert library](https://github.com/logicalparadox/chai). Tests are written to pass in both
a node.js environment and in the browser.

Browsers tests are currently known to pass in Chrome 16 and Firefox 8. Please let me know if you can test
in other browsers or other version.

### Server Side Testing

It's quite simple...

      make test


### Browser Side Testing

It's also quite simple. Open up `test/browser/index.html` in your nearest browser.

## Benchmarking

A benchmarking suite is available but is a work in progress. To run it...

      make benchmark