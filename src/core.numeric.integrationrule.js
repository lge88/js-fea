/*global require*/
// core.numeric.integrationrule

var _ = require('./core.utils');
var numeric = require('./core.numeric');
var transpose = numeric.transpose;
var cloneDeep = _.cloneDeep;

function IntegrationRule() {}

// paramCoords :: IntegrationRule -> ParametricCoordinates
// ParametricCoordinates :: 2D JS array of dimension npts by dim
IntegrationRule.prototype.paramCoords = function() {
  throw new Error('IntegrationRule::paramCoords(): must be overrided by subclass.');
};

// weights :: IntegrationRule -> Weights
// Weights :: 1D JS array of dimension npts
IntegrationRule.prototype.weights = function() {
  throw new Error('IntegrationRule::weights(): must be overrided by subclass.');
};

// npts :: IntegrationRule -> Int
IntegrationRule.prototype.npts = function() {
  throw new Error('IntegrationRule::npts(): must be overrided by subclass.');
};

// dim :: IntegrationRule -> Int
IntegrationRule.prototype.dim = function() {
  throw new Error('IntegrationRule::dim(): must be overrided by subclass.');
};

exports.IntegrationRule = IntegrationRule;

// GaussRule :: Dimension -> Order -> GaussRule
// Dimension :: Int
// Order :: Int
// dim: {1, 2, 3} D
// order: number of points along one dimension
function GaussRule(dim, order) {
  // TODO: some parameter validation here.
  // dim in { 1, 2, 3 }

  var pcs, ws;
  switch(order) {
  case 1:
    pcs = [ 0 ];
    ws  = [ 2 ];
    break;
  case 2:
    pcs = [ -0.577350269189626, 0.577350269189626 ];
    ws  = [ 1, 1 ];
    break;
  case 3:
    pcs = [ -0.774596669241483, 0, 0.774596669241483 ];
    ws  = [ 0.5555555555555556, 0.8888888888888889, 0.5555555555555556 ];
    break;
  case 4:
    pcs = [ -0.86113631159405, -0.33998104358486, 0.33998104358486, 0.86113631159405 ];
    ws  = [ 0.34785484513745, 0.65214515486255, 0.65214515486255, 0.34785484513745 ];
    break;
  default:
    throw new Error('GaussRule(dim, order): for order = ' + order +
                    ' is not implemented.');
  }

  var paramCoords, weights, i, j, k;
  switch(dim) {
  case 1:
    paramCoords = transpose([ pcs ]);
    weights = ws;
    break;
  case 2:
    paramCoords = [];
    weights = [];
    for (i = 0; i < order; ++i) {
      for (j = 0; j < order; ++j) {
        paramCoords.push([ pcs[i], pcs[j] ]);
        weights.push(ws[i] * ws[j]);
      }
    }
    break;
  case 3:
    paramCoords = [];
    weights = [];
    for (i = 0; i < order; ++i) {
      for (j = 0; j < order; ++j) {
        for (k = 0; k < order; ++k) {
          paramCoords.push([ pcs[i], pcs[j], pcs[k] ]);
          weights.push(ws[i] * ws[j] * ws[k]);
        }
      }
    }
    break;
  default:
    throw new Error('GaussRule(dim, order): for dim = ' + dim +
                    ' is not implemented.');
  }

  this._paramCoords = paramCoords;
  this._weights = weights;
}

GaussRule.prototype = Object.create(IntegrationRule.prototype);
GaussRule.prototype.constructor = GaussRule;

GaussRule.prototype.paramCoords = function() {
  return cloneDeep(this._paramCoords);
};

GaussRule.prototype.weights = function() {
  return cloneDeep(this._weights);
};

GaussRule.prototype.npts = function() {
  return this._paramCoords.length;
};

GaussRule.prototype.dim = function() {
  return this._paramCoords[0].length;
};

exports.GaussRule = GaussRule;
