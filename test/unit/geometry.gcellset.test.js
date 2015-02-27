/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var ModuleTester = require(ROOT + '/test/lib/module-tester').ModuleTester;
// var expect = require('expect.js');
// var dataDriven = require('data-driven');

var _ = require(SRC + '/core.utils');
// var assert = _.assert;
var check = _.check;
// var defineContract = _.defineContract;
var matrixOfDimension = _.contracts.matrixOfDimension;
// var vectorOfDimension = _.contracts.vectorOfDimension;

var gcellset = require(SRC + '/geometry.gcellset.js');

var VERIFIES = {
  'id': function(computed) {
    if (!check.string(computed))
      throw new Error('id is not a string');

    var ID_LEN = 36;
    if (computed.length !== ID_LEN)
      throw new Error('id is not of length ' + ID_LEN + ', but ' + computed.length);
  },
  'L2::jacbianMatrix': function(computed, expected) {
    matrixOfDimension(1, 1, 'jacbianMatrix is not of dimension 1 x 1')(computed);
  }
};


describe('geometry.gcellset', function() {
  var fixtures = [
    {
      _desc: 'should fail if conn is of wrong dimension',
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
      _exception: true
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
          verify: 'eql'
        }
      ],

      jacobianMatrix: [
        {
          input: [
            [ [1], [2] ],
            [ [2], [2] ]
          ],
          output: null,
          verify: 'L2::jacbianMatrix'
        },
        {
          input: [
            [ [1] ],
            [ [2], [2] ]
          ],
          exception: true,
          desc: 'nder wrong dimension'
        },
        {
          input: [
            [ [1], [2] ],
            [ [2], [2], [3] ]
          ],
          exception: true,
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

  var tester = new ModuleTester(gcellset, fixtures, VERIFIES);
  tester.run();

});
