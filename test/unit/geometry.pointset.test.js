/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var PointSet = require(SRC + '/geometry.pointset.js').PointSet;

describe('geometry.pointset.js', function() {
  describe('PointSet::constructor()', function() {
    it('([]) & ([[]])', function() {
      var ps1 = new PointSet([]);
      expect(ps1.size).to.be(0); expect(ps1.rn).to.be(0);

      var ps2 = new PointSet([[]]);
      expect(ps2.size).to.be(0); expect(ps2.rn).to.be(0);
    });

    it('([coords1, coords2, ...])', function() {
      var ps = new PointSet([
        [0],
        [1, 2, 3],
        [2, 0],
        [2]
      ]);
      expect(ps.size).to.be(4);
      expect(ps.rn).to.be(3);
      expect(ps.toList()).to.eql([
        [0, 0, 0],
        [1, 2, 3],
        [2, 0, 0],
        [2, 0, 0]
      ]);
    });

    it('(size, rn)', function() {
      var ps = new PointSet(3, 2);
      expect(ps.size).to.be(3);
      expect(ps.rn).to.be(2);
      expect(ps.toList()).to.eql([
        [0, 0],
        [0, 0],
        [0, 0]
      ]);
    });

    it('(size, fn)', function() {
      var ps = new PointSet(3, function(idx) { return [idx+1, idx-1]; });
      expect(ps.size).to.be(3);
      expect(ps.rn).to.be(2);
      expect(ps.toList()).to.eql([
        [1, -1],
        [2, 0],
        [3, 1]
      ]);
    });

  });
});
