/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var ModuleTester = require(ROOT + '/test/lib/module-tester').ModuleTester;
var material = require(SRC + '/material.js');
var property = require(SRC + '/property.js');

var VERIFIES = {

};

describe('material', function() {
  var dataset = [
    {
      _type: 'DeforSSLinElUniax',
      _init_params: [
        {
          property: { _type: 'LinElIso', E: 1000 }
        }
      ],

      tangentModuli: [
        { output: 1000 }
      ]
    },
    {
      _type: 'DeforSSLinElUniax',
      _desc: 'should throw if params is not an instance of LinElIso',
      _init_params: [
        {
          property: { E: 1000 }
        }
      ],
      _exception: true
    }
  ];

  dataset = dataset.map(function(item) {
    item._init_params = item._init_params.map(function(arg) {
      if (arg.property && arg.property._type)
        return { property: new property[arg.property._type](arg.property) };
      return arg;
    });
    return item;
  });

  var tester = new ModuleTester(material, dataset, VERIFIES);
  tester.run();

});
