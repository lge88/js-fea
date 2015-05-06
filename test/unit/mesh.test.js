/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var dataDriven = require('data-driven');
var mesh = require(SRC + '/mesh.js');

describe('mesh', function() {

  describe('#L2Block()', function() {
    var L2Block = mesh.L2Block;
    it('L2Block(5, 5)', function() {
      var l2 = L2Block(5, 5);
      var xyzExpected = [[0], [1], [2], [3], [4], [5]];
      var connExpected = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5]
      ];
      expect(l2.fens().xyz()).to.eql(xyzExpected);
      expect(l2.gcells().conn()).to.eql(connExpected);
    });
  });


  describe('#Q4Block()', function() {
    var Q4Block = mesh.Q4Block;
    it('Q4Block(2, 2)', function() {
      var q4 = Q4Block(4, 2, 2, 2);
      var xyzExpected = [
        [0, 0],
        [2, 0],
        [4, 0],
        [0, 1],
        [2, 1],
        [4, 1],
        [0, 2],
        [2, 2],
        [4, 2],
      ];
      var connExpected = [
        [0, 1, 4, 3],
        [1, 2, 5, 4],
        [3, 4, 7, 6],
        [4, 5, 8, 7]
      ];

      expect(q4.fens().xyz()).to.eql(xyzExpected);
      expect(q4.gcells().conn()).to.eql(connExpected);
    });
  });

  describe('#H8Block()', function() {
    var H8Block = mesh.H8Block;
    var dataset = [
      {
        w: 1, l: 1, h: 1,
        nx: 1, ny: 1, nz: 1,
        desc: 'single block',
        expectedXYZ: [
          [ 0, 0, 0 ],
          [ 1, 0, 0 ],
          [ 0, 1, 0 ],
          [ 1, 1, 0 ],
          [ 0, 0, 1 ],
          [ 1, 0, 1 ],
          [ 0, 1, 1 ],
          [ 1, 1, 1 ]
        ],
        expectedConn: [
          [ 0, 1, 3, 2, 4, 5, 7, 6 ]
        ]
      },
      {
        w: 1, l: 1, h: 1,
        nx: 1, ny: 1, nz: 2,
        desc: 'two block',
        expectedXYZ: [
          [ 0, 0, 0 ],
          [ 1, 0, 0 ],
          [ 0, 1, 0 ],
          [ 1, 1, 0 ],

          [ 0, 0, 0.5 ],
          [ 1, 0, 0.5 ],
          [ 0, 1, 0.5 ],
          [ 1, 1, 0.5 ],

          [ 0, 0, 1 ],
          [ 1, 0, 1 ],
          [ 0, 1, 1 ],
          [ 1, 1, 1 ],
        ],
        expectedConn: [
          [ 0, 1, 3, 2, 4, 5, 7, 6 ],
          [ 4, 5, 7, 6, 8, 9, 11, 10 ]
        ]
      }
    ];

    dataDriven(dataset, function() {
      it('should work {desc}', function(ctx) {
        var m = H8Block(ctx.w, ctx.l, ctx.h, ctx.nx, ctx.ny, ctx.nz);
        var xyz = m.fens().xyz();
        var conn = m.gcells().conn();
        expect(xyz).to.eql(ctx.expectedXYZ);
        expect(conn).to.eql(ctx.expectedConn);
      });
    });
  });


  describe('Mesh#map', function() {

    it('should work with proper mapping function', function() {
      var H8Block = mesh.H8Block;
      var m1 = H8Block(1,1,1,1,1,1);
      var m2 = m1.map(function(xyz) {
        return [
          xyz[0] + 1,
          xyz[1] + 2,
          xyz[2] + 3,
        ];
      });

      expect(m2.fens().xyz()).to.eql([
        [ 1, 2, 3 ],
        [ 2, 2, 3 ],

        [ 1, 3, 3 ],
        [ 2, 3, 3 ],

        [ 1, 2, 4 ],
        [ 2, 2, 4 ],
        [ 1, 3, 4 ],
        [ 2, 3, 4 ]
      ]);

      expect(m2.gcells().conn()).to.eql([ [ 0, 1, 3, 2, 4, 5, 7, 6 ] ]);
    });

  });


});
