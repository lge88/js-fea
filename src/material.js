/*global require*/
// dependencies
var _ = require('./core.utils');
var check = _.check;
var isObject = check.object;
var isa = check.instance;
var assert = _.assert;

var numeric = require('./core.numeric');
var ix = numeric.ix;
var ixUpdate_ = numeric.ixUpdate_;
var mul = numeric.mul;
var div = numeric.div;
var dot = numeric.dot;
var add = numeric.add;

var property = require('./property');
var LinElIso = property.LinElIso;

/**
 * @module material
 */

/**
 * @class
 * @abstract
 */
exports.Material = function Material() {};
var Material = exports.Material;

/**
 * Create a new material state. Override by subclasses.
 * @abstract
 */
exports.Material.prototype.newState = function() {
  throw new Error('Material::newState(): is not implemented.');
};

/**
 * Update material state. Override by subclasses.
 * @abstract
 */
exports.Material.prototype.update = function() {
  throw new Error('Material::update(): is not implemented.');
};

/**
 * @typedef module:material.DeforSSLinElUniaxInitOption
 * @property {module:property.LinElIso} property
 */

/**
 * @class
 * @extends module:material.Material
 * @param {module:material.DeforSSLinElUniaxInitOption} options
 */
exports.DeforSSLinElUniax = function DeforSSLinElUniax(options) {
  if (!isObject(options) || !isa(options.property, LinElIso))
    throw new Error('DeforSSLinElUniax#constructor(options): options' +
                    ' is not valid DeforSSLinElUniaxInitOption');
  this._prop = options.property;
};
var DeforSSLinElUniax = exports.DeforSSLinElUniax;

DeforSSLinElUniax.prototype = Object.create(Material.prototype);
DeforSSLinElUniax.prototype.constructor = DeforSSLinElUniax;

/**
 * Returns the tangent moduli
 * @returns {module:types.Matrix}
 */
exports.DeforSSLinElUniax.prototype.tangentModuli = function() {
  return [ [this._prop.E()] ];
};

/**
 * @typedef module:material.DeforSSLinElBiaxInitOption
 * @property {module:property.LinElIso} property
 * @property {String} reduction - 'strain', 'stress' or
 * 'axisSymm'. Default is 'strain'
 */

/**
 * @class
 * @extends module:material.Material
 * @param {module:material.DeforSSLinElBiaxInitOption} options
 */
exports.DeforSSLinElBiax = function DeforSSLinElBiax(options) {
  if (!isObject(options) || !isa(options.property, LinElIso))
    throw new Error('DeforSSLinElBiax#constructor(options): options' +
                    ' is not valid DeforSSLinElBiaxInitOption');
  this._prop = options.property;
  this._reduction = options.reduction || 'strain';
};
var DeforSSLinElBiax = exports.DeforSSLinElBiax;

DeforSSLinElBiax.prototype = Object.create(Material.prototype);
DeforSSLinElBiax.prototype.constructor = DeforSSLinElBiax;

/**
 * Returns the tangent moduli
 * @returns {module:types.Matrix}
 */
exports.DeforSSLinElBiax.prototype.tangentModuli = function() {
  var D = this._prop.D();
  var reduced, Dt;
  if (this._reduction === 'strain') {
    reduced = ix(D, [1, 2, 4], [1, 2, 4]);
  } else if (this._reduction === 'axisSymm') {
    reduced = ix(D, [1, 2, 3, 4], [1, 2, 3, 4]);
  } else if (this._reduction === 'stress') {
    Dt = ix(D, [1,2], [1,2]);
    Dt = add(Dt, mul(-1, div(dot(ix(D, [1,2], [3]), ix(D, [3], [1,2])), D[2][2])));
    reduced = ix(D, [1,2,4], [1,2,4]);
    reduced = ixUpdate_(reduced, [1,2], [1,2], Dt);
  } else {
    throw new Error('DeforSSLinElBiax::tangentModuli() is ');
  }

  return reduced;
};
