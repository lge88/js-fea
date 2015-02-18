/*jshint undef: true, unused: true */
/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var _ = require(SRC + '/core.utils.js');
var dataDriven = require('data-driven');

describe('core.utils', function() {
  describe('array1d()', function() {
    it('array1d(size, value) should work with constant', function() {
      expect(_.array1d(3, 0)).to.eql([0, 0, 0]);
    });

    it('array1d(size, fn) should work with generator function', function() {
      expect(_.array1d(3, function(x) { return x*2; })).to.eql([0, 2, 4]);
    });
  });

  describe('array2d()', function() {
    it('#array2d(m, n, fn)', function() {
      var mat = _.array2d(3, 2, function(i, j) { return i + j; });
      var expectedMat = [
        [0.0, 1.0],
        [1.0, 2.0],
        [2.0, 3.0]
      ];
      expect(mat).to.eql(expectedMat);
    });

    it('#array2d(m, n, val)', function() {
      var mat = _.array2d(3, 2, 1.0);
      var expectedMat = [
        [1.0, 1.0],
        [1.0, 1.0],
        [1.0, 1.0]
      ];
      expect(mat).to.eql(expectedMat);
    });
  });

  describe('embed()', function() {
    it('embed(notAnArray, ..) should throw', function() {
      expect(_.embed.bind(null, {})).to.throwException();
    });

    it('embed(vec, dim) should work with lower dimension', function() {
      var vec = [1, 2, 3];
      expect(_.embed(vec, 2)).to.eql([1, 2]);
    });

    it('embed(vec, dim) should work with higher dimension', function() {
      var vec = [1, 2, 3];
      expect(_.embed(vec, 5)).to.eql([1, 2, 3, 0, 0]);
    });
  });

  describe('_.byLexical', function() {
    it('should sort list of arrays by lexical', function() {
      var arr = [
        [3, 2, 1],
        [5, 4, 3],
        [0, 1, 2],
        [3, 1, 2],
        [5, 4, 0]
      ];

      expect(arr.sort(_.byLexical)).to.eql([
        [0, 1, 2],
        [3, 1, 2],
        [3, 2, 1],
        [5, 4, 0],
        [5, 4, 3]
      ]);
    });

    it('should sort list of typed arrays by lexical', function() {
      var arr = [
        new Uint32Array([3, 2, 1]),
        new Uint32Array([5, 4, 3]),
        new Uint32Array([0, 1, 2]),
        new Uint32Array([3, 1, 2]),
        new Uint32Array([5, 4, 0])
      ];

      expect(arr.sort(_.byLexical).map(function(a) {
        return Array.prototype.slice.call(a);
      })).to.eql([
        [0, 1, 2],
        [3, 1, 2],
        [3, 2, 1],
        [5, 4, 0],
        [5, 4, 3]
      ]);
    });
  });

  describe('rotateRight(arr, offset)', function() {

    var arr = [1, 2, 3, 4, 5];
    it('should work with 0', function() {
      expect(_.rotateRight(arr, 0)).to.eql(arr);
    });

    it('should work with positive integer', function() {
      expect(_.rotateLeft(arr, 1)).to.eql([2, 3, 4, 5, 1]);
      expect(_.rotateLeft(arr, 2)).to.eql([3, 4, 5, 1, 2]);
      expect(_.rotateLeft(arr, 5)).to.eql([1, 2, 3, 4, 5]);
      expect(_.rotateLeft(arr, 6)).to.eql([2, 3, 4, 5, 1]);
      expect(_.rotateLeft(arr, 8)).to.eql([4, 5, 1, 2, 3]);

      expect(_.rotateRight(arr, 1)).to.eql([5, 1, 2, 3, 4]);
      expect(_.rotateRight(arr, 2)).to.eql([4, 5, 1, 2, 3]);
      expect(_.rotateRight(arr, 5)).to.eql([1, 2, 3, 4, 5]);
      expect(_.rotateRight(arr, 6)).to.eql([5, 1, 2, 3, 4]);
      expect(_.rotateRight(arr, 8)).to.eql([3, 4, 5, 1, 2]);
    });

    it('should work with negative integer', function() {
      expect(_.rotateLeft(arr, -1)).to.eql([5, 1, 2, 3, 4]);
      expect(_.rotateLeft(arr, -2)).to.eql([4, 5, 1, 2, 3]);
      expect(_.rotateLeft(arr, -5)).to.eql([1, 2, 3, 4, 5]);
      expect(_.rotateLeft(arr, -6)).to.eql([5, 1, 2, 3, 4]);
      expect(_.rotateLeft(arr, -8)).to.eql([3, 4, 5, 1, 2]);

      expect(_.rotateRight(arr, -1)).to.eql([2, 3, 4, 5, 1]);
      expect(_.rotateRight(arr, -2)).to.eql([3, 4, 5, 1, 2]);
      expect(_.rotateRight(arr, -5)).to.eql([1, 2, 3, 4, 5]);
      expect(_.rotateRight(arr, -6)).to.eql([2, 3, 4, 5, 1]);
      expect(_.rotateRight(arr, -8)).to.eql([4, 5, 1, 2, 3]);
    });
  });


  describe('minIndex(vec)', function() {
    it('should work with []', function() {
      expect(_.minIndex([])).to.be(-1);
    });

    it('should work with [1]', function() {
      expect(_.minIndex([1])).to.be(0);
    });

    it('should work with [3, 1, 2]', function() {
      expect(_.minIndex([3, 1, 2])).to.be(1);
    });
  });

  describe('isIterator(iter)/noopIterator/listFromIterator(iter)/iteratorFromList(lst)', function() {
    it('isIterator', function() {
      var iter0 = _.iteratorFromList([]);
      var iter1 = _.noopIterator;
      var iter2 = { hasNext: false, next: function(){} };
      expect(_.isIterator(iter0)).to.be(true);
      expect(_.isIterator(iter1)).to.be(true);
      expect(_.isIterator(iter2)).to.be(false);
    });

    it('empty list', function() {
      var iter = _.iteratorFromList([]);
      expect(_.listFromIterator(iter)).to.eql([]);
    });

    it('non empty', function() {
      var lst = [3,4,3,3,2,1];
      var iter = _.iteratorFromList(lst);
      expect(_.listFromIterator(iter)).to.eql(lst);
    });
  });

  describe('uuid()', function() {
    it('should return a string', function() {
      var id, i = 10;
      while (i-- > 0) {
        id = _.uuid();
        expect(id).to.be.a('string');
        expect(id.length).to.be(36);
      }
    });
  });

  describe('normalizedCell()', function() {
    var fixtures = [
      {
        cell: [ 3, 2, 1 ],
        normalized: [1, 3, 2]
      },
      {
        cell: [ 3 ],
        normalized: [ 3 ]
      },
      {
        cell: [ 3, 4, 7, 1 ],
        normalized: [ 1, 3, 4, 7 ]
      }
    ];

    dataDriven(fixtures, function() {
      it('should return normalized cell', function(ctx) {
        expect(_.normalizedCell(ctx.cell)).to.eql(ctx.normalized);
      });
    });

  });

});
