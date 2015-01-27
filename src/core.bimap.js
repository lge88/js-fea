/*global require*/
// core.bimap

function Bimap(pairs, getKeyOf) {
  this._l2r = {};
  this._r2l = {};
  if (typeof getKeyOf === 'function') { this.getKeyOf = getKeyOf; }
  if (Array.isArray(pairs)) {
    pairs.forEach(function(pair) {
      this.insert(pair[0], pair[1]);
    }, this);
  }
}

Bimap.prototype.insert= function(l, r) {
  if (Array.isArray(l)) { r = l[1]; l = l[0]; }
  var lk = this.getKeyOf(l), rk = this.getKeyOf(r);
  this._l2r[lk] = r;
  this._r2l[rk] = l;
  return this;
};
Bimap.prototype.add= Bimap.prototype.insert;

Bimap.prototype.size= function() { return Object.keys(this._l2r).length; };
Bimap.prototype.empty= function() { return this.size() === 0; };
Bimap.prototype.clear= function() { this._l2r = {}; this._r2l = {}; return this; };

Bimap.prototype.insertSafe= function(l, r) {
  if (Array.isArray(l)) { r = l[1]; l = l[0]; }
  var lk = this.getKeyOf(l);
  if (typeof this._l2r[lk] !== 'undefined') {
    throw new Error(l + ' with key' + lk + ' exists!');
  }
  this.add(l, r);
  return this;
};

Bimap.prototype.getKeyOf = function(item) { if (item && item._uid) return item._uid; else return item; };

Bimap.prototype.belongsTo = function(obj) {
  var k = this.getKeyOf(obj);
  if (typeof this._l2r[k] !== 'undefined') { return 'left'; }
  if (typeof this._r2l[k] !== 'undefined') { return 'right'; }
  return 'none';
};

Bimap.prototype.leftFind = function(l) { return this._l2r[this.getKeyOf(l)]; };
Bimap.prototype.rightFind = function(r) { return this._r2l[this.getKeyOf(r)]; };
Bimap.prototype.find = function(obj) { return this.leftFind(obj) || this.rightFind(obj); };
Bimap.prototype.lookup = Bimap.prototype.find;
Bimap.prototype.inLeft = function(obj) { return typeof this.leftFind(obj) !== 'undefined'; };
Bimap.prototype.inRight = function(obj) { return typeof this.rightFind(obj) !== 'undefined'; };
Bimap.prototype.containsObject = function(obj) { return typeof this.find(obj) !== 'undefined'; };
Bimap.prototype.containsPair = function(l, r) {
  if (Array.isArray(l)) { r = l[1]; l = l[0]; }
  var _r = this.leftFind(l);
  if (typeof _r !== 'undefined') {
    return this.getKeyOf(r) === this.getKeyOf(_r);
  }
  return false;
};
Bimap.prototype.contains = function() {
  var args = Array.prototype.slice.call(arguments), argc = args.length;
  if (argc <= 1) { return this.containsObject(args[0]); }
  else { return this.containsPair(args[0], args[1]); }
};

Bimap.prototype.leftRemove = function(l) {
  var r = this.leftFind(l);
  if (typeof r !== 'undefined') {
    delete this._l2r[this.getKeyOf(l)];
    this.rightRemove(r);
  }
  return this;
};

Bimap.prototype.rightRemove = function(r) {
  var l = this.rightFind(r);
  if (typeof l !== 'undefined') {
    delete this._r2l[this.getKeyOf(r)];
    this.leftRemove(l);
  }
  return this;
};

Bimap.prototype.removePair = function(l, r) {
  if (this.containsPair(l, r)) {
    delete this._l2r[this.getKeyOf(l)];
    delete this._r2l[this.getKeyOf(r)];
  }
  return this;
};

Bimap.prototype.remove = function() {
  var args = Array.prototype.slice.call(arguments), argc = args.length;
  if (argc <= 1) {
    var obj = args[0];
    if (this.inLeft(obj)) { this.leftRemove(obj); }
    else if (this.inRight(obj)) { this.rightRemove(obj); }
  } else {
    this.removePair(args[0], args[1]);
  }
  return this;
};

Bimap.prototype.erase = Bimap.prototype.remove;

Bimap.prototype.getNodes =  function(group) {
  if (!group) { return this.getLeftNodes().concat(this.getRightNodes()); }
  var table = /[lL](eft)?/.test(group) ? this._r2l : this._l2r;
  return Object.keys(table).map(function(k) { return table[k]; });
};
Bimap.prototype.getLeftNodes = function() { return this.getNodes('left'); };
Bimap.prototype.getRightNodes = function() { return this.getNodes('right'); };

Bimap.prototype.forEachNode = function(group, fn, scope) {
  var nodes = this.getNodes(group);
  nodes.forEach(fn, scope || this);
};
Bimap.prototype.forEachLeftNode = function(fn, scope) { this.forEachNode('left', fn, scope); };
Bimap.prototype.forEachRightNode = function(fn, scope) { this.forEachNode('right', fn, scope); };

Bimap.prototype.toJSON = function() {
  var out = {};
  this.forEachLeftNode(function(left) {
    var right = this.find(left);
    out[left] = right;
  }, this);
  return out;
};

exports.Bimap =Bimap;
