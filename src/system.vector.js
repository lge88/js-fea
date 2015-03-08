/*global require*/
// system.vector
var _ = require('./core.utils');
var iteratorFromList = _.iteratorFromList;
var isArray = _.isArray;
var isIterator = _.isIterator;
var numeric = require('./core.numeric');
var SparseVector = numeric.SparseVector;
// var mldivide = numeric.mldivide;

function SparseSystemVector(dim, elementVectors) {
  console.log("elementVectors = ", elementVectors);
  this._dim = dim;
  this._evs = elementVectors;
  this._sparseVector = null;
}
exports.SparseSystemVector = SparseSystemVector;

SparseSystemVector.prototype._assemble_ = function() {
  var sources = this._evs;
  var dest = new SparseVector([], this._dim);

  if (!isIterator(sources)) {
    if (isArray(sources))
      sources = iteratorFromList(sources);
    else
      throw new Error('SparseSystemVector::_assemble_: evs must be a iterator or array.');
  }

  var ev;
  while (sources.hasNext()) {
    ev = sources.next();
    console.log("ev = ", ev);
    var val = ev.value, en = ev.eqnum;
    console.log("val = ", val);
    var idx = en - 1;
    var was = dest.at(idx);

    dest.set_(idx, was + val);
  }
  this._sparseVector = dest;
};

SparseSystemVector.prototype.sparseVector = function() {
  if (this._sparseVector === null) this._assemble_();
  return this._sparseVector;
};

SparseSystemVector.prototype.toFull = function() {
  return this.sparseVector().toFull();
};
