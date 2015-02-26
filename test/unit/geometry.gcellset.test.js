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

var gcellset = require(SRC + '/geometry.gcellset.js');

var EXCEPTION = {};
var DONT_CARE = {};
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
  'jacbianMatrix': function(computed, expected) {
    matrixOfDimension(1, 1, 'jacbianMatrix is not of dimension 1 x 1')(computed);
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

describe('geometry.gcellset', function() {
  var fixtures = [
    {
      desc: 'should fail if conn is of wrong dimension',
      _type: 'L2',
      _init_params: [
        {
          conn: [
            [ 1, 3 ],
            [ 1 ],
            [ 2, 4 ]
          ],
          otherDimension: 1.0,
          axisSymm: false
        }
      ],
      _init_output: EXCEPTION
    },
    {
      _type: 'L2',
      _init_params: [
        {
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
          otherDimension: 1.0,
          axisSymm: false
        }
      ],
      _init_output: DONT_CARE,

      type: [
        { output: 'L2' }
      ],
      dim: [
        { output: 1 }
      ],
      cellSize: [
        { output: 2 }
      ],
      id: [
        { verify: 'id' }
      ],
      otherDimension: [
        { output: 1.0 }
      ],
      axisSymm: [
        { output: false }
      ],
      conn: [
        {
          output: [
            [ 1, 3 ],
            [ 1, 4 ],
            [ 2, 4 ],
            [ 3, 4 ],
            [ 3, 5 ],
            // FIXME: topology resorts the cell indices..
            // [ 5, 4 ],
            [ 4, 5 ],
            // [ 6, 4 ],
            [ 4, 6 ],
            [ 5, 6 ]
          ],
          verify: 'toEql'
        }
      ],

      jacobianMatrix: [
        {
          input: [
            [ [1], [2] ],
            [ [2], [2] ]
          ],
          output: null,
          verify: 'jacbianMatrix'
        },
        {
          input: [
            [ [1] ],
            [ [2], [2] ]
          ],
          output: EXCEPTION,
          desc: 'nder wrong dimension'
        },
        {
          input: [
            [ [1], [2] ],
            [ [2], [2], [3] ]
          ],
          output: EXCEPTION,
          desc: 'x wrong dimension'
        }
      ],

      bfun: [
        {
          input: [
            [ 0.8 ]
          ],
          output: null
        }
      ],

      bfundpar: [
        {
          input: [
            [ 0.8 ]
          ],
          // TODO:
          output: null
        }
      ],

      bfundsp: [
        {
          input: [
            [ [1], [2] ],
            [ [2], [2] ]
          ],
          output: null
        }
      ],

      jacobian: [
        {
          input: [
            [1, 3],
            [
              [ 1.0 ],
              [ 0.5 ]
            ],
            [ [1.0] ],
            [
              [ 0.5 ],
              [ 0.0 ],
            ]
          ],
          output: 1.0
        }
      ]

    }
  ];


  var testCases = _(fixtures)
        .map(function(ctx) {
          var type = ctx._type;
          var Constr = gcellset[type];
          var initParams = ctx._init_params;
          var create = function(a, b, c, d, e) {
            return new Constr(a, b, c, d, e);
          };

          if (ctx._init_output === EXCEPTION) {
            return [
              {
                instance: null,
                type: type,
                method: 'constructor',
                input: initParams,
                output: EXCEPTION,
                fn: create.bind(null, initParams),
                desc: ctx.desc
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
                  desc: check.string(testCase.desc) ? testCase.desc : ''
                };

                if (check.string(testCase.verify))
                  cleaned.verify = VERIFY_METHODS[testCase.verify];

                if (!check.assigned(cleaned.verify)) {
                  // Do we even care the output?
                  // If we do, by default verify use expect().to.be();
                  if (check.assigned(cleaned.output) && cleaned.output !== DONT_CARE) {
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

  dataDriven(testCases, function() {
    it('{type}:{method}() {desc}', function(ctx) {
      if (ctx.output === EXCEPTION) {
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
});
