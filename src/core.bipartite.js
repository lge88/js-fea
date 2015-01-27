/*global require*/
// core.bipartite

function Bipartite(edges, getKeyOf, autoRemoveIsolatedNodes) {
  if (typeof edges === 'undefined') { edges = []; }
  if (typeof getKeyOf === 'function') { this.getKeyOf = getKeyOf; }
  if (typeof autoRemoveIsolatedNodes === undefined) {
    this._autoRemoveIsolatedNodes = false;
  } else {
    this._autoRemoveIsolatedNodes = autoRemoveIsolatedNodes;
  }

  this._l2r = {};
  this._r2l = {};

  this.addEdges(edges);
}

Bipartite.prototype.getNumOfLeftNodes = function() { return Object.keys(this._l2r).length; };
Bipartite.prototype.getNumOfRightNodes = function() { return Object.keys(this._r2l).length; };
Bipartite.prototype.getNumOfNodes = function() { return this.getNumOfLeftNodes() + this.getNumOfRightNodes(); };
Bipartite.prototype.getNumOfEdges = function() { var c = 0; this.forEachLeftNode(function(n) { c += this.getDegree(n); }, this); return c; };
Bipartite.prototype.empty = function() { return this.getNumOfNodes() === 0; };
Bipartite.prototype.clear = function() { this._l2r ={}; this._r2l = {}; return this; };
Bipartite.prototype.getKeyOf = function(item) { if (item && item._uid) return item._uid; else return item; };
Bipartite.prototype.addNode = function(group, n) {
  var k = this.getKeyOf(n);
  var table = /[lL](eft)?/.test(group) ? this._l2r :this._r2l;
  table[k] = { node: n, neighbors: {} };
  return this;
};

Bipartite.prototype.addLeftNode = function(l) { return this.addNode('l', l); };
Bipartite.prototype.addRightNode = function(r) { return this.addNode('r', r); };

Bipartite.prototype.addEdges = function(edges) {
  edges.forEach(function(edge) {
    var l = edge[0], r = edge[1];
    this.addEdge(l, r);
  }, this);
  return this;
};

Bipartite.prototype.addEdge = function(l, r) {
  if (Array.isArray(l)) { r = l[1]; l = l[0]; }
  var lk = this.getKeyOf(l), rk = this.getKeyOf(r);

  if (!this._l2r[lk]) { this._l2r[lk] = { node: l, neighbors: {} }; }
  if (!this._r2l[rk]) { this._r2l[rk] = { node: r, neighbors: {} }; }

  this._l2r[lk].neighbors[rk] = r;
  this._r2l[rk].neighbors[lk] = l;

  return this;
};
Bipartite.prototype.insert = Bipartite.prototype.addEdge;

Bipartite.prototype.removeEdge = function(l, r) {
  if (Array.isArray(l)) { r = l[1]; l = l[0]; }
  if (this.hasPair(l, r)) {
    var lk = this.getKeyOf(l), rk = this.getKeyOf(r);
    delete this._l2r[lk].neighbors[rk];
    delete this._r2l[rk].neighbors[lk];

    if (this._autoRemoveIsolatedNodes === true ) {
      if (Object.keys(this._l2r[lk].neighbors).length === 0) {
        delete this._l2r[lk];
      }
      if (Object.keys(this._r2l[rk].neighbors).length === 0) {
        delete this._r2l[rk];
      }
    }
  }
  return this;
};
Bipartite.prototype.erase = Bipartite.prototype.removeEdge;

Bipartite.prototype.removeNode = function(node) {
  var group = this.belongsTo(node);
  if (group === 'none') { return this; }

  this.getNeighbors(node).forEach(function(nb) {
    var l, r;
    if (group === 'left') { l = node; r = nb; }
    else { l = nb; r = node; }
    this.removeEdge(l, r);
  }, this);
  return this;
};
Bipartite.prototype.eraseNode = Bipartite.prototype.removeNode;

Bipartite.prototype.hasNode = function(node) {
  var key = this.getKeyOf(node);
  if (this._l2r[key]) { return true; }
  if (this._r2l[key]) { return true; }
  return false;
};

Bipartite.prototype.hasEdge = function(l, r) {
  var lk = this.getKeyOf(l), rk = this.getKeyOf(r);
  if (this._l2r[lk]) {
    var flag1 = typeof this._l2r[lk].neighbors[rk] !== 'undefined';
    var flag2 = typeof this._r2l[rk].neighbors[lk] !== 'undefined';
    console.assert(flag1 === flag2);
    return flag1;
  }
  return false;
};

Bipartite.prototype.contains = function(l, r) {
  var argv = Array.prototype.slice.call(arguments), argc = argv.length;
  if (argc <= 1) { return this.hasNode(argv[0]); }
  else { return this.hasEdge(argv[0]), argv[1]; }
};

Bipartite.prototype.isAdjacent = function(a, b) { return this.hasEdge(a, b) || this.hasEdge(b, a); };
Bipartite.prototype.hasPair = Bipartite.prototype.isAdjacent;

// If node is not in the graph, return empty list.
Bipartite.prototype.getNeighbors = function(node) {
  var key = this.getKeyOf(node), nbs = null;
  if (this._l2r[key]) { nbs = this._l2r[key].neighbors; }
  if (this._r2l[key]) { nbs = this._r2l[key].neighbors; }
  if (nbs === null) { return []; }
  return Object.keys(nbs).map(function(k) { return nbs[k]; });
};

// If node is not in the graph, return -1.
Bipartite.prototype.getDegree = function(node) {
  var key = this.getKeyOf(node);
  if (this._l2r[key]) { return Object.keys(this._l2r[key].neighbors).length; }
  if (this._r2l[key]) { return Object.keys(this._r2l[key].neighbors).length; }
  return -1;
};

// Return (left|right|none).
Bipartite.prototype.getGroupName = function(node) {
  var key = this.getKeyOf(node);
  if (this._l2r[key]) { return 'left'; }
  if (this._r2l[key]) { return 'right'; }
  return 'none';
};
Bipartite.prototype.belongsTo = Bipartite.prototype.getGroupName;

Bipartite.prototype.getNodesOfGroup = function(group, predicate) {
  var table = /[lL](eft)?/.test(group) ? this._l2r : this._r2l, nodes;
  nodes = Object.keys(table).map(function(k) { return table[k].node; });
  if (typeof predicate === 'function') { nodes = nodes.filter(predicate); }
  return nodes;
};
Bipartite.prototype.getLeftNodes = function(predicate) { return this.getNodesOfGroup('left', predicate); };
Bipartite.prototype.getRightNodes = function(predicate) { return this.getNodesOfGroup('right', predicate); };
Bipartite.prototype.getNodes = function(predicate) { return this.getLeftNodes(predicate).concat(this.getRightNodes(predicate)); };
Bipartite.prototype.forEachLeftNode = function(fn, scope) { this.getLeftNodes().forEach(fn, scope || this); };
Bipartite.prototype.forEachRightNode = function(fn, scope) { this.getRightNodes().forEach(fn, scope || this); };
Bipartite.prototype.forEachNode = function(fn, scope) { this.forEachLeftNode(fn, scope); this.forEachRightNode(fn, scope); };

Bipartite.prototype.forEachEdge = function(fn, scope) {
  var sc = scope || this;
  this.forEachLeftNode(function(l) {
    this.getNeighbors(l).forEach(function(r) {
      fn.call(sc, l, r);
    });
  }, this);
};

Bipartite.prototype.toDot = function() {
  var strs = ['graph g {'];
  this.forEachLeftNode(function(l) {
    this.getNeighbors(l).forEach(function(r) {
      var lk = this.getKeyOf(l), rk = this.getKeyOf(r);
      strs.push('  ' + lk + ' -- ' + rk);
    }, this);
  }, this);
  strs.push('}');
  return strs.join('\n');
};

exports.Bipartite = Bipartite;
