/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var ModuleTester = require(ROOT + '/test/lib/module-tester').ModuleTester;
var FeNodeSet = require(SRC + '/fens').FeNodeSet;
var PointSet = require(SRC + '/geometry.pointset').PointSet;
var EBC = require(SRC + '/ebc').EBC;
var field = require(SRC + '/field.js');

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
      ]

    },

  ];

  var tester = new ModuleTester(field, dataset, {});
  tester.run();
});
