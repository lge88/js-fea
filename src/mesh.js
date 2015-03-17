/*global require*/
// mesh
var _ = require('./core.utils');
var check = _.check;
var isObject = check.object;
var fens = require('./fens');
var FeNodeSet = fens.FeNodeSet;
var gcells = require('./gcellset');
var Q4 = gcells.Q4;

/**
 * @typedef Mesh~InitOption
 * @property {FeNodeSet} fens - optional. finite element node set.
 * @property {Array} xyz - optional. 2D array of node coordinates.
 * @property {GCellSet} gcells - optional. geometry cell set.
 * @property {String} gcellsType - optional. finite element node set.
 * @property {Array} conn - optional. connectiviy list.
 */

/**
 * Mesh class.
 * @class
 * @param {Mesh~InitOption} options
 * @example

   var msh1 = new Mesh({
     fens: new FeNodeSet(...),
     gcells: new L2(...)
   });

   var msh2 = new Mesh({
     xyz: [...],
     gcellsType: 'L2',
     conn: [...]
   });
 *
 */
function Mesh(options) {
  if (!isObject(options)) options = {};
  this._fens = options.fens;
  this._gcells = options.gcells;
}

/**
 * Returns finite element node set of the mesh.
 * @returns {FeNodeSet}
 */
Mesh.prototype.fens = function() { return this._fens; };

/**
 * Returns geometry cell set of the mesh.
 * @returns {GCellSet}
 */
Mesh.prototype.gcells = function() { return this._gcells; };

/**
 * Creates a L-shaped domain using 3 quads.
 * @returns {Mesh}
 */
function L2x2() {
  var fens, gcells;
  fens = new FeNodeSet({
    xyz: [
      [1/2, 0],
      [1, 0],
      [1, 1/2],
      [1/2, 1/2],
      [1, 1],
      [1/2, 1],
      [0, 1],
      [0, 1/2]
    ]
  });

  gcells = new Q4({
    conn: [
      [1, 2, 3, 4],
      [4, 3, 5, 6],
      [4, 6, 7, 8]
    ]
  });

  return new Mesh({ fens: fens, gcells: gcells });
}

exports.L2x2 = L2x2;
