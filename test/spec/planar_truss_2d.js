/*jshint undef: true, unused: true */
/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var fe = require(SRC);

describe('FAESOR Planar_truess_with_anim example', function() {

  it('should create model.', function() {
    // import objects:
    // var PointSet = fe.geometry.pointset.PointSet;
    var FeNodeSet = fe.fens.FeNodeSet;
    var L2 = fe.gcellset.L2;
    var LinElIso = fe.property.LinElIso;
    var DeforSSLinElUniax = fe.material.DeforSSLinElUniax;
    var GaussRule = fe.numeric.GaussRule;
    var SparseSystemMatrix = fe.system.matrix.SparseSystemMatrix;
    var SparseSystemVector = fe.system.vector.SparseSystemVector;
    var solve = fe.system.solve;
    var Field = fe.field.Field;
    var DeforSS = fe.feblock.DeforSS;
    var NodalLoad = fe.nodalload.NodalLoad;
    var size = fe.numeric.size;
    var eye = fe.numeric.eye;
    var div = fe.numeric.div;
    var norm2 = fe.numeric.norm2;
    // var mldivide = fe.numeric.mldivide;

    // parameters:
    var E = 1e7;
    var integrationOrder = 1;

    var feb, fens, gcells, mater, prop, ebcGroup, geom, u;

    function genISORm(xyz, tangents) {
      var tmp = size(tangents);
      var sdim = tmp[0], ntan = tmp[1];
      if (sdim === ntan) {
        return eye(sdim);
      } else {
        var e1 = tangents.map(function(row) {
          return [row[0]];
        });

        e1 = div(e1, norm2(e1));
        switch (ntan) {
        case 1:
          return e1;
          break;
        case 2:
          throw new Error('genISORm: ntan = ' + ntan + ' is not implemented.');
          break;
        default:
          throw new Error('genISORm: incorrect size of tangents, ntan = ' + ntan);
        }

      }

    }

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

    ebcGroup = {
      fenids: [1,1,2,2],
      prescribed: [1,1,1,1],
      component: [1,2,1,2],
      value: [0,0,0,0]
    };

    prop = new LinElIso({ E: E, nu: 0.0 });

    mater = new DeforSSLinElUniax({
      property: prop
    });

    var ir = new GaussRule(1, integrationOrder);

    geom = new Field({
      name: 'geom',
      fens: fens
    });

    u = new Field({
      name: 'u',
      dim: geom.dim(),
      nfens: geom.nfens(),
      ebcs: [ ebcGroup ]
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
    var x1 = solve(K, F);
    // console.log("x1 = ", x1);

    var x2 = solve(K, F.sparseVector().toList());
    // console.log("x2 = ", x2);

    return 0;

    u = u.scatterSystemVector(x);

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
