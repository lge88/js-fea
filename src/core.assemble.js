/*global require*/
// core.assemble

function ElementMatrix(matrix, equationNumbers) {
  // TODO: do some checking here;
  this.matrix = matrix;
  this.equationNumbers = equationNumbers;
}

exports.ElementMatrix = ElementMatrix;

// dest: DokSparseMatrix|DenseMatrix
// sources: [ ElementMatrix ]
function assemble_(dest, sources) {


}

exports.assemble_ = assemble_;
