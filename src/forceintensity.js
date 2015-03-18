/*global require*/
var _ = require('./core.utils');
var check = _.check;
var isObject = check.object;
var isArray = check.array;
var isAssigned = check.assigned;
var isFunction = check.function;

var numeric = require('./core.numeric');
var transpose = numeric.transpose;

/**
 * @module forceintensity
 */

/**
 * @typedef module:forceintensity.ForceIntensityInitOption
 * @property {module:types.Vector|Function} magn - 1) a vector of
 * values; 2) function: (xyz) => val 3) function: (xyz, J) => val
 */

/**
 * @class
 * @param {module:forceintensity.ForceIntensityInitOption} options
 * @returns {}
 */
exports.ForceIntensity = function ForceIntensity(options) {
  if (!isObject(options) || !isAssigned(options.magn))
    throw new Error('ForceIntensity#constructor(options): ' +
                    'option is not a valid ForceIntensityInitOption.');

  if (isArray(options.magn)) {
    this._magn = function() {
      return transpose([options.magn]);
    };
  } else if (isFunction(options.magn)) {
    this._magn = options.magn;
  } else {
    throw new Error('ForceIntensity#constructor(options): ' +
                    'options.magn is not array or function.');
  }

};
var ForceIntensity = exports.ForceIntensity;

/**
 * Get force intensity magnitude at the specified point.
 * @param {module:type.Matrix} xyz - location.
 * @param {module:type.Matrix} J - Jacobian matrix.
 * @returns {module:type.Matrix} dim by 1 matrix.
 */
exports.ForceIntensity.prototype.magn = function(xyz, J) {
  return this._magn(xyz, J);
};
