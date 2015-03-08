/*global require*/
// system
var _ = require('./core.utils');
var isVector = _.isArray;
var matrix = require('./system.matrix');
var vector = require('./system.vector');
var SparseSystemMatrix = matrix.SparseSystemMatrix;
var SparseSystemVector = vector.SparseSystemVector;

exports.matrix = matrix;
exports.vector = vector;

// Return a full vector (1d js array).
function solve(A, b) {
  if (A instanceof SparseSystemMatrix && b instanceof SparseSystemVector) {
    return A.dokMatrix().solveSparseVector(b.sparseVector()).toList();
  } else if (A instanceof SparseSystemMatrix && isVector(b)) {
    return A.dokMatrix().solveVector(b);
  }

  throw new Error('system.solve(): unsupported type A and b.');
}

exports.solve = solve;
