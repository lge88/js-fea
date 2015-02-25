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
_(numeric)
  .keys()
  .difference(conflicts)
  .forEach(function(method) {
    _[method] = numeric[method];
  });

_.numeric = numeric;

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


// Type checking & contracts:
var check = require('check-types');
var assert = require('assert');

_._env = 'dev';

function noop() {}
_.noop = noop;

function defineContract(c, whatsWrong) {
  if (_._env === 'dev') {
    return function() {
      try {
        c.apply(null, arguments);
      } catch(err) {
        if (typeof whatsWrong === 'function')
          err.message = whatsWrong.apply(null, arguments) + '\n' + err.message;

        if (whatsWrong)
          err.message = whatsWrong + '\n' + err.message;

        throw err;
      }
    };
  } else {
    return noop;
  }
}

assert.string = check.assert.string;
assert.unemptyString = check.assert.unemptyString;
assert.webUrl = check.assert.webUrl;
assert.length = check.assert.length;
assert.number = check.assert.number;
assert.positive = check.assert.positive;
assert.negative = check.assert.negative;
assert.odd = check.assert.odd;
assert.even = check.assert.even;
assert.integer = check.assert.integer;
assert.function = check.assert.function;
assert.array = check.assert.array;
assert.length = check.assert.length;
assert.date = check.assert.date;
assert.object = check.assert.object;
assert.emptyObject = check.assert.emptyObject;
assert.instance = check.assert.instance;
assert.like = check.assert.like;
assert.null = check.assert.null;
assert.undefined = check.assert.undefined;
assert.assigned = check.assert.assigned;
assert.boolean = check.assert.boolean;

_.check = check;
_.assert = assert;
_.defineContract = defineContract;

_.contracts = {};

function matrixOfDimension(m, n, msg) {
  if (m !== '*') assert.positive(m);
  if (n !== '*') assert.positive(n);

  if (!msg) msg = 'input is not a matrix of ' + m + ' x ' + n + '.';
  return defineContract(function(mat) {
    assert.array(mat, 'mat is not a JS array');

    if (m === '*') m = mat.length;
    assert(mat.length === m, 'mat length ' + mat.length + ' is not '+ m);

    var i, j;
    for (i = 0; i < m; ++i) {
      assert.array(mat[i], 'row ' + i + ' is not a JS array');
      if (n === '*') n = mat[i].length;
      assert(mat[i].length === n, 'row ' + i + ' has ' + mat[i].length + ' elements' +
             ' instead of ' + n);
      for (j = 0; j < n; ++j) {
        assert.number(mat[i][j], 'mat(' + [i,j] + ') is not a number.');
      }
    }
  }, msg);
};

_.contracts.matrixOfDimension = matrixOfDimension;

function vectorOfDimension(n, msg) {
  if (n !== '*') assert.positive(n);
  if (!msg) msg = 'input is not a vector of ' + n + ' dimension.';
  return defineContract(function(vec) {
    assert.array(vec, 'vec is not a JS array');
    if (n === '*') n = vec.length;
    assert(vec.length === n, 'vec length ' + vec.length + ' is not ' + n);

    var i;
    for (i = 0; i < n; ++i)
      assert.number(vec[i], 'vec(' + i + '): ' + vec[i] + ' is not a number.');

  }, msg);

}

_.contracts.vectorOfDimension = vectorOfDimension;




module.exports = exports = _;
