/*jshint undef: true, unused: true */
/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var dataDriven = require('data-driven');
var _ = require(SRC + '/core.utils.js');
var numeric = require(SRC + '/core.numeric');
var DokSparseMatrix = numeric.DokSparseMatrix;
var DenseMatrix = numeric.DenseMatrix;
var SparseVector = numeric.SparseVector;
var ccsValueListIterator = numeric.ccsValueListIterator;
var mldivide = numeric.mldivide;
var vecEquals = numeric.vecEquals;
var array2dEquals = numeric.array2dEquals;
var isMatrixLikeArray = numeric.isMatrixLikeArray;

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

  describe('array2dEquals(a, b, aTolerance)', function() {
    var fixtures = [
      {
        desc: 'a and b are of difference dimension',
        a: [ [1, 2], [0, 0] ],
        b: [ [1, 2] ],
        expected: false
      },
      {
        desc: '',
        a: [ [1, 2], [2, 3] ],
        b: [ [1, 2], [2, 3] ],
        expected: true
      },
      {
        desc: '',
        a: [ [1, 2], [2, 3.1] ],
        b: [ [1, 2], [2, 3] ],
        expected: false
      },
      {
        desc: 'when tol is large',
        a: [ [1, 2], [2, 3.1] ],
        b: [ [1, 2], [2, 3] ],
        tol: 0.1,
        expected: true
      }
    ];
    dataDriven(fixtures, function() {
      it('should return {expected} when {desc}', function(ctx) {
        expect(array2dEquals(ctx.a, ctx.b, ctx.tol)).to.be(ctx.expected);
      });
    });
  });

  describe('isMatrixLikeArray(arr)', function() {
    var fixtures = [
      {
        desc: 'arr is not a JS array',
        arr: 'hello',
        expected: false
      },
      {
        desc: 'arr is empty arr',
        arr: [],
        expected: false
      },
      {
        desc: 'arr is array of non-array enties',
        arr: [ 1, 2, 3 ],
        expected: false
      },
      {
        desc: 'arr has rows that has zero entries',
        arr: [ [] ],
        expected: false
      },
      {
        desc: 'arr has vary length rows',
        arr: [ [1], [2, 3], [3, 4] ],
        expected: false
      },
      {
        desc: 'arr has same length rows',
        arr: [ [1, 3], [2, 3], [3, 4] ],
        expected: true
      }
    ];

    dataDriven(fixtures, function() {
      it('should return {expected} when {desc}', function(ctx) {
        expect(isMatrixLikeArray(ctx.arr)).to.be(ctx.expected);
      });
    });
  });


  describe('DenseMatrix', function() {
    var m2x2 = [ [1, 2], [3, 4] ];
    var m3x4 = [
      [ 1, 2, 3, 4 ],
      [ 5, 6, 7, 8 ],
      [ 9, 9, 9, 9 ]
    ];
    describe('DenseMatrix()', function() {
      var f = function(a, b, c) {
        return new DenseMatrix(a, b, c);
      };

      var casesShouldThrow = [
        {
          a: []
        }
      ];

      dataDriven(casesShouldThrow, function() {
        it('should throw', function(ctx) {
          expect(f.bind(null, ctx.a, ctx.b, ctx.c)).to.throwException();
        });
      });

      var casesShouldWork = [
        {
          a: 4,
          b: 3
        },
        {
          a: [ [1, 2], [3, 4] ]
        }
      ];

      dataDriven(casesShouldWork, function() {
        it('should work', function(ctx) {
          f(ctx.a, ctx.b, ctx.c);
        });
      });

      it('should work with fn', function() {
        var m = f(2, 3, function(i, j) { return i*j; });
        var expected = [
          [0, 0, 0],
          [0, 1, 2]
        ];
        expect(m.toFull()).to.eql(expected);
      });

    });

    describe('DenseMatrix::size()', function() {
      dataDriven([
        {
          mat: [ [1, 2], [3, 4] ],
          size: [ 2, 2 ]
        },
        {
          mat: [ [1, 2] ],
          size: [ 1, 2 ]
        },
        {
          mat: [ [1], [2] ],
          size: [ 2, 1 ]
        },
      ], function() {
        it('should return correct size', function(ctx) {
          var m = new DenseMatrix(ctx.mat);
          expect(m.size()).to.eql(ctx.size);
        });
      });
    });

    describe('DenseMatrix::at(i, j)', function() {
      dataDriven([
        { mat: m2x2, i: -1, j: 1 },
        { mat: m2x2, i: 0, j: -1 },
        { mat: m2x2, i: 3, j: 0 },
        { mat: m2x2, i: 0, j: 3 },
      ], function() {
        it('should throw when given invalid location', function(ctx) {
          var m = new DenseMatrix(ctx.mat);
          expect(m.at.bind(m, ctx.i, ctx.j)).to.throwException();
        });
      });

      dataDriven([
        { mat: m2x2, i: 0, j: 0, val: 1 },
        { mat: m2x2, i: 0, j: 1, val: 2 },
        { mat: m2x2, i: 1, j: 0, val: 3 },
        { mat: m2x2, i: 1, j: 1, val: 4 }
      ], function() {
        it('should return element at valid location', function(ctx) {
          var m = new DenseMatrix(ctx.mat);
          expect(m.at(ctx.i, ctx.j)).to.be(ctx.val);
        });
      });
    });

    describe('DenseMatrix::set_(i, j, val)', function() {

      dataDriven([
        { m: m3x4, i: -1, j: 0, val: 1 },
        { m: m3x4, i: 3, j: 0, val: 1 },
        { m: m3x4, i: 0, j: -1, val: 1 },
        { m: m3x4, i: 0, j: 4, val: 1 }
      ], function() {
        it('should throw when i, j outof bound', function(ctx) {
          var m = new DenseMatrix(ctx.m);
          expect(m.set_.bind(m, ctx.i, ctx.j, ctx.val)).to.throwException();
        });
      });

      dataDriven([
        { m: m3x4, i: 0, j: 0, val: '1' },
        { m: m3x4, i: 0, j: 0, val: [] },
        { m: m3x4, i: 0, j: 0, val: {} }
      ], function() {
        it('should throw when val is not valid', function(ctx) {
          var m = new DenseMatrix(ctx.m);
          expect(m.set_.bind(m, ctx.i, ctx.j, ctx.val)).to.throwException();
        });
      });

      dataDriven([
        { m: m3x4, i: 0, j: 0, val: 2 },
        { m: m3x4, i: 2, j: 1, val: 3 },
        { m: m3x4, i: 1, j: 3, val: 5 }
      ], function() {
        it('should work', function(ctx) {
          var m = new DenseMatrix(ctx.m);
          m.set_(ctx.i, ctx.j, ctx.val);
          expect(m.at(ctx.i, ctx.j)).to.be(ctx.val);
        });
      });
    });

    describe('DenseMatrix::toFull()', function() {
      dataDriven([
        { m: m2x2 },
        { m: m3x4 }
      ], function() {
        it('should return correct 2d JS Array.', function(ctx) {
          var m = new DenseMatrix(ctx.m);
          expect(m.toFull()).to.eql(ctx.m);
        });
      });
    });

    describe('DenseMatrix::toCcs()', function() {
      dataDriven([
        {
          m: [ [0, 1], [0, 0]],
          ccs: [
            [0, 0, 1],
            [0],
            [1]
          ]
        },
      ], function() {
        it('should return correct ccs.', function(ctx) {
          var m = new DenseMatrix(ctx.m);
          expect(m.toCcs()).to.eql(ctx.ccs);
        });
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
