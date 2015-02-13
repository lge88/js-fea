/*global require*/
// core.numeric

var _ = require('./core.utils');
var array1d = _.array1d;
var array2d = _.array2d;
var listFromIterator = _.listFromIterator;

var numeric = require('numeric');
var ccsSparse = numeric.ccsSparse;
var ccsFull = numeric.ccsFull;
var ccsLUP = numeric.ccsLUP;
var ccsLUPSolve = numeric.ccsLUPSolve;

function vecEquals(a, b, aTolerance) {
  if (!_.isArray(a) || !_.isArray(b)) return false;
  if (a.length !== b.length) return false;

  var tolerance = aTolerance || vecEquals.TOLERANCE;
  var d = numeric.sub(a, b);
  var relativeError = numeric.norm2(d) / numeric.norm2(b);
  return relativeError < tolerance;
};
vecEquals.TOLERANCE = 1e-4;
exports.vecEquals = vecEquals;

// both a and b are 2d array
function array2dEquals(a, b, aTolerance) {
  if (a.length !== b.length) return false;

  var m = a.length;
  if (m === 0) return false;

  var n = a[0].length || 0;
  if (n === 0) return false;
  if (!(b && b[0] && b[0].length === n)) return false;

  var tolerance = typeof aTolerance === 'number' ? aTolerance : array2dEquals.TOLERANCE;
  var d = numeric.sub(a, b);
  var relativeError = numeric.norm2(d) / numeric.norm2(b);
  return relativeError < tolerance;
}
array2dEquals.TOLERANCE = 1e-4;
exports.array2dEquals = array2dEquals;

// input: ccs representation
// output: iterator that emits a sequence of (i, j, value) tuple.
function ccsValueListIterator(ccs) {
  var indicesForFirstNonZeroElementInEachColumn = ccs[0];
  var rowIndices = ccs[1];
  var values = ccs[2], len = values.length;
  var i = 0, currentColumn = 0;
  return {
    hasNext: function() {
      return i < len;
    },
    next: function() {
      var row, col, val, res;
      row = rowIndices[i];
      col = currentColumn;
      val = values[i];
      res = [ row, col, val ];

      // update:
      var indexAtNewColumn = indicesForFirstNonZeroElementInEachColumn[currentColumn + 1];
      ++i;
      if (i >= indexAtNewColumn) {
        ++currentColumn;
      }

      return res;
    }
  };
}
exports.ccsValueListIterator = ccsValueListIterator;

function DenseMatrix(m, n, fn) {
  if (typeof m === 'number' && m > 0 &&
      typeof n === 'number' && n > 0) {
    this.m = m;
    this.n = n;
    this._data = _.array2d(m, n, fn);
  }
  throw new Error('DenseMatrix(m, n): m and n must be positive integer.');
}

DenseMatrix.prototype.at = function(i, j) {
  if (i >= 0 && i < this.m && j >= 0 && j < this.n) {
    return this._data[i][j];
  }
  throw new Error('DenseMatrix::at(): index ' + [i, j] + ' outof bound ' + [this.m, this.n]);
};

DenseMatrix.prototype.size = function() {
  throw new Error('DenseMatrix::size()');
};

DenseMatrix.prototype.set_ = function(i, j, val) {
  if (i >= 0 && i < this.m && j >= 0 && j < this.n) {
    this._data[i][j] = val;
  }
  throw new Error('DenseMatrix::set(): index ' + [i, j] + ' outof bound ' + [this.m, this.n]);
};

DenseMatrix.prototype.toFull = function() {
  return this._data;
};

DenseMatrix.prototype.toCcs = function() {
  return ccsSparse(this.toFull());
};

function DokSparseMatrix(valueList, m, n) {
  if ((m | 0) !== m || m <= 0 || (n | 0) !== n || n <= 0)
    throw new Error('DokSparseMatrix(ijvLst, m, n): m, n must be ' +
                   'positive integer.');

  this._m = m;
  this._n = n;
  this._dict = {};

  var iter = _.noopIterator;
  if (_.isArray(valueList)) {
    iter = _.iteratorFromList(valueList);
  } else if (_.isIterator(valueList)) {
    iter = valueList;
  }

  var ijv, i, j, val;
  while (iter.hasNext()) {
    ijv = iter.next();
    i = ijv[0];
    j = ijv[1];
    val = ijv[2];
    this.set_(i, j, val);
  }
}

DokSparseMatrix.prototype.size = function() { return [this.m, this.n]; };

DokSparseMatrix.prototype.m = function() { return this._m; };
DokSparseMatrix.prototype.n = function() { return this._n; };

DokSparseMatrix.prototype.at = function(i, j) {
  if (i >= 0 && i < this._m && j >= 0 && j < this._n) {
    if (this._dict[j] && this._dict[j][i]) {
      return this._dict[j][i];
    }
    return 0.0;
  }
  throw new Error('DokSparseMatrix::at(i, j): i,j: ' + [i, j] + ' outof dimension m, n: ' + [this._m, this._n]);
};

DokSparseMatrix.prototype.set_ = function(i, j, val) {
  if (i >= 0 && i < this._m && j >= 0 && j < this._n) {
    if (typeof val !== 'number')
      throw new Error('DokSparseMatrix::set_(i, j, val): val must be a number. val = ' + val);

    // Internally the dict is store the column index as first layer, then row index.
    // This make convertion to ccs efficient.
    if (!this._dict[j]) this._dict[j] = {};
    this._dict[j][i] = val;
    return;
  }
  throw new Error('DokSparseMatrix::set_(i, j, val): i,j: ' + [i, j] + ' outof dimension m, n: ' + [this._m, this._n]);
};

DokSparseMatrix.prototype.toFull = function() {
  var m = this._m, n = this._n, out = array2d(m, n, 0.0);
  Object.keys(this._dict).forEach(function(j) {
    Object.keys(this._dict[j]).forEach(function(i) {
      out[i][j] = this.at(i, j);
    }, this);
  }, this);

  return out;
};

DokSparseMatrix.prototype.toCcs = function() {
  var dict = this._dict, m = this._m, n = this._n;
  var ccs = [ [0], [], [] ];
  var nzCountInColumns = array1d(n, function(i) {
    if (typeof dict[i] !== 'undefined')
      return Object.keys(dict[i]).length;
    return 0;
  });

  nzCountInColumns.forEach(function(count) {
    var indices = ccs[0], sofar = indices[indices.length - 1];
    indices.push(sofar + count);
  });

  var cols = Object.keys(dict).sort(function(a, b) {
    return parseInt(a) - parseInt(b);
  });

  cols.forEach(function(col) {
    Object.keys(dict[col]).forEach(function(row) {
      var val = dict[col][row];
      ccs[1].push(row);
      ccs[2].push(val);
    });
  });

  return ccs;
};

DokSparseMatrix.prototype.toJSON = function() {
  return { m: this.m, n: this.n, values: this.toValueList() };
};

DokSparseMatrix.prototype.toValueList = function() {
  var values = [], dict = this._dict;
  Object.keys(dict).forEach(function(i) {
    Object.keys(dict[i]).forEach(function(j) {
      var val = dict[i][j];
      values.push([i, j, val]);
    });
  });
  return values;
};

// b is a [number]
// Return a [number]
DokSparseMatrix.prototype.solveVector = function(b) {
  if (this._m !== this._n) {
    throw new Error('DokSparseMatrix::solve can only be used by square matrix where this.m === this.n.');
  }

  if (this._m !== b.length) {
    throw new Error('DokSparseMatrix::solve can only be applied to vector of same dimension.');
  }

  var A = this.toCcs();
  var lup = ccsLUP(A);
  return ccsLUPSolve(lup, b);
};

// b is a SparseVector
// Return a SparseVector
DokSparseMatrix.prototype.solveSparseVector = function(b) {
  if (!(b instanceof SparseVector)) {
    throw new Error('DokSparseMatrix::solveSparseVector(b): b must be a SparseVector.');
  }

  if (this._m !== b.length()) {
    throw new Error('DokSparseMatrix::solve can only be applied to vector of same dimension.');
  }

  var A = this.toCcs();
  var lup = ccsLUP(A);
  var ccsB = b.toCcs();

  // TODO: make it fast..
  // var ccsX = ccsSparse(ccsFull(ccsLUPSolve(lup, ccsB)));
  var ccsX = ccsLUPSolve(lup, ccsB);

  var valueList = listFromIterator(ccsValueListIterator(ccsX)).map(function(tuple) {
    return [tuple[0], tuple[2]];
  });
  var res = new SparseVector(valueList, this._m);
  return res;
};

exports.DokSparseMatrix = DokSparseMatrix;

function SparseVector(valueList, dimension) {
  if ((dimension | 0) !== dimension || dimension <= 0)
    throw new Error('SparseVector(valueList, dimension): dimension must be positive integer.');

  this._dim = dimension;
  this._dict = {};

  var iter = _.noopIterator;
  if (_.isArray(valueList)) {
    iter = _.iteratorFromList(valueList);
  } else if (_.isIterator(valueList)) {
    iter = valueList;
  }

  var item, idx, val;
  while (iter.hasNext()) {
    item = iter.next();
    idx = item[0];
    val = item[1];
    if (val !== 0)
      this.set_(idx, val);
  }
}

SparseVector.prototype.length = function() { return this._dim; };
SparseVector.prototype.dim = SparseVector.prototype.length;

SparseVector.prototype.nzCount = function() {
  var count = 0, k;
  for (k in this._dict) ++count;
  return count;
};

SparseVector.prototype.at = function(i) {
  if (i >=0 && i < this._dim) {
    var val = this._dict[i];
    if (typeof val === 'number') return val;
    return 0;
  }
  throw new Error('SparseVector::at(i): index outof bound.');
};

SparseVector.prototype.valueListIterator = function() {
  var i = 0, indices = Object.keys(this._dict), len = indices.length;
  var dict = this._dict;
  indices.sort(function(a, b) {
    return parseInt(a) - parseInt(b);
  });

  return {
    hasNext: function() { return i < len; },
    next: function() {
      var idx = indices[i], item = [parseInt(idx), dict[idx]];
      ++i;
      return item;
    }
  };
};

SparseVector.prototype.equals = function(other, aTolerance) {
  // TODO: better implementation
  var a = this.toList();
  var b = typeof other.toList === 'function' ? other.toList() : other;
  var ok = vecEquals(a, b, aTolerance);
  return ok;
};

SparseVector.prototype.set_ = function(i, val) {
  if (i < 0 || i >= this._dim)
    throw new Error('SparseVector::set_(i): index outof bound.');

  if (typeof val !== 'number')
    throw new Error('SparseVector::set_(i, val): val must be a number. val = ' + val);

  if (val !== 0)
    this._dict[i] = val;
};


SparseVector.prototype.toCcs = function() {
  var dict = this._dict, dim = this._dim, key, i;
  var ccs = [ [0, -1], [], [] ];
  var nNonZeros = 0;
  for (key in dict) {
    i = parseInt(key);
    ccs[1].push(i);
    ccs[2].push(dict[i]);
    ++nNonZeros;
  }
  ccs[0][1] = nNonZeros;
  return ccs;
};

SparseVector.prototype.toFull = function() {
  var dim = this._dim, dict = this._dict;
  return array2d(dim, 1, function(i, j) {
    if (typeof dict[i] === 'number')
      return dict[i];
    return 0;
  });
};

SparseVector.prototype.toList = function() {
  var dim = this._dim, dict = this._dict;
  return array1d(dim, function(i) {
    if (typeof dict[i] === 'number')
      return dict[i];
    return 0;
  });
};

function mldivide(A, b) {
  if (A instanceof DokSparseMatrix && b instanceof SparseVector) {
    return A.solveSparseVector(b);
  } else if (A instanceof DokSparseMatrix && _.isArray(b)) {
    return A.solveVector(b);
  }

  throw new Error('mldivide(A, b): unsupported type A or b. A, b: ' + A + ', ' + b);
}
exports.mldivide = mldivide;

exports.SparseVector = SparseVector;
_.assign(exports, numeric);
