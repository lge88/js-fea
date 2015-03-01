/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var dataDriven = require('data-driven');
var _ = require(SRC + '/core.utils');
// var assert = _.assert;
var check = _.check;
var flatten = _.flatten;
var filter = _.filter;
var map = _.map;
var assign = _.assign;
// var defineContract = _.defineContract;
// var matrixOfDimension = _.contracts.matrixOfDimension;
// var vectorOfDimension = _.contracts.vectorOfDimension;

// TODO: Make it work with functions as well.
function ModuleTester(mod, testDatasetOrFile, verifyMethods, options) {
  // built-in verify methods
  var VERIFY_METHODS = {
    'be': function(computed, expected) {
      expect(computed).to.be(expected);
    },
    'eql': function(computed, expected) {
      expect(computed).to.eql(expected);
    }
  };

  assign(VERIFY_METHODS, verifyMethods);

  function loadTestDataset(file) {
    return JSON.parse(require('fs').readFileSync(file));
  }

  function findVerifyMethod(name) {
    var meth = VERIFY_METHODS[name];
    if (check.string(meth))
      meth = VERIFY_METHODS[meth];
    if (!check.function(meth))
      meth = null;
    return meth;
  }

  function buildTestCases(dataset) {
    var tests = map(dataset, function(ctx) {
      var type = ctx._type;
      var Constr = mod[type];
      var initParams = ctx._init_params;
      var create = function(a, b, c, d, e) {
        return new Constr(a, b, c, d, e);
      };

      if (ctx._exception === true) {
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

      var methods = filter(Object.keys(ctx), function(k) {
        return !(/^_/.test(k));
      });

      var tests = map(methods, function(method) {
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

          if (check.string(testCase.verify)) {
            var meth = findVerifyMethod(testCase.verify);
            if (!meth) {
              throw new Error('ModuleTester: can not find verify method: ' +
                              testCase.verify);
            }
            cleaned.verify = meth;
          }

          if (!check.assigned(cleaned.verify)) {
            // Do we even care the output?
            // If we do, by default verify use expect().to.be();
            if (check.assigned(cleaned.output)) {
              cleaned.verify = VERIFY_METHODS['be'];
            } else {
              cleaned.verify = null;
            }
          }

          var fn = cleaned.instance[method];
          cleaned.fn = fn.bind.apply(fn, [ins].concat(cleaned.input));

          return cleaned;
        });
      });

      tests = flatten(tests);
      return tests;
    });

    return flatten(tests);
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
