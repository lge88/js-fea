/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var ModuleTester = require(ROOT + '/test/lib/module-tester').ModuleTester;
var expect = require('expect.js');
// var dataDriven = require('data-driven');

var _ = require(SRC + '/core.utils');
var assert = _.assert;
var check = _.check;
// var defineContract = _.defineContract;
var matrixOfDimension = assert.ensureMatrixOfDimension;
// var vectorOfDimension = _.contracts.vectorOfDimension;
var normalizedCell = _.normalizedCell;
var byLexical = _.byLexical;

var fens = require(SRC + '/fens');
var FeNodeSet = fens.FeNodeSet;
var gcellset = require(SRC + '/gcellset.js');
var P1 = gcellset.P1;
var L2 = gcellset.L2;
var Q4 = gcellset.Q4;

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
  },
  'sortEql': function(computed, expected) {
    computed = computed.slice().sort();
    expected = expected.slice().sort();
    expect(computed).to.eql(expected);
  },
  'normalizeEql': function(computed, expected) {
    computed = computed.slice().map(function(cell) {
      return normalizedCell(cell);
    }).sort(byLexical);
    expected = expected.slice().map(function(cell) {
      return normalizedCell(cell);
    }).sort(byLexical);
    expect(computed).to.eql(expected);
  },
  'gcellsetEquals': function(computed, expected) {
    expect(computed.equals(expected)).to.be(true);
  }
};


describe('gcellset', function() {
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

      equals: [
        {
          input: [
            new L2({
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
              axisSymm: true
            })
          ],
          output: false,
          desc: 'axisSymm is different'
        },
        {
          input: [
            new L2({
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
              otherDimension: 2.0,
              axisSymm: false
            })
          ],
          output: false,
          desc: 'otherDimension is different'
        },
        {
          input: [
            new L2({
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
            })
          ],
          output: true,
          desc: 'same'
        },
        {
          input: [
            new L2({
              conn: [
                [ 1, 3 ],
                [ 2, 4 ],
                [ 3, 4 ],
                [ 3, 5 ],
                [ 5, 4 ],
                [ 6, 4 ],
                [ 5, 6 ]
              ],
              otherDimension: 1.0,
              axisSymm: false
            })
          ],
          output: false,
          desc: 'conn is different'
        },
        {
          input: [
            new Q4({
              conn: [ [1,2,3,4] ]
            })
          ],
          desc: 'type is different',
          output: false
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
            [ 5, 4 ],
            [ 6, 4 ],
            [ 5, 6 ]
          ],
          verify: 'eql'
        }
      ],
      edges: [
        {
          output: [
            [ 1, 3 ],
            [ 1, 4 ],
            [ 2, 4 ],
            [ 3, 4 ],
            [ 3, 5 ],
            [ 5, 4 ],
            [ 6, 4 ],
            [ 5, 6 ]
          ],
          verify: 'normalizeEql'
        }
      ],
      vertices: [
        {
          output: [1,2,3,4,5,6],
          verify: 'sortEql'
        }
      ],
      triangles: [
        { output: [], verify: 'eql' }
      ],
      count: [
        { output: 8 }
      ],
      nfens: [
        { output: 6 }
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
        // {
        //   input: [
        //     [ [1] ],
        //     [ [2], [2] ]
        //   ],
        //   exception: true,
        //   desc: 'nder wrong dimension'
        // },
        // {
        //   input: [
        //     [ [1], [2] ],
        //     [ [2], [2], [3] ]
        //   ],
        //   exception: true,
        //   desc: 'x wrong dimension'
        // }
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

      boundary: [
        { output: new P1({ conn: [ [2] ] }), verify: 'gcellsetEquals' }
      ]

      // jacobian: [
      //   {
      //     input: [
      //       [1, 3],
      //       [
      //         [ 1.0 ],
      //         [ 0.5 ]
      //       ],
      //       [ [1.0] ],
      //       [
      //         [ 0.5 ],
      //         [ 0.0 ],
      //       ]
      //     ],
      //     output: 1.0
      //   }
      // ]
    },
    {
      _type: 'Q4',
      _init_params: [
        {
          conn: [
            [1,2,3,4],
            [4,3,6,5]
          ]
        }
      ],
      boundary: [
        {
          output: new L2({
            conn: [ [1, 2], [2, 3], [4, 1], [3, 6], [6, 5], [5, 4] ]
          }),
          verify: 'gcellsetEquals'
        }
      ]
    },
    {
      _type: 'Q4',
      _init_params: [
        {
          conn: [
            [ 1, 2, 3, 4 ]
          ],
          otherDimension: 1.0,
          axisSymm: false
        }
      ],
      vertices: [
        { output: [1, 2, 3, 4], verify: 'sortEql' }
      ],
      edges: [
        {
          output: [
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 1]
          ],
          verify: 'normalizeEql'
        }
      ],
      triangles: [
        {
          output: [
            [1, 2, 3],
            [3, 4, 1]
          ],
          verify: 'normalizeEql'
        }
      ]
    },
    {
      _type: 'Q4',
      _init_params: [
        {
          conn: [
            [1, 0, 3, 2], // 0

            [1, 2, 6, 5], // 1
            [2, 3, 7, 6], // 2
            [3, 0, 4, 7], // 3
            [1, 5, 4, 0], // 4

            [5, 6, 10, 9], // 5
            [6, 7, 11, 10], // 6
            [7, 4, 8, 11],  // 7
            [4, 5, 9, 8],  // 8

            [8, 9, 10, 11] //9
          ]
        }
      ],
      boxSelect: [
        {
          input: [
            new FeNodeSet({
              xyz: [
                [ 0, 0, 0 ],
                [ 1, 0, 0 ],
                [ 1, 1, 0 ],
                [ 0, 1, 0 ],

                [ 0, 0, 1 ],
                [ 1, 0, 1 ],
                [ 1, 1, 1 ],
                [ 0, 1, 1 ],

                [ 0, 0, 2 ],
                [ 1, 0, 2 ],
                [ 1, 1, 2 ],
                [ 0, 1, 2 ]
              ]
            }),
            {
              bounds: [ -1, 2, 0.5, 1.5, 0.5, Infinity ]
            }
          ],
          output: [ 6 ],
          verify: 'sortEql'
        },
        {
          input: [
            new FeNodeSet({
              xyz: [
                [ 0, 0, 0 ],
                [ 1, 0, 0 ],
                [ 1, 1, 0 ],
                [ 0, 1, 0 ],

                [ 0, 0, 1 ],
                [ 1, 0, 1 ],
                [ 1, 1, 1 ],
                [ 0, 1, 1 ],

                [ 0, 0, 2 ],
                [ 1, 0, 2 ],
                [ 1, 1, 2 ],
                [ 0, 1, 2 ]
              ]
            }),
            {
              bounds: [ -1, 2, 0.5, 1.5, 0.5, Infinity ],
              any: true
            }
          ],
          output: [ 5, 1, 2, 6, 3, 7, 9 ],
          verify: 'sortEql'
        },
      ]
    }
  ];

  var tester = new ModuleTester(gcellset, fixtures, VERIFIES);
  tester.run();

});
