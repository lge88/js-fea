/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var dataDriven = require('data-driven');
var assemble_ = require(SRC + '/core.assemble.js').assemble_;
var ElementMatrix = require(SRC + '/core.assemble.js').ElementMatrix;
var numeric = require(SRC + '/core.numeric');
var DokSparseMatrix = numeric.DokSparseMatrix;
var array2dEquals = numeric.array2dEquals;
var read = require('fs').readFileSync;
var fixtureFile = ROOT + '/test/fixtures/assemble.json';

function loadFixtures(fileName) {
  var json = JSON.parse(read(fileName, 'utf8'));
  return json;
}

describe('core.assemble', function() {
  describe('assemble(dest, srcs: [ElementMatrix])', function() {
    var fixtures = loadFixtures(fixtureFile);
    dataDriven(fixtures, function() {
      it('should work for DokSparseMatrix', function(ctx) {
        var dim = ctx.dim, ems = ctx.ems, expectedK = ctx.K;
        var elementMatrices = ems.map(function(em) {
          return new ElementMatrix(em.matrix, em.equationNumbers);
        });

        var K = new DokSparseMatrix([], dim, dim);
        assemble_(K, elementMatrices);

        expect(array2dEquals(K.toFull(), expectedK)).to.be(true);
      });
    });

  });

});
