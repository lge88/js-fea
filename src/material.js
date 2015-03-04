/*global require*/
// material

var _ = require('./core.utils');
var check = _.check;
var assert = _.assert;
var defineContract = _.defineContract;
var property = require('./property');
var LinElIso = property.LinElIso;

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

DeforSSLinElUniax.prototype.tangentModuli = function() {
  return this._prop.E();
};

exports.DeforSSLinElUniax = DeforSSLinElUniax;
