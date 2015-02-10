var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var fe = require(SRC);
var _ = fe._;
var expect = require('expect.js');

var creator = new fe.geometry.HypercubeGeometryCreator();
var geo = creator.domain([
  [0, 0.5 * Math.PI],
  [0.5, 1]
], [
  10, 5
]).map(function(p) {
  var theta = p[0], rho = p[1];
  var x, y;
  if (Math.abs(rho - 1.0) < 1e-6) {
    if (theta <= 0.25*Math.PI) {
      x = 1.0;
      y = Math.tan(theta);
    } else {
      x = 1.0 / Math.tan(theta);
      y = 1.0;
    }
  } else {
    x = Math.cos(theta) * rho;
    y = Math.sin(theta) * rho;
  }
  return [x, y];
});

function selectNodeIds(g, box) {
  return _.flatten(g.boxSelect(box).getCellsInDim(0));
}

var bottomNodes = selectNodeIds(geo, [ [-Infinity, Infinity], [-1e-5, 1e-5] ]);
var leftNodes = selectNodeIds(geo, [ [-1e-5, 1e-5], [-Infinity, Infinity] ]);

var E = 1000;
var nu = 0.4999;
var fens = new fe.fenodeset.FeNodeSet(geo.pointset);
var gcells = new fe.gcellset.FeGCellSet(geo.topology.getMaxCells());
var prop  = new fe.property.LinearElasticIso({ E: E, nu: nu });
var mater = new fe.material.DeformSmallStrainLinearElasticTriax({ property: prop });
var feb = new fe.feblock.DeformSmallStrain({
  material: mater,
  gcells: gcells,
  integrationRule: new fe.integrationrule.GaussRule(3, 2)
});

var geom = new fe.field.Field({ name: 'geom', dim: 3, fens: fens });
var u = geom.multiply(0.0);

var ebcXYFixed = new fe.ebc.EBC({
  components: [0, 1],
  values: 0
});

var ebcXFixed = new fe.ebc.EBC({
  components: [0],
  values: 0
});

u = u.applyEBC(bottomNodes, ebcXYFixed);
u = u.applyEBC(leftNodes, ebcXFixed);
u = u.numberEquations();

var K = new fe.matrix.DokSparseMatrix();
K = fe.solve.assemble(K, fe.solve.stiffness(feb, geom, u));
