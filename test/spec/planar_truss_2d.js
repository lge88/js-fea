/*jshint undef: true, unused: true */
/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var fe = require(SRC);
var creator = new fe.geometry.HypercubeGeometryCreator();

describe('FAESOR Planar_truess_with_anim example', function() {

  it('should have same nodal displacements', function() {
    var n1 = creator.point([0, 0]);
    var n2 = creator.point([0, 40]);
    var n3 = creator.point([40, 0]);
    var n4 = creator.point([40, 40]);
    var n5 = creator.point([80, 0]);
    var n6 = creator.point([80, 40]);

    var l1 = creator.line(n1, n3);
    var l2 = creator.line(n1, n4);
    var l3 = creator.line(n2, n4);

  });

});
