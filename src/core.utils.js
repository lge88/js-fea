/*global require*/

// var _ = require('highland');
var _ = require('lodash');
var numeric = require('numeric');

var numericMethods = [
  'ccsSparse',
  'ccsLUP',
  'ccsLUPSolve',
  'norm2',
  'sub'
];

numericMethods.forEach(function(method) {
  _[method] = numeric[method];
});

function solveDok(dokMat, vec) {
  return dokMat.solve(vec);
}

function array1d(m, fn) {
  if (typeof fn === 'function') {
    return Array.apply(null, Array(m)).map(function(x, i) { return fn(i); });
  } else {
    return Array.apply(null, Array(m)).map(function() { return fn; });
  }
}
_.array1d = array1d;

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
_.array2d = array2d;

function embed(vec, dim) {
  var i, len, out;
  if (_.isArray(vec) && typeof dim === 'number') {
    out = array1d(dim, 0.0);
    for (i = 0, len = vec.length < dim ? vec.length : dim; i < len; ++i) out[i] = vec[i];
    return out;
  }
  throw new Error('embed(vec, dim): vec must be a Javascript array.');
}
_.embed = embed;

module.exports = exports = _;
