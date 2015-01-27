/*jshint undef: true, unused: true */
/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js'), _ = require(SRC + '/core.utils.js');
var numeric = require('numeric');
var DokSparseMatrix = require(SRC + '/matrix.dok').DokSparseMatrix;

describe('dok sparse matrix', function() {
  var dsm, m = 3, n = 4;
  var valueLst = [
    [0, 0, 1.0],
    [0, 1, 2.0],
    [1, 1, 1.0],
    [1, 2, 2.0],
    [2, 1, 1.0],
    [2, 2, 1.0],
    [2, 3, 1.0]
  ];
  var expectedFullMatrix = [
    [1.0, 2.0, 0.0, 0.0],
    [0.0, 1.0, 2.0, 0.0],
    [0.0, 1.0, 1.0, 1.0]
  ];

  var expectedCcsMatrix = [
    [0, 1, 4, 6, 7],
    [0, 0, 1, 2, 1, 2, 2],
    [1.0, 2.0, 1.0, 1.0, 2.0, 1.0, 1.0]
  ];

  it('#constructor(lst, m, n)', function() {
    dsm = new DokSparseMatrix(valueLst, m, n);
    expect(dsm.m).to.be(3);
    expect(dsm.n).to.be(4);
  });

  it('#toFull()', function() {
    expect(dsm.toFull()).to.eql(expectedFullMatrix);
  });

  it('#toCcs()', function() {
    expect(dsm.toCcs()).to.eql(expectedCcsMatrix);
  });

  it('#getValue(i, j)', function() {
    var i, j;
    for (i = 0; i < m; ++i)
      for (j = 0; j < n; ++j)
        expect(dsm.getValue(i, j)).to.be(expectedFullMatrix[i][j]);

    expect(dsm.getValue.bind(dsm, m, 0)).to.throwException();
    expect(dsm.getValue.bind(dsm, -1, 0)).to.throwException();
    expect(dsm.getValue.bind(dsm, 0, -1)).to.throwException();
    expect(dsm.getValue.bind(dsm, 0, n)).to.throwException();
  });

  it('#setValue(i, j, val)', function() {
    var i, j, val;
    var newMat = _.array2d(m, n, function(i, j) { return i + j; });
    for (i = 0; i < m; ++i)
      for (j = 0; j < n; ++j)
        dsm.setValue(i, j, newMat[i][j]);

    expect(dsm.setValue.bind(dsm, m, 0, 1.0)).to.throwException();
    expect(dsm.setValue.bind(dsm, -1, 0, 1.0)).to.throwException();
    expect(dsm.setValue.bind(dsm, 0, -1, 1.0)).to.throwException();
    expect(dsm.setValue.bind(dsm, 0, n, 1.0)).to.throwException();
    expect(dsm.toFull()).to.eql(newMat);
  });

  describe('#solve', function() {
    it('should throw error if the matrix is not square.', function() {
      var m = new DokSparseMatrix([], 3, 2);
      expect(m.solve.bind(m, [1, 2])).to.throwException();
    });

    it('should throw error if the vector dimension does not match matrix dimension.', function() {
      var m = new DokSparseMatrix([], 3, 3);
      expect(m.solve.bind(m, [1, 2])).to.throwException();
    });

    it('should return correct result for eye(3)', function() {
      var A = new DokSparseMatrix([
        [0, 0, 1.0],
        [1, 1, 1.0],
        [2, 2, 1.0]
      ], 3, 3), b = [1.0, 2.0, 3.0];

      var x = A.solve(b);
      expect(x).to.eql(b);
    });

    // TODO:
    // it('should throw expection when A is singular', function() {
    //   var A = new DokSparseMatrix([], 3, 3), b = [1.0, 2.0, 3.0];

    //   expect(A.solve.bind(A, b)).to.throwException();
    // });

    it('should return correct result for conceived A, x', function() {
      var A = new DokSparseMatrix([

        [0, 0, 1.0],
        [0, 1, 2.0],
        [0, 2, 3.0],

        [1, 0, 6.0],
        [1, 1, 5.0],
        [1, 2, 4.0],

        [2, 0, 7.0],
        [2, 1, 10.0],
        [2, 2, 4.0]

      ], 3, 3), b = [5.0, 9.0, 5.0];

      var xExpected = [1.0, -1.0, 2.0];
      var x = A.solve(b);
      var relDiff = numeric.norm2(numeric.sub(x, xExpected)) / numeric.norm2(xExpected);
      var tol = 1e-10;

      expect(relDiff).to.lessThan(tol);
    });

  });

  describe('#assembly()', function() {



  });

});
