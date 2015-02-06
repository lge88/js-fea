/*global require*/

// var _ = require('highland');
var _ = require('lodash');
var numeric = require('numeric');

var numericMethods = [
  'ccsSparse',
  'ccsLUP',
  'ccsLUPSolve'
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

_.array1d = array1d;
_.array2d = array2d;

module.exports = exports = _;
