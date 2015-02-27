/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
require(SRC + '/property.js');

describe('material property', function() {
  xit('should fail', function() {
    expect(false).to.be(true);
  });
});
