/*global __dirname describe it require*/
var ROOT = __dirname + '/../..', SRC = ROOT + '/src';
var expect = require('expect.js');
var SetStore = require(SRC + '/core.setstore.js').SetStore;

describe('core.setstore', function() {

  function ClassA(val) { this._uid = 'a' + (++ClassA.count); this.val = val; }
  ClassA.prototype.getType = function() { return 'A'; };
  ClassA.count = 0;

  function ClassB(val) { this._uid = 'b' + (++ClassB.count); this.val = val; }
  ClassB.prototype.getType = function() { return 'B'; };
  ClassB.count = 0;

  function getKeyOf(item) { if (item && item._uid) return item._uid; else return item; }
  function setKeyOf(item, key) {
    if (this.contains(item)) {
      this.erase(item);
      item._uid = key;
      this.insert(item);
    }
  }

  function getTypeOf(o) { return o.getType(); }
  function byId(x, y) { return x._id - y._id; };

  describe('basic', function() {
    var a1 = new ClassA(1);
    var a2 = new ClassA(2);
    var a3 = new ClassA(3);
    var b1 = new ClassB('a');
    var b2 = new ClassB('b');
    var b3 = new ClassB('c');
    var b4 = new ClassB('d');
    var ss;

    it ('#constructor()/#size()/#empty()/#contains(item)', function() {
      ss = new SetStore([a1, a2, a3, b1, b2, b3], getKeyOf, setKeyOf, getTypeOf);
      expect(ss.size()).to.be(6);
      expect(ss.empty()).to.be(false);
      expect(ss.contains(a1)).to.be(true);
      expect(ss.contains(b2)).to.be(true);
      expect(ss.contains(b4)).to.be(false);
    });

    it('#find(item|id)', function() {
      expect(ss.find('a1')).to.be(a1);
      expect(ss.find(a1)).to.be(a1);
      expect(ss.find('b1')).to.be(b1);
      expect(ss.find('b4')).to.be(undefined);
    });

    it('#findInType(item, type)', function() {
      expect(ss.findInType('a1', 'A')).to.be(a1);
      expect(ss.findInType(a1, 'A')).to.be(a1);
      expect(ss.findInType('a1', 'B')).to.be(undefined);
      expect(ss.findInType('b4', 'B')).to.be(undefined);
    });

    it('#getAllTypes()', function() {
      expect(ss.getAllTypes().sort()).to.eql(['A', 'B']);
    });

    it('#getAllTypes()', function() {
      expect(ss.getAllTypes().sort()).to.eql(['A', 'B']);
    });

    it('#getKeyOf()', function() {
      expect(ss.getKeyOf(a1)).to.be('a1');
      expect(ss.getKeyOf(b3)).to.be('b3');
    });

    it('#getItems()', function() {
      var items = ss.getItems().sort(byId);
      expect(items).to.eql([a1, a2, a3, b1, b2, b3]);
    });

    it('#getItemsOfType(type)', function() {
      var allAs = ss.getItemsOfType('A').sort(byId);
      expect(allAs).to.eql([a1, a2, a3]);
    });

    it('#setKeyOf(item, key)', function() {
      ss.setKeyOf(b3, 'bbb');
      expect(ss.getKeyOf(b3)).to.be('bbb');
      expect(ss.find('bbb')).to.be(b3);
      expect(ss.findInType('bbb', 'B')).to.be(b3);
    });

    it('#erase(item)/#insert(item)', function() {
      ss.erase(b3);
      ss.erase(a2);
      ss.insert(b4);

      expect(ss.size()).to.be(5);
      expect(ss.empty()).to.be(false);
      expect(ss.contains(a1)).to.be(true);
      expect(ss.contains(a2)).to.be(false);
      expect(ss.contains(b3)).to.be(false);
      expect(ss.contains(b4)).to.be(true);

      expect(ss.find('a1')).to.be(a1);
      expect(ss.find('b1')).to.be(b1);
      expect(ss.find('b4')).to.be(b4);
      expect(ss.find('a2')).to.be(undefined);

      expect(ss.findInType('a1', 'A')).to.be(a1);
      expect(ss.findInType('a1', 'B')).to.be(undefined);
      expect(ss.findInType('b4', 'B')).to.be(b4);

      var items = ss.getItems().sort(byId);
      expect(items).to.eql([a1, a3, b1, b2, b4]);

      var allBs = ss.getItemsOfType('B').sort(byId);
      expect(allBs).to.eql([b1, b2, b4]);

      ss.erase(a1);
      ss.erase(a3);
      expect(ss.getAllTypes().sort()).to.eql(['B']);
    });

    it('#clear()', function() {
      ss.clear();
      expect(ss.size()).to.be(0);
      expect(ss.empty()).to.be(true);
    });

  });

  describe('label', function() {
    var a1 = new ClassA(1);
    var a2 = new ClassA(2);
    var a3 = new ClassA(3);
    var b1 = new ClassB('a');
    var b2 = new ClassB('b');
    var ss;

    it('#constructor()', function() {
      ss = new SetStore([a1, a2, a3, b1, b2], getKeyOf, setKeyOf, getTypeOf);
    });

    it('#setLableOf(item, label)', function() {
      ss.setLabelOf(a1, 'A1');
      ss.setLabelOf(b2, 'B2');
    });

    it('#getAllLables(item)', function() {
      expect(ss.getAllLabels().sort()).to.eql(['A1', 'B2']);
    });

    it('#getLableOf(item)', function() {
      expect(ss.getLabelOf(a1)).to.be('A1');
      expect(ss.getLabelOf(a2)).to.be('');
      expect(ss.getLabelOf(b2)).to.be('B2');
    });

    it('#findByLabel(lable)', function() {
      expect(ss.findByLabel('A1')).to.be(a1);
      expect(ss.findByLabel('B1')).to.be(undefined);
      expect(ss.findByLabel('B2')).to.be(b2);
    });

    it('#isLabeled(item)', function() {
      expect(ss.isLabeled(a1)).to.be(true);
      expect(ss.isLabeled(a3)).to.be(false);
    });

    it('#labelExists(label)', function() {
      expect(ss.labelExists('A1')).to.be(true);
      expect(ss.labelExists('A3')).to.be(false);
    });

    it('#unsetLabelOf(item)', function() {
      ss.unsetLabelOf(a1);

      expect(ss.getAllLabels().sort()).to.eql(['B2']);
      expect(ss.getLabelOf(a1)).to.be('');
      expect(ss.getLabelOf(b2)).to.be('B2');

      expect(ss.isLabeled(a1)).to.be(false);
      expect(ss.isLabeled(a3)).to.be(false);
      expect(ss.labelExists('A1')).to.be(false);
      expect(ss.labelExists('A3')).to.be(false);
    });
  });

});
