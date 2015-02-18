/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var _ = require(SRC + '/core.utils');
var gcellset = require(SRC + '/geometry.gcellset.js');
var L2 = gcellset.L2;

describe('geometry.gcellset', function() {
  describe('geometry.gcellset.L2', function() {
    var conn = [
      [ 1, 3 ],
      [ 1, 4 ],
      [ 2, 4 ],
      [ 3, 4 ],
      [ 3, 5 ],
      [ 5, 4 ],
      [ 6, 4 ],
      [ 5, 6 ]
    ];

    var gcells = new L2(conn, 1.0, false);

    expect(gcells.conn()).to.eql(conn.map(_.normalizedCell).sort(_.byLexical));
    expect(gcells.otherDimension()).to.be(1.0);
    expect(gcells.axisSymm()).to.be(false);
    expect(gcells.dim()).to.be(1);
    expect(gcells.cellSize()).to.be(2);
    expect(gcells.type()).to.be('L2');

    var jac = gcells.jacobianCurve(
      [ 1, 3 ],
      [
        [ 1.0 ],
        [ 0.5 ]
      ],
      [
        [ 1.0 ],
      ],
      [
        [ 0.5 ],
        [ 0.0 ],
      ]
    );
    expect(jac).to.be(1);
  });
});
