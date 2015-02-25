/*global require*/
// geometry.gcellset

var _ = require('./core.utils');
var uuid = _.uuid;
var defineContract = _.defineContract;
var assert = _.assert;
var check = _.check;
var matrixnx2 = _.contracts.matrixOfDimension('*', 2);

var numeric = require('./core.numeric');
var ensureMatrixDimension = numeric.ensureMatrixDimension;

var hypercube = require('./geometry.topology').hypercube;

// Supposed to be private
// TODO: support lookup by label.
function GCellSet(topology) {
  var cellSizeFromTopology = topology.getCellSizeInDim(topology.getDim());
  var cellSizeShouldBe = this.cellSize();
  if (cellSizeFromTopology !== cellSizeShouldBe)
    throw new Error('GCellSet(): cellSize of the topology dismatch.');

  var dimFromTopology = topology.getDim();
  var dimShouldBe = this.dim();
  if (dimFromTopology !== dimShouldBe)
    throw new Error('GCellSet(): dim of the topology dismatch.');

  this._id = uuid();
  this._topology = topology;
}

GCellSet.prototype.type = function() {
  throw new Error('GCellSet::type(): is not implemented.');
};

GCellSet.prototype.boundaryGCellSetConstructor = function() {
  throw new Error('GCellSet::getBoundaryGCellSetConstructor(): is not implemented.');
};

GCellSet.prototype.boundaryCellType = function() {
  var C = this.boundaryGCellSetConstructor();
  return C.prototype.type.call(null);
};

GCellSet.prototype.boundary = function() {
  var C = this.boundaryGCellSetConstructor();
  var boundaryTopology = this._topology.boundary();
  return new C(boundaryTopology);
};

GCellSet.prototype.dim = function() {
  throw new Error('GCellSet::dim(): is not implemented.');
};

GCellSet.prototype.cellSize = function() {
  throw new Error('GCellSet::cellSize(): is not implemented.');
};
GCellSet.prototype.nfens = GCellSet.prototype.cellSize;

GCellSet.prototype.id = function() {
  return this._id;
};

GCellSet.prototype.conn = function() {
  return this._topology.getMaxCells();
};

// jacobianMatrix :: GCellSet -> NodalDerivativesInParametricDomain -> NodalCoordinatesInSpatialDomain
//                   -> JacobianMatrix
// NodalDerivativesInParametricDomain :: 2D JS array of dimension this.cellSize() by this.dim()
// NodalCoordinatesInSpatialDomain :: 2D JS array of dimension this.cellSize() by this.dim()
// JacobianMatrix :: 2D JS array of dimension this.dim() by this.dim()
GCellSet.prototype.jacobianMatrix = function(nder, x) {
  var m = this.cellSize(), n = this.dim();
  nder = ensureMatrixDimension(nder, m, n);
  x = ensureMatrixDimension(x, m, n);
  return numeric.mul(numeric.transpose(x), nder);
};

// bfun :: GCellSet -> ParametricCoordinates
//         -> NodalContributionVector
// ParametricCoordinates :: 1D JS array of length this.dim()
// NodalContributionVector :: 1D JS array of length this.cellSize()
// bfun: basis function in parametric domain.
// Required to be overrided by subclasss.
GCellSet.prototype.bfun = function(paramCoords) {
  throw new Error('GCellSet::bfun(): is not implemented.');
};

// bfundpar :: GCellSet -> ParametricCoordinates
//             -> NodalDerivativesInParametricDomain
// ParametricCoordinates :: 1D JS array of length this.dim()
// NodalDerivativesInParametricDomain :: 2D JS array of dimension this.cellSize() by this.dim()
// bfundpar: derivatives of the basis function in parametric domain.
// Required to be overrided by subclasss.
GCellSet.prototype.bfundpar = function(paramCoords) {
  throw new Error('GCellSet::bfundpar(): is not implemented.');
};

// bfundsp :: GCellSet -> NodalDerivativesInParametricDomain -> NodalCoordinatesInSpatialDomain
//            -> NodalDerivativesInSpatialDomain
// NodalDerivativesInParametricDomain :: 2D JS array of dimension this.cellSize() by this.dim()
// NodalCoordinatesInSpatialDomain :: 2D JS array of dimension this.cellSize() by this.dim()
// NodalDerivativesInSpatialDomain :: 2D JS array of dimension this.cellSize() by this.dim()
// bfundsp: derivatives of the basis functions in spatical domain.
GCellSet.prototype.bfundsp = function(nder, x) {
  var m = this.cellSize(), n = this.dim();
  nder = ensureMatrixDimension(nder, m, n);
  x = ensureMatrixDimension(x, m, n);
  var J = numeric.mul(numeric.transpose(x), nder);
  J = ensureMatrixDimension(J, 1, 1);
  J = J[0][0];
  return numeric.div(nder, J);
};

GCellSet.prototype.cat = function() {
  throw new Error('GCellSet::cat(): is not implemented.');
};

// count: return number of cells.
GCellSet.prototype.count = function() {
  return this._topology.getNumOfCellsInDim(this._topology.getDim());
};
GCellSet.prototype.size = GCellSet.prototype.count;

// isInParametric :: GCellSet -> ParametricCoordinates
//                   -> bool
// ParametricCoordinates :: 1D JS array of length this.dim()
// isInParametric: Check if given parametric coordinates are
//   inside the element parametric domain.
GCellSet.prototype.isInParametric = function(paramCoords) {
  throw new Error('GCellSet::isInParametric(): is not implemented.');
};

// map2parametric :: GCellSet -> NodalCoordinatesInSpatialDomain -> SpatialCoordinates
//                   -> ParametricCoordinates
// SpatialCoordinates :: 1D JS array of length this.dim()
// ParametricCoordinates :: 1D JS array of length this.dim()
// map2parametric: Returns the parametric coordinates for given spatial coordinates
GCellSet.prototype.map2parametric = function(x, c) {
  throw new Error('GCellSet::map2parametric(): is not implemented.');
};

// subset :: GCellSet -> Indices
//           -> GCellSet
// Indices :: [ Int ]
// subset: Return a new GCellSet which is a subset of self by given indices.
GCellSet.prototype.subset = function(indices) {
  throw new Error('GCellSet::subset(): is not implemented.');
};

GCellSet.prototype.clone = function() {
  throw new Error('GCellSet::clone(): is not implemented.');
};

GCellSet.prototype.updateConnectivity = function() {
  throw new Error('GCellSet::updateConnectivity(): is not implemented.');
};

function Manifold1GCellSet(topology, otherDimension, axisSymm) {
  this._otherDimension = (typeof otherDimension === 'number' || typeof otherDimension === 'function') ?
    otherDimension : 1.0;
  this._axisSymm = typeof axisSymm !== 'undefined' ? (!!axisSymm) : false;
  GCellSet.call(this, topology);
}

Manifold1GCellSet.prototype = Object.create(GCellSet.prototype);
Manifold1GCellSet.prototype.constructor = Manifold1GCellSet;

Manifold1GCellSet.prototype.dim = function() { return 1; };

Manifold1GCellSet.prototype.otherDimension = function(conn, N, x) {
  if (typeof this._otherDimension === 'function')
    return this._otherDimension(conn, N, x);
  return this._otherDimension;
};

Manifold1GCellSet.prototype.axisSymm = function() { return this._axisSymm; };

// jacobian :: GCellSet -> ConnectivityList -> NodalContributionVector -> JacobianMatrix
//             -> NodalCoordinatesInSpatialDomain
//             -> ManifoldJacobian
// ConnectivityList :: 1D JS array of dimension this.cellSize()
// NodalContributionVector :: 1D JS array of length this.cellSize()
// JacobianMatrix :: 2D JS array of dimension this.dim() by this.dim()
// NodalCoordinatesInSpatialDomain :: 2D JS array of dimension this.cellSize() by this.dim()
// ManifoldJacobian :: number
Manifold1GCellSet.prototype.jacobian = function(conn, N, J, x) {
  return this.jacobianCurve(conn, N, J, x);
};

// jacobian :: GCellSet -> ConnectivityList -> NodalContributionVector -> JacobianMatrix
//             -> NodalCoordinatesInSpatialDomain
//             -> ManifoldJacobian
// ConnectivityList :: 1D JS array of dimension this.cellSize()
// NodalContributionVector :: 1D JS array of length this.cellSize()
// JacobianMatrix :: 2D JS array of dimension this.dim() by this.dim()
// NodalCoordinatesInSpatialDomain :: 2D JS array of dimension this.cellSize() by this.dim()
// ManifoldJacobian :: number
Manifold1GCellSet.prototype.jacobianCurve = function(conn, N, J, x) {
  J = ensureMatrixDimension(J, null, 1);
  // TODO: not so effecient?
  var vec = numeric.transpose(J)[0];
  return numeric.norm2(vec);
};

// jacobian :: GCellSet -> ConnectivityList -> NodalContributionVector -> JacobianMatrix
//             -> NodalCoordinatesInSpatialDomain
//             -> ManifoldJacobian
// ConnectivityList :: 1D JS array of dimension this.cellSize()
// NodalContributionVector :: 1D JS array of length this.cellSize()
// JacobianMatrix :: 2D JS array of dimension this.dim() by this.dim()
// NodalCoordinatesInSpatialDomain :: 2D JS array of dimension this.cellSize() by this.dim()
// ManifoldJacobian :: number
// For the one-dimensional cell, the surface Jacobian is
//     (i) the product of the curve Jacobian and the other dimension
//     (units of length);
//     or, when used as axially symmetric
//     (ii) the product of the curve Jacobian and the circumference of
//     the circle through the point pc.
Manifold1GCellSet.prototype.jacobianSurface = function(conn, N, J, x) {
  if (this.axisSymm()) {
    var m = this.cellSize(), n = this.dim();
    N = ensureMatrixDimension(N, m, 1);
    x = ensureMatrixDimension(N, m, n);
    var xyz = numeric.mul(numeric.transpose(N), x)[0];
    return this.jacobianCurve(conn, N, J, x) * 2 * Math.PI * xyz[0];
  } else {
    return this.jacobianCurve(conn, N, J, x) * this.otherDimension(conn, N, x);
  }
};

// jacobian :: GCellSet -> ConnectivityList -> NodalContributionVector -> JacobianMatrix
//             -> NodalCoordinatesInSpatialDomain
//             -> ManifoldJacobian
// ConnectivityList :: 1D JS array of dimension this.cellSize()
// NodalContributionVector :: 1D JS array of length this.cellSize()
// JacobianMatrix :: 2D JS array of dimension this.dim() by this.dim()
// NodalCoordinatesInSpatialDomain :: 2D JS array of dimension this.cellSize() by this.dim()
// ManifoldJacobian :: number
// For the one-dimensional cell, the volume Jacobian is
//     (i) the product of the curve Jacobian and the other dimension
//     (units of length squared);
//     or, when used as axially symmetric
//     (ii) the product of the curve Jacobian and the circumference of
//     the circle through the point pc and the other dimension (units of
//     length)
Manifold1GCellSet.prototype.jacobianVolumn = function(conn, N, J, x) {
  if (this.axisSymm()) {
    var m = this.cellSize(), n = this.dim();
    N = ensureMatrixDimension(N, m, 1);
    x = ensureMatrixDimension(N, m, n);
    var xyz = numeric.mul(numeric.transpose(N), x)[0];
    return this.jacobianCurve(conn, N, J, x) * 2 * Math.PI * xyz[0] * this.otherDimension(conn, N, x);
  } else {
    return this.jacobianCurve(conn, N, J, x) * this.otherDimension(conn, N, x);
  }
};

// jacobian :: GCellSet -> ConnectivityList -> NodalContributionVector -> JacobianMatrix
//             -> NodalCoordinatesInSpatialDomain -> Dimension
//             -> ManifoldJacobian
// ConnectivityList :: 1D JS array of dimension this.cellSize()
// NodalContributionVector :: 1D JS array of length this.cellSize()
// JacobianMatrix :: 2D JS array of dimension this.dim() by this.dim()
// NodalCoordinatesInSpatialDomain :: 2D JS array of dimension this.cellSize() by this.dim()
// Dimension :: int
// ManifoldJacobian :: number
// jacobianInDim: A convinient wrapper for jacobianCurve, jacobianSurface, jacobianVolumn
Manifold1GCellSet.prototype.jacobianInDim = function(conn, N, J, x, dim) {
  switch (dim) {
  case 3:
    return this.jacobianVolumn(conn, N, J, x);
  case 2:
    return this.jacobianSurface(conn, N, J, x);
  case 1:
    return this.jacobianCurve(conn, N, J, x);
  default:
    throw new Error('Manifold1GCellSet::jacobianInDim(): wrong dimension ' + dim);
  }
};

var _input_contract_L2_ = defineContract(function(options) {
  assert.object(options);
  matrixnx2(options.conn);
  if (check.assigned(options.otherDimension)) {
    assert.number(options.otherDimension);
  }

  if (check.assigned(options.axisSymm)) {
    assert.boolean(options.axisSymm);
  }
});

function L2(options) {
  _input_contract_L2_(options);

  var conn = options.conn;
  var otherDimension = check.assigned(options.otherDimension) ?
        options.otherDimension : 1.0;
  var axisSymm = check.assigned(options.axisSymm) ?
        options.axisSymm : false;

  var topology = hypercube(conn, 1);
  Manifold1GCellSet.call(this, topology, otherDimension, axisSymm);
}

L2.prototype = Object.create(Manifold1GCellSet.prototype);
L2.prototype.constructor = L2;

L2.prototype.cellSize = function() { return 2; };

L2.prototype.type = function() { return 'L2'; };

L2.prototype.bfun = function(paramCoords) {
  var x = paramCoords[0];
  return [
    [ 0.5 * (1 - x) ],
    [ 0.5 * (1 + x) ]
  ];
};

L2.prototype.bfundpar = function(paramCoords) {
  return [
    [ -0.5 ],
    [ +0.5 ]
  ];
};

exports.L2 = L2;
