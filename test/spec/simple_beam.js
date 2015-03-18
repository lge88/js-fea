/*jshint undef: true, unused: true */
/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var fe = require(SRC);

describe('FAESOR simple_beam example', function() {

  it('should create model.', function() {

    var FeNodeSet = fe.fens.FeNodeSet;
    var H8Block = fe.mesh.H8Block;
    var LinElIso = fe.property.LinElIso;
    var DeforSSLinElTriax = fe.material.DeforSSLinElTriax;
    var GaussRule = fe.integrationrule.GaussRule;
    var SparseSystemMatrix = fe.system.matrix.SparseSystemMatrix;
    var SparseSystemVector = fe.system.vector.SparseSystemVector;
    var mldivide = fe.system.mldivide;
    var Field = fe.field.Field;
    var EBC = fe.ebc.EBC;
    var DeforSS = fe.feblock.DeforSS;
    var NodalLoad = fe.nodalload.NodalLoad;
    var ForceIntensity = fe.forceintensity.ForceIntensity;
    var genISORm = fe.feutils.genISORm;
    var matrixEquals = fe.numeric.matrixEquals;
    var sum = fe.numeric.sum;
    var nthColumn = fe.numeric.nthColumn;

    // parameters:
    var E = 1000;
    var nu = 0.0;
    var W = 2.5;
    var H = 5;
    var L = 50;
    var htol = Math.min(L, H, W)/1000;
    var uzex = -12.6;
    var magn = 0.2*uzex/4;
    var Force = magn*W*H*2;

    var nx = 3;
    var mult = 4;
    var ny = mult*nx;
    var nz = 2*nx;

    var feb, febIr, surfaceIr, fens, gcells, mater, prop, ebcs, geom, u;

    var mesh = H8Block(W, L, H, nx, ny, nz);
    fens = mesh.fens();
    gcells = mesh.gcells();
    // console.log("fens = ", fens.xyz());
    // console.log("gcells = ", gcells);
    return;

    prop = new LinElIso({ E: E, nu: nu });

    mater = new DeforSSLinElTriax({
      property: prop
    });

    febIr = new GaussRule(3, 2);

    feb = new DeforSS({
      material: mater,
      gcells: gcells,
      integrationRule: febIr,
      rm: genISORm
    });

    geom = new Field({
      name: 'geom',
      fens: fens
    });

    ebcs = [
      {
        id: fens.boxSelect({
          bounds: [0, W, 0, 0, 0, H],
          inflate: 1e-4
        }),
        dir: [1, 2, 3],
        value: 0
      },
      {
        id: fens.boxSelect({
          bounds: [W, W, 0, L, 0, H],
          inflate: 1e-4
        }),
        dir: 1,
        value: 0
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
    console.log("neqns = ", neqns);

    var K = new SparseSystemMatrix(neqns, neqns, elementMatrices);
    console.log("K = ", K.toFull());

    var fi = new ForceIntensity({ magn: [0, 0, magn] });
    var bdryGcells = gcells.boundary();
    var bcl = bdryGcells.boxSelect(fens, {
      bounds: [0, W, L, L, 0, H],
      inflate: htol
    });
    var lfeb = new DeforSS({
      mater: mater,
      gcells: bdryGcells.subset(bcl),
      integrationRule: surfaceIr
    });

    var elementVectors = lfeb.distributeLoads(geom, u, fi, 2);
    console.log("elementVectors = ", elementVectors);

    var F = new SparseSystemVector(neqns, elementVectors);
    console.log("F = ", F.toFull());

    var x = mldivide(K, F);
    console.log("x = ", x);

    u.scatterSystemVector_(x);
    var values = u.values();
    console.log("values = ", values);

    var freeendNids = fens.boxSelect({
      bounds: [0, W, L, L, 0, H],
      inflate: 1e-4
    });

    var uv = u.gatherValuesMatrix(freeendNids);
    var uz = sum(nthColumn(uv, 3))/freeendNids.length;
    console.log("uz = ", uz);

    var uzExpected = -9.4;
    console.log("uzExpected = ", uzExpected);

    expect(Math.abs(uz - uzExpected) < 1e-4).to.be(true);
    return 0;
  });

});
