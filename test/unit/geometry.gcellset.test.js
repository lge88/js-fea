/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var _ = require(SRC + '/core.utils');
var dataDriven = require('data-driven');
var gcellset = require(SRC + '/geometry.gcellset.js');
var GCellSet = gcellset.GCellSet;
var L2 = gcellset.L2;

// var type = gcellset.type;
// var boundaryGCellSetConstructor = gcellset.boundaryGCellSetConstructor;
// var boundaryCellType = gcellset.boundaryCellType;
// var boundary = gcellset.boundary;
// var dim = gcellset.dim;
// var cellSize = gcellset.cellSize;
// var id = gcellset.id;
// var conn = gcellset.conn;
// var jacobianMatrix = gcellset.jacobianMatrix;
// var bfun = gcellset.bfun;
// var bfundpar = gcellset.bfundpar;
// var bfundsp = gcellset.bfundsp;
// var cat = gcellset.cat;
// var count = gcellset.count;
// var isInParametric = gcellset.isInParametric;
// var map2parametric = gcellset.map2parametric;
// var subset = gcellset.subset;
// var clone = gcellset.clone;
// var updateConnectivity = gcellset.updateConnectivity;

var EXCEPTION = {};
var OK = {};

describe('geometry.gcellset', function() {
  var fixtures = [
    {
      _type: 'L2',
      _init: {
        conn: [
          [ 1, 3 ],
          [ 1, 4 ],
          [ 2, 4 ],
          [ 3, 4 ],
          [ 3, 5 ],
          [ 5, 4 ],
          [ 6, 4 ],
          [ 5, 6 ]
        ],
        otherDimension: 1.0,
        axisSymm: false
      },
      _init_result: OK,

      type: [ { input: null, output: 'L2' } ],
      dim: [ { input: null, output: 1 } ],
      cellSize: [ { input: null, output: 2 } ],
      id: [ { input: null, output: OK } ],

      otherDimension: [ { input: null, output: 1.0 } ],
      axisSymm: [ { input: null, output: false } ],
      conn: [
        {
          input: null ,
          output: [
            [ 1, 3 ],
            [ 1, 4 ],
            [ 2, 4 ],
            [ 3, 4 ],
            [ 3, 5 ],
            [ 5, 4 ],
            [ 6, 4 ],
            [ 5, 6 ]
          ]
        }
      ],

      jacobianMatrix: [
        {
          input: {
            nder: [ [1], [2] ],
            x: [ [2], [2] ]
          },
          output: {
            // TODO:
          }
        }
      ],

      bfun: [
        {
          input: {
            paramCoords: [ 0.8 ]
          },
          output: {
            // TODO:
          }
        }
      ],

      bfundpar: [
        {
          input: {
            paramCoords: [ 0.8 ]
          },
          // TODO:
          output: []
        }
      ],

      bfundsp: [
        // TODO:
        {
          input: [],
          output: []
        }
      ],

      jacobian: [
        {
          input: {
            conn: [1, 3],
            N: [
              [ 1.0 ],
              [ 0.5 ]
            ],
            J: [ [1.0] ],
            x: [
              [ 0.5 ],
              [ 0.0 ],
            ]
          },
          // TODO:
          output: 1.0
        }
      ]

    }
  ];


  var testCases = _(fixtures)
        .map(function(ctx) {
          return _([
            'type',
            'cellSize'
          ])
            .map(function(method) {
              var tcs = ctx[method];
              console.log("method = ", method);
              console.log("tcs = ", tcs);
              tcs.forEach(function(tc) {
                // TODO:
                console.log("tc._type = ", tc._type);
                console.log("gcellset = ", gcellset);

                tc._type = ctx._type;
                tc._init = ctx._init;
                tc._init_result = ctx._init_result;
                console.log("tc._init = ", tc._init);

                tc.instance = new gcellset[tc._type](tc._init);
                tc.method = method;
              });
              return tcs;
            })
            .value();
        })
        .flatten()
        .value();

  console.log("testCases = ", testCases);

  dataDriven(testCases, function() {
    it('{_type}:{method}()', function(ctx) {
      console.log("ctx = ", ctx);

    });

  });

  return;
  xdescribe('common interfaces', function() {
    var fixtures = [
      {
        type: 'L2',
        init: {
          conn: [
            [ 1, 3 ],
            [ 1, 4 ],
            [ 2, 4 ],
            [ 3, 4 ],
            [ 3, 5 ],
            [ 5, 4 ],
            [ 6, 4 ],
            [ 5, 6 ]
          ],
          otherDimension: 1.0,
          axisSymm: 1.0
        },
        jacobianMatrix: {
          input: {
            nder: [ [1], [2] ],
            x: [ [2], [2] ]
          },
          output: {
            // TODO:
          }
        },
        bfunParams: {
          paramCoords: [ 0.8 ]
        },
        bfundparParams: {
          paramCoords: [ 0.8 ]
        },
        jacobianParams: {
          conn: [1, 3],
          N: [
            [ 1.0 ],
            [ 0.5 ]
          ],
          J: [ [1.0] ],
          x: [
            [ 0.5 ],
            [ 0.0 ],
          ]
        }
      }
    ];

    dataDriven(fixtures, function() {
      it('should create {name}() ', function(ctx) {
        ctx.gcellset = new ctx.gcellsetConstructor(ctx.initParams);
      });

      it('should {name}::type() has correct signature', function(ctx) { type(ctx.gcellset); });
      it('should {name}::boundaryGCellSetConstructor() has correct signature', function(ctx) { boundaryGCellSetConstructor(ctx.gcellset); });
      it('should {name}::boundaryCellType() has correct signature', function(ctx) { boundaryCellType(ctx.gcellset); });
      it('should {name}::boundary() has correct signature', function(ctx) { boundary(ctx.gcellset); });
      it('should {name}::dim() has correct signature', function(ctx) { dim(ctx.gcellset); });
      it('should {name}::cellSize() has correct signature', function(ctx) { cellSize(ctx.gcellset); });
      it('should {name}::id() has correct signature', function(ctx) { id(ctx.gcellset); });
      it('should {name}::conn() has correct signature', function(ctx) { conn(ctx.gcellset); });
      it('should {name}::count() has correct signature', function(ctx) { count(ctx.gcellset); });
      it('should {name}::clone() has correct signature', function(ctx) { clone(ctx.gcellset); });

      it('should {name}::jacobianMatrix() has correct signature', function(ctx) {
        jacobianMatrix(ctx.gcellset, ctx.jacobianMatrixParams.nder, ctx.jacobianMatrixParams.x);
      });



      // it('should {name}::jacobianSurface() has correct signature', function(ctx) {
      //   jacobianSurface(ctx.gcellset, ctx.jacobianMatrixParams.nder, ctx.jacobianMatrixParams.x);
      // });
    });


  });


  xdescribe('geometry.gcellset.L2', function() {
    var connList = [
      [ 1, 3 ],
      [ 1, 4 ],
      [ 2, 4 ],
      [ 3, 4 ],
      [ 3, 5 ],
      [ 5, 4 ],
      [ 6, 4 ],
      [ 5, 6 ]
    ];

    var gcells = new L2({
      conn: connList,
      otherDimension: 1.0,
      axisSymm: false
    });

    var jacParams = {
      conn: [1, 3],
      N: [
        [ 1.0 ],
        [ 0.5 ]
      ],
      J: [ [1.0] ],
      x: [
        [ 0.5 ],
        [ 0.0 ],
      ]
    };

    // it('should implement desired interfaces', function() {
    //   expect(gcells.type()).to.be.a('string');

    //   // TODO:
    //   // expect(gcells.boundaryGCellSetConstructor()).to.be.a('function');
    //   // expect(gcells.boundaryCellType()).to.be.a('string');
    //   // expect(gcells.boundary()).to.be.a(GCellSet);

    //   expect(gcells.dim()).to.be.a('number');
    //   expect(gcells.cellSize()).to.a('number');
    //   expect(gcells.id()).to.be.a('string');

    //   expect(gcells.conn()).to.be.a('array');

    //   expect(gcells.otherDimension()).to.be.a('number');
    //   expect(gcells.axisSymm()).to.be.a('boolean');
    //   expect(gcells.dim()).to.be.a('number');

    //   var jac = gcells.jacobian(jacParams.conn, jacParams.N, jacParams.J, jacParams.x);
    //   var jacC = gcells.jacobianCurve(jacParams.conn, jacParams.N, jacParams.J, jacParams.x);
    //   var jacS = gcells.jacobianSurface(jacParams.conn, jacParams.N, jacParams.J, jacParams.x);
    //   var jacV = gcells.jacobianVolumn(jacParams.conn, jacParams.N, jacParams.J, jacParams.x);
    //   var jacD = gcells.jacobianInDim(jacParams.conn, jacParams.N, jacParams.J, jacParams.x, 2);

    //   expect(jac).to.be.a('number');
    //   expect(jacC).to.be.a('number');
    //   expect(jacS).to.be.a('number');
    //   expect(jacV).to.be.a('number');
    //   expect(jacD).to.be.a('number');

    // });

    // it('should return correct values', function() {
    //   expect(conn(gcells)).to.eql(connList.map(_.normalizedCell).sort(_.byLexical));

    //   // expect(otherDimension(gcells)).to.be(1.0);
    //   // expect(axisSymm(gcells)).to.be(false);

    //   expect(dim(gcells)).to.be(1);
    //   expect(cellSize(gcells)).to.be(2);
    //   expect(type(gcells)).to.be('L2');

    //   var jac = gcells.jacobianCurve(jacParams.conn, jacParams.N, jacParams.J, jacParams.x);
    //   expect(jac).to.be(1);
    // });
  });
});
