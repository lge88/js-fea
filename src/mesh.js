/*global require*/
// dependencies
var _ = require('./core.utils');
var check = _.check;
var isObject = check.object;
var array2d = _.array2d;
var fens = require('./fens');
var FeNodeSet = fens.FeNodeSet;
var gcells = require('./gcellset');
var Q4 = gcells.Q4;
var H8 = gcells.H8;

/**
 * @module mesh
 */

/**
 * @typedef module:mesh.MeshInitOption
 * @property {FeNodeSet} fens - optional. finite element node set.
 * @property {Array} xyz - optional. 2D array of node coordinates.
 * @property {GCellSet} gcells - optional. geometry cell set.
 * @property {String} gcellsType - optional. finite element node set.
 * @property {Array} conn - optional. connectiviy list.
 */

/**
 * Mesh class.
 * @class
 * @param {module:mesh.MeshInitOption} options
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
exports.Mesh = function Mesh(options) {
  if (!isObject(options)) options = {};
  this._fens = options.fens;
  this._gcells = options.gcells;
};
var Mesh = exports.Mesh;

/**
 * Returns finite element node set of the mesh.
 * @returns {module:fens.FeNodeSet}
 */
exports.Mesh.prototype.fens = function() { return this._fens; };

/**
 * Returns geometry cell set of the mesh.
 * @returns {module:gcellset.GCellSet}
 */
exports.Mesh.prototype.gcells = function() { return this._gcells; };

/**
 * @callback module:mesh.MapCallback
 * @param {module:types.Vector} coords
 * @param {Int} i
 * @returns {module:types.Vector}
 */

/**
 *
 * Apply the mapping function the each vertex, return the new mesh.
 * @param {module:mesh.MapCallback} mapping - the mapping function.
 * @returns {module:mesh.Mesh}
 */
exports.Mesh.prototype.map = function(mapping) {
  var fens = this._fens.map(mapping);
  return new Mesh({ fens: fens, gcells: this._gcells.clone() });
};

/**
 * Creates a L-shaped domain using 3 quads.
 * @returns {module:mesh.Mesh}
 */
exports.L2x2 = function L2x2() {
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
};
var L2x2 = exports.L2x2;

/**
 * Creates a H8 block mesh.
 * @param {Number} w - width in x direction.
 * @param {Number} l - length in y direction.
 * @param {Number} h - height in z direction.
 * @param {Int} nx - number of divisions in x direction.
 * @param {Int} ny - number of divisions in y direction.
 * @param {Int} nz - number of divisions in z direction.
 * @returns {module:mesh.Mesh}
 */
exports.H8Block = function(w, l, h, nx, ny, nz) {
  var dx = w/nx, dy = l/ny, dz = h/nz;
  var nn = (nx+1)*(ny+1)*(nz+1);
  var xyz = new Array(nn);
  var conn = new Array(nx*ny*nz);
  var i, j, k;

  // return 1d index from 3 index
  function ijkToIndex(i, j, k, ni, nj, nk) {
    return i*nj*nk + j*nk + k;
    // return k*ni*nj + j*ni + i;
  }

  // nodes
  for (i = 0; i < nx + 1; ++i)
    for (j = 0; j < ny + 1; ++j)
      for (k = 0; k < nz + 1; ++k)
        xyz[ijkToIndex(i, j, k, nx+1, ny+1, nz+1)] = [i*dx, j*dy, k*dz];

  // connectivity:
  for (i = 0; i < nx; ++i)
    for (j = 0; j < ny; ++j)
      for (k = 0; k < nz; ++k)
        conn[ijkToIndex(i, j, k, nx, ny, nz)] = cellConnAt(i, j, k);

  function cellConnAt(i, j, k) {
    return [
      ijkToIndex(i, j, k, nx+1, ny+1, nz+1),
      ijkToIndex(i+1, j, k, nx+1, ny+1, nz+1),
      ijkToIndex(i+1, j+1, k, nx+1, ny+1, nz+1),
      ijkToIndex(i, j+1, k, nx+1, ny+1, nz+1),

      ijkToIndex(i, j, k+1, nx+1, ny+1, nz+1),
      ijkToIndex(i+1, j, k+1, nx+1, ny+1, nz+1),
      ijkToIndex(i+1, j+1, k+1, nx+1, ny+1, nz+1),
      ijkToIndex(i, j+1, k+1, nx+1, ny+1, nz+1)
    ];
  }

  // FIXME: should be a better way to unify zero-based vs one-based
  // indices madness :(
  conn.forEach(function(cell) {
    cell.forEach(function(x, i) { cell[i] = x + 1; });
  });

  var fens = new FeNodeSet({ xyz: xyz });
  var gcells = new H8({ conn: conn });
  var mesh = new Mesh({ fens: fens, gcells: gcells });

  return mesh;
};
