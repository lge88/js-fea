/*global require*/
// system.matrix
var _ = require('./core.utils');
var iteratorFromList = _.iteratorFromList;
var isArray = _.isArray;
var isIterator = _.isIterator;
var numeric = require('./core.numeric');
var mldivide = numeric.mldivide;
var DokSparseMatrix = numeric.DokSparseMatrix;

function assemble_(dest, sources) {
  // TODO: ensure sources of made of ElementMatrix;
  if (!isIterator(sources)) {
    if (isArray(sources))
      sources = iteratorFromList(sources);
    else
      throw new Error('assemble_(dest, sources): sources must be a iterator or array.');
  }

  var Ke;
  while (sources.hasNext()) {

    Ke = sources.next();
    var mat = Ke.matrix, eqnums = Ke.eqnums;

    var noneZeroIndices = eqnums.map(function(globalIndex, localIndex) {
      return {
        globalIndex: globalIndex,
        localIndex: localIndex
      };
    }).filter(function(item) {
      return item.globalIndex !== 0;
    });

    noneZeroIndices.forEach(function(item0) {
      // Notice the equation number starts from 1.
      var globalRowIndex = item0.globalIndex - 1;
      var localRowIndex = item0.localIndex;
      noneZeroIndices.forEach(function(item1) {
        var globalColIndex = item1.globalIndex - 1;
        var localColIndex = item1.localIndex;

        var oldVal = dest.at(globalRowIndex, globalColIndex);

        // TODO: use mat.at()
        var elementContribution = mat[localRowIndex][localColIndex];
        dest.set_(globalRowIndex, globalColIndex, oldVal + elementContribution);
      });
    });
  }
}

function SparseSystemMatrix(nrows, ncols, kes) {
  this._kes = kes;
  this._nrows = nrows;
  this._ncols = ncols;
  this._dokMatrix = null;
}

SparseSystemMatrix.prototype._assemble_ = function() {
  this._dokMatrix = new DokSparseMatrix([], this._nrows, this._ncols);
  assemble_(this._dokMatrix, this._kes);
};

SparseSystemMatrix.prototype.dokMatrix = function() {
  if (this._dokMatrix == null) this._assemble_();
  return this._dokMatrix;
};

SparseSystemMatrix.prototype.toFull = function() {
  return this.dokMatrix().toFull();
};

SparseSystemMatrix.prototype.mldivide = function(vec) {
  var mat = this.dokMatrix();
  return mldivide(mat, vec);
};

exports.SparseSystemMatrix = SparseSystemMatrix;
