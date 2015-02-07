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

  describe('PointSet::get(index)', function() {
    var ps = new PointSet([[1,2], [2,4,0]]);
    it('should throw error if the index out of bounds', function() {
      expect(ps.get.bind(ps, -1)).to.throwException();
      expect(ps.get.bind(ps, 2)).to.throwException();
    });

    it('should return an array of rn numbers', function() {
      var point0 = ps.get(0);
      expect(point0.length).to.be(ps.rn);
      expect(point0).to.eql([1, 2, 0]);
    });

    it('should return a copy of coords instead of reference.', function() {
      var point1 = ps.get(1);
      point1[0] = 100; point1[1] = 100; point1[2] = 100;

      var point1Again = ps.get(1);
      expect(point1Again).to.eql([2, 4, 0]);
    });
  });


  describe('PointSet::set(index, point)', function() {
    var ps = new PointSet([[1,2], [2,4,0]]);
    it('should throw error if the index out of bounds', function() {
      expect(ps.set.bind(ps, -1, [3,3,4])).to.throwException();
      expect(ps.set.bind(ps, 2, [3,3,3])).to.throwException();
    });

    it('should throw error if the point dimension is not matched', function() {
      expect(ps.set.bind(ps, 0, [3,3])).to.throwException();
      expect(ps.set.bind(ps, 0, [])).to.throwException();
    });

    it('should set the coords', function() {
      ps.set(0, [5, 5, 5]);

      var point0 = ps.get(0);
      expect(point0.length).to.be(ps.rn);
      expect(point0).to.eql([5, 5, 5]);
    });
  });

  describe('PointSet::clone()', function() {
    var ps1, ps2;
    it('should clone', function() {
      ps1 = new PointSet([[1, 2], [3, 4, 5]]);
      ps2 = ps1.clone();
    });

    it('should clone be the same', function() {
      expect(ps1.equals(ps2)).to.be(true);
    });

    it('should not reference same object', function() {
      ps1.set(0, [5, 5, 5]);
      expect(ps1.get(0)).to.eql([5, 5, 5]);
      expect(ps2.get(0)).to.eql([1, 2, 0]);
    });
  });

  describe('PointSet::equals(other)', function() {
    it('should equal', function() {
      var ps1 = new PointSet([[1, 2], [3, 4, 5]]);
      var ps2 = new PointSet([[1, 2, 0], [3, 4, 5]]);
      expect(ps1.equals(ps2)).to.be(true);

      var ps3 = new PointSet([]);
      var ps4 = new PointSet([]);
      expect(ps3.equals(ps4)).to.be(true);
    });

    it('should not equal', function() {
      var ps1 = new PointSet([[1, 2], [3, 4, 5]]);
      var ps2 = new PointSet([[1, 2, 4], [3, 4, 5]]);
      expect(ps1.equals(ps2)).to.be(false);

      var ps3 = new PointSet([[1, 2]]);
      var ps4 = new PointSet([[1, 2, 0]]);
      expect(ps3.equals(ps4)).to.be(false);
    });
  });

  describe('PointSet::forEach(iterator)', function() {
    it('should do nothing if point set is empty', function() {
      var ps = new PointSet([[]]), called = false;
      ps.forEach(function(p, i) { called = true; });
      expect(called).to.be(false);
    });

    var lst, ps;
    it('should iterate over all points', function() {
      lst = [], ps = new PointSet([[0, 1], [1], [3, 3, 5]]);
      ps.forEach(function(p, i) {
        lst.push({ index: i, point: p });
      });
      expect(lst).to.eql([
        {index: 0, point: [0, 1, 0]},
        {index: 1, point: [1, 0, 0]},
        {index: 2, point: [3, 3, 5]}
      ]);
    });

    it('should point be copy not reference', function() {
      lst[0].point[0] = 5, lst[0].point[1] = 5, lst[0].point[2] = 5;
      expect(ps.get(0)).to.eql([0, 1, 0]);
    });
  });

  describe('PointSet::map(transform)', function() {
    var ps1 = new PointSet([[1], [2, 3], [4, 5, 6]]);
    var ps2 = ps1.map(function(p, i) {
      return p.map(function(x) { return x*2; });
    });

    it('should return a correct pointset', function() {
      expect(ps2.toList()).to.eql([
        [2, 0, 0],
        [4, 6, 0],
        [8, 10, 12]
      ]);
    });

    it('should return copy not reference', function() {
      ps2.set(0, [7, 7, 8]);
      expect(ps1.get(0)).to.eql([1, 0, 0]);
    });

  });


});
