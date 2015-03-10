/* global: fe */
var FeNodeSet = fe.fens.FeNodeSet;
var L2 = fe.gcellset.L2;
var LinElIso = fe.property.LinElIso;
var DeforSSLinElUniax = fe.material.DeforSSLinElUniax;
var GaussRule = fe.integrationrule.GaussRule;
var SparseSystemMatrix = fe.system.matrix.SparseSystemMatrix;
var SparseSystemVector = fe.system.vector.SparseSystemVector;
var mldivide = fe.system.mldivide;
var Field = fe.field.Field;
var EBC = fe.ebc.EBC;
var DeforSS = fe.feblock.DeforSS;
var NodalLoad = fe.nodalload.NodalLoad;
var genISORm = fe.feutils.genISORm;
var log = fe.io.log;

// parameters:
var E = 1e7;
var integrationOrder = 1;

var feb, fens, gcells, mater, prop, fixedSupport, geom, u;

fens = new FeNodeSet({
  xyz: [
    [0, 0],
    [0, 40],
    [40, 0],
    [40, 40],
    [80, 0],
    [80, 40]
  ]
});

gcells = new L2({
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
  otherDimension: 1.5
});

prop = new LinElIso({ E: E, nu: 0.0 });

mater = new DeforSSLinElUniax({
  property: prop
});

var ir = new GaussRule(1, integrationOrder);

geom = new Field({
  name: 'geom',
  fens: fens
});

fixedSupport = new EBC({
  id: [1, 2],
  dir: [1, 2],
  value: 0
});

u = new Field({
  name: 'u',
  dim: geom.dim(),
  nfens: geom.nfens(),
  ebcs: [ fixedSupport ]
});

feb = new DeforSS({
  material: mater,
  gcells: gcells,
  integrationRule: ir,
  rm: genISORm
});

var elementMatrices = feb.stiffness(geom, u);
var neqns = u.neqns();
var K = new SparseSystemMatrix(neqns, neqns, elementMatrices);
// console.log("K = ", K.toFull());

var nodalLoads = [
  { id: 3, dir: 2, magn: -2000 },
  { id: 5, dir: 1, magn: +2000 },
  { id: 6, dir: 1, magn: +4000 },
  { id: 6, dir: 2, magn: +6000 },
].map(function(item) {
  return new NodalLoad(item);
});

var elementVectors = nodalLoads
      .map(function(nl) {
        return nl.loads(u);
      })
      .reduce(function(sofar, ev) {
        return sofar.concat(ev);
      }, []);

var F = new SparseSystemVector(neqns, elementVectors);
// console.log("F = ", F.toFull());

// var x = mldivide(K.dokMatrix(), F.sparseVector());
var x1 = mldivide(K, F);
// console.log("x1 = ", x1);

var x2 = mldivide(K, F.sparseVector().toList());
// console.log("x2 = ", x2);

u.scatterSystemVector_(x1);
var values = u.values();
// console.log("values = ", values);

// var expected = [
//   [0, 0],
//   [0, 0],
//   [0.0213, 0.0408],
//   [-0.0160, 0.0462],
//   [0.0427, 0.1501],
//   [-0.0053, 0.1661],
// ];
// console.log("expected = ", expected);

log('nodal displacements:\n');
log(JSON.stringify(values, null, 2));
