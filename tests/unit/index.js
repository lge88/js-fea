var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var DokSparseMatrix = require(SRC + '/matrix.dok').DokSparseMatrix;

describe('dok sparse matrix', function() {
  describe('#constructor()', function() {
    var mat = new DokSparseMatrix([
      [0, 0, 1.0],
      [0, 1, 2.0],
      [1, 1, 1.0],
      [1, 2, 2.0],
      [2, 1, 1.0],
      [2, 2, 1.0],
      [2, 3, 1.0]
    ], 3, 4);

    expect(mat.m).to.be(3);
    expect(mat.n).to.be(4);

  });
});
