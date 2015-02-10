/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var topology = require(SRC + '/geometry.topology.js');
var Topology = topology.Topology;
var hypercubeTopology = topology.hypercubeTopology;
var simplexTopology = topology.simplexTopology;

describe('geometry.topology', function() {
  var f = function(a, b, c) { return new Topology(a, b, c); };
  describe('Topology::constructor(complexes)', function() {

    it('should throw if complexes is not valid.', function() {
      expect(f.bind(null)).to.throwException();
      expect(f.bind(null, [[1]])).to.throwException();
      expect(f.bind(null, [
        [ [0], [1], [2, 3] ]
      ])).to.throwException();
      expect(f.bind(null, [
        [ [0], [1], [2.3] ]
      ])).to.throwException();
      expect(f.bind(null, [
        []
      ])).to.throwException();
    });

    it('should create isolated points', function() {
      var t = f([
        [ [0], [1], [2] ]
      ]);
      expect(t.getDim()).to.be(0);
      expect(t.getNumOfCellsInDim(0)).to.be(3);
      expect(t.getCellSizeInDim(0)).to.be(1);
    });

    it('should create 2 line segments', function() {
      var t = f([
        [ [0], [1], [2] ],
        [ [0, 1], [1, 2]],
      ]);
      expect(t.getDim()).to.be(1);
      expect(t.getNumOfCellsInDim(0)).to.be(3);
      expect(t.getNumOfCellsInDim(1)).to.be(2);
      expect(t.getCellSizeInDim(0)).to.be(1);
      expect(t.getCellSizeInDim(1)).to.be(2);
    });

    it('should create 2 triangles', function() {
      var t = f([
        [ [0], [1], [2], [3] ],
        [ [0, 1], [1, 2], [2, 0], [2, 3], [3, 0] ],
        [ [0, 1, 2], [2, 3, 0]]
      ]);
      expect(t.getDim()).to.be(2);
      expect(t.getNumOfCellsInDim(0)).to.be(4);
      expect(t.getNumOfCellsInDim(1)).to.be(5);
      expect(t.getNumOfCellsInDim(2)).to.be(2);

      expect(t.getCellSizeInDim(0)).to.be(1);
      expect(t.getCellSizeInDim(1)).to.be(2);
      expect(t.getCellSizeInDim(2)).to.be(3);


    });

    it('should create 1 tetrahedron', function() {
      var t = f([
        [ [0], [1], [2], [3] ],
        [ [0, 1], [1, 2], [2, 0], [3, 0], [3, 1], [3, 2] ],
        [ [0, 2, 1], [3, 0, 1], [3, 1, 2], [3, 2, 0] ],
        [ [0, 1, 2, 3] ]
      ]);
      expect(t.getDim()).to.be(3);
      expect(t.getNumOfCellsInDim(0)).to.be(4);
      expect(t.getNumOfCellsInDim(1)).to.be(6);
      expect(t.getNumOfCellsInDim(2)).to.be(4);
      expect(t.getNumOfCellsInDim(3)).to.be(1);

      expect(t.getCellSizeInDim(0)).to.be(1);
      expect(t.getCellSizeInDim(1)).to.be(2);
      expect(t.getCellSizeInDim(2)).to.be(3);
      expect(t.getCellSizeInDim(3)).to.be(4);

      expect(t.toList()).to.eql([
        [ [0], [1], [2], [3] ],
        [ [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3] ],
        [
          [0, 1, 3],
          [0, 2, 1],
          [0, 3, 2],
          [1, 2, 3]
        ],
        [ [0, 1, 2, 3] ]
      ]);

    });

    it('should create 2 quads', function() {
      var t = f([
        [ [0], [1], [2], [3], [4], [5]],
        [ [0, 1], [1, 2], [2, 3], [3, 0], [2, 4], [3, 5], [4, 5] ],
        [ [0, 2, 3, 1], [2, 4, 5, 3] ]
      ]);
      expect(t.getDim()).to.be(2);
      expect(t.getNumOfCellsInDim(0)).to.be(6);
      expect(t.getNumOfCellsInDim(1)).to.be(7);
      expect(t.getNumOfCellsInDim(2)).to.be(2);

      expect(t.getCellSizeInDim(0)).to.be(1);
      expect(t.getCellSizeInDim(1)).to.be(2);
      expect(t.getCellSizeInDim(2)).to.be(4);
    });

    it('should create 1 hexahedron', function() {
      var t = f([
        [ [0], [1], [2], [3], [4], [5], [6], [7] ],
        [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [0, 4], [1, 5], [2, 6], [3, 7],
          [4, 5], [5, 6], [6, 7], [7, 4]
        ],
        [
          [0, 1, 2, 3],
          [4, 5, 6, 7],
          [0, 1, 5, 4],
          [1, 2, 6, 5],
          [2, 3, 7, 6],
          [3, 0, 4, 7]
        ],
        [
          [0, 1, 2, 3, 4, 5, 6, 7]
        ]
      ]);
      expect(t.getDim()).to.be(3);
      expect(t.getNumOfCellsInDim(0)).to.be(8);
      expect(t.getNumOfCellsInDim(1)).to.be(12);
      expect(t.getNumOfCellsInDim(2)).to.be(6);
      expect(t.getNumOfCellsInDim(3)).to.be(1);

      expect(t.getCellSizeInDim(0)).to.be(1);
      expect(t.getCellSizeInDim(1)).to.be(2);
      expect(t.getCellSizeInDim(2)).to.be(4);
      expect(t.getCellSizeInDim(3)).to.be(8);
    });
  });

  describe('Topology::equals(other)', function() {
    it('should work for empty sets', function() {
      var t1 = new Topology([[]], [1]), t2 = new Topology([[]], [1]);
      expect(t1.equals(t2)).to.be(true);
    });

    it('should work for points', function() {
      var t1 = new Topology([
        [ [1], [3], [0], [2] ]
      ]);
      var t2 = new Topology([
        [ [1], [3], [0], [2] ]
      ]);
      var t3 = new Topology([
        [ [1], [3], [4], [2] ]
      ]);
      expect(t1.equals(t2)).to.be(true);
      expect(t1.equals(t3)).to.be(false);
    });

    it('should equals clone', function() {
      var t1 = f([
        [ [0], [1], [2], [3], [4], [5], [6], [7] ],
        [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [0, 4], [1, 5], [2, 6], [3, 7],
          [4, 5], [5, 6], [6, 7], [7, 4]
        ],
        [
          [0, 1, 2, 3],
          [4, 5, 6, 7],
          [0, 1, 5, 4],
          [1, 2, 6, 5],
          [2, 3, 7, 6],
          [3, 0, 4, 7]
        ],
        [
          [0, 1, 2, 3, 4, 5, 6, 7, 8]
        ]
      ]);
      expect(t1.equals(t1.clone())).to.be(true);
    });

    it('should not equal if dim dismatch', function() {
      var t1 = f([ [ [0], [1] ] ]);
      var t2 = f([ [ [0], [1] ], [ [0, 1] ] ]);
      expect(t1.equals(t2)).to.be(false);
    });

    it('should not equal if cellSizes dismatch', function() {
      var t1 = f([
        [ [0], [1], [2], [3] ],
        [ [0, 1], [1, 2], [2, 0], [1, 3], [3, 0] ],
        [ [0, 1, 2], [2, 3, 0]]
      ]);
      var t2 = f([
        [ [0], [1], [2], [3] ],
        [ [0, 1], [1, 2], [2, 3], [3, 0] ],
        [ [0, 1, 2, 3] ]
      ]);
      expect(t1.equals(t2)).to.be(false);
    });

    it('should not equal if indexes dismatch', function() {
      var t1 = f([
        [ [0], [1], [2], [3] ],
        [ [0, 1], [1, 2], [2, 0], [1, 3], [3, 0] ],
        [ [0, 1, 2], [2, 3, 0]]
      ]);
      var t2 = f([
        [ [0], [1], [2], [4] ],
        [ [0, 1], [1, 2], [2, 0], [1, 4], [4, 0] ],
        [ [0, 1, 2], [2, 4, 0]]
      ]);
      expect(t1.equals(t2)).to.be(false);
    });
  });

  describe('Topology::fuse()', function() {
    it('should work with empty set', function() {
      var t1 = Topology([[[0], [1]]]);
      var t2 = Topology([[]], [1]);
      expect(t1.fuse(t2).equals(t1)).to.be(true);
    });

    it('should work with topology of same dimension', function() {
      var t1 = Topology([[[0], [1]]]);
      var t2 = Topology([[[3], [4]]]);
      var t12 = Topology([[[0], [1], [3], [4]]]);
      expect(t1.fuse(t2).equals(t12)).to.be(true);

      var t3 = Topology([
        [[0], [1]],
        [[0, 1]]
      ]);
      var t4 = Topology([
        [[0], [1]],
        [[0, 1]]
      ]);
      var t34 = Topology([
        [[0], [0], [1], [1]],
        [[0, 1], [0, 1]]
      ]);
      expect(t3.fuse(t4).equals(t34)).to.be(true);
    });

    it('should work with topology of different dimension', function() {
      var t1 = Topology([
        [ [0], [1] ]
      ]);
      var t2 = Topology([
        [ [2], [3], [4] ],
        [ [2, 3], [3, 4], [4, 2] ],
        [ [2, 3, 4] ]
      ]);
      var t12 = Topology([
        [ [0], [1], [2], [3], [4] ],
        [ [2, 3], [3, 4], [4, 2] ],
        [ [2, 3, 4] ]
      ]);
      expect(t1.fuse(t2).equals(t12)).to.be(true);
    });

  });

  xdescribe('hypercubeTopology()', function() {
    var f = function(a, b, c) { return new hypercubeTopology(a, b, c); };
    it('hypercubeTopology([[]]) should throw()', function() {
      expect(f.bind(null, [[[0], [1]]])).to.throwException();
    });

    it('hypercubeTopology([[], [], ...], 0) should create points', function() {
      var t = hypercubeTopology([
        [0], [1], [2]
      ], 0);
      expect(t.getDim()).to.be(0);
      expect(t.getNumOfCellsInDim(0)).to.be(3);
    });
  });
});
