/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var _ = require(SRC + '/core.utils');
var cloneDeep = _.cloneDeep;
var normalizedCell = _.normalizedCell;
var byLexical = _.byLexical;
var dataDriven = require('data-driven');
var topology = require(SRC + '/geometry.topology.js');
var Topology = topology.Topology;
var hypercube = topology.hypercube;
var hypercubeBoundary = topology.hypercubeBoundary;
var simplex = topology.simplex;

function normalizeEql(computed, expected) {
  computed = computed.slice().map(function(cell) {
    return normalizedCell(cell);
  }).sort(byLexical);
  expected = expected.slice().map(function(cell) {
    return normalizedCell(cell);
  }).sort(byLexical);
  expect(computed).to.eql(expected);
}

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
      // expect(f.bind(null, [
      //   []
      // ])).to.throwException();
    });

    it('should create isolated points', function() {
      var t = f([
        [ [0], [1], [2] ]
      ]);
      expect(t.getDim()).to.be(0);
      expect(t.getNumOfCellsInDim(0)).to.be(3);
      expect(t.getCellSizeInDim(0)).to.be(1);
      expect(t.getPointIndices()).to.eql([0, 1, 2]);

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
      ], 'P1L2T3T4');
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
      ], 'P1L2T3T4');
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
        [ [0, 1], [1, 2], [2, 0], [3, 0], [3, 1], [3, 2] ],
        [ [0, 2, 1], [3, 0, 1], [3, 1, 2], [3, 2, 0] ],
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
      var t1 = new Topology([[]]), t2 = new Topology([[]]);
      expect(t1.equals(t2)).to.be(true);
    });

    it('should work for different family', function() {
      var t1 = new Topology([[ [0] ]], 'P1L2T3T4');
      var t2 = new Topology([[ [0] ]], 'P1L2Q4H8');
      expect(t1.equals(t2)).to.be(false);
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
          [0, 1, 2, 3, 4, 5, 6, 7]
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
      ], 'P1L2T3T4');
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
      ], 'P1L2T3T4');
      var t2 = f([
        [ [0], [1], [2], [4] ],
        [ [0, 1], [1, 2], [2, 0], [1, 4], [4, 0] ],
        [ [0, 1, 2], [2, 4, 0]]
      ], 'P1L2T3T4');
      expect(t1.equals(t2)).to.be(false);
    });
  });

  describe('Topology::normalized', function() {
    var dataset = [
      {
        input: [
          [ [3], [1], [0], [2] ],
          [ [0, 1], [1, 2], [2, 3], [3, 0] ],
          [ [2, 3, 0, 1] ]
        ],
        output: [
          [ [0], [1], [2], [3] ],
          [ [0, 1], [0, 3], [1, 2], [2, 3] ],
          [ [0, 1, 2, 3] ]
        ]
      }
    ];

    dataDriven(dataset, function() {
      it('should work {desc}', function(ctx) {
        var t1 = new Topology(ctx.input);
        var t2 = new Topology(ctx.output);
        expect(t1.normalized().equals(t2)).to.be(true);
      });
    });
  });

  xdescribe('Topology::fuse()', function() {
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

  describe('hypercube(conn, dim)', function() {
    var casesShouldWork = [
      {
        desc: 'points made of P1',
        conn: [
          [1], [2], [3], [4]
        ],
        dim: 0,
        expectedComplexes: [
          [ [1], [2], [3], [4] ]
        ]
      },
      {
        desc: 'points from a flatten indices',
        conn: [
          1, 2, 3, 4
        ],
        dim: 0,
        expectedComplexes: [
          [ [1], [2], [3], [4] ]
        ]
      },
      {
        desc: 'A line made of L2',
        conn: [
          [1, 2]
        ],
        dim: 1,
        expectedComplexes: [
          [ [1], [2] ],
          [ [1, 2] ]
        ]
      },
      {
        desc: 'A triangle made of L2',
        conn: [
          [1, 2],
          [3, 2],
          [1, 3]
        ],
        dim: 1,
        expectedComplexes: [
          [ [1], [2], [3] ],
          [ [1, 2], [3, 2], [1, 3] ]
        ]
      },
      {
        desc: 'A quad made of L2',
        conn: [
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 1]
        ],
        dim: 1,
        expectedComplexes: [
          [ [1], [2], [3], [4] ],
          [ [1, 2], [2, 3], [3, 4], [4, 1] ]
        ]
      },
      {
        desc: '2 quads made of Q4',
        conn: [
          [1, 2, 4, 3],
          [3, 4, 6, 5]
        ],
        dim: 2,
        expectedComplexes: [
          [ [1], [2], [3], [4], [5], [6] ],
          [ [1, 2], [2, 4], [4, 3], [3, 1], [4, 6], [6, 5], [5, 3] ],
          [ [1, 2, 4, 3], [3, 4, 6, 5] ]
        ]
      },
      {
        desc: '2 brick made of H8',
        conn: [
          [1, 2, 5, 6, 7, 8, 11, 12],
          [2, 3, 4, 5, 8, 9, 10, 11]
        ],
        dim: 3,
        expectedComplexes: [
          [
            [1], [2], [3], [4], [5], [6],
            [7], [8], [9], [10], [11], [12]
          ],
          [
            [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1], [2, 5],
            [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 7], [8, 11],
            [1, 7], [6, 12], [2, 8], [5, 11], [3, 9], [4, 10]
          ],
          [
            [1, 6, 5, 2], [1, 2, 8, 7], [2, 5, 11, 8], [5, 6, 12, 11], [1, 7, 12, 6], [7, 8, 11, 12],
            [2, 5, 4, 3], [2, 3, 9, 8], [3, 4, 10, 9], [4, 5, 11, 10], [2, 8, 11, 5], [8, 9, 10, 11]
          ],
          [
            [1, 2, 5, 6, 7, 8, 11, 12],
            [2, 3, 4, 5, 8, 9, 10, 11]
          ]
        ]
      },
    ];

    dataDriven(casesShouldWork, function() {
      it('should work for dim = {dim} {desc}', function(ctx) {
        var resultTopology = hypercube(ctx.conn, ctx.dim).normalized();
        var expectedTopology = (new Topology(ctx.expectedComplexes)).normalized();
        expect(resultTopology.equals(expectedTopology)).to.be(true);
      });
    });

  });

  describe('Topology#skeleton', function() {
    var t = hypercube([ [0,1,2,3,4,5,6,7] ], 3).normalized();

    it('#skeleton(3+)', function() {
      expect(t.skeleton(3).equals(t)).to.be(true);
      expect(t.skeleton(4).equals(t)).to.be(true);
    });

    it('#skeleton()/#skeleton(2)', function() {
      var expected = hypercube([
        [0, 3, 2, 1],
        [1, 2, 6, 5],
        [2, 3, 7, 6],
        [3, 0, 4, 7],
        [0, 1, 5, 4],
        [4, 5, 6, 7]
      ] ,2).normalized();
      expect(t.skeleton().equals(expected)).to.be(true);
      expect(t.skeleton(2).equals(expected)).to.be(true);
    });

    it('#skeleton(1)', function() {
      var expected = hypercube([
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],

        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4],

        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7]
      ] ,1).normalized();
      expect(t.skeleton(1).equals(expected)).to.be(true);
    });

    it('#skeleton(0)', function() {
      var expected = hypercube([
        [0],
        [1],
        [2],
        [3],
        [4],
        [5],
        [6],
        [7]
      ] ,0).normalized();
      expect(t.skeleton(0).equals(expected)).to.be(true);
    });
  });

  describe('Topoloy#boundary', function() {
    describe('P1L2Q4H8 family', function() {
      it('should work for hybercube1', function() {
        var t = hypercube([ [0, 1] ], 1);
        var bdry = t.boundary().normalized();
        var expected = hypercube([ [0], [1] ], 0).normalized();
        expect(bdry.equals(expected)).to.be(true);
      });

      it('should work for one hybercube2', function() {
        var t = hypercube([ [1, 2, 3, 4] ], 2);
        var bdry = t.boundary().normalized();
        var expected = hypercube([
          [1, 2], [2, 3], [3, 4], [1, 4]
        ], 1).normalized();
        expect(bdry.equals(expected)).to.be(true);
      });

      it('should work for two hybercube2', function() {
        var t = hypercube([ [1, 2, 3, 4], [4, 3, 6, 5] ], 2);
        var bdry = t.boundary().normalized();
        var expected = hypercube([
          [1, 2], [2, 3], [1, 4], [3, 6], [5, 6], [5, 4]
        ], 1).normalized();
        expect(bdry.equals(expected)).to.be(true);
      });

      it('should work for one hybercube3', function() {
        var t = hypercube([ [1, 2, 3, 4, 5, 6, 7, 8] ], 3);
        var bdry = t.boundary().normalized();
        var expected = hypercube([
          [2, 1, 4, 3],
          [5, 6, 7, 8],
          [2, 3, 7, 6],
          [3, 4, 8, 7],
          [4, 1, 5, 8],
          [2, 6, 5, 1]
        ], 2).normalized();
        expect(bdry.equals(expected)).to.be(true);
      });

      it('should work for two hybercube3', function() {
        var t = hypercube([
          [1, 2, 3, 4, 5, 6, 7, 8],
          [5, 6, 7, 8, 9, 10, 11, 12]
        ], 3);
        var bdry = t.boundary().normalized();
        var expected = hypercube([
          [2, 1, 4, 3],

          [2, 3, 7, 6],
          [3, 4, 8, 7],
          [4, 1, 5, 8],
          [2, 6, 5, 1],

          [6, 7, 11, 10],
          [7, 8, 12, 11],
          [8, 5, 9, 12],
          [5, 6, 10, 9],

          [9, 10, 11, 12]
        ], 2).normalized();
        expect(bdry.equals(expected)).to.be(true);
      });

    });

  });
});
