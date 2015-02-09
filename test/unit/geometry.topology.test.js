/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var topology = require(SRC + '/geometry.topology.js');
var Topology = topology.Topology;
var hypercubeTopology = topology.hypercubeTopology;
var simplexTopology = topology.simplexTopology;

describe('geometry.topology', function() {
  describe('Topology::constructor(complexes)', function() {
    var f = function(a, b, c) { return new Topology(a, b, c); };

    it('should throw if complexes is not valid.', function() {
      expect(f.bind(null)).to.throwException();
      expect(f.bind(null, [[1]])).to.throwException();
      expect(f.bind(null, [
        [ [0], [1], [2, 3] ]
      ])).to.throwException();
    });

    it('should create isolated points', function() {
      var t = f([
        [ [0], [1], [2] ]
      ]);
      expect(t.getDim()).to.be(0);
      expect(t.getNumOfCellsInDim(0)).to.be(3);
    });

    it('should create 2 line segments', function() {
      var t = f([
        [ [0], [1], [2] ],
        [ [0, 1], [1, 2]],
      ]);
      expect(t.getDim()).to.be(1);
      expect(t.getNumOfCellsInDim(0)).to.be(3);
      expect(t.getNumOfCellsInDim(1)).to.be(2);
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
    });

    it('should create 1 tetrahedron', function() {
      var t = f([
        [ [0], [1], [2], [3] ],
        [ [0, 1], [1, 2], [2, 0], [3, 0], [3, 1], [3, 2] ],
        [ [0, 2, 1], [3, 0, 1], [3, 1, 2], [3, 2, 0] ]
      ]);
      expect(t.getDim()).to.be(2);
      expect(t.getNumOfCellsInDim(0)).to.be(4);
      expect(t.getNumOfCellsInDim(1)).to.be(5);
      expect(t.getNumOfCellsInDim(2)).to.be(2);
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
    });

    it('should create 1 hexahedron', function() {
      var t = f([
        [ [0], [1], [2], [3], [4], [5], [6], [7], [8] ],
        [ [0, 1], [1, 2], [2, 3], [3, 0],
          [0, 4], [1, 5], [2, 6], [3, 7],
          [4, 5], [5, 6], [6, 7], [7, 4] ]
        [ [0, 2, 3, 1], [2, 4, 5, 3] ]
      ]);
      expect(t.getDim()).to.be(2);
      expect(t.getNumOfCellsInDim(0)).to.be(6);
      expect(t.getNumOfCellsInDim(1)).to.be(7);
      expect(t.getNumOfCellsInDim(2)).to.be(2);
    });
  });

  describe('hypercubeTopology()', function() {
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
