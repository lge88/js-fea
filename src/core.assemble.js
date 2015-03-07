/*global require*/
// core.assemble

// dest: DokSparseMatrix|DenseMatrix
// sources: [ ElementMatrix ]
function assemble_(dest, sources) {
  // TODO: ensure sources of made of ElementMatrix;

  sources.forEach(function(Ke) {
    var mat = Ke.matrix, eqnums = Ke.eqnums;

    var noneZeroIndices = eqnums.map(function(globalIndex, localIndex) {
      return {
        globalIndex: globalIndex,
        localIndex: localIndex
      };
    }).filter(function(item) {
      return item.globalIndex !== 0;
    });

    noneZeroIndices.forEach(function(item0) {
      // Notice the equation number starts from 1.
      var globalRowIndex = item0.globalIndex - 1;
      var localRowIndex = item0.localIndex;
      noneZeroIndices.forEach(function(item1) {
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
