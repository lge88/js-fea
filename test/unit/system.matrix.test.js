/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var dataDriven = require('data-driven');
var numeric = require(SRC + '/core.numeric');
var array2dEquals = numeric.array2dEquals;
var read = require('fs').readFileSync;
var fixtureFile = ROOT + '/test/fixtures/assemble.json';
var SparseSystemMatrix = require(SRC + '/system.matrix.js').SparseSystemMatrix;

function loadFixtures(fileName) {
  var json = JSON.parse(read(fileName, 'utf8'));
  return json;
}

describe('SparseSystemMatrix', function() {
  var fixtures = loadFixtures(fixtureFile);

  dataDriven(fixtures, function() {
    it('should work for DokSparseMatrix', function(ctx) {
      var dim = ctx.dim, ems = ctx.ems, expectedK = ctx.K;
      var elementMatrices = ems.map(function(em) {
        return {
          matrix: em.matrix,
          eqnums: em.equationNumbers
        };
      });

      var K = new SparseSystemMatrix(dim, dim, elementMatrices);
      expect(array2dEquals(K.toFull(), expectedK)).to.be(true);
    });
  });


});
