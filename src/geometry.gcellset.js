/*global require*/
// geometry.gcellset

// FUNCTIONS:
//   GCellSet(topology)
//   Manifold1GCellSet(topology, otherDimension, axisSymm)
//   L2(options)
// //
// [GCellSet] constructor:
//   GCellSet(topology)
// //
// [GCellSet] instance methods:
//   GCellSet::type()
//   GCellSet::boundaryGCellSetConstructor()
//   GCellSet::boundaryCellType()
//   GCellSet::boundary()
//   GCellSet::dim()
//   GCellSet::cellSize()
//   GCellSet::id()
//   GCellSet::conn()
//   GCellSet::jacobianMatrix(nder, x)
//   GCellSet::bfun(paramCoords)
//   GCellSet::bfundpar(paramCoords)
//   GCellSet::bfundsp(nder, x)
//   GCellSet::cat()
//   GCellSet::count()
//   GCellSet::isInParametric(paramCoords)
//   GCellSet::map2parametric(x, c)
//   GCellSet::subset(indices)
//   GCellSet::clone()
//   GCellSet::updateConnectivity()
// //
// [Manifold1GCellSet] constructor:
//   Manifold1GCellSet(topology, otherDimension, axisSymm)
// //
// [Manifold1GCellSet] instance methods:
//   Manifold1GCellSet::dim()
//   Manifold1GCellSet::otherDimension(conn, N, x)
//   Manifold1GCellSet::axisSymm()
//   Manifold1GCellSet::jacobian(conn, N, J, x)
//   Manifold1GCellSet::jacobianCurve(conn, N, J, x)
//   Manifold1GCellSet::jacobianSurface(conn, N, J, x)
//   Manifold1GCellSet::jacobianVolumn(conn, N, J, x)
//   Manifold1GCellSet::jacobianInDim(conn, N, J, x, dim)
// //
// [L2] constructor:
//   L2(options)
// //
// [L2] instance methods:
//   L2::cellSize()
//   L2::type()
//   L2::bfun(paramCoords)
//   L2::bfundpar(paramCoords)


var _ = require('./core.utils');
var uuid = _.uuid;
var noop = _.noop;
var defineContract = _.defineContract;
var assert = _.assert;
var check = _.check;
var matrixOfDimension = _.contracts.matrixOfDimension;
var vectorOfDimension = _.contracts.vectorOfDimension;

var numeric = require('./core.numeric');
var hypercube = require('./geometry.topology').hypercube;

var gcellsetMethodContracts = [
  { name: 'type', input: noop, output: function(out) { assert.string(out); } },
  { name: 'boundaryGCellSetConstructor', input: noop, output: function() {} },
  { name: 'boundaryCellType', input: noop, output: function() {} },
  { name: 'boundary', input: noop, output: function() {} },
  { name: 'dim', input: noop, output: function() {} },
  { name: 'cellSize', input: noop, output: function() {} },
  { name: 'id', input: noop, output: function() {} },
  { name: 'conn', input: noop, output: function() {} },
  { name: 'jacobianMatrix', input: noop, output: function() {} },
  { name: 'bfun', input: noop, output: function() {} },
  { name: 'bfundpar', input: noop, output: function() {} },
  { name: 'bfundsp', input: noop, output: function() {} },
  { name: 'cat', input: noop, output: function() {} },
  { name: 'count', input: noop, output: function() {} },
  { name: 'isInParametric', input: noop, output: function() {} },
  { name: 'map2parametric', input: noop, output: function() {} },
  { name: 'subset', input: noop, output: function() {} },
  { name: 'clone', input: noop, output: function() {} },
  { name: 'updateConnectivity', input: noop, output: function() {} },
];

var contracts = {};
gcellsetMethodContracts.forEach(function(method) {
  var methodName = method.name;
  var inputContract = '_input_contract_' + methodName + '_';
  var outputContract = '_output_contract_' + methodName + '_';

  contracts[inputContract] = defineContract(function(gcellset) {
    assert.instance(gcellset, GCellSet);
    var params = Array.prototype.slice.call(arguments).slice(1);
    method.input.apply(null, params);
  });

  contracts[outputContract] = method.output;

  exports[methodName] = function(gcellset) {
    contracts[inputContract].apply(null, arguments);

    var params = Array.prototype.slice.call(arguments, 1);
    var res = gcellset[methodName].apply(gcellset, params);

    contracts[outputContract](res);
    return res;
  };
  exports[methodName].name = methodName;
});

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
  matrixOfDimension(
    m,
    n,
    'NodalDerivativesInParametricDomain is not a matrix of ' + m + ' x ' + n
  )(nder);

  matrixOfDimension(
    m,
    n,
    'NodalCoordinatesInSpatialDomain is not a matix of ' + m + ' x ' + n
  )(x);

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

  matrixOfDimension(
    m,
    n,
    'NodalDerivativesInParametricDomain is not a matrix of ' + m + ' x ' + n
  )(nder);

  matrixOfDimension(
    m,
    n,
    'NodalCoordinatesInSpatialDomain is not a matix of ' + m + ' x ' + n
  )(x);

  var J = numeric.mul(numeric.transpose(x), nder);

  matrixOfDimension(
    n,
    n,
    'J is not a matrix of ' + n + ' x ' + n
  )(J);

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

var _input_contract_m1_jac_ = _.defineContract(function(conn, N, J, x) {
  vectorOfDimension(2)(conn);
  matrixOfDimension(2, '*')(N);
  matrixOfDimension(1, 1)(J);
  matrixOfDimension(2, 1)(x);
}, 'input is not valid for mainfold 1 gcellset jacobian.');

var _output_contract_jac_ = _.defineContract(function(jac) {
  assert.number(jac);
}, 'jac is not a number');

// jacobian :: GCellSet -> ConnectivityList -> NodalContributionVector -> JacobianMatrix
//             -> NodalCoordinatesInSpatialDomain
//             -> ManifoldJacobian
// ConnectivityList :: 1D JS array of dimension this.cellSize()
// NodalContributionVector :: 1D JS array of length this.cellSize()
// JacobianMatrix :: 2D JS array of dimension this.dim() by this.dim()
// NodalCoordinatesInSpatialDomain :: 2D JS array of dimension this.cellSize() by this.dim()
// ManifoldJacobian :: number
Manifold1GCellSet.prototype.jacobian = function(conn, N, J, x) {
  _input_contract_m1_jac_(conn, N, J, x);

  var jac = this.jacobianCurve(conn, N, J, x);

  _output_contract_jac_(jac);
  return jac;
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
  _input_contract_m1_jac_(conn, N, J, x);

  var vec = numeric.transpose(J)[0];
  var jac = numeric.norm2(vec);

  _output_contract_jac_(jac);
  return jac;
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
  _input_contract_m1_jac_(conn, N, J, x);

  var jac;
  if (this.axisSymm()) {
    var m = this.cellSize(), n = this.dim();
    matrixOfDimension(m, 1)(N);
    matrixOfDimension(m, n)(x);
    var xyz = numeric.mul(numeric.transpose(N), x)[0];
    jac = this.jacobianCurve(conn, N, J, x) * 2 * Math.PI * xyz[0];
  } else {
    jac = this.jacobianCurve(conn, N, J, x) * this.otherDimension(conn, N, x);
  }

  _output_contract_jac_(jac);
  return jac;
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
  _input_contract_m1_jac_(conn, N, J, x);

  var jac;
  if (this.axisSymm()) {
    var m = this.cellSize(), n = this.dim();
    var xyz = numeric.mul(numeric.transpose(N), x)[0];
    jac = this.jacobianCurve(conn, N, J, x) * 2 * Math.PI * xyz[0] * this.otherDimension(conn, N, x);
  } else {
    jac = this.jacobianCurve(conn, N, J, x) * this.otherDimension(conn, N, x);
  }

  _output_contract_jac_(jac);
  return jac;
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
  _input_contract_m1_jac_(conn, N, J, x);

  var jac;

  switch (dim) {
  case 3:
    jac = this.jacobianVolumn(conn, N, J, x);
    break;
  case 2:
    jac = this.jacobianSurface(conn, N, J, x);
    break;
  case 1:
    jac = this.jacobianCurve(conn, N, J, x);
    break;
  default:
    throw new Error('Manifold1GCellSet::jacobianInDim(): wrong dimension ' + dim);
  }

  _output_contract_jac_(jac);
  return jac;
};

var _input_contract_gcellset_ = defineContract(function(options) {
  assert.object(options);
  assert.assigned(options.conn);
  matrixOfDimension('*', '*')(options.conn);
}, 'input is not a valid gcellset option.');

var _input_contract_L2_ = defineContract(function(options) {
  _input_contract_gcellset_(options);

  matrixOfDimension('*', 2)(options.conn);
  if (check.assigned(options.otherDimension)) {
    assert.number(options.otherDimension);
  }

  if (check.assigned(options.axisSymm)) {
    assert.boolean(options.axisSymm);
  }
}, 'input is not a valid L2 option.');

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
// TODO:
// L2.prototype.boundaryGCellSetConstructor = function() {
//   return P1;
// };

L2.prototype.cellSize = function() { return 2; };

L2.prototype.type = function() { return 'L2'; };

var _input_contract_l2_param_coords_ = defineContract(function(paramCoords) {
  vectorOfDimension(1)(paramCoords);
}, 'input is not a valid l2 param coords, which should be of vector of dimension 1.');

L2.prototype.bfun = function(paramCoords) {
  _input_contract_l2_param_coords_(paramCoords);

  var x = paramCoords[0];
  var out = [
    [ 0.5 * (1 - x) ],
    [ 0.5 * (1 + x) ]
  ];
  return out;
};

L2.prototype.bfundpar = function(paramCoords) {
  _input_contract_l2_param_coords_(paramCoords);

  return [
    [ -0.5 ],
    [ +0.5 ]
  ];
};

exports.L2 = L2;
