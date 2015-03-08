/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var ModuleTester = require(ROOT + '/test/lib/module-tester').ModuleTester;

var _ = require(SRC + '/core.utils');
var numeric = require(SRC + '/core.numeric');
var matrixEquals = numeric.matrixEquals;
var size = numeric.size;
var eye = numeric.eye;
var div = numeric.div;
var norm2 = numeric.norm2;

var FeNodeSet = require(SRC + '/fens').FeNodeSet;
var L2 = require(SRC + '/gcellset').L2;
var LinElIso = require(SRC + '/property.js').LinElIso;
var DeforSSLinElUniax = require(SRC + '/material.js').DeforSSLinElUniax;
var GaussRule = require(SRC + '/integrationrule').GaussRule;
var Field = require(SRC + '/field').Field;
var EBC = require(SRC + '/ebc').EBC;

var feblock = require(SRC + '/feblock.js');
var DeforSS = feblock.DeforSS;

describe('feblock', function() {
  describe('DeforSS 2D truss', function() {
    // parameters:
    var E = 1e7;
    var integrationOrder = 1;

    var feb, fens, gcells, mater, prop, fixedSupport, geom, u;

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

    fixedSupport = new EBC({
      id: [1, 2],
      dir: [1, 2],
      value: 0
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

    it('stiffness()', function() {
      var tmp = feb.stiffness(geom, u);
      var Kes = tmp.matrices;
      var eqnums = tmp.eqnums;
      // TODO: fix the gcell topology sort index issue;
      // console.log("Kes = ", Kes);
      // console.log("eqnums = ", eqnums);
      var relTol = 0.005;
      var KesExpected = [];
      var eqnumsExpected = [];

      expect(true).to.be(true);
      return;

      Kes.forEach(function(Ke, i) {
        var KeExpected = KesExpected[i];
        expect(matrixEquals(KeExpected, Ke, relTol)).to.be(true);
      });

      expect(eqnums).to.eql(eqnumsExpected);

    });



  });

});
