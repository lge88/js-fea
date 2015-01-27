/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var Bimap = require(SRC + '/core.bimap.js').Bimap;

describe('core.bimap', function() {
  var bm;

  it('#constructor(lst)/#size()', function() {
    bm = new Bimap([
      [ 'A', '1' ],
      [ 'B', '2' ],
      [ 'C', '3' ],
      [ 'D', '4' ],
      [ 'E', '5' ]
    ]);
    expect(bm.size()).to.be(5);
  });

  it('#find(node)', function() {
    expect(bm.find('A')).to.be('1');
    expect(bm.find('D')).to.be('4');
    expect(bm.find('4')).to.be('D');
    expect(bm.find('5')).to.be('E');
  });

  it('#belongsTo(node)', function() {
    expect(bm.belongsTo('A')).to.be('left');
    expect(bm.belongsTo('Z')).to.be('none');
    expect(bm.belongsTo('4')).to.be('right');
  });

  it('#inLeft(node)/#inRight(node)', function() {
    expect(bm.inLeft('C')).to.be(true);
    expect(bm.inLeft('1')).to.be(false);
    expect(bm.inRight('C')).to.be(false);
    expect(bm.inRight('2')).to.be(true);
  });

  it('#contains(node)', function() {
    expect(bm.contains('5')).to.be(true);
    expect(bm.contains('B')).to.be(true);
    expect(bm.contains('F')).to.be(false);
  });

  it('#contains(left, right)', function() {
    expect(bm.contains('A', '1')).to.be(true);
    expect(bm.contains('1', 'A')).to.be(false);
    expect(bm.contains('A', '2')).to.be(false);
  });

  it('#getLeftNodes()', function() {
    expect(bm.getLeftNodes().sort()).to.eql([
      'A', 'B', 'C', 'D', 'E'
    ]);
  });

  it('#getRightNodes()', function() {
    expect(bm.getRightNodes().sort()).to.eql([
      '1', '2', '3', '4', '5'
    ]);
  });

  it('#toJSON()', function() {
    expect(bm.toJSON()).to.eql({
      'A': '1',
      'B': '2',
      'C': '3',
      'D': '4',
      'E': '5'
    });
  });

  it('#remove(node) success', function() {
    bm.remove('A');
    expect(bm.size()).to.be(4);
    expect(bm.contains('A', '1')).to.be(false);
    expect(bm.contains('A')).to.be(false);
    expect(bm.contains('1')).to.be(false);
  });

  it('#remove(node) fail', function() {
    bm.remove('K');
    expect(bm.size()).to.be(4);
  });

  it('#remove(left, right) fail', function() {
    bm.remove('B', '3');
    expect(bm.size()).to.be(4);
  });

  it('#remove(left, right) success', function() {
    bm.remove('B', '2');
    expect(bm.size()).to.be(3);
    expect(bm.contains('B')).to.be(false);
    expect(bm.contains('B', '2')).to.be(false);
    expect(bm.contains('2')).to.be(false);
  });

  it('#insert(left, right) success', function() {
    bm.insert('M', '10');
    expect(bm.size()).to.be(4);
    expect(bm.contains('M')).to.be(true);
    expect(bm.contains('M', '10')).to.be(true);
    expect(bm.contains('10')).to.be(true);
  });

  it('#insert([left, right]) success', function() {
    bm.insert(['N', '11']);
    expect(bm.size()).to.be(5);
    expect(bm.contains('N')).to.be(true);
    expect(bm.contains('N', '11')).to.be(true);
    expect(bm.contains('11')).to.be(true);
  });

});
