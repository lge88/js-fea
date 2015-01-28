/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var FeModel = require(SRC + '/femodel.js').FeModel;

describe('femodel', function() {
  //                                 ^
  // n4(0,1)            e4           |  n3(2,1)
  //      o.............<............o
  //      .                    ..    .
  //      .                 ..       .
  //      .              ..          .
  //      .           ..             ^
  //   e5 .     |   .    e3          . e2
  //      V     |/__                 .
  //      .   ..                     .
  //      . .                        .
  //      o............>.............o
  //      /\                          /\
  // n1(0,0)             e1           n2(2,0)

  function byLabel(a, b) { return a.getLabel() > b.getLabel(); }

  var m, n1, n2, n3, n4, e1, e2, e3, e4, e5;

  it('FeModel::constructor()', function() {
    m = new FeModel();
  });

  it('FeModel::createNode()', function() {
    m.createNode(0, 0, 0).setLabel('n1');
    m.createNode([2, 0, 0]).setLabel('n2');
    m.createNode(2, 1, 0).setLabel('n3');
    m.createNode(0, 1, 0).setLabel('n4');
  });

  it('FeModel::findByLabel()', function() {
    n1 = m.findByLabel('n1'); expect(n1.getLabel()).to.be('n1');
    n2 = m.findByLabel('n2'); expect(n2.getLabel()).to.be('n2');
    n3 = m.findByLabel('n3'); expect(n3.getLabel()).to.be('n3');
    n4 = m.findByLabel('n4'); expect(n4.getLabel()).to.be('n4');
  });

  it('FeModel::createElement()', function() {
    e1 = m.createElement([n1, n2]).setLabel('e1');
    e2 = m.createElement([n2, n3]).setLabel('e2');
    e3 = m.createElement([n3, n1]).setLabel('e3');
    e4 = m.createElement([n3, n4]).setLabel('e4');
    e5 = m.createElement([n4, n1]).setLabel('e5');

    var labels = [e1, e2, e3, e4, e5].map(function(e) { return e.getLabel(); });
    expect(labels).to.eql(['e1', 'e2', 'e3', 'e4', 'e5']);
  });


  // TODO: spc related.
  it('FeModel::createSPC()', function() {
    // var spc1 = m.createSPC([0, 1], [0, 0]).setLabel('spc1');
    // m.assignSPC([n1, n2], spc1);


    // FeModel::toJSON()/FeModel.fromJSON()
    // var str = JSON.stringify(m.toJSON(), null, 2);
    // console.log(str);

    // var m2 = FeModel.createFromJSON(JSON.parse(str));
    // var str2 = JSON.stringify(m2.toJSON(), null, 2);
    // console.log(str2);
  });

  it('FeNode::getElements()', function() {
    expect(n1.getElements().sort(byLabel)).to.eql([e1, e3, e5]);
    expect(n4.getElements().sort(byLabel)).to.eql([e4, e5]);
  });

  it('FeNode::inElement()', function() {
    expect(n1.isInElement(e1)).to.be(true);
    expect(n2.isInElement(e1)).to.be(true);
    expect(n1.isInElement(e5)).to.be(true);
    expect(n2.isInElement(e3)).to.be(false);
  });

  it('FeNode::isAdjacentTo()', function() {
    expect(n1.isAdjacentTo(n1)).to.be(false);
    expect(n1.isAdjacentTo(n2)).to.be(true);
    expect(n3.isAdjacentTo(n1)).to.be(true);
    expect(n2.isAdjacentTo(n4)).to.be(false);
  });

  it('FeNode::getAdjacentNodes()', function() {
    expect(n1.getAdjacentNodes().sort(byLabel)).to.eql([n2, n3, n4]);
    expect(n2.getAdjacentNodes().sort(byLabel)).to.eql([n1, n3]);
  });

  it('FeElement::hasNode()', function() {
    expect(e1.hasNode(n1)).to.be(true);
    expect(e1.hasNode(n2)).to.be(true);
    expect(e3.hasNode(n1)).to.be(true);
    expect(e3.hasNode(n2)).to.be(false);
    expect(e5.hasNode(n1)).to.be(true);
  });

  it('FeElement::getAdjacentElements()', function() {
    expect(e1.getAdjacentElements().sort(byLabel)).to.eql([e2, e3, e5]);
    expect(e3.getAdjacentElements().sort(byLabel)).to.eql([e1, e2, e4, e5]);
  });

  it('FeElement::isAdjacentTo()', function() {
    expect(e1.isAdjacentTo(e2)).to.be(true);
    expect(e1.isAdjacentTo(e3)).to.be(true);
    expect(e1.isAdjacentTo(e4)).to.be(false);
    expect(e2.isAdjacentTo(e5)).to.be(false);
  });

  it('FeModel::getObject()', function() {
    expect(m.getObject(n4.getId())).to.be(n4);
    expect(m.getObject(e3.getId())).to.be(e3);
  });

  it('FeModel::forEachNode', function() {
    var tags = [];
    m.forEachNode(function(n) { tags.push(n.getLabel()); });
    expect(tags.sort()).to.eql(['n1', 'n2', 'n3', 'n4']);
  });

  it('FeModel::forEachElement', function() {
    var tags = [];
    m.forEachElement(function(e) { tags.push(e.getLabel()); });
    expect(tags.sort()).to.eql(['e1', 'e2', 'e3', 'e4', 'e5']);
  });

  it('FeModel::getNodes()', function() {
    expect(m.getNodes().sort(byLabel)).to.eql([n1, n2, n3, n4]);
  });

  it('FeModel::getElements()', function() {
    expect(m.getElements().sort(byLabel)).to.eql([e1, e2, e3, e4, e5]);
  });

  it('FeModel::getAABB()', function() {
    expect(m.getAABB()).to.eql([0, 2, 0, 1, 0, 0]);
  });

  it('FeModel::getXRange()/::getYRange()/::getZRange()', function() {
    expect(m.getXRange()).to.eql([0, 2]);
    expect(m.getYRange()).to.eql([0, 1]);
    expect(m.getZRange()).to.eql([0, 0]);
  });

  it('FeModel::getXDiff()/::getYDiff()/::getZDiff()', function() {
    expect(m.getXDiff()).to.be(2);
    expect(m.getYDiff()).to.be(1);
    expect(m.getZDiff()).to.be(0);
  });

  it('FeModel::getDimension', function() {
    expect(m.getDimension()).to.be(2);
  });

});
