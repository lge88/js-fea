/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var ModuleTester = require(ROOT + '/test/lib/module-tester').ModuleTester;
var property = require(SRC + '/property.js');

describe('material property', function() {
  var dataset = [
    {
      _type: 'LinElIso',
      _init_params: [
        { E: 1000 }
      ],
      E: [ { output: 1000 } ],
      nu: [ { output: 0.0 } ],
      G: [ { output: 500.0 } ]
    },
    {
      _type: 'LinElIso',
      _desc: 'should throw if E is negative',
      _init_params: [
        { E: -1000 }
      ],
      _exception: true
    }
  ];

  var tester = new ModuleTester(property, dataset, {});

  tester.run();
});
