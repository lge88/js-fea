/*global require*/
// material

var _ = require('./core.utils');
var check = _.check;
var assert = _.assert;
var defineContract = _.defineContract;
var property = require('./property');
var LinElIso = property.LinElIso;
var numeric = require('./core.numeric');
var ix = numeric.ix;

function Material() {}

Material.prototype.newState = function() {
  throw new Error('Material::newState(): is not implemented.');
};

Material.prototype.update = function() {
  throw new Error('Material::update(): is not implemented.');
};
exports.Material = Material;

var _input_contract_linel_uniax_prop_ = defineContract(function(o) {
  assert.object(o);
  if (!check.instance(o.property, LinElIso)) {
    throw new Error('input is not a instance of LinElIso.');
  }
}, 'Input is not a valid option for DeforSSLinElUniax');

function DeforSSLinElUniax(options) {
  _input_contract_linel_uniax_prop_(options);
  this._prop = options.property;
}

DeforSSLinElUniax.prototype = Object.create(Material.prototype);
DeforSSLinElUniax.prototype.constructor = DeforSSLinElUniax;

// return: mat:(1,1)
DeforSSLinElUniax.prototype.tangentModuli = function() {
  return [ [this._prop.E()] ];
};

exports.DeforSSLinElUniax = DeforSSLinElUniax;

var _input_contract_linel_biax_prop_ = defineContract(function(o) {
  assert.object(o);
  if (!check.instance(o.property, LinElIso)) {
    throw new Error('input is not a instance of LinElIso.');
  }
}, 'Input is not a valid option for DeforSSLinElBiax');

function DeforSSLinElBiax(options) {
  _input_contract_linel_uniax_prop_(options);
  this._prop = options.property;
  this._reduction = options.reducion || 'strain';
}
exports.DeforSSLinElBiax = DeforSSLinElBiax;

DeforSSLinElBiax.prototype = Object.create(Material.prototype);
DeforSSLinElBiax.prototype.constructor = DeforSSLinElBiax;

// return: mat:(3, 3) or mat:(4, 4)
DeforSSLinElBiax.prototype.tangentModuli = function() {
  var D = this._prop.D();
  if (this._reduction === 'strain') {
    return ix(D, [1, 2, 4], [1, 2, 4]);
  } else {
    throw new Error('DeforSSLinElBiax::tangentModuli() is ');
  }
};
