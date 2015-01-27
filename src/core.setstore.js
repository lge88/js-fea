/*global require*/
// core.setstore

var Bimap = require('./core.bimap').Bimap;

function SetStore(items, getKeyOf, setKeyOf, getTypeOf) {
  this._items = {};
  this._byLabels = new Bimap([], getLabelKey);
  this._byTypes = {};
  if (typeof getKeyOf === 'function') { this.getKeyOf = getKeyOf; }
  if (typeof setKeyOf === 'function') { this.setKeyOf = setKeyOf; }
  if (typeof getTypeOf === 'function') { this.getTypeOf = getTypeOf; }
  if (Array.isArray(items)) { items.forEach(function(x) { this.insert(x); }, this); }

  var _this = this;
  function getLabelKey(o) { return typeof o === 'string' ? o : _this.getKeyOf(o); }
}

SetStore.prototype.size = function() { return Object.keys(this._items).length; };
SetStore.prototype.empty = function() { return this.size() === 0; };
SetStore.prototype.clear = function() { this._items = {}; this._byTypes = {}; this._byLabels.clear(); };
SetStore.prototype.contains = function(item) { return typeof this.find(item) !== 'undefined'; };
SetStore.prototype.has = SetStore.prototype.contains;

SetStore.prototype.insert = function(item) {
  var k = this.getKeyOf(item), t = this.getTypeOf(item);
  if (typeof this._items[k] !== 'undefined') {
    return false;
  } else {
    this._items[k] = item;
    if (t) {
      if (typeof this._byTypes[t] === 'undefined') { this._byTypes[t] = {}; }
      this._byTypes[t][k] = item;
    }
    return true;
  }
};
SetStore.prototype.add = SetStore.prototype.insert;

SetStore.prototype.erase = function(item) {
  var k = this.getKeyOf(item), t = this.getTypeOf(item);
  if (typeof this._items[k] === 'undefined') {
    return false;
  } else {
    delete this._items[k];
    if (t) {
      delete this._byTypes[t][k];
      if (Object.keys(this._byTypes[t]).length === 0) { delete this._byTypes[t]; }
    }
    return true;
  }
};
SetStore.prototype.remove = SetStore.prototype.erase;

SetStore.prototype.find = function(obj) { var key = this.getKeyOf(obj); return this._items[key]; };
SetStore.prototype.get = SetStore.prototype.find;
SetStore.prototype.findInType = function(obj, type) {
  var key = this.getKeyOf(obj);
  var table = this._byTypes[type];
  if (table) { return table[key]; }
  else { return undefined; }
};
SetStore.prototype.getAllTypes = function() { return Object.keys(this._byTypes); };
SetStore.prototype.getTypeOf = function(o) { return (o && typeof o.getType === 'function') ? o.getType() : ''; };
SetStore.prototype.forEach = function(fn, scope) {
  var k, items = this._items, sc = scope || this;
  for (k in items) { fn.call(sc, items[k], k); }
};

SetStore.prototype.getKeyOf = function(o) { if (o && o._uid) return o._uid; else return o; };
SetStore.prototype.setKeyOf = function(v, k) { if (this.contains(v)) { this.erase(v); item._uid = k; this.insert(v); } };
SetStore.prototype.setLabelOf = function(item, label) {
  if (this.contains(item)) {
    if (typeof label === 'string' && label) { this._byLabels.insert(label, item); }
    else { this._byLabels.remove(item); }
  }
};
SetStore.prototype.unsetLabelOf = function(item) { this.setLabelOf(item, ''); };
SetStore.prototype.getLabelOf = function(item) { return this._byLabels.lookup(item) || ''; };
SetStore.prototype.findByLabel = function(label) { return this._byLabels.lookup(label); };
SetStore.prototype.isLabeled = function(item) { return this.getLabelOf(item) !== ''; };
SetStore.prototype.labelExists = function(label) { return this.findByLabel(label) !== undefined; };
SetStore.prototype.getAllLabels = function() { return this._byLabels.getLeftNodes(); };

SetStore.prototype.getItemsOfType = function(type, predicate) {
  var items = this._byTypes[type];
  items = Object.keys(items).map(function(k) { return items[k]; });
  if (typeof predicate === 'function') { items = items.filter(predicate); }
  return items;
};

SetStore.prototype.getItems = function(predicate) {
  var items = this._items;
  items = Object.keys(items).map(function(k) { return items[k]; });
  if (typeof predicate === 'function') { items = items.filter(predicate); }
  return items;
};

exports.SetStore = SetStore;
