/*jshint undef: true, unused: true */
/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var _ = require(SRC + '/core.utils.js');

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

  describe('byLexical()', function() {
    it('should sort list of vectors by lexical', function() {
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
  });
});
