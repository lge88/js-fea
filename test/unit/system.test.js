/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
require(SRC + '/system.js');

describe('system', function() {
  it('should fail', function() {
    expect(false).to.be(true);
  });
});
