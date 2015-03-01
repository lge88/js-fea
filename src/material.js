/*global require*/
// material

var _ = require('./core.utils');
var check = _.check;
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

var _input_contract_linel_uniax_prop_ = defineContract(function(p) {
  if (!check.instance(p, LinElIso)) {
    throw new Error('input is not a instance of LinElIso.');
  }
});

function DeforSSLinElUniax(prop) {
  _input_contract_linel_uniax_prop_(prop);
  this._prop = prop;
}

DeforSSLinElUniax.prototype = Object.create(Material.prototype);
DeforSSLinElUniax.prototype.constructor = DeforSSLinElUniax;

DeforSSLinElUniax.prototype.tangentModuli = function() {
  return this._prop.E();
};

exports.DeforSSLinElUniax = DeforSSLinElUniax;
