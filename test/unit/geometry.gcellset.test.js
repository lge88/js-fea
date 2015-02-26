/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var dataDriven = require('data-driven');

var _ = require(SRC + '/core.utils');
var assert = _.assert;
var check = _.check;
var matrixOfDimension = _.contracts.matrixOfDimension;
var vectorOfDimension = _.contracts.vectorOfDimension;

var gcellset = require(SRC + '/geometry.gcellset.js');

var EXCEPTION = {};
var DONT_CARE = {};

describe('geometry.gcellset', function() {
  var fixtures = [
    {
      desc: 'should fail if conn is of wrong dimension',
      _type: 'L2',
      _init_params: [
        {
          conn: [
            [ 1, 3 ],
            [ 1 ],
            [ 2, 4 ]
          ],
          otherDimension: 1.0,
          axisSymm: false
        }
      ],
      _init_output: EXCEPTION
    },
    {
      _type: 'L2',
      _init_params: [
        {
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
        }
      ],
      _init_output: DONT_CARE,

      type: [ { input: null, output: 'L2' } ],
      dim: [ { input: null, output: 1 } ],
      cellSize: [ { input: null, output: 2 } ],
      id: [ { input: null, outputContract: assert.string } ],

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
            // FIXME: topology resorts the cell indices..
            // [ 5, 4 ],
            [ 4, 5 ],
            // [ 6, 4 ],
            [ 4, 6 ],
            [ 5, 6 ]
          ]
        }
      ],

      jacobianMatrix: [
        {
          input: [
            [ [1], [2] ],
            [ [2], [2] ]
          ],
          outputContract: matrixOfDimension(1, 1),
          output: null
        }
      ],

      bfun: [
        {
          input: [
            [ 0.8 ]
          ],
          output: null
        }
      ],

      bfundpar: [
        {
          input: [
            [ 0.8 ]
          ],
          // TODO:
          output: null
        }
      ],

      bfundsp: [
        // TODO:
        {
          input: [],
          output: null
        }
      ],

      jacobian: [
        {
          input: [
            [1, 3],
            [
              [ 1.0 ],
              [ 0.5 ]
            ],
            [ [1.0] ],
            [
              [ 0.5 ],
              [ 0.0 ],
            ]
          ],
          output: 1.0
        }
      ]

    }
  ];


  var testCases = _(fixtures)
        .map(function(ctx) {
          var type = ctx._type;
          var Constr = gcellset[type];
          var initParams = ctx._init_params;
          var create = function(a, b, c, d, e) {
            return new Constr(a, b, c, d, e);
          };

          if (ctx._init_output === EXCEPTION) {
            return [
              {
                instance: null,
                type: type,
                method: 'constructor',
                input: initParams,
                output: EXCEPTION,
                fn: create,
                desc: ctx.desc
              }
            ];
          }

          // console.log("initParams = ", initParams);
          var ins = create.apply(null, initParams);
          var methods = Object
                .keys(ctx)
                .filter(function(k) {
                  return !(/^_/.test(k));
                });

          return _(methods)
            .map(function(method) {
              return ctx[method].map(function(io) {
                var out = {
                  instance: ins,
                  type: type,
                  method: method,
                  input: io.input,
                  output: io.output,
                  outputContract: io.outputContract,
                  desc: check.string(io.desc) ? io.desc : ''
                };
                out.fn = out.instance[method];

                // TODO handle vec/matrix equals:
                // out.equals = ...


                return out;
              });
            })
            .value();
        })
        .flatten()
        .value();

  dataDriven(testCases, function() {
    it('{type}:{method}() {desc}', function(ctx) {
      if (ctx.output === EXCEPTION) {
        var fn = function() {
          return ctx.fn.apply(ctx.instance, ctx.input);
        };
        expect(fn).to.throwException();
      } else {
        var res;
        if (check.assigned(ctx.outputContract)) {
          res = ctx.fn.apply(ctx.instance, ctx.input);
          expect(ctx.outputContract.bind(null, res)).not.to.throwException();
        }

        if (check.assigned(ctx.output) && ctx.output !== DONT_CARE) {
          res = ctx.fn.apply(ctx.instance, ctx.input);

          var equals = ctx.equals;
          if (check.function(equals)) {
            expect(ctx.equals(res, ctx.output)).to.be(true);
          } else {
            if (check.array(res) || check.object(res))
              expect(res).to.eql(ctx.output);
            else
              expect(res).to.be(ctx.output);
          }
        }
      }
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
