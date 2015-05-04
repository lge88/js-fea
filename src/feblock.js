/*global require*/
// dependencies
var _ = require('./core.utils');
var assert = _.assert;
var check = _.check;
var isObject = check.object;
var isFunction = check.function;
var isAssigned = check.assigned;
var isa = check.instance;
var isMatrixOfDimension = check.isMatrixOfDimension;
var array2d = _.array2d;
var array1d = _.array1d;
var defineContract = _.defineContract;

var numeric = require('./core.numeric');
var size = numeric.size;
var transpose = numeric.transpose;
var dot = numeric.dot;
var add = numeric.add;
var mul = numeric.mul;
var inv = numeric.inv;
var norm = numeric.norm;
var colon = numeric.colon;
var ixUpdate_ = numeric.ixUpdate_;
var ix = numeric.ix;
var zeros = numeric.zeros;
var reshape = numeric.reshape;
var nthColumn = numeric.nthColumn;

var Material = require('./material').Material;
var GCellSet = require('./gcellset').GCellSet;
var IntegrationRule = require('./integrationrule').IntegrationRule;
var ElementMatrix = require('./system.matrix').ElementMatrix;
var ElementVector = require('./system.vector').ElementVector;

/**
 * @module feblock
 */

/**
 * Finite element block class.
 * @class
 * @abstract
 */
exports.Feblock = function Feblock() {};
var Feblock = exports.Feblock;

/**
 * Returns the gcellset. Useful for visualization.
 * @returns {module:gcellset.GCellSet}
 */
exports.Feblock.prototype.gcells = function() {
  return this._gcells;
};

/**
 * Returns the topology. Useful for visualization.
 * @returns {module:topology.Topology}
 */
exports.Feblock.prototype.topology = function() {
  return this._gcells.topology();
};

/**
 * @typedef module:feblock.DeforSSInitOption
 * @property {module:material.Material} material
 * @property {module:gcellset.GCellSet} gcells
 * @property {module:integrationrule.IntegrationRule} integrationRule
 */

/**
 * @class
 * @extends module:feblock.Feblock
 * @param {module:feblock.DeforSSInitOption} options
 */
exports.DeforSS = function DeforSS(options) {
  this._mater = null;
  this._gcells = null;
  this._ir = null;
  this._rm = null;

  if (!isObject(options))
    throw new Error('DeforSS#constructor(options): option is not a valid ' +
                    'DeforSSInitOption.');

  if (!isa(options.material, Material))
    throw new Error('DeforSS#constructor(options):' +
                    ' options.material is not a instance of Material');

  if (!isa(options.gcells, GCellSet))
    throw new Error('DeforSS#constructor(options):' +
                    'options.gcells is not a instance of GCellSet');

  if (!isa(options.integrationRule, IntegrationRule))
    throw new Error('DeforSS#constructor(options):' +
                    'options.integrationRule is not a instance of integrationRule');

  this._mater = options.material;
  this._gcells = options.gcells;
  this._ir = options.integrationRule;
  if (isAssigned(options.rm)) this._rm = options.rm;

  var dim = this._gcells.dim();
  switch (dim) {
  case 1:
    this.hBlmat = this._blmat1;
    break;
  case 2:
    if (this._gcells.axisSymm())
      throw new Error('DeforSS::hBlmat() for axixSymm, dim = ' +
                      dim + ' is not implemented.');
    else
      this.hBlmat = this._blmat2;
    break;
  case 3:
    this.hBlmat = this._blmat3;
    break;
  default:
    throw new Error('DeforSS::hBlmat() for dim ' + dim + ' is not implemented.');
  }
};
var DeforSS = exports.DeforSS;
DeforSS.prototype = Object.create(Feblock.prototype);
DeforSS.prototype.constructor = DeforSS;

/**
 * Compute the strain-displacement matrix (B) for a one-manifold element.
 * @param {module:types.Matrix} N - matrix of basis function values.
 * @param {module:types.Matrix} Ndersp - matrix of basis function
 * gradients.
 * @param {module:types.Matrix} c - spatial coordinates.
 * @param {module:types.Matrix|undefined} Rm - orthogonal matrix
 * represent the global-to-local transformation.
 * @returns {module:types.Matrix} B matrix.
 */
exports.DeforSS.prototype._blmat1 = function(N, Ndersp, c, Rm) {
  var nfn = size(Ndersp, 1);
  var dim = size(c, 2);
  var B = array2d(1, nfn*dim, 0);
  var i, indices;

  var s, dimi_1, from, to, span;

  if (Rm) {
    s = Rm.map(function(row) {
      return row[0];
    });

    for (i = 1; i <= nfn; ++i) {
      from = dim*(i-1);
      to = dim*i-1;
      span = to - from;
      indices = array1d(span+1, function(x) {
        return from + x;
      });
      indices.forEach(function(idx, j) {
        B[0][idx] = Ndersp[i-1][0]*s[j];
      });
    }
  } else {
    throw new Error('_blmat1: not implmented when !Rm');
  }
  return B;
};

/**
 * Compute the strain-displacement matrix (B) for a two-manifold element.
 * @param {module:types.Matrix} N - matrix of basis function values.
 * @param {module:types.Matrix} Ndersp - matrix of basis function
 * gradients.
 * @param {module:types.Matrix} c - spatial coordinates.
 * @param {module:types.Matrix|undefined} Rm - orthogonal matrix
 * represent the global-to-local transformation.
 * @returns {module:types.Matrix} B matrix.
 */
exports.DeforSS.prototype._blmat2 = function(N, Ndersp, c, Rm) {
  var nfn = size(Ndersp, 1);
  var dim = size(c, 2);
  var B = array2d(3, nfn*dim, 0);
  var i, cols, vals, RmT;

  if (Rm) {
    // console.log("nfn = ", nfn);
    for (i = 1; i <= nfn; ++i) {
      cols = colon(dim*(i-1)+1, dim*i);
      vals = [
        [ Ndersp[i-1][0], 0 ],
        [ 0, Ndersp[i-1][1] ],
        [ Ndersp[i-1][1], Ndersp[i-1][0] ]
      ];
      // RmT = transpose(ix(Rm, ':', [1,2]));
      RmT = transpose(ix(Rm, ':', [0, 1]));
      vals = dot(vals, RmT);

      // console.log("B = ", B);
      // console.log("cols = ", cols);
      // console.log("i = ", i);
      // console.log("vals = ", vals);
      B = ixUpdate_(B, ':', cols, vals);
      // console.log("updated B = ", B);
    }
  } else
    throw new Error('_blmat1: not implmented when !Rm');
  return B;
};

/**
 * Compute the strain-displacement matrix (B) for a 3-manifold element.
 * @param {module:types.Matrix} N - matrix of basis function values.
 * @param {module:types.Matrix} Ndersp - matrix of basis function
 * gradients.
 * @param {module:types.Matrix} c - spatial coordinates.
 * @param {module:types.Matrix|undefined} Rm - orthogonal matrix
 * represent the global-to-local transformation.
 * @returns {module:types.Matrix} B matrix.
 */
exports.DeforSS.prototype._blmat3 = function(N, Ndersp, c, Rm) {
  var nfn = size(Ndersp, 1);
  var B = array2d(6, nfn*3);

  var i, k, RmT, indices, part;
  if (!isAssigned(Rm)) {
    for (i = 0; i < nfn; ++i) {
      k = 3*i;
      B[0][k] = Ndersp[i][0];
      B[1][k+1] = Ndersp[i][1];
      B[2][k+2] = Ndersp[i][2] ;
      B[3][k] = Ndersp[i][1]; B[3][k+1]= Ndersp[i][0];
      B[4][k] = Ndersp[i][2]; B[4][k+2]= Ndersp[i][0];
      B[5][k+1] = Ndersp[i][2]; B[5][k+2]= Ndersp[i][1];
    }
  } else {
    RmT = transpose(Rm);
    for (i = 1; i <= nfn; ++i) {
      indices = colon(3*(i-1)+1, 3*i);
      part = [
        [ Ndersp[i-1][0], 0, 0 ],
        [ 0, Ndersp[i-1][1], 0 ],
        [ 0, 0, Ndersp[i-1][2] ],
        [ Ndersp[i-1][1], Ndersp[i-1][0], 0 ],
        [ Ndersp[i-1][2], 0, Ndersp[i-1][0] ],
        [ 0, Ndersp[i-1][2], Ndersp[i-1][1] ]
      ];
      part = dot(part, RmT);
      ixUpdate_(B, ':', indices, part);
    }
  }

  return B;
};

/**
 * Return a list of element matrices that can be assembled to global
 * stiffness matrix.
 * @param {module:field.Field} geom - geometric field.
 * @param {module:field.Field} u - displacement field.
 * @returns {Array} array of {@link module:system.matrix.ElementMatrix }
 */
DeforSS.prototype.stiffness = function(geom, u) {
  var gcells = this._gcells;
  var cellSize = gcells.cellSize();
  var ir = this._ir;

  var pc = ir.paramCoords();
  var w = ir.weights();
  var npts = ir.npts();

  var Ns = [], Nders = [];
  var j;
  for (j = 0; j < npts; ++j) {
    Ns[j] = gcells.bfun(pc[j]);
    Nders[j] = gcells.bfundpar(pc[j]);
  }

  var rmh = null;
  if (isFunction(this._rm)) rmh = this._rm;
  var rm = this._rm;
  var mat = this._mater;

  var conns = gcells.conn();
  // labels??
  var numCells = gcells.count();
  var Ke = new Array(numCells);
  var eqnums = new Array(numCells);

  var dim = geom.dim();
  // console.log("dim = ", dim);
  var i;
  for (i = 0; i < numCells; ++i) {
    eqnums[i] = u.gatherEqnumsVector(conns[i]);
    Ke[i] = zeros(dim*cellSize, dim*cellSize);
  }

  var allIds = array1d(geom.nfens(), function(i) { return i; });
  var xs = geom.gatherValuesMatrix(allIds);

  var conn, x, c, J, Ndersp, Jac, B, D, delta;
  for (i = 0; i < numCells; ++i) {
    conn = conns[i];
    x = conn.map(function(i) { return xs[i]; });

    for (j = 0; j < npts; ++j) {
      c = dot(transpose(Ns[j]), x);
      J = dot(transpose(x), Nders[j]);
      // console.log("c = ", c);
      // console.log("J = ", J);
      if (rmh) rm = rmh(c, J);

      if (rm) {
        // TODO: figure out rm
        // console.log("dot(transpose(rm), J)) = ", dot(transpose(rm), J));
        // console.log("inv(dot(transpose(rm), J)) = ", inv(dot(transpose(rm), J)));
        Ndersp = dot(Nders[j], inv(dot(transpose(rm), J)));
      } else {
        Ndersp = dot(Nders[j], inv(J));
      }
      // console.log("Ndersp = ", Ndersp);

      Jac = gcells.jacobianVolumn(conn, Ns[j], J, x);
      // console.log("Jac = ", Jac);
      if (Jac < 0) throw new Error('Non-positive Jacobian');

      // TODO: _hBlmat
      B = this.hBlmat(Ns[j], Ndersp, c, rm);
      // console.log("B = ", B);
      // size(B)
      // console.log("size(B) = ", size(B));
      D = mat.tangentModuli({ xyz: c });
      // console.log("D = ", D);

      // var jw = Jac*w[j];
      // var mid = mul(D, Jac*w[j]);
      // console.log("mid = ", mid);
      // console.log("B = ", B);
      // console.log("B' = ", transpose(B));
      // console.log("dot(transpose(B), mid) = ", dot(transpose(B), mid));

      // console.log("Jac = ", Jac);
      // console.log("mul(D, Jac*w[j]) = ", mul(D, Jac*w[j]));
      // console.log("dot(transpose(B), mul(D, Jac*w[j])) = ", dot(transpose(B), mul(D, Jac*w[j])));
      delta = dot(dot(transpose(B), mul(D, Jac*w[j])), B);

      // console.log("delta = ", delta);
      // console.log("delta = ", delta);

      // delta = dot(dot(transpose(B), mul(D, Jac*w[j])), B);
      // console.log("Ke[j] = ", Ke[j]);
      Ke[i] = add(Ke[i], delta);
      // console.log("Ke[j] = ", Ke[j]);
    }
  }

  var elementMatrices = Ke.map(function(mat, i) {
    return new ElementMatrix(mat, eqnums[i]);
  });

  return elementMatrices;
};


DeforSS.prototype.noneZeroEBCLoads = function(geom, u) {
  var gcells = this._gcells;
  var ncells = gcells.count();
  var conns = gcells.conn();

  var evs = [];
  var i, conn, pu, feb, ems, Ke, f, eqnums;
  for (i = 0; i < ncells; ++i) {
    conn = conns[i];
    pu = u.gatherPrescirbedValues(conn);
    if (norm(pu) !== 0) {
      // console.log("this._gcells.subset(i) = ", this._gcells.subset([i]));
      feb = new DeforSS({
        material: this._mater,
        gcells: this._gcells.subset([i]),
        integrationRule: this._ir,
        rm: this._rm
      });
      // this._gcells = this._gcells.subset([i]);
      // console.log("nzbc stiff = ");
      ems = feb.stiffness(geom, u);
      Ke = ems[0].matrix;

      f = mul(-1, dot(Ke, pu));
      // console.log("f = ", f);
      eqnums = u.gatherEqnumsVector(conn);
      evs.push(new ElementVector(f, eqnums));
    }
  }
  return evs;
};

/**
 * Compute the element load vectors
 * @param {module:field.Field} geom - geometric filed
 * @param {module:field.Field} u - displacement filed
 * @param {module:forceintensity.ForceIntensity} fi - force intensity
 * @param {Int} m - manifold dimension
 * @returns {ElementVector[]}
 */
DeforSS.prototype.distributeLoads = function(geom, u, fi, m) {
  var evs = [];
  var gcells = this._gcells;
  var cellSize = gcells.cellSize();
  var ir = this._ir;
  var dim = u.dim();

  var pc = ir.paramCoords();
  var w = ir.weights();
  var npts = ir.npts();

  var conns = gcells.conn();
  var Fe = new Array(ncells), eqnums = new Array(ncells);
  var ncells = gcells.count();

  var i;
  for (i = 0; i < ncells; ++i) {
    eqnums[i] = u.gatherEqnumsVector(conns[i]);
    Fe[i] = zeros(geom.dim()*cellSize, 1);
  }

  var xs = geom.values(), j, N, Nder, conn, x;
  var J, Jac, f, delta;
  for (j = 0; j < npts; ++j) {
    N = gcells.bfun(pc[j]);
    Nder = gcells.bfundpar(pc[j]);
    // console.log("Nder = ", Nder);
    for (i = 0; i < ncells; ++i) {
      conn = conns[i];
      // console.log("conn = ", conn);
      x = conn.map(function(i) { return xs[i]; });

      // console.log("Nder = ", Nder);
      // console.log("x = ", x);

      J = gcells.jacobianMatrix(Nder, x);
      // console.log("conn = ", conn);
      // console.log("N = ", N);
      // console.log("J = ", J);
      // console.log("m = ", m);
      Jac = gcells.jacobianInDim(conn, N, J, x, m);
      // console.log("Jac = ", Jac);
      f = fi.magn(dot(transpose(N), x), J);
      // console.log("f = ", f);

      // delta = transpose(N);
      // console.log("delta = ", delta);
      // delta = dot(f, delta);
      // console.log("delta = ", delta);
      // delta = reshape(delta, dim*cellSize, 1);
      // console.log("delta = ", delta);
      // console.log("Jac*w[j] = ", Jac*w[j]);
      // delta = mul(delta, Jac*w[j]);
      // console.log("delta = ", delta);

      delta = mul(reshape(dot(f, transpose(N)), dim*cellSize, 1), Jac*w[j]);

      Fe[i] = add(Fe[i], delta);
    }
  }

  var elementVectors = Fe.map(function(mat, i) {
    var vec = transpose(mat)[0];
    return new ElementVector(vec, eqnums[i]);
  });

  return elementVectors;
};

exports.DeforSS = DeforSS;
