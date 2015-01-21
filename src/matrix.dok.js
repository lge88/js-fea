/*jshint undef: true, unused: true */
/*global __dirname describe it require*/
var numeric = require('numeric');

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
      out = Array.apply(null, Array(m)).map(function() {
        return Array.apply(null, Array(n)).map(function() { return 0.0; });
      });

  Object.keys(this._dict).forEach(function(i) {
    Object.keys(this._dict[i]).forEach(function(j) {
      out[i][j] = this.getValue(i, j);
    }, this);
  }, this);

  return out;
};

DokSparseMatrix.prototype.toCcs = function() {
  // TODO: better implementation
  return numeric.ccsSparse(this.toFull());
};

exports.DokSparseMatrix = DokSparseMatrix;
