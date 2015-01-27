/*jshint undef: true, unused: true */
/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var _ = require(SRC + '/core.utils.js');

describe('core.utils', function() {
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
