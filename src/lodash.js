// lodash with mixins

/*jshint undef: true, unused: true */
/*global __dirname describe it require*/
var _ = require('lodash');

function array1d(m, fn) {
  if (typeof fn === 'function') {
    return Array.apply(null, Array(m)).map(function(x, i) { return fn(i); });
  } else {
    return Array.apply(null, Array(m)).map(function() { return fn; });
  }
}

function array2d(m, n, fn) {
  if (typeof fn === 'function') {
    return array1d(m, function(i) {
      return array1d(n, function(j) {
        return fn(i, j);
      });
    });
  } else {
    return array1d(m, function(i) {
      return array1d(n, fn);
    });
  }
}

_.mixin({
  array1d: array1d,
  array2d: array2d
});

module.exports = exports = _;
