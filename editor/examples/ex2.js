/*global fe */
var L2x2 = fe.mesh.L2x2;
var DeforSS = fe.feblock.DeforSS;
var LinElIso = fe.property.LinElIso;
var DeforSSLinElBiax = fe.material.DeforSSLinElBiax;
var Field = fe.field.Field;
var EBC = fe.ebc.EBC;
var GaussRule = fe.integrationrule.GaussRule;
var genISORm = fe.feutils.genISORm;
var SparseSystemMatrix = fe.system.matrix.SparseSystemMatrix;
var SparseSystemVector = fe.system.vector.SparseSystemVector;
var mldivide = fe.system.mldivide;

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

var x = mldivide(K, F);
// console.log("x = ", x);

u.scatterSystemVector_(x);
var values = u.values();
// console.log("values = ", values);

// var expected = [
//   [-0.05623,0.00000],
//   [-0.10050,0.00000],
//   [-0.06318,0.10703],
//   [-0.02666,0.17392],
//   [-0.02529,0.25000],
//   [0.00740,0.25000],
//   [0.00000,0.25000],
//   [0.00000,0.26186]
// ];
// console.log("expected = ", expected);

fe.io.log('nodal displacements:\n');
fe.io.log(JSON.stringify(values, null, 2));
