/*jshint undef: true, unused: true */
/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var fe = require(SRC);

var FeNodeSet = fe.fens.FeNodeSet;
var L2x2 = fe.mesh.L2x2;
var L2 = fe.gcellset.L2;
var LinElIso = fe.property.LinElIso;
var DeforSSLinElBiax = fe.material.DeforSSLinElBiax;//
var GaussRule = fe.integrationrule.GaussRule;
var SparseSystemMatrix = fe.system.matrix.SparseSystemMatrix;
var SparseSystemVector = fe.system.vector.SparseSystemVector;
var mldivide = fe.system.mldivide;
var Field = fe.field.Field;
var EBC = fe.ebc.EBC;
var DeforSS = fe.feblock.DeforSS;
var NodalLoad = fe.nodalload.NodalLoad;
var genISORm = fe.feutils.genISORm;
var matrixEquals = fe.numeric.matrixEquals;

describe('FAESOR Ltract example', function() {

  it('should create model.', function() {

    // parameters:
    var E = 1e7;
    var nu = 0.3;
    var integrationOrder = 2;
    var scale = 1;

    var feb, ir, fens, gcells, mater, prop, ebcs, geom, u;

    var mesh = L2x2();
          // .refineQ4().refineQ4();
    fens = mesh.fens;
    gcells = mesh.gcells;

    prop = new LinElIso({ E: E, nu: nu });

    mater = new DeforSSLinElBiax({
      property: prop,
      reduction: 'stress'
    });

    ir = new GaussRule(2, integrationOrder);

    feb = new DeforSS({
      material: mater,
      gcells: gcells,
      integrationRule: ir,
      rm: genISORm
    });

    geom = new Field({
      name: 'geom',
      fens: fens
    });

    ebcs = [
      {
        id: fens.boxSelect({
          bounds: [0, 0, 0, 1],
          inflate: 1e-4
        }),
        dir: 1,
        value: 0
      },
      {
        id: fens.boxSelect({
          bounds: [0, 1, 0, 0],
          inflate: 1e-4
        }),
        dir: 2,
        value: 0
      },
      {
        id: fens.boxSelect({
          bounds: [0, 1, 1, 1],
          inflate: 1e-4
        }),
        dir: 2,
        value: 0.25
      }
    ].map(function(o) { return new EBC(o); });

    u = new Field({
      name: 'u',
      dim: geom.dim(),
      nfens: geom.nfens(),
      ebcs: ebcs
    });

    var elementMatrices = feb.stiffness(geom, u);
    var neqns = u.neqns();
    var K = new SparseSystemMatrix(neqns, neqns, elementMatrices);
    // console.log("K = ", K.toFull());

    var elementVectors = feb.noneZeroEBCLoads(geom, u);
    // console.log("elementVectors = ", elementVectors);

    var F = new SparseSystemVector(neqns, elementVectors);
    // console.log("F = ", F.toFull());

    var x1 = mldivide(K, F);
    // console.log("x1 = ", x1);

    var x2 = mldivide(K, F.sparseVector().toList());
    // console.log("x2 = ", x2);


    u.scatterSystemVector_(x1);
    var values = u.values();
    // console.log("values = ", values);

    var expected = [
      [-0.05623,0.00000],
      [-0.10050,0.00000],
      [-0.06318,0.10703],
      [-0.02666,0.17392],
      [-0.02529,0.25000],
      [0.00740,0.25000],
      [0.00000,0.25000],
      [0.00000,0.26186]
    ];
    // console.log("expected = ", expected);

    expect(matrixEquals(values, expected, 1e-2)).to.be(true);
    return 0;
  });

});
