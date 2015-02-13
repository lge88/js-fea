/*jshint undef: true, unused: true */
/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var dataDriven = require('data-driven');
var _ = require(SRC + '/core.utils.js');
var numeric = require(SRC + '/core.numeric');
var DokSparseMatrix = numeric.DokSparseMatrix;
var SparseVector = numeric.SparseVector;
var ccsValueListIterator = numeric.ccsValueListIterator;
var mldivide = numeric.mldivide;
var vecEquals = numeric.vecEquals;

describe('core.numeric', function() {

  describe('ccsValueListIterator()', function() {

    it('should emit correct sequence', function() {
      var full = [
        [ 0, 1, 0 ],
        [ 1, 2, 0 ],
        [ 0, 1, 1 ]
      ];

      var ccs = numeric.ccsSparse(full);

      var expectedValueList = [
        [ 1, 0, 1 ],
        [ 0, 1, 1 ],
        [ 1, 1, 2 ],
        [ 2, 1, 1 ],
        [ 2, 2, 1 ]
      ];

      var iter = ccsValueListIterator(ccs);
      var valueList = _.listFromIterator(iter);

      expect(valueList).to.eql(expectedValueList);
    });

  });

  describe('vecEquals(a, b, aTolerance)', function() {
    var fixtures = [
      {
        desc: 'a and b are both empty',
        a: [],
        b: [],
        expected: false
      },
      {
        desc: 'a and b are of difference dimension',
        a: [],
        b: [1],
        expected: false
      },
      {
        desc: 'a and b are of difference dimension',
        a: [1, 2, 0],
        b: [1, 2],
        expected: false
      },
      {
        desc: '',
        a: [1, 2, 0],
        b: [1, 2, 0],
        expected: true
      },
      {
        desc: '',
        a: [1, 2, 0.1],
        b: [1, 2, 0],
        expected: false
      },
      {
        desc: 'when tol is large',
        a: [1, 2, 0.1],
        b: [1, 2, 0],
        tol: 0.1,
        expected: true
      }
    ];
    dataDriven(fixtures, function() {
      it('should return {expected} when {desc}', function(ctx) {
        expect(vecEquals(ctx.a, ctx.b, ctx.tol)).to.be(ctx.expected);
      });
    });
  });

  describe('DokSparseMatrix', function() {
    var fixtures = [
      {
        m: 3,
        n: 4,
        valueLst: [
          [0, 0, 1.0],
          [0, 1, 2.0],
          [1, 1, 1.0],
          [1, 2, 2.0],
          [2, 1, 1.0],
          [2, 2, 1.0],
          [2, 3, 1.0]
        ],
        expectedFullMatrix: [
          [1.0, 2.0, 0.0, 0.0],
          [0.0, 1.0, 2.0, 0.0],
          [0.0, 1.0, 1.0, 1.0]
        ],
        expectedCcsMatrix: [
          [0, 1, 4, 6, 7],
          [0, 0, 1, 2, 1, 2, 2],
          [1.0, 2.0, 1.0, 1.0, 2.0, 1.0, 1.0]
        ]
      }
    ];

    it('#constructor(lst/iter, m, n)', function() {
      var mat1 = new DokSparseMatrix(fixtures[0].valueLst, fixtures[0].m, fixtures[0].n);
      expect(mat1.m()).to.be(3);
      expect(mat1.n()).to.be(4);

      var mat2 = new DokSparseMatrix(_.iteratorFromList(fixtures[0].valueLst), fixtures[0].m, fixtures[0].n);
      expect(mat2.m()).to.be(3);
      expect(mat2.n()).to.be(4);
    });

    it('#at(i, j)', function() {
      var mat = new DokSparseMatrix(fixtures[0].valueLst, fixtures[0].m, fixtures[0].n);
      var i, j;
      for (i = 0; i < fixtures[0].m; ++i)
        for (j = 0; j < fixtures[0].n; ++j)
          expect(mat.at(i, j)).to.be(fixtures[0].expectedFullMatrix[i][j]);

      expect(mat.at.bind(mat, fixtures[0].m, 0)).to.throwException();
      expect(mat.at.bind(mat, -1, 0)).to.throwException();
      expect(mat.at.bind(mat, 0, -1)).to.throwException();
      expect(mat.at.bind(mat, 0, fixtures[0].n)).to.throwException();
    });

    it('#set_(i, j, val)', function() {
      var mat = new DokSparseMatrix(fixtures[0].valueLst, fixtures[0].m, fixtures[0].n);
      var newMat = _.array2d(fixtures[0].m, fixtures[0].n, function(i, j) { return i + j; });
      var i, j, val;
      for (i = 0; i < fixtures[0].m; ++i)
        for (j = 0; j < fixtures[0].n; ++j)
          mat.set_(i, j, newMat[i][j]);

      expect(mat.set_.bind(mat, fixtures[0].m, 0, 1.0)).to.throwException();
      expect(mat.set_.bind(mat, -1, 0, 1.0)).to.throwException();
      expect(mat.set_.bind(mat, 0, -1, 1.0)).to.throwException();
      expect(mat.set_.bind(mat, 0, fixtures[0].n, 1.0)).to.throwException();
      expect(mat.toFull()).to.eql(newMat);
    });

    it('#toFull()', function() {
      var m1 = new DokSparseMatrix(fixtures[0].valueLst, fixtures[0].m, fixtures[0].n);
      expect(m1.toFull()).to.eql(fixtures[0].expectedFullMatrix);

      var m2 = new DokSparseMatrix([
        [0, 1, 1],
        [2, 1, 1],
        [2, 2, 1]
      ], 3, 3);
      expect(m2.toFull()).to.eql([
        [0, 1, 0],
        [0, 0, 0],
        [0, 1, 1]
      ]);

    });

    it('#toCcs()', function() {
      var m1 = new DokSparseMatrix(fixtures[0].valueLst, fixtures[0].m, fixtures[0].n);
      expect(m1.toCcs()).to.eql(fixtures[0].expectedCcsMatrix);

      var m2 = new DokSparseMatrix([
        [0, 1, 1],
        [2, 1, 1],
        [2, 2, 1]
      ], 3, 3);
      expect(m2.toCcs()).to.eql([
        [0, 0, 2, 3],
        [0, 2, 2],
        [1, 1, 1]
      ]);
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

      var m2 = new DokSparseMatrix([], 3, 3);
      expect(m2.toValueList()).to.eql([]);

    });

  });

  describe('SparseVector', function() {
    var f = function(a, b) { return new SparseVector(a, b); };
    var v0, v1, v2;

    it('SparseVector(valueList, dim)', function() {
      v0 = new SparseVector([], 10);
      v1 = new SparseVector([
        [5, 2],
        [2, 2],
        [60, 8]
      ], 1000);
      v2 = new SparseVector([ [0, 1], [1, 2], [2, 3] ], 3);

      expect(f.bind(null, [ [0, 1], [2, 3] ])).to.throwException();
    });

    it('SparseVector::at(i)/length()/nzCount()', function() {
      expect(v0.length()).to.be(10);
      expect(v0.nzCount()).to.be(0);
      expect(v0.at(0)).to.be(0);
      expect(v0.at(2)).to.be(0);
      expect(v0.at.bind(v0, -1)).to.throwException();
      expect(v0.at.bind(v0, 10)).to.throwException();

      expect(v1.length()).to.be(1000);
      expect(v1.nzCount()).to.be(3);
      expect(v1.at(0)).to.be(0);
      expect(v1.at(5)).to.be(2);
      expect(v1.at(60)).to.be(8);
      expect(v1.at.bind(v1, 1000)).to.throwException();

      expect(v2.length()).to.be(3);
      expect(v2.nzCount()).to.be(3);
      expect(v2.at(0)).to.be(1);
      expect(v2.at(1)).to.be(2);
      expect(v2.at(2)).to.be(3);
      expect(v2.at.bind(null, 3)).to.throwException();
    });

    it('SparseVector::set_(i, val)', function() {
      var v = new SparseVector([ [0, 0], [3, 3] ], 5);
      expect(v.set_.bind(v, -1)).to.throwException();
      expect(v.set_.bind(v, 10)).to.throwException();

      v.set_(0, 2);
      expect(v.at(0)).to.be(2);

      expect(v.at(1)).to.be(0);
      v.set_(1, 5);
      expect(v.at(1)).to.be(5);

      expect(v.set_.bind(v, 1, 'sdf')).to.throwException();
    });

    it('SparseVector::toFull()/toList()/toCcs()', function() {
      var v1 = new SparseVector([ [0, 0], [3, 3] ], 5);
      expect(v1.toFull()).to.eql([ [0], [0], [0], [3], [0] ]);
      expect(v1.toList()).to.eql([ 0, 0, 0, 3, 0 ]);
      expect(v1.toCcs()).to.eql([
        [0, 1],
        [3],
        [3]
      ]);
    });

    it('SparseVector::valueListIterator()', function() {
      var valLst = [ [3, 3], [ 9, 2] ];
      var v1 = new SparseVector(valLst, 20);
      var iter = v1.valueListIterator();

      var valLst2 = [ [0, 0], [3, 3], [ 9, 2] ];
      var v2 = new SparseVector(valLst2, 20);
      var iter2 = v2.valueListIterator();
      expect(_.listFromIterator(iter2)).to.eql([ [3, 3], [9, 2] ]);
    });

  });


  describe('mldivide()', function() {
    var casesThatShouldThrow = [
      {
        desc: 'A is not square',
        A: new DokSparseMatrix([], 3, 2),
        b: [1, 2]
      },
      {
        desc: 'A b dimension dismatch',
        A: new DokSparseMatrix([], 3, 3),
        b: new SparseVector([], 2)
      }
    ];

    dataDriven(casesThatShouldThrow, function() {
      it('should throw when {desc}.', function(ctx) {
        var A = ctx.A, b = ctx.b;
        expect(mldivide.bind(null, A, b)).to.throwException();
      });
    });

    var vecEquals = numeric.vecEquals;

    var sparseEquals = function(a, b, aTolerance) {
      return a.equals(b, aTolerance);
    };

    var casesThatShouldWork = [
      {
        desc: 'A is identity matrix, b is an JS array',
        A: new DokSparseMatrix([
          [ 0, 0, 1.0 ],
          [ 1, 1, 1.0 ],
          [ 2, 2, 1.0 ]
        ], 3, 3),
        b: [ 1.0, 2.0, 3.0 ],
        expected: [ 1.0, 2.0, 3.0 ],
        equals: vecEquals
      },
      {
        desc: 'A is 3x3 matrix, b is an JS array',
        A: new DokSparseMatrix([
          [0, 0, 1.0],
          [0, 1, 2.0],
          [0, 2, 3.0],

          [1, 0, 6.0],
          [1, 1, 5.0],
          [1, 2, 4.0],

          [2, 0, 7.0],
          [2, 1, 10.0],
          [2, 2, 4.0]
        ], 3, 3),
        b: [ 5.0, 9.0, 5.0 ],
        expected: [ 1.0, -1.0, 2.0 ],
        equals: vecEquals
      },
      {
        desc: 'A is identity matrix, b is a SparseVector',
        A: new DokSparseMatrix([
          [0, 0, 1.0],
          [1, 1, 1.0],
          [2, 2, 1.0]
        ], 3, 3),
        b: new SparseVector([
          [0, 1],
          [1, 2],
          [2, 3],
        ], 3),
        expected: [1.0, 2.0, 3.0],
        equals: sparseEquals
      },
      {
        desc: 'A is 3x3 matrix, b is a SparseVector',
        A: new DokSparseMatrix([
          [0, 0, 1.0],
          [0, 1, 2.0],
          [0, 2, 3.0],

          [1, 0, 6.0],
          [1, 1, 5.0],
          [1, 2, 4.0],

          [2, 0, 7.0],
          [2, 1, 10.0],
          [2, 2, 4.0]
        ], 3, 3),
        b: new SparseVector([
          [ 0, 5.0 ],
          [ 1, 9.0 ],
          [ 2, 5.0 ]
        ], 3),
        expected: [ 1.0, -1.0, 2.0 ],
        equals: sparseEquals
      }
    ];

    dataDriven(casesThatShouldWork, function() {
      it('should work when {desc}.', function(ctx) {
        var A = ctx.A, b = ctx.b, expected = ctx.expected;
        var equals = ctx.equals;
        var actual = mldivide(A, b);
        expect(equals(actual, expected)).to.be(true);
      });
    });

  });
});
