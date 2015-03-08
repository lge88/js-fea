/*global require*/
// fens

var _ = require('./core.utils');
var embed = _.embed;
var check = _.check;
var assert = _.assert;
var defineContract = _.defineContract;
var isMatrixOfDimension = _.isMatrixOfDimension;
var vectorOfDimension = _.vectorOfDimension;
var PointSet = require('./geometry.pointset').PointSet;

var _input_contract_fens_options_ = defineContract(function(o) {
  assert.object(o);
  assert.assigned(o.xyz);

  if (!isMatrixOfDimension(o.xyz, '*', 1) &&
      !isMatrixOfDimension(o.xyz, '*', 2) &&
      !isMatrixOfDimension(o.xyz, '*', 3) &&
      !check.instance(o.xyz, PointSet)) {
    throw new Error('Not valid xyz for fens.');
  }

}, 'Input is not a valid fens option.');

function FeNodeSet(options) {
  if (check.instance(options.xyz, PointSet)) {
    this._xyz = options.xyz.clone();
  } else {
    this._xyz = new PointSet(options.xyz);
  }
}

FeNodeSet.prototype.xyz = function() {
  return this._xyz.toList();
};

FeNodeSet.prototype.xyzById = function(id) {
  return this._xyz.get(id - 1);
};

FeNodeSet.prototype.get = FeNodeSet.prototype.xyzById;

FeNodeSet.prototype.xyzIter = function() {
  var i = 0, xyz = this._xyz, len = xyz.getSize();
  return {
    hasNext: function() { return i < len; },
    next: function() { return xyz.get(i++); }
  };
};

FeNodeSet.prototype.xyz3 = function() {
  return this._xyz.embed(3).toList();
};

FeNodeSet.prototype.xyz3ById = function(id) {
  return embed(this._xyz.get(id-1), 3);
};

FeNodeSet.prototype.xyz3Iter = function() {
  var it = this.xyzIter();
  return {
    hasNext: function() { return it.hasNext(); },
    next: function() { return embed(it.next(), 3); }
  };
};

FeNodeSet.prototype.count = function() {
  return this._xyz.getSize();
};

FeNodeSet.prototype.nfens = FeNodeSet.prototype.count;

exports.FeNodeSet = FeNodeSet;
