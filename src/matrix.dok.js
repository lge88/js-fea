/*global require*/
var _ = require('./core.utils');
var array2d = _.array2d;
var ccsSparse = _.ccsSparse;
var ccsLUP = _.ccsLUP;
var ccsLUPSolve = _.ccsLUPSolve;

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

DokSparseMatrix.prototype.setValue = function(i, j, val) {
  if (i >= 0 && i < this.m && j >= 0 && j < this.n) {
    if (!this._dict[i]) this._dict[i] = {};
    this._dict[i][j] = val;
    return;
  }
  throw new Error('index ' + [i, j] + ' outof bound ' + [this.m, this.n]);
};

DokSparseMatrix.prototype.toFull = function() {
  var m = this.m,
      n = this.n,
      out = array2d(m, n, 0.0);

  Object.keys(this._dict).forEach(function(i) {
    Object.keys(this._dict[i]).forEach(function(j) {
      out[i][j] = this.getValue(i, j);
    }, this);
  }, this);

  return out;
};

DokSparseMatrix.prototype.toCcs = function() {
  // TODO: better implementation
  return ccsSparse(this.toFull());
};

DokSparseMatrix.prototype.solve = function(b) {
  // if (this.m !== this.n) {
  //   throw new Error('#solve can only be used by square matrix where this.m === this.n.');
  // }

  // if (this.m !== b.length) {
  //   throw new Error('#solve can only be applied to vector of same dimension.');
  // }

  var ccs = this.toCcs();
  var lup = ccsLUP(ccs);
  var x = ccsLUPSolve(lup, b);
  return x;
};



exports.DokSparseMatrix = DokSparseMatrix;
