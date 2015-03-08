/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
require(SRC + '/system.vector.js');

describe('system.vector', function() {
  it('should fail', function() {
    expect(false).to.be(true);
  });
});
