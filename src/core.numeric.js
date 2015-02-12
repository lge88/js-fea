/*global require*/
// core.numeric

var _ = require('./core.utils');
var array2d = _.array2d;

var numeric = require('numeric');
var ccsSparse = numeric.ccsSparse;
var ccsFull = numeric.ccsFull;
var ccsLUP = numeric.ccsLUP;
var ccsLUPSolve = numeric.ccsLUPSolve;

function dictToFull(dict, m, n) {
  var out = array2d(m, n, 0.0);

  Object.keys(dict).forEach(function(i) {
    Object.keys(dict[i]).forEach(function(j) {
      out[i][j] = dict[i][j];
    });
  });

  return out;
}


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

function DokSparseMatrix(ijvLst, m, n) {
  // check dimension m x n is valid
  this.m = m;
  this.n = n;
  this._dict = {};

  if (Array.isArray(ijvLst)) {
    ijvLst.forEach(function(ijv) {
      var i = ijv[0], j = ijv[1], val = ijv[2];
      this.setValue(i, j, val);
    }, this);
  }
}

DokSparseMatrix.prototype.getValue = function(i, j) {
  if (i >= 0 && i < this.m && j >= 0 && j < this.n) {
    if (this._dict[i] && this._dict[i][j]) {
      return this._dict[i][j];
    }
    return 0.0;
  }
  throw new Error('index ' + [i, j] + ' outof bound ' + [this.m, this.n]);
};
DokSparseMatrix.prototype.at = DokSparseMatrix.prototype.getValue;

DokSparseMatrix.prototype.setValue = function(i, j, val) {
  if (i >= 0 && i < this.m && j >= 0 && j < this.n) {
    if (!this._dict[i]) this._dict[i] = {};
    this._dict[i][j] = val;
    return;
  }
  throw new Error('index ' + [i, j] + ' outof bound ' + [this.m, this.n]);
};
DokSparseMatrix.prototype.set_ = DokSparseMatrix.prototype.setValue;

DokSparseMatrix.prototype.toFull = function() {
  return dictToFull(this._dict, this.m, this.n);
  // var m = this.m,
  //     n = this.n,
  //     out = array2d(m, n, 0.0);

  // Object.keys(this._dict).forEach(function(i) {
  //   Object.keys(this._dict[i]).forEach(function(j) {
  //     out[i][j] = this.getValue(i, j);
  //   }, this);
  // }, this);

  // return out;
};

DokSparseMatrix.prototype.toCcs = function() {
  // TODO: better implementation
  return ccsSparse(this.toFull());
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

// b is a vector
// Return a vector
DokSparseMatrix.prototype.solveVector = function(b) {
  if (this.m !== this.n) {
    throw new Error('DokSparseMatrix::solve can only be used by square matrix where this.m === this.n.');
  }

  if (this.m !== b.length) {
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

  if (this.m !== b.dim) {
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
  var res = new SparseVector(valueList, this.m);
  return res;
};

exports.DokSparseMatrix = DokSparseMatrix;

function listFromIterator(iter) {
  var out = [];
  while (iter.hasNext()) out.push(iter.next());
  return out;
}

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

function SparseVector(valueList, dimension) {
  var dict = {};
  if (_.isArray(valueList)) {
    valueList.forEach(function(tuple) {
      var idx = tuple[0], val = tuple[1];
      dict[idx] = val;
    });
  }

  this._dict = dict;
  this._dim = dimension;
}

SparseVector.prototype.getDim = function() { return this._dim; };
SparseVector.prototype.__defineGetter__('dim', SparseVector.prototype.getDim);

SparseVector.prototype.at = function(i) {
  if (i >=0 && i < this.dim) {
    return this._dict[i];
  }
  throw new Error('SparseVector::at(i): index outof bound.');
};
SparseVector.prototype.toCcs = function() {
  // TODO: better implementation
  var full = this.toFull();
  var ccs = ccsSparse(full);
  return ccs;
};
SparseVector.prototype.toFull = function() {
  var dim = this.dim, dict = this._dict;
  return array2d(dim, 1, function(i, j) {
    if (typeof dict[i] === 'number')
      return dict[i];
    return 0;
  });
};

exports.SparseVector = SparseVector;
_.assign(exports, numeric);
