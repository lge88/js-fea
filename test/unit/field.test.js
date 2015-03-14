/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var ModuleTester = require(ROOT + '/test/lib/module-tester').ModuleTester;
var FeNodeSet = require(SRC + '/fens').FeNodeSet;
var PointSet = require(SRC + '/geometry.pointset').PointSet;
var EBC = require(SRC + '/ebc').EBC;
var field = require(SRC + '/field.js');
var Field = field.Field;
var numeric = require(SRC + '/core.numeric');
var matEql = numeric.matEql;

describe('field', function() {
  var dataset = [
    {
      _type: 'Field',
      _init_params: [
        {
          values: [
            [0, 0],
            [80, 40]
          ]
        }
      ],
      _desc: 'construct from values.',
      _exception: false
    },
    {
      _type: 'Field',
      _init_params: [
        {
          values: [
            [0, 0, 3],
            [80, 40]
          ]
        }
      ],
      _desc: 'values is not a valid matrix.',
      _exception: true
    },
    {
      _type: 'Field',
      _init_params: [
        {
          nfens: 5,
          dim: 2
        }
      ],
      _desc: 'construct from nfens and dim.',
      _exception: false
    },
    {
      _type: 'Field',
      _init_params: [
        {
          fens: new FeNodeSet({
            xyz: [
              [0,0,0],
              [0,1,0]
            ]
          })
        }
      ],
      _desc: 'construct from fens.',
      _exception: false
    },
    {
      _type: 'Field',
      _init_params: [
        {
          pointset: new PointSet([
            [0,0,0],
            [0,1,0]
          ])
        }
      ],
      _desc: 'construct from pointset.',
      _exception: false
    },
    {
      _type: 'Field',
      _init_params: [
        {
          values: [
            [0, 0],
            [0, 40],
            [40, 0],
            [40, 40],
            [80, 0],
            [80, 40]
          ],
          ebcs: [
            new EBC({
              id: [1, 2],
              dir: [1, 2],
              value: 0
            })
          ]
        }
      ],
      _desc: 'construct from pointset.',
      getById: [
        { input: 1, output: [0, 0], verify: 'eql' },
        { input: 2, output: [0, 0], verify: 'eql' },
        { input: 3, output: [40, 0], verify: 'eql' },
        { input: 4, output: [40, 40], verify: 'eql' },
        { input: 5, output: [80, 0], verify: 'eql' },
        { input: 6, output: [80, 40], verify: 'eql' }
      ],
      at: [
        { input: 0, output: [0, 0], verify: 'eql' },
        { input: 1, output: [0, 0], verify: 'eql' },
        { input: 2, output: [40, 0], verify: 'eql' },
        { input: 3, output: [40, 40], verify: 'eql' },
        { input: 4, output: [80, 0], verify: 'eql' },
        { input: 5, output: [80, 40], verify: 'eql' }
      ],
      dim: [ { output: 2 } ],
      nfens: [ { output: 6 } ],
      isPrescribed: [
        { input: [1,1], output: true },
        { input: [1,2], output: true },
        { input: [2,2], output: true },
        { input: [2,1], output: true },
        { input: [3,1], output: false },
        { input: [4,2], output: false }
      ],
      prescribedValue: [
        { input: [1,1], output: 0 },
        { input: [1,2], output: 0 },
        { input: [2,2], output: 0 },
        { input: [2,1], output: 0 },
        { input: [3,1], output: null },
        { input: [4,2], output: null }
      ],
      eqnum: [
        { input: [1,1], output: 0 },
        { input: [1,2], output: 0 },
        { input: [2,1], output: 0 },
        { input: [2,2], output: 0 },
        { input: [3,1], output: 1 },
        { input: [3,2], output: 2 },
        { input: [4,1], output: 3 },
        { input: [4,2], output: 4 },
        { input: [5,1], output: 5 },
        { input: [5,2], output: 6 },
        { input: [6,1], output: 7 },
        { input: [6,2], output: 8 },
        { input: [7,1], exception: true },
        { input: [6,3], exception: true },
      ],
      neqns: [
        { output: 8 }
      ],
      gatherEqnumsVector: [
        {
          input: [
            [1, 3]
          ],
          output: [0, 0, 1, 2],
          verify: 'eql'
        },
        {
          input: [
            [1, 4]
          ],
          output: [0, 0, 3, 4],
          verify: 'eql'
        }
      ],
      gatherValuesMatrix: [
        {
          input: [ [1,3,5] ],
          output: [
            [0, 0],
            [40, 0],
            [80, 0]
          ],
          verify: 'eql'
        }
      ],

      map: [
        {
          input: [ function(xyz) { return xyz.map(function(x) { return x*2; }); } ],
          output: [
            [0, 0],
            [0, 0],
            [80, 0],
            [80, 80],
            [160, 0],
            [160, 80]
          ],
          verify: 'fieldValuesEqual'
        }
      ],

      clone: [
        {
          output: [
            [0, 0],
            [0, 0],
            [40, 0],
            [40, 40],
            [80, 0],
            [80, 40]
          ],
          verify: 'fieldValuesEqual'
        }
      ],

      mul: [
        {
          input: [ 10 ],
          output: [
            [0, 0],
            [0, 0],
            [400, 0],
            [400, 400],
            [800, 0],
            [800, 400]
          ],
          verify: 'fieldValuesEqual'
        }
      ],

      add: [
        {
          input: [ 10 ],
          output: [
            [10, 10],
            [10, 10],
            [50, 10],
            [50, 50],
            [90, 10],
            [90, 50]
          ],
          verify: 'fieldValuesEqual'
        },
        {
          input: [ [10, 20] ],
          output: [
            [10, 20],
            [10, 20],
            [50, 20],
            [50, 60],
            [90, 20],
            [90, 60]
          ],
          verify: 'fieldValuesEqual'
        },
        {
          input: [
            new Field({
              values: [
                [10,0],
                [10,0],
                [10,0],
                [0,20],
                [0,20],
                [0,20]
              ]
            })
          ],
          output: [
            [10, 0],
            [10, 0],
            [50, 0],
            [40, 60],
            [80, 20],
            [80, 60]
          ],
          verify: 'fieldValuesEqual'
        },

        {
          input: [
            new Field({
              values: [
                [10],
                [10],
                [10],
                [0],
                [0],
                [0]
              ]
            })
          ],
          exception: true,
          desc: 'other dimension dismatch.'
        }


      ],
      sub: [
        {
          input: [ 10 ],
          output: [
            [-10, -10],
            [-10, -10],
            [30, -10],
            [30, 30],
            [70, -10],
            [70, 30]
          ],
          verify: 'fieldValuesEqual'
        }
      ],

      div: [
        {
          input: [ 10 ],
          output: [
            [0, 0],
            [0, 0],
            [4, 0],
            [4, 4],
            [8, 0],
            [8, 4]
          ],
          verify: 'fieldValuesEqual'
        }
      ]
    },

  ];

  var verifies = {
    fieldValuesEqual: function(computed, expected) {
      var vals = computed.values();
      expect(matEql(vals, expected, 1e-8)).to.be(true);
    }
  };

  var tester = new ModuleTester(field, dataset, verifies);
  tester.run();
});
