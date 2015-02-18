/*global require*/

// var _ = require('highland');
var _ = require('lodash');
var numeric = require('numeric');

var conflicts = [
  'all',
  'any',
  'clone',
  'identity',
  'isFinite',
  'isNaN',
  'max',
  'min',
  'random'
];

// TODO: do not mount numeric directly under _ namespace.
// Not that effecient, maybe precompute this.
_(numeric)
  .keys()
  .difference(conflicts)
  .forEach(function(method) {
    _[method] = numeric[method];
  });

_.Bimap = require('./core.bimap').Bimap;
_.Bipartite= require('./core.bipartite').Bipartite;
_.SetStore = require('./core.setstore').SetStore;

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


// a and b are array of numbers in same dimension.
function byLexical(a, b) {
  var i = 0, l = a.length, res;
  while (i < l) {
    res = a[i] - b[i];
    if (res !== 0) return res;
    ++i;
  }
  return res;
}
_.byLexical = byLexical;

function rotateLeft(arr, offset) {
  if (typeof offset === 'undefined')
    throw new Error('rotateLeft(): no offset specified.');

  var len = arr.length;
  var out = new Array(len);
  var i = (len + (offset % len)) % len, j = 0;
  while (j < len) {
    out[j] = arr[(i+j) % len];
    ++j;
  }
  return out;
}
function rotateRight(arr, offset) { return rotateLeft(arr, -offset); }
_.rotateLeft = rotateLeft;
_.rotateRight = rotateRight;

function minIndex(vec) {
  return _.reduce(vec, function(sofar, x, i) {
    if (x < sofar.value) {
      sofar.value = x;
      sofar.index = i;
    }
    return sofar;
  }, {
    value: Infinity,
    index: -1
  }).index;
}
_.minIndex = minIndex;

function isIterator(iter) {
  return iter && typeof iter.hasNext === 'function' &&
    typeof iter.next === 'function';
}
_.isIterator = isIterator;

_.noopIterator = {
  hasNext: function() { return false; },
  next: function() { return null; }
};

function listFromIterator(iter) {
  var out = [];
  while (iter.hasNext()) out.push(iter.next());
  return out;
}
_.listFromIterator = listFromIterator;

function iteratorFromList(lst) {
  if (!_.isArray(lst)) {
    throw new Error('iteratorFromList(lst): lst must be an array.');
  }

  var i = 0, len = lst.length;
  return {
    hasNext: function() { return i < len; },
    next: function() { return lst[i++]; }
  };
}
_.iteratorFromList = iteratorFromList;

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}
_.uuid = uuid;


function normalizedCell(cell) {
  var offset = minIndex(cell);
  return rotateLeft(cell, offset);
}
_.normalizedCell = normalizedCell;

module.exports = exports = _;
