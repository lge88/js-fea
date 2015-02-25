/*jshint undef: true, unused: true */
/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var fe = require(SRC);

describe('FAESOR Planar_truess_with_anim example', function() {

  it('should create model.', function() {
    // import objects:
    var PointSet = fe.geometry.pointset.PointSet;
    var L2 = fe.geometry.gcellset.L2;
    var LinElIso = fe.property.LinElIso;

    // parameters:
    var E = 1e7;
    var integrationOrder = 1;

    var fens = new PointSet([
      [0, 0],
      [0, 40],
      [40, 0],
      [40, 40],
      [80, 0],
      [80, 40]
    ]);

    var gcells = new L2({
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

    var ebcFenids =[ 1, 1, 2, 2 ];
    var ebcPrescribed = [ 1, 1, 1, 1 ];
    var ebcComp = [ 1, 2, 1, 2 ];
    var ebcVal = ebcComp.map(function() { return 0; });

    var prop = new LinElIso({ E: E, nu: 0.0 });

    // TODO: Everything below is not implemented.
    return 0;

    var mater = new fe.material.DeformableSmallStrainLinearlyElasticUniaxial({
      property: prop
    });

    var feb = new fe.feblock.DeformableSmallStrain({
      material: mater,
      gcells: gcells,
      integrationRule: new fe.numeric.GaussRule(1, integrationOrder),
      Rm: fe.utils.genISORm
    });

    var geomField = new fe.field.Field({
      name: 'geom',
      dim: 2,
      fens: fens
    });

    var u = geomField.clone();
    u.name = 'u';
    u = u.map(function() { return 0; });

    u = u.setEBC(ebcFenids, ebcPrescribed, ebcComp, ebcVal);
    u = u.applyEBC();

    u = u.numberEquations();

    var ems = feb.stiffness(geomField, u);
    var neqns = u.getNumEquations();
    var K = new fe.numeric.DokSparseMatrix([], neqns, neqns);
    fe.assemble.assemble_(K, ems);

    var F = new fe.numeric.SparseVector([], neqns);
    var nodalLoads = [
      { nodeId: 3, dir: 2, magnitude: -2000 },
      { nodeId: 5, dir: 1, magnitude: +2000 },
      { nodeId: 6, dir: 1, magnitude: +4000 },
      { nodeId: 6, dir: 2, magnitude: +6000 },
    ].map(function(item) {
      return new fe.nodalload.NodalLoad(item);
    });

    nodalLoads.forEach(function(nl) {
      var evs = nl.loads(u);
      fe.assemble.assembleF_(F, evs);
    });

    var x = fe.numeric.mldivide(K, F);

    u = u.scatter(x);

    var values = u.getValues();
    console.log("values = ", values);

    var expected = [
      [0, 0],
      [0, 0],
      [0.0213, 0.0408],
      [-0.0160, 0.0462],
      [0.0427, 0.1501],
      [-0.0053, 0.1661],
    ];

    expect(fe.numeric.vecEqual(values, expected)).to.be(true);
  });

});
