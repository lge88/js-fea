/*jshint undef: true, unused: true */
/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js'), _ = require(SRC + '/lodash');
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



});
