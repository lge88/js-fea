/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
require(SRC + '/feutils.js');

describe('feutils', function() {
  it('should fail', function() {
    expect(false).to.be(true);
  });
});
