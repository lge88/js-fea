/*global require*/
// core.assemble

function ElementMatrix(matrix, equationNumbers) {
  // TODO: do some type checking and convertion here;
  // matrix is a 2d array of size m x m
  // equationNumbers is a 1d array m x 1
  this.matrix = matrix;
  this.equationNumbers = equationNumbers;
}

exports.ElementMatrix = ElementMatrix;

// dest: DokSparseMatrix|DenseMatrix
// sources: [ ElementMatrix ]
function assemble_(dest, sources) {
  // TODO: ensure sources of made of ElementMatrix;

  sources.forEach(function(Ke) {
    var mat = Ke.matrix, eqnums = Ke.equationNumbers;

    var nonTrial = eqnums.map(function(globalIndex, localIndex) {
      return {
        globalIndex: globalIndex,
        localIndex: localIndex
      };
    }).filter(function(item) {
      return item.globalIndex !== 0;
    });

    nonTrial.forEach(function(item0) {
      // Notice the equation number starts from 1.
      var globalRowIndex = item0.globalIndex - 1;
      var localRowIndex = item0.localIndex;
      nonTrial.forEach(function(item1) {
        var globalColIndex = item1.globalIndex - 1;
        var localColIndex = item1.localIndex;

        var oldVal = dest.at(globalRowIndex, globalColIndex);

        // TODO: use mat.at()
        var elementContribution = mat[localRowIndex][localColIndex];
        dest.set_(globalRowIndex, globalColIndex, oldVal + elementContribution);
      });
    });

  });

}

exports.assemble_ = assemble_;
