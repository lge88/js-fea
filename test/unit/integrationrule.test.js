/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var dataDriven = require('data-driven');
var read = require('fs').readFileSync;
var gaussRulesFile = ROOT + '/test/fixtures/gauss-rules.json';
var numeric = require(SRC + '/core.numeric');
var array2dEquals = numeric.array2dEquals;
var vecEquals = numeric.vecEquals;
var integrationRule = require(SRC + '/integrationrule.js');
var IntegrationRule = integrationRule.IntegrationRule;
var GaussRule = integrationRule.GaussRule;


function loadFixtures(fileName) {
  var json = JSON.parse(read(fileName, 'utf8'));
  return json;
}

describe('integrationrule', function() {
  describe('IntegrationRule', function() {
    var ir = new IntegrationRule();
    dataDriven([
      { method: 'dim' },
      { method: 'npts' },
      { method: 'weights' },
      { method: 'paramCoords' }
    ], function() {
      it('should throw because {method} is not implemented.', function(ctx) {
        expect(ir[ctx.method].bind(ir)).to.throwException();
      });
    });
  });

  describe('GaussRule', function() {
    var fixtures = loadFixtures(gaussRulesFile);

    dataDriven(fixtures, function() {
      it('should work for dim = {dim} and order = {order}', function(ctx) {
        var ir = new GaussRule(ctx.dim, ctx.order);
        var pcs = ir.paramCoords();
        var ws = ir.weights();
        var npts = ir.npts();
        var tol = 1e-4;

        expect(ir.dim()).to.be(ctx.dim);
        expect(array2dEquals(pcs, ctx.expectedParamCoords, tol)).to.be(true);
        expect(vecEquals(ws, ctx.expectedWeights, tol)).to.be(true);
        expect(npts).to.be(ctx.expectedNpts);
      });
    });

    it('should throw for not implemented dim or order', function() {
      expect(function() { return new GaussRule(4, 2); }).to.throwException();
      expect(function() { return new GaussRule(2, 5); }).to.throwException();
    });

  });
});
