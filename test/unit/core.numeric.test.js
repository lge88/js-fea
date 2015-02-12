/*jshint undef: true, unused: true */
/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var _ = require(SRC + '/core.utils.js');
var numeric = require(SRC + '/core.numeric');
var DokSparseMatrix = numeric.DokSparseMatrix;
var SparseVector = numeric.SparseVector;
var ccsValueListIterator = numeric.ccsValueListIterator;

describe('core.numeric', function() {

  describe('ccsValueListIterator()', function() {

    it('should emit correct sequence', function() {
      var ccs = [
        [0, 1, 4, 5],
        [1, 0, 1, 2, 2],
        [1, 1, 2, 1, 1]
      ];
      var expectedValueList = [
        [ 1, 0, 1 ],
        [ 0, 1, 1 ],
        [ 1, 1, 2 ],
        [ 2, 1, 1 ],
        [ 2, 2, 1 ]
      ];

      var iter = ccsValueListIterator(ccs), tuple;
      var valueList = [];

      while(iter.hasNext()) {
        tuple = iter.next();
        valueList.push(tuple);
      }

      expect(valueList).to.eql(expectedValueList);

    });

  });

  describe('DokSparseMatrix', function() {
    describe('DokSparseMatrix basic operations', function() {

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

      it('#at(i, j)', function() {
        var i, j;
        for (i = 0; i < m; ++i)
          for (j = 0; j < n; ++j)
            expect(dsm.at(i, j)).to.be(expectedFullMatrix[i][j]);

        expect(dsm.at.bind(dsm, m, 0)).to.throwException();
        expect(dsm.at.bind(dsm, -1, 0)).to.throwException();
        expect(dsm.at.bind(dsm, 0, -1)).to.throwException();
        expect(dsm.at.bind(dsm, 0, n)).to.throwException();
      });

      it('#set_(i, j, val)', function() {
        var i, j, val;
        var newMat = _.array2d(m, n, function(i, j) { return i + j; });
        for (i = 0; i < m; ++i)
          for (j = 0; j < n; ++j)
            dsm.set_(i, j, newMat[i][j]);

        expect(dsm.set_.bind(dsm, m, 0, 1.0)).to.throwException();
        expect(dsm.set_.bind(dsm, -1, 0, 1.0)).to.throwException();
        expect(dsm.set_.bind(dsm, 0, -1, 1.0)).to.throwException();
        expect(dsm.set_.bind(dsm, 0, n, 1.0)).to.throwException();
        expect(dsm.toFull()).to.eql(newMat);
      });

      it('DokSparseMatrix::toValueList(), should return correct value list consist of tuple (rowIndex, colIndex, value)', function() {
        var m1 = new DokSparseMatrix([
          [1, 1, 2],
          [2, 2, 5],
          [0, 0, 2]
        ], 4, 3);
        expect(m1.toValueList().sort(_.byLexical)).to.eql([
          [0, 0, 2],
          [1, 1, 2],
          [2, 2, 5]
        ]);

        expect((new DokSparseMatrix([], 3, 3)).toValueList()).to.eql([]);

      });

    });

    describe('DokSparseMatrix::solveSparseVector(vec)/solveVector(vec)', function() {
      it('should throw error if the vec is not a SparseVector.', function() {
        var m = new DokSparseMatrix([], 3, 2);
        expect(m.solveSparseVector.bind(m, [1, 2])).to.throwException();
      });

      it('should throw error if the sparse vector dimension does not match matrix dimension.', function() {
        var A = new DokSparseMatrix([], 3, 3);
        var b = new SparseVector([], 2);
        expect(A.solveSparseVector.bind(A, b)).to.throwException();
      });

      it('should return correct result for eye(3)', function() {
        var A = new DokSparseMatrix([
          [0, 0, 1.0],
          [1, 1, 1.0],
          [2, 2, 1.0]
        ], 3, 3), b1 = [1.0, 2.0, 3.0];
        var b2 = new SparseVector([
          [0, 1.0],
          [1, 2.0],
          [2, 3.0]
        ], 3);

        var x1 = A.solveVector(b1);
        expect(x1).to.eql(b1);

        var x2 = A.solveSparseVector(b2);
        expect(x2.toCcs()).to.eql(b2.toCcs());
      });

      // TODO:
      // it('should throw expection when A is singular', function() {
      //   var A = new DokSparseMatrix([], 3, 3), b = [1.0, 2.0, 3.0];

      //   expect(A.solve.bind(A, b)).to.throwException();
      // });

      it('should return correct result for conceived A and b, b is an array', function() {
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

        ], 3, 3);
        var b1 = [5.0, 9.0, 5.0];
        var b2 = [ [5.0], [9.0], [5.0] ];

        var xExpected = [1.0, -1.0, 2.0];
        var x1 = A.solveVector(b1);
        // var x2 = A.solveVector(b2);
        var relDiff1 = numeric.norm2(numeric.sub(x1, xExpected)) / numeric.norm2(xExpected);
        // var relDiff2 = numeric.norm2(numeric.sub(x2, xExpected)) / numeric.norm2(xExpected);
        var tol = 1e-10;

        expect(relDiff1).to.lessThan(tol);
        // expect(relDiff2).to.lessThan(tol);
      });

      it('should return correct result for conceived A and b, b is a SparseVector', function() {
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

        ], 3, 3);
        var b = new SparseVector([
          [0, 5.0], [1, 9.0], [2, 5.0]
        ], 3);

        var xExpected = [1.0, -1.0, 2.0];
        var x = A.solveSparseVector(b);
        x = numeric.transpose(x.toFull())[0];

        var relDiff = numeric.norm2(numeric.sub(x, xExpected)) / numeric.norm2(xExpected);
        var tol = 1e-10;
        expect(relDiff).to.lessThan(tol);
      });

    });


  });


  xdescribe('#assembly()', function() {



  });

});
