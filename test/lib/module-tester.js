/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var dataDriven = require('data-driven');
var _ = require(SRC + '/core.utils');
var assert = _.assert;
var check = _.check;
var defineContract = _.defineContract;
var matrixOfDimension = _.contracts.matrixOfDimension;
var vectorOfDimension = _.contracts.vectorOfDimension;

function ModuleTester(mod, testDatasetOrFile, verifyMethods, options) {
  // built-in verify methods
  var VERIFY_METHODS = {
    'toBe': function(computed, expected) { expect(computed).to.be(expected); },
    'toEql': function(computed, expected) { expect(computed).to.eql(expected); },
    'id': function(computed) {
      if (!check.string(computed))
        throw new Error('id is not a string');

      var ID_LEN = 36;
      if (computed.length !== ID_LEN)
        throw new Error('id is not of length ' + ID_LEN + ', but ' + computed.length);
    },
    'vecEql': function(computed, expected) {
      // TODO:
      expect().fail('vecEql not implemented');
    },
    'matEql': function(computed, expected) {
      // TODO:
      expect().fail('matEql not implemented');
    }
  };

  _.assign(VERIFY_METHODS, verifyMethods);

  function loadTestDataset(file) {
    return JSON.parse(require('fs').readFileSync(file));
  }

  function buildTestCases(dataset) {
    return _(dataset)
      .map(function(ctx) {
        var type = ctx._type;
        var Constr = mod[type];
        var initParams = ctx._init_params;
        var create = function(a, b, c, d, e) {
          return new Constr(a, b, c, d, e);
        };

        if (ctx.exception === true) {
          return [
            {
              instance: null,
              type: type,
              method: 'constructor',
              input: initParams,
              exception: true,
              fn: create.bind(null, initParams),
              desc: ctx._desc
            }
          ];
        }

        var ins = create.apply(null, initParams);
        var methods = Object
              .keys(ctx)
              .filter(function(k) {
                return !(/^_/.test(k));
              });

        return _(methods)
          .map(function(method) {
            return ctx[method].map(function(testCase) {
              var cleaned = {
                instance: ins,
                type: type,
                method: method,
                input: testCase.input,
                output: testCase.output,
                exception: testCase.exception,
                desc: check.string(testCase.desc) ? testCase.desc : ''
              };

              if (check.string(testCase.verify))
                cleaned.verify = VERIFY_METHODS[testCase.verify];

              if (!check.assigned(cleaned.verify)) {
                // Do we even care the output?
                // If we do, by default verify use expect().to.be();
                if (check.assigned(cleaned.output)) {
                  cleaned.verify = VERIFY_METHODS['toBe'];
                } else {
                  cleaned.verify = null;
                }
              }

              var fn = cleaned.instance[method];
              cleaned.fn = fn.bind.apply(fn, [ins].concat(cleaned.input));

              return cleaned;
            });
          })
          .value();
      })
      .flatten()
      .value();
  }

  function run() {
    var testDataset;
    if (check.string(testDatasetOrFile))
      testDataset = loadTestDataset(testDatasetOrFile);
    else
      testDataset = testDatasetOrFile;

    var testCases = buildTestCases(testDataset);

    dataDriven(testCases, function() {
      it('{type}:{method}() {desc}', function(ctx) {
        if (ctx.exception === true) {
          expect(ctx.fn).to.throwException();
        } else {
          // Should not throw
          var res = ctx.fn();

          // If we do care the output, call verify()
          if (check.function(ctx.verify))
            ctx.verify(res, ctx.output, ctx.input, ctx.instance);
        }
      });
    });
  }

  return {
    run: run
  };
}

exports.ModuleTester = ModuleTester;
