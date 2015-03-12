var fe =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

	_.assign(exports, __webpack_require__(2));
	_.assign(exports, __webpack_require__(3));
	_.assign(exports, __webpack_require__(4));
	_.assign(exports, __webpack_require__(5));

	exports._ = _;
	exports.numeric = __webpack_require__(6);

	exports.geometry = {
	  pointset: __webpack_require__(7),
	  topology: __webpack_require__(8)
	};

	exports.feutils = __webpack_require__(9);
	exports.fens = __webpack_require__(10);
	exports.gcellset = __webpack_require__(11);
	exports.field = __webpack_require__(12);
	exports.property = __webpack_require__(13);
	exports.material = __webpack_require__(14);
	exports.feblock = __webpack_require__(15);
	exports.system = __webpack_require__(16);
	exports.nodalload = __webpack_require__(17);
	exports.integrationrule = __webpack_require__(18);
	exports.ebc = __webpack_require__(19);
	exports.mesh = __webpack_require__(20);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/

	// var _ = require('highland');
	var _ = __webpack_require__(24);
	var numeric = __webpack_require__(25);

	var conflicts = [
	  'all',
	  'any',
	  'clone',
	  'identity',
	  'isFinite',
	  'isNaN',
	  'max',
	  'min',
	  'random'
	];

	// TODO: do not mount numeric directly under _ namespace.
	_(numeric)
	  .keys()
	  .difference(conflicts)
	  .forEach(function(method) {
	    _[method] = numeric[method];
	  });

	_.numeric = numeric;

	_.Bimap = __webpack_require__(2).Bimap;
	_.Bipartite= __webpack_require__(3).Bipartite;
	_.SetStore = __webpack_require__(4).SetStore;

	function array1d(m, fn) {
	  if (typeof fn === 'function') {
	    return Array.apply(null, Array(m)).map(function(x, i) { return fn(i); });
	  } else {
	    return Array.apply(null, Array(m)).map(function() { return fn; });
	  }
	}
	_.array1d = array1d;

	function array2d(m, n, fn) {
	  if (typeof fn === 'function') {
	    return array1d(m, function(i) {
	      return array1d(n, function(j) {
	        return fn(i, j);
	      });
	    });
	  } else {
	    return array1d(m, function(i) {
	      return array1d(n, fn);
	    });
	  }
	}
	_.array2d = array2d;

	function embed(vec, dim) {
	  var i, len, out;
	  if (_.isArray(vec) && typeof dim === 'number') {
	    out = array1d(dim, 0.0);
	    for (i = 0, len = vec.length < dim ? vec.length : dim; i < len; ++i) out[i] = vec[i];
	    return out;
	  }
	  throw new Error('embed(vec, dim): vec must be a Javascript array.');
	}
	_.embed = embed;


	// a and b are array of numbers in same dimension.
	function byLexical(a, b) {
	  var i = 0, l = a.length, res;
	  while (i < l) {
	    res = a[i] - b[i];
	    if (res !== 0) return res;
	    ++i;
	  }
	  return res;
	}
	_.byLexical = byLexical;

	function rotateLeft(arr, offset) {
	  if (typeof offset === 'undefined')
	    throw new Error('rotateLeft(): no offset specified.');

	  var len = arr.length;
	  var out = new Array(len);
	  var i = (len + (offset % len)) % len, j = 0;
	  while (j < len) {
	    out[j] = arr[(i+j) % len];
	    ++j;
	  }
	  return out;
	}
	function rotateRight(arr, offset) { return rotateLeft(arr, -offset); }
	_.rotateLeft = rotateLeft;
	_.rotateRight = rotateRight;

	function minIndex(vec) {
	  return _.reduce(vec, function(sofar, x, i) {
	    if (x < sofar.value) {
	      sofar.value = x;
	      sofar.index = i;
	    }
	    return sofar;
	  }, {
	    value: Infinity,
	    index: -1
	  }).index;
	}
	_.minIndex = minIndex;

	function isIterator(iter) {
	  return iter && typeof iter.hasNext === 'function' &&
	    typeof iter.next === 'function';
	}
	_.isIterator = isIterator;

	_.noopIterator = {
	  hasNext: function() { return false; },
	  next: function() { return null; }
	};

	function listFromIterator(iter) {
	  var out = [];
	  while (iter.hasNext()) out.push(iter.next());
	  return out;
	}
	_.listFromIterator = listFromIterator;

	function iteratorFromList(lst) {
	  if (!_.isArray(lst)) {
	    throw new Error('iteratorFromList(lst): lst must be an array.');
	  }

	  var i = 0, len = lst.length;
	  return {
	    hasNext: function() { return i < len; },
	    next: function() { return lst[i++]; }
	  };
	}
	_.iteratorFromList = iteratorFromList;

	function uuid() {
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	  });
	}
	_.uuid = uuid;


	function normalizedCell(cell) {
	  var offset = minIndex(cell);
	  return rotateLeft(cell, offset);
	}
	_.normalizedCell = normalizedCell;


	// Type checking & contracts:
	var check = __webpack_require__(26);
	var assert = __webpack_require__(23);

	_._env = 'dev';

	function noop() {}
	_.noop = noop;

	function defineContract(c, whatsWrong) {
	  if (_._env === 'dev') {
	    return function() {
	      try {
	        c.apply(null, arguments);
	      } catch(err) {
	        if (typeof whatsWrong === 'function')
	          err.message = whatsWrong.apply(null, arguments) + '\n' + err.message;

	        if (whatsWrong)
	          err.message = whatsWrong + '\n' + err.message;

	        throw err;
	      }
	    };
	  } else {
	    return noop;
	  }
	}

	assert.string = check.assert.string;
	assert.unemptyString = check.assert.unemptyString;
	assert.webUrl = check.assert.webUrl;
	assert.length = check.assert.length;
	assert.number = check.assert.number;
	assert.positive = check.assert.positive;
	assert.negative = check.assert.negative;
	assert.odd = check.assert.odd;
	assert.even = check.assert.even;
	assert.integer = check.assert.integer;
	assert.function = check.assert.function;
	assert.array = check.assert.array;
	assert.length = check.assert.length;
	assert.date = check.assert.date;
	assert.object = check.assert.object;
	assert.emptyObject = check.assert.emptyObject;
	assert.instance = check.assert.instance;
	assert.like = check.assert.like;
	assert.null = check.assert.null;
	assert.undefined = check.assert.undefined;
	assert.assigned = check.assert.assigned;
	assert.boolean = check.assert.boolean;

	_.check = check;
	_.assert = assert;
	_.defineContract = defineContract;

	_.contracts = {};

	function matrixOfDimension(m, n, msg) {
	  if (m !== '*') assert.positive(m);
	  if (n !== '*') assert.positive(n);

	  if (!msg) msg = 'input is not a matrix of ' + m + ' x ' + n + '.';
	  return defineContract(function(mat) {
	    assert.array(mat, 'mat is not a JS array');

	    if (m === '*') m = mat.length;
	    assert(mat.length === m, 'mat length ' + mat.length + ' is not '+ m);

	    var i, j;
	    for (i = 0; i < m; ++i) {
	      assert.array(mat[i], 'row ' + i + ' is not a JS array');
	      if (n === '*') n = mat[i].length;
	      assert(mat[i].length === n, 'row ' + i + ' has ' + mat[i].length + ' elements' +
	             ' instead of ' + n);
	      for (j = 0; j < n; ++j) {
	        assert.number(mat[i][j], 'mat(' + [i,j] + ') is not a number.');
	      }
	    }
	  }, msg);
	};

	_.contracts.matrixOfDimension = matrixOfDimension;

	function isMatrixOfDimension(mat, m, n) {
	  try {
	    matrixOfDimension(m, n)(mat);
	  } catch(err) {
	    return false;
	  }
	  return true;
	}
	_.isMatrixOfDimension = isMatrixOfDimension;

	function vectorOfDimension(n, msg) {
	  if (n !== '*') assert.positive(n);
	  if (!msg) msg = 'input is not a vector of ' + n + ' dimension.';
	  return defineContract(function(vec) {
	    assert.array(vec, 'vec is not a JS array');
	    if (n === '*') n = vec.length;
	    assert(vec.length === n, 'vec length ' + vec.length + ' is not ' + n);

	    var i;
	    for (i = 0; i < n; ++i)
	      assert.number(vec[i], 'vec(' + i + '): ' + vec[i] + ' is not a number.');

	  }, msg);

	}

	_.contracts.vectorOfDimension = vectorOfDimension;


	function isVectorOfDimension(vector, n) {
	  try {
	    vectorOfDimension(n)(vector);
	  } catch(err) {
	    return false;
	  }
	  return true;
	}
	_.isVectorOfDimension = isVectorOfDimension;


	module.exports = exports = _;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

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

	exports.Bimap = Bimap;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// core.setstore

	var Bimap = __webpack_require__(2).Bimap;

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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// femodel

	// FUNCTIONS:
	//   FeObject()
	//   __node__()
	//   FeNode(x, y, z, model)
	//   FeNodeProperty(feModel)
	//   FeSPC()
	//   FeNodalLoad()
	//   FeElement(nodes, model)
	//   FeElementProperty(feModel)
	//   TrussElementProperty(fem, A, E)
	//   FeTimeSeries(feModel)
	//   FePattern(ts, feModel)
	//   FePlainPattern(ts, feModel)
	//   FeModel()
	//   __helpers__()
	//   uuid()
	//   NotImplementedError(msg)
	//   getId(obj)
	//   setId(item, id)
	//   getTypeOf(obj)
	//   repeat(val, n)
	//   addToSet(arr, item)
	//   uniq(arr, getKey, seen)
	//   clone(obj, shallow)
	// //
	// [FeObject] constructor:
	//   FeObject()
	// //
	// [FeObject] instance methods:
	//   FeObject::uid()
	//   FeObject::getId()
	//   FeObject::setId(id)
	//   FeObject::getLabel()
	//   FeObject::setLabel(t)
	//   FeObject::getType()
	//   FeObject::clone()
	//   FeObject::copy(other)
	//   FeObject::toJSON()
	//   FeObject::setFromJSON(json)
	// //
	// [FeNode] constructor:
	//   FeNode(x, y, z, model)
	// //
	// [FeNode] instance methods:
	//   FeNode::getType()
	//   FeNode::clone()
	//   FeNode::copy(other)
	//   FeNode::toJSON()
	//   FeNode::setFromJSON(json)
	//   FeNode::getElements()
	//   FeNode::isInElement(feEle)
	//   FeNode::isAdjacentTo(feNode)
	//   FeNode::getAdjacentNodes()
	//   FeNode::setConstraint()
	//   FeNode::getNumOfConstraints()
	//   FeNode::isFree()
	//   FeNode::isConstrained()
	//   FeNode::setFixedIn()
	//   FeNode::setFreeIn()
	//   FeNode::isFreeIn()
	//   FeNode::isFixedIn()
	//   FeNode::isFixedIn()
	// //
	// [FeNodeProperty] constructor:
	//   FeNodeProperty(feModel)
	// //
	// [FeNodeProperty] class methods:
	//   FeNodeProperty.prototype[method]()
	// //
	// [FeNodeProperty] instance methods:
	//   FeNodeProperty::getType()
	//   FeNodeProperty::clone(other)
	//   FeNodeProperty::copy(other)
	//   FeNodeProperty::toJSON()
	//   FeNodeProperty::getNodes()
	//   FeNodeProperty::getNumOfNodes()
	//   FeNodeProperty::setNodes(nodes)
	//   FeNodeProperty::getValues()
	//   FeNodeProperty::method]()
	// //
	// [FeSPC] constructor:
	//   FeSPC()
	// //
	// [FeSPC] instance methods:
	//   FeSPC::getType()
	//   FeSPC::copy(other)
	//   FeSPC::clone()
	//   FeSPC::toJSON()
	//   FeSPC::getValue()
	//   FeSPC::setValue(comps)
	//   FeSPC::setConstraint(dir, val)
	//   FeSPC::getNumOfConstraints()
	//   FeSPC::isFree()
	//   FeSPC::isConstrained()
	//   FeSPC::setFixedIn(dirs)
	//   FeSPC::setFreeIn(dirs)
	//   FeSPC::isFreeIn(dir)
	//   FeSPC::isFixedIn(dir)
	// //
	// [FeNodalLoad] constructor:
	//   FeNodalLoad()
	// //
	// [FeNodalLoad] instance methods:
	//   FeNodalLoad::getType()
	//   FeNodalLoad::_setType(t)
	//   FeNodalLoad::getValues()
	//   FeNodalLoad::_setValues(vals)
	//   FeNodalLoad::isZero()
	//   FeNodalLoad::getValueAt(dirs)
	//   FeNodalLoad::setValueAt(dir, val)
	// //
	// [FeElement] constructor:
	//   FeElement(nodes, model)
	// //
	// [FeElement] instance methods:
	//   FeElement::getType()
	//   FeElement::toJSON()
	//   FeElement::getNodes()
	//   FeElement::getNumOfNodes()
	//   FeElement::hasNode(feNode)
	//   FeElement::isAdjacentTo(feEle)
	//   FeElement::getAdjacentElements()
	// //
	// [FeElementProperty] constructor:
	//   FeElementProperty(feModel)
	// //
	// [FeElementProperty] instance methods:
	//   FeElementProperty::getType()
	//   FeElementProperty::getElements()
	//   FeElementProperty::setElements(eles)
	//   FeElementProperty::getValue()
	//   FeElementProperty::setValue(val)
	// //
	// [TrussElementProperty] constructor:
	//   TrussElementProperty(fem, A, E)
	// //
	// [TrussElementProperty] instance methods:
	//   TrussElementProperty::getType()
	//   TrussElementProperty::copy(other)
	//   TrussElementProperty::clone(other)
	// //
	// [FeTimeSeries] constructor:
	//   FeTimeSeries(feModel)
	// //
	// [FeTimeSeries] instance methods:
	//   FeTimeSeries::getType()
	//   FeTimeSeries::setType(t)
	//   FeTimeSeries::getFactor()
	//   FeTimeSeries::setFactor(f)
	//   FeTimeSeries::getParams()
	//   FeTimeSeries::setParams(params)
	//   FeTimeSeries::evalAt(time)
	//   FeTimeSeries::toJSON()
	// //
	// [FePattern] constructor:
	//   FePattern(ts, feModel)
	// //
	// [FePattern] instance methods:
	//   FePattern::getType()
	//   FePattern::getTimeSeries()
	//   FePattern::setTimeSeries(ts)
	//   FePattern::getFactor()
	//   FePattern::setFactor(f)
	//   FePattern::setAsCurrent()
	// //
	// [FePlainPattern] constructor:
	//   FePlainPattern(ts, feModel)
	// //
	// [FePlainPattern] instance methods:
	//   FePlainPattern::getType()
	//   FePlainPattern::createNodalLoad(values, type)
	//   FePlainPattern::createNodalLoad(values, type)
	//   FePlainPattern::createBeamUniformLoad(values)
	//   FePlainPattern::createBeamPointLoad(values)
	//   FePlainPattern::assignNodalLoad(nodes, nodalLoad)
	//   FePlainPattern::getNodalLoad(node)
	//   FePlainPattern::toJSON()
	// //
	// [FeModel] constructor:
	//   FeModel()
	// //
	// [FeModel] class methods:
	//   FeModel.createFromJSON(json)
	// //
	// [FeModel] instance methods:
	//   FeModel::find(obj)
	//   FeModel::findInType(obj, type)
	//   FeModel::findNode(obj)
	//   FeModel::findElement(obj)
	//   FeModel::setIdOf(obj, id)
	//   FeModel::getIdOf(obj)
	//   FeModel::setLabelOf(item, label)
	//   FeModel::getLabelOf(item)
	//   FeModel::findByLabel(label)
	//   FeModel::createNode(x, y, z)
	//   FeModel::createElement(nodes)
	//   FeModel::assignNodeProperty(nodes, nodeProp)
	//   FeModel::createNodalLoad(values)
	//   FeModel::assignNodalLoad(nodes, nodalLoad)
	//   FeModel::createElementProperty(type, args_)
	//   FeModel::assignElementProperty(eles, eleProp)
	//   FeModel::getNodeProperty(node)
	//   FeModel::createSPC(dims, vals)
	//   FeModel::assignSPC(nodes, spc)
	//   FeModel::createPattern(type, ts)
	//   FeModel::getCurrentPattern()
	//   FeModel::setCurrentPattern(p)
	//   FeModel::getNodes()
	//   FeModel::getElements()
	//   FeModel::forEachNode(fn, scope)
	//   FeModel::forEachElement(fn, scope)
	//   FeModel::getAABB()
	//   FeModel::getXRange()
	//   FeModel::getYRange()
	//   FeModel::getZRange()
	//   FeModel::getXDiff()
	//   FeModel::getYDiff()
	//   FeModel::getZDiff()
	//   FeModel::getDimension()
	//   FeModel::toJSON()
	//   FeModel::setFromJSON(json)
	//   FeModel::copy(other)
	//   FeModel::clone()

	var Bipartite = __webpack_require__(3).Bipartite;
	var Bimap = __webpack_require__(2).Bimap;
	var SetStore = __webpack_require__(4).SetStore;

	function FeObject() { this._uid = this.generateUid(); }
	FeObject.prototype.generateUid = uuid;
	FeObject.prototype.uid = function() { return this._uid; };
	FeObject.prototype.getId = function() { return this._model ? this._model.getIdOf(this) : this._uid; };
	FeObject.prototype.setId = function(id) { if (this._model) { this._model.setIdOf(this, id); } return this; };
	FeObject.prototype.getLabel = function() { return this._model ? this._model.getLabelOf(this) : ''; };
	FeObject.prototype.setLabel = function(t) { if (this._model) { this._model.setLabelOf(this, t); } return this; };

	// Return type string
	FeObject.prototype.getType = function() { throw new NotImplementedError; };

	// Return a new intance of FeObject
	FeObject.prototype.clone = function() { throw new NotImplementedError; };

	// Copy another FeObject, return this.
	FeObject.prototype.copy = function(other) { throw new NotImplementedError; };

	// Serialize object to plain json
	FeObject.prototype.toJSON = function() { throw new NotImplementedError; };

	// Set state from plain json
	FeObject.prototype.setFromJSON = function(json) { throw new NotImplementedError; };

	function __node__() {}
	function FeNode(x, y, z, model) {
	  FeObject.call(this);
	  x = parseFloat(x); y = parseFloat(y); z = parseFloat(z);
	  this.x = isNaN(x) ? 0.0 : x;
	  this.y = isNaN(y) ? 0.0 : y;
	  this.z = isNaN(z) ? 0.0 : z;
	  this._model = model;
	}

	FeNode.prototype = Object.create(FeObject.prototype);
	FeNode.prototype.constructor = FeNode;

	FeNode.prototype.getType = function() { return 'fe_node'; };

	FeNode.prototype.clone = function() {
	  return new FeNode(this.x, this.y, this.z, this._model);
	};

	FeNode.prototype.copy = function(other) {
	  this.x = other.x; this.y = other.y; this.z = other.z;
	  return this;
	};

	FeNode.prototype.toJSON = function() {
	  var json = {};
	  json.x = this.x; json.y = this.y; json.z = this.z;
	  return json;
	};

	FeNode.prototype.setFromJSON = function(json) {
	  this.x = json.x; this.y = json.y; this.z = json.z;
	  return this;
	};

	FeNode.prototype.getElements = function() {
	  var model = this._model;
	  var eles = model._nodeEleGraph.getNeighbors(this);
	  return Array.isArray(eles) ? eles : [];
	};

	FeNode.prototype.isInElement = function(feEle) {
	  var nodeEleGraph = this._model._nodeEleGraph;
	  return nodeEleGraph.hasEdge(this, feEle);
	};

	FeNode.prototype.isAdjacentTo = function(feNode) {
	  var nodes = this.getAdjacentNodes();
	  return nodes.indexOf(feNode) !== -1;
	};

	FeNode.prototype.getAdjacentNodes = function() {
	  var eles = this.getElements();
	  var out = [], seen = {};
	  seen[this.uid()] = true;
	  eles.forEach(function(ele) {
	    var nodes = ele.getNodes();
	    nodes.forEach(function(n) {
	      var nid = n.uid();
	      if (!seen[nid]) {
	        out.push(n);
	        seen[nid] = true;
	      }
	    });
	  });
	  return out;
	};

	// Following methods assigns node to node property in the graph.
	// If the property is not set up yet, it creates one first.

	FeNode.prototype.setConstraint = function() {};
	FeNode.prototype.getNumOfConstraints = function() {};
	FeNode.prototype.isFree = function() {};
	FeNode.prototype.isConstrained = function() {};
	FeNode.prototype.setFixedIn = function() {};
	FeNode.prototype.setFreeIn = function() {};
	FeNode.prototype.isFreeIn = function() {};
	FeNode.prototype.isFixedIn = function() {};
	FeNode.prototype.isFixedIn = function() {};

	function FeNodeProperty(feModel) {
	  FeObject.call(this);

	  // TODO: need to distinguish undefined vs defined but value is zero
	  this._values = {
	    spc: new FeSPC(),
	    forceLoad: new FeNodalLoad(),
	    dispLoad: new FeNodalLoad()
	  };
	  this._values.forceLoad.setType('force');
	  this._values.dispLoad.setType('disp');
	  this._model = feModel;
	}

	FeNodeProperty.prototype = Object.create(FeObject.prototype);
	FeNodeProperty.prototype.constructor = FeNodeProperty;

	FeNodeProperty.prototype.getType = function() { return 'fe_node_property'; };

	FeNodeProperty.prototype.clone = function(other) {
	  var np = new FeNodeProperty(this._model);
	  np.copy(this);
	  return this;
	};

	FeNodeProperty.prototype.copy = function(other) {
	  this._model = other._model;

	  this.setNodes(other.getNodes());

	  this._values = {};
	  this._valuse.spc = new FeSPC();
	  this._values.spc.copy(other._values.spc);

	  this._valuse.forceLoad = new FeNodalLoad();
	  this._values.forceLoad.copy(other._values.forceLoad);

	  this._valuse.dispLoad = new FeNodalLoad();
	  this._values.dispLoad.copy(other._values.dispLoad);
	  return this;
	};

	FeNodeProperty.prototype.toJSON = function() {
	  var json = {};
	  json.nodes = this.getNodes().map(getId);
	  json.values = this.getValues();
	  return json;
	};

	// FeNodeProperty.prototype.setFromJSON = function(json) {};

	FeNodeProperty.prototype.getNodes = function() {
	  var nodePropGraph = this._model._nodePropGraph;
	  var out = nodePropGraph.getNeighbors(this);
	  return Array.isArray(out) ? out : [];
	};

	FeNodeProperty.prototype.getNumOfNodes = function() {
	  return this.getNodes().length;
	};

	FeNodeProperty.prototype.setNodes = function(nodes) {
	  this._model.assignNodeProperty(nodes, this);
	  return this;
	};

	FeNodeProperty.prototype.getValues = function() {
	  var values = {};
	  if (this._values.spc.isConstrained()) {
	    values.spc = this._values.spc.getValue();
	  }

	  if (!this._values.forceLoad.isZero()) {
	    values.forceLoad = this._values.forceLoad.getValue();
	  }

	  if (!this._values.dispLoad.isZero()) {
	    values.dispLoad = this._values.dispLoad.getValue();
	  }
	  return values;
	};
	// FeNodeProperty.prototype.setValue = function(v) { return this; };

	// Forward methods to spc

	// Method forward:
	var spcMethods = [
	  'setConstraint',
	  'getNumOfConstraints',
	  'isFree',
	  'isConstrained',
	  'setFixedIn',
	  'setFreeIn',
	  'isFreeIn',
	  'isFixedIn'
	];

	spcMethods.forEach(function(method) {
	  FeNodeProperty.prototype[method] = function() {
	    var res = this._values.spc[method].apply(this._values.spc, arguments);
	    if (res === this._values.spc) { res = this; }
	    return res;
	  };
	});

	function FeSPC() {
	  FeObject.call(this);

	  // null means not constrained
	  this._comps = repeat(null, 6);
	}

	FeSPC.prototype = Object.create(FeNodeProperty.prototype);
	FeSPC.prototype.constructor = FeSPC;
	FeSPC.prototype.getType = function() { return 'spc'; };

	FeSPC.prototype.copy = function(other) {
	  this._comps = clone(other._comps);
	  return this;
	};

	FeSPC.prototype.clone = function() {
	  var cloned = new FeSPC();
	  cloned._comps = clone(this._comps);
	  return cloned;
	};

	FeSPC.prototype.toJSON = function() {
	  var json = {};
	  json.components = clone(this._comps);
	  return json;
	};

	FeSPC.prototype.getValue = function() { return clone(this._comps); };
	FeSPC.prototype.setValue = function(comps) {
	  this._comps = clone(comps);
	  return this;
	};

	// Specific for SPC:
	FeSPC.prototype.setConstraint = function(dir, val) {
	  if (Array.isArray(dir)) {
	    dir.forEach(function(d, i) {
	      var v = Array.isArray(val) ? val[i] : val;
	      this.setConstraint(d, v);
	    }, this);
	  } else {
	    var i = this._comps.length;
	    for (; i < dir; ++i) { this._comps[i] = null; }
	    this._comps[dir] = val;
	  }
	  return this;
	};

	FeSPC.prototype.getNumOfConstraints = function() {
	  var count = 0;
	  this._comps.forEach(function(c) {
	    if (c !== null) ++count;
	  });
	  return count;
	};

	FeSPC.prototype.isFree = function() {
	  return this.getNumOfConstraints() === 0;
	};

	FeSPC.prototype.isConstrained = function() {
	  return !this.isFree();
	};

	FeSPC.prototype.setFixedIn = function(dirs) {
	  if (!Array.isArray(dirs)) { dirs = [dirs]; }
	  var vals = dirs.map(function() { return 0; });
	  this.setConstraint(dirs, vals);
	  return this;
	};

	FeSPC.prototype.setFreeIn = function(dirs) {
	  if (!Array.isArray(dirs)) { dirs = [dirs]; }
	  var vals = dirs.map(function() { return null; });
	  this.setConstraint(dirs, vals);
	  return this;
	};

	FeSPC.prototype.isFreeIn = function(dir) {
	  var val = this._comps[dir];
	  return (val === null) || (typeof val === 'undefined');
	};

	FeSPC.prototype.isFixedIn = function(dir) { return !this.isFree(dir); };

	function FeNodalLoad() {
	  FeObject.call(this);

	  this._type = '';
	  this._values = repeat(0.0, 6);
	}

	FeNodalLoad.prototype = Object.create(FeNodeProperty.prototype);
	FeNodalLoad.prototype.constructor = FeNodalLoad;

	FeNodalLoad.prototype.getType = function() { return this._type; };
	FeNodalLoad.prototype._setType = function(t) {
	  this._type = /^(nodal_)?[dD]isp(lacement)?(_load)?$/.test(t) ?
	    'nodal_displacement_load' : 'nodal_force_load';
	  return this;
	};

	FeNodalLoad.prototype.getValues = function() { return this._values.slice(); };
	FeNodalLoad.prototype._setValues = function(vals) {
	  this._values = vals.slice();
	  return this;
	};

	FeNodalLoad.prototype.isZero = function() {
	  return this._values.reduce(function(acc, cur) {
	    return acc + cur*cur;
	  }, 0.0) === 0.0;
	};

	FeNodalLoad.prototype.getValueAt = function(dirs) {
	  if (typeof dirs === 'undefined') { return this.getValues(); };

	  if (!Array.isArray(dirs)) { dirs = [dirs]; }

	  return dirs.map(function(d) {
	    var val = this._values[d];
	    return (typeof val === 'number' && !isNaN(val)) ? val : 0.0;
	  }, this);
	};

	FeNodalLoad.prototype.setValueAt = function(dir, val) {
	  if (Array.isArray(dir)) {
	    dir.forEach(function(d, i) {
	      var v = Array.isArray(val) ? val[i] : val;
	      this.setLoad(d, v);
	    }, this);
	  } else {
	    var i = this._values.length;
	    for (; i < dir; ++i) { this._values[i] = 0.0; }
	    this._values[dir] = val;
	  }
	  return this;
	};


	// conn is an array of FeNodes
	// prop is an object
	function FeElement(nodes, model) {
	  FeObject.call(this);

	  this._nodes = nodes.slice();
	  this._model = model;

	  var nodeEleGraph = model._nodeEleGraph;
	  this._nodes.forEach(function(n) {
	    nodeEleGraph.addEdge(n, this);
	  }, this);
	}

	FeElement.prototype = Object.create(FeObject.prototype);
	FeElement.prototype.constructor = FeElement;

	FeElement.prototype.getType = function() { return 'fe_element'; };

	// FeElement.prototype.setId = function(id) {
	//   this._model.setElementId(this, id);
	//   return this;
	// };

	// FeElement.prototype.getLabel = function() {
	//   return '' + this._tag;
	// };

	// FeElement.prototype.setLabel = function(t) { this._model.setLabelOf(this, t); return this; };

	FeElement.prototype.toJSON = function() {
	  var json = {};
	  json.id = this.uid();
	  json.nodes = this._nodes.map(function(n) { return n.uid(); });
	  return json;
	};

	FeElement.prototype.getNodes = function() {
	  return this._nodes.slice();
	};

	FeElement.prototype.getNumOfNodes = function() {
	  return this._nodes.length;
	};

	FeElement.prototype.hasNode = function(feNode) {
	  return this._nodes.indexOf(feNode) !== -1;
	};

	FeElement.prototype.isAdjacentTo = function(feEle) {
	  var eles = this.getAdjacentElements();
	  return eles.indexOf(feEle) !== -1;
	};

	FeElement.prototype.getAdjacentElements = function() {
	  var out = [], seen = {};
	  seen[this.uid()] = true;
	  var nodes = this._nodes;
	  nodes.forEach(function(n) {
	    var eles = n.getElements();
	    eles.forEach(function(ele) {
	      var eid = ele.uid();
	      if (!seen[eid]) {
	        out.push(ele);
	        seen[eid] = true;
	      }
	    });
	  });
	  return out;
	};

	function FeElementProperty(feModel) {
	  FeObject.call(this);
	  this._model = feModel;
	}
	FeElementProperty.prototype = Object.create(FeObject.prototype);
	FeElementProperty.prototype.constructor = FeElementProperty;
	FeElementProperty.prototype.getType = function() { return ''; };

	FeElementProperty.prototype.getElements = function() {
	  // var propEleMap = this._model._propEleMap;
	  var elePropGraph = this._model._elePropGraph;
	  // var out = eleNodeMap[this.uid()];
	  var out = elePropGraph.getNeighbors(this);
	  return Array.isArray(out) ? out : [];
	};

	FeElementProperty.prototype.setElements = function(eles) {
	  var id = this.uid();
	  var elePropGraph = this._model._elePropGraph;

	  if (!Array.isArray(eles)) { eles = [eles]; }
	  eles.forEach(function(ele) {
	    elePropGraph.addEdge(ele, this);
	  }, this);

	  return this;
	};

	FeElementProperty.prototype.getValue = function() { return null; };
	FeElementProperty.prototype.setValue = function(val) { return this; };

	function TrussElementProperty(fem, A, E) {
	  FeElementProperty.call(this, fem);
	  this.A = A;
	  this.E = E;
	}
	TrussElementProperty.prototype = Object.create(FeElementProperty.prototype);
	TrussElementProperty.prototype.constructor = TrussElementProperty;
	TrussElementProperty.prototype.getType = function() { return 'truss'; };
	TrussElementProperty.prototype.copy = function(other) {
	  this._model = other._model;
	  this.A = other.A;
	  this.E = other.E;
	  return this;
	};
	TrussElementProperty.prototype.clone = function(other) {
	  return new TrussElementProperty(this._model, this.A, this.E);
	};


	function FeTimeSeries(feModel) {
	  FeObject.call(this);
	  this._model = feModel;
	  this._type = '';
	  this._factor = 1.0;
	  this._params = {};

	  this.setType('Linear');
	}
	FeTimeSeries.prototype = Object.create(FeObject.prototype);
	FeTimeSeries.prototype.constructor = FeTimeSeries;

	FeTimeSeries.prototype.getType = function() { return this._type; };
	FeTimeSeries.prototype.setType = function(t) {
	  // TODO:
	  if (/^[lL]inear$/.test(t)) {
	    this._type = 'linear';
	  } else if (/^[cC]onstant$/.test(t)) {
	    this._type = 'constant';
	  } else {
	    throw new Error('Unknown time series type' + t + '!');
	  }
	  return this;
	};
	FeTimeSeries.prototype.getFactor = function() { return this._factor; };
	FeTimeSeries.prototype.setFactor = function(f) {
	  f = parseFloat(f);
	  this._factor = isNaN(f) ? 1.0 : f;
	  return this;
	};
	FeTimeSeries.prototype.getParams = function() { return clone(this._params); };
	FeTimeSeries.prototype.setParams = function(params) {
	  this._params = clone(params);
	  return this;
	};
	FeTimeSeries.prototype.evalAt = function(time) {
	  var type = this._type;
	  var params = this._params;
	  var f = this._factor;

	  switch(type) {
	  case 'linear':
	    return f * time;
	    break;
	  case 'constant':
	  default:
	    return f;
	  }
	};
	FeTimeSeries.prototype.toJSON = function() {
	  var json = {};
	  json.id = this.uid();
	  json.type = this.getType();
	  json.factor = this.getFactor();
	  json.params = this.getParams();
	  return json;
	};

	function FePattern(ts, feModel) {
	  FeObject.call(this);

	  this._ts = ts;
	  this._model = feModel;
	}
	FePattern.prototype = Object.create(FeObject.prototype);
	FePattern.prototype.constructor = FePattern;

	FePattern.prototype.getType = function() { return ''; };

	FePattern.prototype.getTimeSeries = function() { return this._ts; };
	FePattern.prototype.setTimeSeries = function(ts) {
	  this._ts = ts;
	  return this;
	};

	FePattern.prototype.getFactor = function() { return this._ts.getFactor(); };
	FePattern.prototype.setFactor = function(f) {
	  this._ts.setFactor(f);
	  return this;
	};

	FePattern.prototype.setAsCurrent = function() {
	  this._model.setCurrentPattern(this);
	  return this;
	};

	function FePlainPattern(ts, feModel) {
	  FePattern.call(this, ts, feModel);

	  this._nodeProps = {};
	  this._eleProps = {};

	  this._nodalLoads = {};
	  this._nodalLoadGraph = new Bipartite([], getId, false);

	  this._eleLoads = {};
	  this._eleLoadGraph = new Bipartite([], getId, false);
	}
	FePlainPattern.prototype = Object.create(FePattern.prototype);
	FePlainPattern.prototype.constructor = FePlainPattern;

	FePlainPattern.prototype.getType = function() { return 'plain'; };

	// FePlainPattern.prototype.createNodeProperty = function(nodes) {
	//   var nodeProp = new FeNodeProperty(this._model);
	//   if (typeof nodes !== 'undefined') {
	//     this.assignNodeProperty(nodes, nodeProp);
	//   }
	//   var id = nodeProp.uid();
	//   this._nodeProps[id] = nodeProp;
	//   return nodeProp;
	// };

	// // TODO: make sure each node has at most only one nodeProp.
	// FePlainPattern.prototype.assignNodeProperty = function(nodes, nodeProp) {
	//   var id = nodeProp.uid();
	//   // var propNodeMap = this._model._propNodeMap;
	//   var nodePropGraph = this._model._nodePropGraph;

	//   if (!Array.isArray(nodes)) { nodes = [nodes]; }
	//   // propNodeMap[id] = uniq(nodes, getId);
	//   nodes.forEach(function(n) {
	//     nodePropGraph.addEdge(n, nodeProp);
	//   });

	//   return this;
	// };

	FePlainPattern.prototype.createNodalLoad = function(values, type) {
	  var load = new FeNodalLoad();
	  load._setType(type);
	  load._setValues(values);
	  this._nodalLoads[load.uid()] = load;
	  return load;
	};

	FePlainPattern.prototype.createNodalLoad = function(values, type) {
	  var load = new FeNodalLoad();
	  load._setType(type);
	  load._setValues(values);
	  this._nodalLoads[load.uid()] = load;
	  return load;
	};

	FePlainPattern.prototype.createBeamUniformLoad = function(values) {
	  return null;
	};

	FePlainPattern.prototype.createBeamPointLoad = function(values) {
	  return null;
	};




	// FIXME: make sure each node has at most one nodalLoad
	FePlainPattern.prototype.assignNodalLoad = function(nodes, nodalLoad) {
	  var nodalLoadGraph = this._nodalLoadGraph;

	  if (!Array.isArray(nodes)) { nodes = [nodes]; }
	  nodes.forEach(function(n) {
	    nodalLoadGraph.addEdge(n, nodalLoad);
	  });
	  return this;
	};

	// FePlainPattern.prototype.assignElementProperty = function(eles, eleProp) {

	// };

	// TODO: handle multiple nodes
	FePlainPattern.prototype.getNodalLoad = function(node) {
	  var nodalLoadGraph = this._nodalLoadGraph;
	  var res = {}, load;
	  if (nodalLoadGraph.hasNode(node)) {
	    load = nodalLoadGraph.getNeighbors()[0];
	  } else {
	    load = new FeNodalLoad();
	  }
	  res.type = load.getType();
	  res.values = load.getValues();
	  return res;
	};

	// FePlainPattern.prototype.getNodeProperty = function(node) {
	//   var key, nodeProps = this._nodeProps;
	//   var prop, nodes;

	//   for (key in nodeProps) {
	//     prop = nodeProps[key];
	//     nodes = prop.getNodes();
	//     if (nodes.indexOf(node) !== -1) { return prop; }
	//   }

	//   return null;
	// };

	FePlainPattern.prototype.toJSON = function() {
	  var json = {};
	  json.id = this.uid();
	  json.type = this.getType();

	  json.nodalLoads = Object.keys(this._nodeProps).map(function(k) {
	    return this[k].toJSON();
	  }, this._nodeProps);

	  json.eleProps = Object.keys(this._eleProps).map(function(k) {
	    return this[k].toJSON();
	  }, this._eleProps);

	  return json;
	};


	function FeModel() {
	  FeObject.call(this);

	  // A set of objects grouped by type info.
	  this._objects = new SetStore([], getId, setId, getTypeOf);

	  // Data structures that support extra queries:
	  //   node->elements, element->elements, node->nodes.
	  this._nodeEleGraph = new Bipartite([], getId, false);

	  // Associate property to a list of nodes/elements/patterns
	  this._nodePropGraph = new Bipartite([], getId, false);
	  this._elePropGraph = new Bipartite([], getId, false);
	  this._patternPropGraph = new Bipartite([], getId, false);
	  this._timeSeriesPatternMap = new Bimap([], getId);

	  // Init default objects:
	  // var defaultTimeSeries = new FeTimeSeries(this);
	  // var defaultPattern = new FePlainPattern(defaultTimeSeries, this);
	  // var defaultPattern = this.createPattern('Plain');

	  // `Current' pointers
	  // this._currentPattern = defaultPattern;
	  // this._patterns = {};
	  // this._patterns[this._currentPattern.uid()] = this._currentPattern;
	}

	FeModel.prototype = Object.create(FeObject.prototype);
	FeModel.prototype.constructor = FeModel;

	FeModel.prototype.find = function(obj) { return this._objects.find(obj); };
	FeModel.prototype.getObject = FeModel.prototype.find;
	FeModel.prototype.findInType = function(obj, type) { return this._objects.findInType(obj, type); };
	FeModel.prototype.findNode = function(obj) { return this.findInType(obj, 'fe_node'); };
	FeModel.prototype.findElement = function(obj) { return this.findInType(obj, 'fe_element'); };
	FeModel.prototype.setIdOf = function(obj, id) { this._objects.setKeyOf(obj, id); };
	FeModel.prototype.getIdOf = function(obj) { return this._objects.getKeyOf(obj); };
	FeModel.prototype.setLabelOf = function(item, label) { this._objects.setLabelOf(item, label); };
	FeModel.prototype.getLabelOf = function(item) { return this._objects.getLabelOf(item); };
	FeModel.prototype.findByLabel = function(label) { return this._objects.findByLabel(label); };

	FeModel.prototype.createNode = function(x, y, z) {
	  if (Array.isArray(x)) { y = x[1]; z = x[2]; x = x[0]; }
	  var n = new FeNode(x, y, z, this);
	  this._objects.insert(n);
	  return n;
	};

	FeModel.prototype.createElement = function(nodes) {
	  var e = new FeElement(nodes, this);
	  this._objects.insert(e);
	  return e;
	};

	// FeModel.prototype.setNodeTag = function(feNode, tag) { this.setLabelOf(feNode, tag); };
	// FeModel.prototype.setElementTag = function(feEle, tag) { this.setLabelOf(feEle, tag); };

	// TODO: refactor this method to FePattern
	// FeModel.prototype.createNodeProperty = function(nodes) {
	//   var pattern = this.getCurrentPattern();
	//   return pattern.createNodeProperty(nodes);
	// };

	FeModel.prototype.assignNodeProperty = function(nodes, nodeProp) {
	  var pattern = this.getCurrentPattern();
	  pattern.assignNodeProperty(nodes, nodeProp);
	  return this;
	};

	FeModel.prototype.createNodalLoad = function(values) {
	  var pattern = this.getCurrentPattern();
	  return pattern.createNodalLoad(values);
	};

	FeModel.prototype.assignNodalLoad = function(nodes, nodalLoad) {
	  var pattern = this.getCurrentPattern();
	  pattern.assignNodalLoad(nodes, nodeLoad);
	  return this;
	};

	FeModel.prototype.createElementProperty = function(type, args_) {
	  var args =  Array.prototype.slice.call(arguments);
	  args.shift();

	  var prop;

	  // parse args, call constructors based on type
	  if (/[tT]russ/.test(type)) {
	    var A = args.shift();
	    var E = args.shift();
	    prop = new TrussElementProperty(this, A, E);
	  }

	};

	FeModel.prototype.assignElementProperty = function(eles, eleProp) {
	  // var id = nodeProp.uid();
	  // var propNodeMap = this._model._propNodeMap;
	  var elePropGraph = this._elePropGraph;

	  if (!Array.isArray(eles)) { eles = [eles]; }
	  // propNodeMap[id] = uniq(nodes, getId);
	  eles.forEach(function(ele) {
	    elePropGraph.addEdge(ele, eleProp);
	  });

	  return this;

	  var pattern = this.getCurrentPattern();
	  pattern.assignElementProperty(eles, eleProp);
	  return this;
	};

	FeModel.prototype.getNodeProperty = function(node) {
	  var pattern = this.getCurrentPattern();
	  return pattern.getNodeProperty(node);
	};

	FeModel.prototype.createSPC = function(dims, vals) {
	  var spc = this.createNodeProperty();

	  spc.setConstraint(dims, vals);
	  return spc;
	};

	FeModel.prototype.assignSPC = function(nodes, spc) {
	  this.assignNodeProperty(nodes, spc);
	  return this;
	};

	FeModel.prototype.createPattern = function(type, ts) {
	  var pattern;
	  if (/^[pP]lain$/.test(type)) {
	    pattern = new PlainPattern(ts, this);
	  } else if (/^[uU]niform(Excitation)?$/.test(type)) {
	    pattern = new UniformPattern(ts, this);
	  } else {
	    throw new Error('Unknown load pattern type ' + type + '!');
	  }

	  this.setCurrentPattern(pattern);
	  return pattern;
	};

	FeModel.prototype.getCurrentPattern = function() {
	  return this._currentPattern;
	};

	FeModel.prototype.setCurrentPattern = function(p) {
	  var pid = getId(p);
	  if (typeof this._patterns[pid] === 'undefined') {
	    this._patterns[pid] = p;
	  }
	  this._currentPattern = p;
	  return this;
	};

	FeModel.prototype.getNodes = function() {
	  return this._nodeEleGraph.getLeftNodes();
	};

	FeModel.prototype.getElements = function() {
	  return this._nodeEleGraph.getRightNodes();
	};

	FeModel.prototype.forEachNode = function(fn, scope) {
	  var k, items = this._nodes, s = scope || this;
	  this._nodeEleGraph.forEachLeftNode(fn, scope);
	};

	FeModel.prototype.forEachElement = function(fn, scope) {
	  var k, items = this._elements, s = scope || this;
	  this._nodeEleGraph.forEachRightNode(fn, scope);
	};

	// return [xmin, xmax, ymin, ymax, zmin, zmax]
	FeModel.prototype.getAABB = function() {
	  var aabb = [
	    Infinity, -Infinity,
	    Infinity, -Infinity,
	    Infinity, -Infinity
	  ];
	  this.forEachNode(function(n) {
	    if (n.x < aabb[0]) aabb[0] = n.x;
	    else if (n.x > aabb[1]) aabb[1] = n.x;

	    if (n.y < aabb[2]) aabb[2] = n.y;
	    else if (n.y > aabb[3]) aabb[3] = n.y;

	    if (n.z < aabb[4]) aabb[4] = n.z;
	    else if (n.z > aabb[5]) aabb[5] = n.z;
	  });
	  return aabb;
	};

	FeModel.prototype.getXRange = function() { return this.getAABB().slice(0, 2); };
	FeModel.prototype.getYRange = function() { return this.getAABB().slice(2, 4); };
	FeModel.prototype.getZRange = function() { return this.getAABB().slice(4); };

	FeModel.prototype.getXDiff = function() {
	  var r = this.getXRange();
	  return r[1] - r[0];
	};

	FeModel.prototype.getYDiff = function() {
	  var r = this.getYRange();
	  return r[1] - r[0];
	};

	FeModel.prototype.getZDiff = function() {
	  var r = this.getZRange();
	  return r[1] - r[0];
	};

	FeModel.TOL = 1e-8;
	FeModel.prototype.getDimension = function() {
	  var tol = FeModel.TOL;
	  var dim = 0;
	  dim += this.getXDiff() > tol ? 1 : 0;
	  dim += this.getYDiff() > tol ? 1 : 0;
	  dim += this.getZDiff() > tol ? 1 : 0;
	  return dim;
	};

	FeModel.prototype.toJSON = function() {
	  var json = {};
	  json.id = this.uid();

	  json.nodes = Object.keys(this._nodes).map(function(k) {
	    var node = this[k];
	    var json = node.toJSON();
	    json.id = node.uid();
	    return json;
	  }, this._nodes);

	  json.elements = Object.keys(this._elements).map(function(k) {
	    var ele = this[k];
	    var json = ele.toJSON();
	    json.id = ele.uid();
	    return json;
	  }, this._elements);

	  json.currentPattern = this._currentPattern.uid();
	  json.patterns = Object.keys(this._patterns).map(function(k) {
	    return this[k].toJSON();
	  }, this._patterns);

	  return json;
	};

	FeModel.prototype.setFromJSON = function(json) {
	  return this;
	};

	FeModel.prototype.copy = function(other) {
	  this.setFromJSON(other.toJSON());
	};

	FeModel.prototype.clone = function() {
	  this.setFromJSON(other.toJSON());
	};

	// TODO: nodes and elements are duplicate
	FeModel.createFromJSON = function(json) {
	  var m = new FeModel();
	  json.id && (m._uid = json.id);

	  // Some meta info:
	  // refType can be by tag or by id;
	  var refType = json.refType || 'id';

	  var nodes = json.nodes;
	  if (Array.isArray(nodes)) {
	    nodes.forEach(function(n) {
	      var newNode = m.createNode(n.x, n.y, n.z);
	      n.id && (newNode.setId(n.id));
	    });
	  }

	  var eles = json.elements;
	  if (Array.isArray(eles)) {
	    eles.forEach(function(ele) {
	      var nodes = ele.nodes.map(function(nid) {
	        return m.getObject(nid);
	      });

	      var newEle = m.createElement(nodes);
	      ele.id && (newEle.setId(ele.id));
	    });
	  }

	  // var nodeProps = json.nodeProps;
	  // if (Array.isArray(nodeProps)) {
	  //   nodeProps.forEach(function(prop) {
	  //     var nodes = ele.nodes.map(function(nid) { return m.getObject(nid); });
	  //     var newEle = m.createElement(nodes);
	  //     ele.id && (newEle.setId(ele.id));
	  //   });
	  // }

	  return m;
	};

	function __helpers__() {}

	function uuid() {
	  var res = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
	  return res.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	  });
	};

	function NotImplementedError(msg) {
	  this.name = 'NotImplementedError';
	  this.message = msg;
	  this.stack = (new Error()).stack;
	}
	NotImplementedError.prototype = new Error;

	function getId(obj) {
	  if (typeof obj === 'string' || typeof obj === 'number') { return obj; }
	  if (obj && typeof obj === 'object' && typeof obj.uid === 'function') { return obj.uid(); }
	  if (typeof obj._uid !== 'undefined') { return obj._uid; }
	  return '';
	}

	function setId(item, id) {
	  if (this.contains(item)) {
	    this.erase(item);
	    item._uid = id;
	    this.insert(item);
	  }
	}

	function getTypeOf(obj) {
	  if (obj && typeof obj.getType === 'function') { return obj.getType(); }
	  if (typeof obj === 'string') { return 'string'; }
	  if (typeof obj === 'number') { return 'number'; }
	  if (Array.isArray(obj)) { return 'array'; }
	  if (typeof obj === 'function') { return 'function'; }
	  if (typeof obj === 'object') { return 'object'; }
	  return '';
	}

	function repeat(val, n) {
	  var arr = new Array(n);
	  while (n--) { arr[n] = val; }
	  return arr;
	}

	function addToSet(arr, item) {
	  if (-1 === arr.indexOf(item)) {
	    arr.push(item);
	    return true;
	  }
	  return false;
	}

	function uniq(arr, getKey, seen) {
	  getKey || (getKey = function(x) { return x; });
	  seen || (seen = {});
	  return arr.filter(function(x) {
	    var key = getKey(x);
	    if (!seen[key]) {
	      seen[key] = true;
	      return true;
	    } else {
	      return false;
	    }
	  });
	}

	function clone(obj, shallow) {
	  if (obj && typeof obj.clone === 'function') { return obj.clone(); }
	  if (Array.isArray(obj)) { return obj.slice(); }
	  if (typeof obj === 'object') {
	    var cloned = {}, key;
	    if (shallow === true) {
	      for (key in obj) {
	        if (obj.hasOwnProperty(key)) { cloned[key] = obj[key]; }
	      }
	    } else {
	      for (key in obj) {
	        if (obj.hasOwnProperty(key)) { cloned[key] = clone(obj[key]); }
	      }
	    }
	    return cloned;
	  }
	  return obj;
	}

	exports.FeObject = FeObject;
	exports.FeNode = FeNode;
	exports.FeElement = FeElement;
	exports.FeSPC = FeSPC;
	exports.FeModel = FeModel;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// core.numeric

	var _ = __webpack_require__(1);
	var cloneDeep = _.cloneDeep;
	var array1d = _.array1d;
	var array2d = _.array2d;
	var listFromIterator = _.listFromIterator;

	var numeric = __webpack_require__(25);
	var ccsSparse = numeric.ccsSparse;
	var ccsFull = numeric.ccsFull;
	var ccsLUP = numeric.ccsLUP;
	var ccsLUPSolve = numeric.ccsLUPSolve;

	function norm(x) {
	  return Math.sqrt(numeric.sum(numeric.pow(x, 2)));
	}
	exports.norm = norm;

	// A(i, :), i starts from 1;
	function nthRow(A, i) { return A[i-1]; }
	exports.nthRow = nthRow;

	// A(:, i), i starts from 1;
	function nthColumn(A, i) {
	  return A.map(function(x) {
	    return [x[i-1]];
	  });
	}
	exports.nthColumn = nthColumn;

	function ix(A, rows, cols) {
	  // check A, rows, cols
	  var mA = size(A, 1), nA = size(A, 2);
	  if (rows === ':') rows = array1d(mA, function(i) { return i+1; });
	  if (cols === ':') cols = array1d(nA, function(i) { return i+1; });
	  var m = rows.length, n = cols.length;

	  var out = array2d(m, n, 0);
	  rows.forEach(function(row, i) {
	    var rowIndx = row - 1;
	    cols.forEach(function(col, j) {
	      var colIndx = col - 1;
	      out[i][j] = A[rowIndx][colIndx];
	    });
	  });
	  return out;
	}
	exports.ix = ix;

	function ixUpdate(A, rows, cols, val) {
	  // check A, rows, cols
	  var mA = size(A, 1), nA = size(A, 2);
	  if (rows === ':') rows = array1d(mA, function(i) { return i+1; });
	  if (cols === ':') cols = array1d(nA, function(i) { return i+1; });
	  var m = rows.length, n = cols.length;

	  if (typeof val === 'number')
	    val = array2d(m, n, val);

	  var out = cloneDeep(A);
	  rows.forEach(function(row, i) {
	    var rowIndx = row - 1;
	    cols.forEach(function(col, j) {
	      var colIndx = col - 1;
	      out[rowIndx][colIndx] = val[i][j];
	    });
	  });
	  return out;
	}
	exports.ixUpdate = ixUpdate;

	function colon(from, to, step) {
	  if (typeof step !== 'number') step = 1;
	  var out = [], val = from;
	  if (step > 0) {
	    while (val <= to) {
	      out.push(val);
	      val = val + step;
	    }
	  } else if (step < 0) {
	    while (val >= to) {
	      out.push(val);
	      val = val + step;
	    }
	  } else
	    throw new Error('colon(): step must not equals to 0.');
	  return out;
	}

	exports.colon = colon;

	// pre: mat is a matrix;
	function size(mat, dim) {
	  if (dim === 1)
	    return mat.length;
	  else if (dim === 2)
	    return mat[0].length;
	  else
	    return [mat.length, mat[0].length];
	}
	exports.size = size;

	function vecEquals(a, b, aTolerance) {
	  if (!_.isArray(a) || !_.isArray(b)) return false;
	  if (a.length !== b.length) return false;
	  if (a.length === 0) return false;

	  var i, len = a.length;
	  for (i = 0; i < len; ++i)
	    if (typeof a[i] !== 'number') return false;

	  for (i = 0; i < len; ++i)
	    if (typeof b[i] !== 'number') return false;

	  var tolerance = aTolerance || vecEquals.TOLERANCE;
	  var d = numeric.sub(a, b);

	  var absError = numeric.norm2(d);
	  if (absError === 0) return true;

	  var relativeError = absError / numeric.norm2(b);
	  return relativeError < tolerance;
	};
	vecEquals.TOLERANCE = 1e-4;
	exports.vecEquals = vecEquals;
	exports.array1dEquals = vecEquals;

	// both a and b are 2d array
	function array2dEquals(a, b, aTolerance) {
	  if (a.length !== b.length) return false;

	  var m = a.length;
	  if (m === 0) return false;

	  var n = a[0].length || 0;
	  if (n === 0) return false;
	  if (!(b && b[0] && b[0].length === n)) return false;

	  var tolerance = typeof aTolerance === 'number' ? aTolerance : array2dEquals.TOLERANCE;
	  var d = numeric.sub(a, b);

	  var absError = numeric.norm2(d);
	  if (absError === 0) return true;

	  var relativeError = absError / numeric.norm2(b);
	  return relativeError < tolerance;
	}
	array2dEquals.TOLERANCE = 1e-4;
	exports.array2dEquals = array2dEquals;
	exports.matrixEquals = array2dEquals;

	// input: ccs representation
	// output: iterator that emits a sequence of (i, j, value) tuple.
	function ccsValueListIterator(ccs) {
	  var indicesForFirstNonZeroElementInEachColumn = ccs[0];
	  var rowIndices = ccs[1];
	  var values = ccs[2], len = values.length;
	  var i = 0, currentColumn = 0;
	  return {
	    hasNext: function() {
	      return i < len;
	    },
	    next: function() {
	      var row, col, val, res;
	      row = rowIndices[i];
	      col = currentColumn;
	      val = values[i];
	      res = [ row, col, val ];

	      // update:
	      var indexAtNewColumn = indicesForFirstNonZeroElementInEachColumn[currentColumn + 1];
	      ++i;
	      if (i >= indexAtNewColumn) {
	        ++currentColumn;
	      }

	      return res;
	    }
	  };
	}
	exports.ccsValueListIterator = ccsValueListIterator;

	// check whether a JS array is matrix like.
	function isMatrixLikeArray(arr) {
	  if (!_.isArray(arr)) return false;
	  if (arr.length <= 0) return false;

	  if (!_.isArray(arr[0])) return false;
	  var m = arr.length, n = arr[0].length;
	  if (n <= 0) return false;

	  var i;
	  for (i = 1; i < m; ++i)
	    if (!_.isArray(arr[i]) || arr[i].length !== n) return false;

	  return true;
	}
	exports.isMatrixLikeArray = isMatrixLikeArray;

	// Prerequisites: mat is a matrix-like 2d JS array.
	function matrixSize(mat) {
	  return [mat.length, mat[0].length];
	}

	function DenseMatrix(m, n, fn) {
	  if (typeof m === 'number' && m > 0 &&
	      typeof n === 'number' && n > 0) {
	    this._m = m;
	    this._n = n;
	    this._data = _.array2d(m, n, typeof fn !== 'undefined' ? fn : 0);
	  } else if (isMatrixLikeArray(m)) {
	    this._data = _.cloneDeep(m);

	    var size = matrixSize(m);
	    this._m = size[0];
	    this._n = size[1];
	  } else if (m instanceof DenseMatrix){
	    this._m = m._m;
	    this._n = m._n;
	    this._data = _.cloneDeep(m._data);
	  } else {
	    throw new Error('DenseMatrix(m, n): m and n must be positive integer.');
	  }
	}

	DenseMatrix.prototype.at = function(i, j) {
	  if (i >= 0 && i < this._m && j >= 0 && j < this._n) {
	    return this._data[i][j];
	  }
	  throw new Error('DenseMatrix::at(): index ' + [i, j] + ' outof bound ' + [this.m, this.n]);
	};

	DenseMatrix.prototype.size = function() {
	  return [this._m, this._n];
	};

	DenseMatrix.prototype.m = function() { return this._m; };
	DenseMatrix.prototype.n = function() { return this._n; };

	DenseMatrix.prototype.set_ = function(i, j, val) {
	  if (i < 0 || i >= this._m || j < 0 || j >= this._n)
	    throw new Error('DenseMatrix::set(): index ' + [i, j] + ' outof bound ' + [this.m, this.n]);

	  if (typeof val !== 'number')
	    throw new Error('DenseMatrix::set_(i, j, val): val must be a number.');

	  this._data[i][j] = val;
	};

	DenseMatrix.prototype.toFull = function() {
	  return _.cloneDeep(this._data);
	};

	DenseMatrix.prototype.toCcs = function() {
	  return ccsSparse(this._data);
	};

	exports.DenseMatrix = DenseMatrix;

	function ensureMatrixDimension(mat, m, n) {
	  var dmat = new DenseMatrix(mat);
	  if (m !== null && dmat.m() !== m)
	    throw new Error('ensureMatrixDimension(mat, m, n): mat.m = ' +
	                    dmat.m() + ' but expect m = ' + m);

	  if (n !== null && dmat.n() !== n)
	    throw new Error('ensureMatrixDimension(mat, m, n): mat.n = ' +
	                    dmat.n() + ' but expect n = ' + n);

	  return mat;
	}
	// could be turned off by set numeric.ensureMatrixDimension = function(x) { return x; }
	exports.ensureMatrixDimension = ensureMatrixDimension;

	function DokSparseMatrix(valueList, m, n) {
	  if ((m | 0) !== m || m <= 0 || (n | 0) !== n || n <= 0)
	    throw new Error('DokSparseMatrix(ijvLst, m, n): m, n must be ' +
	                   'positive integer.');

	  this._m = m;
	  this._n = n;
	  this._dict = {};

	  var iter = _.noopIterator;
	  if (_.isArray(valueList)) {
	    iter = _.iteratorFromList(valueList);
	  } else if (_.isIterator(valueList)) {
	    iter = valueList;
	  }

	  var ijv, i, j, val;
	  while (iter.hasNext()) {
	    ijv = iter.next();
	    i = ijv[0];
	    j = ijv[1];
	    val = ijv[2];
	    this.set_(i, j, val);
	  }
	}

	DokSparseMatrix.prototype.size = function() { return [this.m, this.n]; };

	DokSparseMatrix.prototype.m = function() { return this._m; };
	DokSparseMatrix.prototype.n = function() { return this._n; };

	DokSparseMatrix.prototype.at = function(i, j) {
	  if (i >= 0 && i < this._m && j >= 0 && j < this._n) {
	    if (this._dict[j] && this._dict[j][i]) {
	      return this._dict[j][i];
	    }
	    return 0.0;
	  }
	  throw new Error('DokSparseMatrix::at(i, j): i,j: ' + [i, j] + ' outof dimension m, n: ' + [this._m, this._n]);
	};

	DokSparseMatrix.prototype.set_ = function(i, j, val) {
	  if (i >= 0 && i < this._m && j >= 0 && j < this._n) {
	    if (typeof val !== 'number')
	      throw new Error('DokSparseMatrix::set_(i, j, val): val must be a number. val = ' + val);

	    // Internally the dict is store the column index as first layer, then row index.
	    // This make convertion to ccs efficient.
	    if (!this._dict[j]) this._dict[j] = {};
	    this._dict[j][i] = val;
	    return;
	  }
	  throw new Error('DokSparseMatrix::set_(i, j, val): i,j: ' + [i, j] + ' outof dimension m, n: ' + [this._m, this._n]);
	};

	DokSparseMatrix.prototype.toFull = function() {
	  var m = this._m, n = this._n, out = array2d(m, n, 0.0);
	  Object.keys(this._dict).forEach(function(j) {
	    Object.keys(this._dict[j]).forEach(function(i) {
	      out[i][j] = this.at(i, j);
	    }, this);
	  }, this);

	  return out;
	};

	DokSparseMatrix.prototype.toCcs = function() {
	  var dict = this._dict, m = this._m, n = this._n;
	  var ccs = [ [0], [], [] ];
	  var nzCountInColumns = array1d(n, function(i) {
	    if (typeof dict[i] !== 'undefined')
	      return Object.keys(dict[i]).length;
	    return 0;
	  });

	  nzCountInColumns.forEach(function(count) {
	    var indices = ccs[0], sofar = indices[indices.length - 1];
	    indices.push(sofar + count);
	  });

	  var cols = Object.keys(dict).sort(function(a, b) {
	    return parseInt(a) - parseInt(b);
	  });

	  cols.forEach(function(col) {
	    Object.keys(dict[col]).forEach(function(row) {
	      var val = dict[col][row];
	      ccs[1].push(row);
	      ccs[2].push(val);
	    });
	  });

	  return ccs;
	};

	DokSparseMatrix.prototype.toJSON = function() {
	  return { m: this.m, n: this.n, values: this.toValueList() };
	};

	DokSparseMatrix.prototype.toValueList = function() {
	  var values = [], dict = this._dict;
	  Object.keys(dict).forEach(function(i) {
	    Object.keys(dict[i]).forEach(function(j) {
	      var val = dict[i][j];
	      values.push([i, j, val]);
	    });
	  });
	  return values;
	};

	// b is a [number]
	// Return a [number]
	DokSparseMatrix.prototype.solveVector = function(b) {
	  if (this._m !== this._n) {
	    throw new Error('DokSparseMatrix::solve can only be used by square matrix where this.m === this.n.');
	  }

	  if (this._m !== b.length) {
	    throw new Error('DokSparseMatrix::solve can only be applied to vector of same dimension.');
	  }

	  var A = this.toCcs();
	  var lup = ccsLUP(A);
	  return ccsLUPSolve(lup, b);
	};

	// b is a SparseVector
	// Return a SparseVector
	DokSparseMatrix.prototype.solveSparseVector = function(b) {
	  if (!(b instanceof SparseVector)) {
	    throw new Error('DokSparseMatrix::solveSparseVector(b): b must be a SparseVector.');
	  }

	  if (this._m !== b.length()) {
	    throw new Error('DokSparseMatrix::solve can only be applied to vector of same dimension.');
	  }

	  var A = this.toCcs();
	  var lup = ccsLUP(A);
	  var ccsB = b.toCcs();

	  // TODO: make it fast..
	  // var ccsX = ccsSparse(ccsFull(ccsLUPSolve(lup, ccsB)));
	  var ccsX = ccsLUPSolve(lup, ccsB);

	  var valueList = listFromIterator(ccsValueListIterator(ccsX)).map(function(tuple) {
	    return [tuple[0], tuple[2]];
	  });
	  var res = new SparseVector(valueList, this._m);
	  return res;
	};

	exports.DokSparseMatrix = DokSparseMatrix;

	function SparseVector(valueList, dimension) {
	  if ((dimension | 0) !== dimension || dimension <= 0)
	    throw new Error('SparseVector(valueList, dimension): dimension must be positive integer.');

	  this._dim = dimension;
	  this._dict = {};

	  var iter = _.noopIterator;
	  if (_.isArray(valueList)) {
	    iter = _.iteratorFromList(valueList);
	  } else if (_.isIterator(valueList)) {
	    iter = valueList;
	  }

	  var item, idx, val;
	  while (iter.hasNext()) {
	    item = iter.next();
	    idx = item[0];
	    val = item[1];
	    if (val !== 0)
	      this.set_(idx, val);
	  }
	}

	SparseVector.prototype.length = function() { return this._dim; };
	SparseVector.prototype.dim = SparseVector.prototype.length;

	SparseVector.prototype.nzCount = function() {
	  var count = 0, k;
	  for (k in this._dict) ++count;
	  return count;
	};

	SparseVector.prototype.at = function(i) {
	  if (i >=0 && i < this._dim) {
	    var val = this._dict[i];
	    if (typeof val === 'number') return val;
	    return 0;
	  }
	  throw new Error('SparseVector::at(i): index outof bound.');
	};

	SparseVector.prototype.valueListIterator = function() {
	  var i = 0, indices = Object.keys(this._dict), len = indices.length;
	  var dict = this._dict;
	  indices.sort(function(a, b) {
	    return parseInt(a) - parseInt(b);
	  });

	  return {
	    hasNext: function() { return i < len; },
	    next: function() {
	      var idx = indices[i], item = [parseInt(idx), dict[idx]];
	      ++i;
	      return item;
	    }
	  };
	};

	SparseVector.prototype.equals = function(other, aTolerance) {
	  // TODO: better implementation
	  var a = this.toList();
	  var b = typeof other.toList === 'function' ? other.toList() : other;
	  var ok = vecEquals(a, b, aTolerance);
	  return ok;
	};

	SparseVector.prototype.set_ = function(i, val) {
	  if (i < 0 || i >= this._dim)
	    throw new Error('SparseVector::set_(i): index outof bound.');

	  if (typeof val !== 'number')
	    throw new Error('SparseVector::set_(i, val): val must be a number. val = ' + val);

	  if (val !== 0)
	    this._dict[i] = val;
	};


	SparseVector.prototype.toCcs = function() {
	  var dict = this._dict, dim = this._dim, key, i;
	  var ccs = [ [0, -1], [], [] ];
	  var nNonZeros = 0;
	  for (key in dict) {
	    i = parseInt(key);
	    ccs[1].push(i);
	    ccs[2].push(dict[i]);
	    ++nNonZeros;
	  }
	  ccs[0][1] = nNonZeros;
	  return ccs;
	};

	SparseVector.prototype.toFull = function() {
	  var dim = this._dim, dict = this._dict;
	  return array2d(dim, 1, function(i, j) {
	    if (typeof dict[i] === 'number')
	      return dict[i];
	    return 0;
	  });
	};

	SparseVector.prototype.toList = function() {
	  var dim = this._dim, dict = this._dict;
	  return array1d(dim, function(i) {
	    if (typeof dict[i] === 'number')
	      return dict[i];
	    return 0;
	  });
	};

	function mldivide(A, b) {
	  if (A instanceof DokSparseMatrix && b instanceof SparseVector) {
	    return A.solveSparseVector(b);
	  } else if (A instanceof DokSparseMatrix && _.isArray(b)) {
	    return A.solveVector(b);
	  }

	  throw new Error('mldivide(A, b): unsupported type A or b. A, b: ' + A + ', ' + b);
	}
	exports.mldivide = mldivide;

	function eye(n) {
	  return array2d(n, n, function(i, j) {
	    if (i === j) return 1;
	    return 0;
	  });
	}
	exports.eye = eye;


	exports.SparseVector = SparseVector;
	_.assign(exports, numeric);


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// geometry.pointset

	// FUNCTIONS:
	//   PointSet()
	// //
	// [PointSet] constructor:
	//   PointSet()
	// //
	// [PointSet] instance methods:
	//   PointSet::getSize()
	//   PointSet::getRn()
	//   PointSet::clone()
	//   PointSet::toJSON()
	//   PointSet::toList()
	//   PointSet::equals(other)
	//   PointSet::get(index)
	//   PointSet::set_(index, point)
	//   PointSet::forEach(iterator)
	//   PointSet::map(transform)
	//   PointSet::filter(predicate)
	//   PointSet::embed(dim)
	//   PointSet::extrude(hlist)
	//   PointSet::findOne(predicate)
	//   PointSet::contains(point, aPrecision)
	//   PointSet::merged(aPrecision)
	//   PointSet::combineWith(other)
	//   PointSet::rotate(dims, angle)
	//   PointSet::scale(dims, values)
	//   PointSet::translate(dims, values)
	//   PointSet::transform(matrix)
	//   PointSet::prod(other)

	var _ = __webpack_require__(1);

	// Importance to understand the dimension of the pointset (rn) and
	// the size of the point set is different concept.
	function PointSet() {
	  var argv = Array.prototype.slice.call(arguments), argc = argv.length;

	  var _points;
	  if (argc === 1 && _.isArray(argv[0])) {
	    if (argv[0].length === 0) {
	      throw new Error('PointSet() Can not determin pointset dimension from []');
	    }
	    _points = argv[0];
	    this._rn = maxNumOfComponents(_points);
	  } else if (argc === 2 && typeof argv[0] === 'number' && typeof argv[1] === 'number') {
	    _points = _.array2d(argv[0], argv[1], 0.0);
	    this._rn = maxNumOfComponents(_points);
	  } else if (argc === 2 && typeof argv[0] === 'number' && typeof argv[1] === 'function') {
	    _points = _.array1d(argv[0], argv[1]);
	    this._rn = maxNumOfComponents(_points);
	  } else if (argc === 2 && _.isArray(argv[0]) && typeof argv[1] === 'number') {
	    _points = argv[0];
	    this._rn = argv[1];
	  } else {
	    throw new Error('PointSet() can not initialize with args: ' + argv);
	  }

	  this._points = new Array(_points.length);
	  _.each(_points, function(p, i) {
	    var coords = _.array1d(this._rn, 0.0);
	    _.each(p, function(val, j) { coords[j] = val; });
	    this._points[i] = coords;
	  }, this);

	  function maxNumOfComponents(pts) {
	    return _.reduce(pts, function(sofar, p) {
	      if (p.length > sofar) sofar = p.length;
	      return sofar;
	    }, 0);
	  }
	};

	PointSet.prototype.getSize = function() { return this._points.length; };
	PointSet.prototype.__defineGetter__('size', PointSet.prototype.getSize);

	PointSet.prototype.getRn = function() { return this._rn; };
	PointSet.prototype.__defineGetter__('rn', PointSet.prototype.getRn);

	PointSet.prototype.clone = function() {
	  return new PointSet(this.toList(), this.rn);
	};

	PointSet.prototype.toJSON = function() {
	  var json = {};
	  json.points = this.toList();
	  json.rn = this.rn;
	  return json;
	};

	PointSet.prototype.toList = function() {
	  return _.cloneDeep(this._points);
	};

	PointSet.prototype.equals = function(other) {
	  if (this.rn !== other.rn || this.size !== other.size) return false;

	  var i, j, size = this.size, rn = this.rn;
	  for (i = 0; i < size; i += 1) {
	    var point = this.get(i), otherPoint = other.get(i);
	    for (j = 0; j < rn; ++j) {
	      if (point[j] !== otherPoint[j]) return false;
	    }
	  }
	  return true;
	};
	PointSet.prototype.isEqualTo = PointSet.prototype.equals;

	PointSet.prototype.get = function(index) {
	  if (index >= 0 && index < this._points.length) {
	    return this._points[index].slice();
	  }
	  throw new Error('PointSet::get() index outof bounds.');
	};

	PointSet.prototype.set_ = function(index, point) {
	  if (index >= 0 && index < this._points.length) {
	    if (point.length !== this.rn) {
	      throw new Error('PointSet::set() point dimension is not matched.');
	    }

	    var _points = this._points;
	    _.each(_points[index], function(x, i) {
	      _points[index][i] = point[i];
	    });
	    return;
	  }
	  throw new Error('PointSet::set() index outof bounds.');
	};

	// dir: index of the dimension, start from zero.
	PointSet.prototype.setAtDir_ = function(index, dir, val) {
	  if (dir < 0 || dir >= this.getRn()) {
	    throw new Error('PointSet::setAtDir_() dir is out of range.');
	  }

	  if (index >= 0 && index < this._points.length) {
	    var _points = this._points;
	    _points[index][dir] = val;
	    return;
	  }
	  throw new Error('PointSet::set() index outof bounds.');
	};

	PointSet.prototype.forEach = function(iterator) {
	  var i, size, p;
	  for (i = 0, size = this.getSize(); i < size; ++i) {
	    p = this.get(i);
	    iterator(p, i);
	  }
	};

	PointSet.prototype.map = function(transform) {
	  var lst = new Array(this.getSize());
	  this.forEach(function(p, i) { lst[i] = transform(p, i); });
	  return new PointSet(lst);
	};

	PointSet.prototype.filter = function(predicate) {
	  var lst = [];
	  this.forEach(function(p, i) {
	    if (predicate(p, i)) { lst.push(p); }
	  });
	  return new PointSet(lst, this._rn);
	};

	PointSet.prototype.embed = function(dim) {
	  return this.map(function(p, i) { return _.embed(p, dim); });
	};

	PointSet.prototype.extrude = function(hlist) {
	  var quotes = hlist
	    .reduce(function(quotes, incr) {
	      var sofar = quotes[quotes.length - 1];
	      quotes.push(sofar + incr);
	      return quotes;
	    }, [0]);

	  var rn = this.rn;
	  var oldPoints = this._points;

	  var newPoints = _.reduce(quotes, function(sofar, q) {
	    _.each(oldPoints, function(p) {
	      var newPoint = _.clone(p);
	      newPoint.push(q);
	      sofar.push(newPoint);
	    });
	    return sofar;
	  }, []);

	  return new PointSet(newPoints, rn + 1);
	};

	// Oh yeah, brute-force
	PointSet.prototype.findOne = function(predicate) {
	  var i, size = this.getSize(), p;
	  for (i = 0; i < size; ++i) {
	    p = this.get(i);
	    if (predicate(p, i) === true) return p;
	  }
	  return null;
	};

	// Oh yeah, brute-force
	PointSet.prototype.contains = function(point, aPrecision) {
	  var precision = aPrecision || PointSet.DEFAULT_PRECISION;
	  if (_.isArray(point) && point.length === this.rn) {
	    return null !== this.findOne(function(p) {
	      return _.norm2(_.sub(p, point)) < precision;
	    });
	  }
	  return false;
	};

	// Oh yeah, brute-force
	PointSet.prototype.merged = function(aPrecision) {
	  var precision = aPrecision || PointSet.DEFAULT_PRECISION;
	  var lst = [];
	  this.forEach(function(p0) {
	    var tooClose = _.any(lst, function(p1) { return _.norm2(p0, p1) < precision; });
	    if (!tooClose) lst.push(p0);
	  });
	  return new PointSet(lst, this.rn);
	};
	PointSet.DEFAULT_PRECISION = 1e-6;

	PointSet.prototype.combineWith = function(other) {
	  if (this.rn !== other.rn) {
	    throw new Error('Pointset::combineWith(other): pointset rn dismatch.');
	  }

	  var lst = this.toList();
	  other.forEach(function(p) { lst.push(p); });
	  return new PointSet(lst, this.rn);
	};
	PointSet.prototype.fuse = PointSet.prototype.combineWith;

	PointSet.prototype.rotate = function (dims, angle) {
	  // var rn = this.rn;
	  // var dims = dims[0] > dims[1] ? [dims[1], dims[0]] : dims;
	  // var points = this.points;
	  // var length = points.length;
	  // var cos_a = Math.cos(angle);
	  // var sin_a = Math.sin(angle);
	  // var r_ii = cos_a;
	  // var r_ij = -sin_a;
	  // var r_ji = sin_a;
	  // var r_jj = cos_a;
	  // var d_i = dims[0];
	  // var d_j = dims[1];
	  // var v_i;
	  // var v_j;
	  // var i, j, k;

	  // if ((dims[0] + dims[1]) % 2 == 0) {
	  //   r_ij *= -1;
	  //   r_ji *= -1;
	  // }

	  // for (k = 0, i = d_i, j = d_j; k < length; k += rn, i = k + d_i, j = k + d_j) {
	  //   v_i = points[i];
	  //   v_j = points[j];
	  //   points[i] = v_i * r_ii + v_j * r_ij;
	  //   points[j] = v_i * r_ji + v_j * r_jj;
	  // }

	  // return this;
	  throw new Error('PointSet::rotate(dims, values) is not implemented');
	};

	PointSet.prototype.scale = function (dims, values) {
	  if (_.isArray(dims) && _.isArray(values) && dims.length === values.length) {
	    if (_.max(dims) + 1 > this.rn) {
	      throw new Error('PointSet::scale(dims, values): dim must be no greater than rn.');
	    }
	    return this.map(function(p) {
	      dims.forEach(function(d, i) { p[d] = p[d] * values[i]; });
	      return p;
	    });
	  }
	  throw new Error('PointSet::scale(dims, values): dims and values must be array of same length.');
	};

	PointSet.prototype.translate = function (dims, values) {
	  if (_.isArray(dims) && _.isArray(values) && dims.length === values.length) {
	    if (_.max(dims) + 1 > this.rn) {
	      throw new Error('PointSet::translate(dims, values): dim must be no greater than rn.');
	    }
	    return this.map(function(p) {
	      dims.forEach(function(d, i) { p[d] = p[d] + values[i]; });
	      return p;
	    });
	  }
	  throw new Error('PointSet::translate(dims, values): dims and values must be array of same length.');
	};

	PointSet.prototype.transform = function (matrix) {
	  throw new Error('PointSet::transform(matrix) is not implemented');
	};

	PointSet.prototype.prod = function(other) {
	  throw new Error('PointSet::prod(other) is not implemented.');
	};

	exports.PointSet = PointSet;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// geometry.topology
	// FUNCTIONS:
	//   Topology(complexes)
	//   hypercube(conn, dim)
	//   simplex(conn, dim)
	// //
	// [Topology] constructor:
	//   Topology(complexes)
	// //
	// [Topology] instance methods:
	//   Topology::getDim()
	//   Topology::toList()
	//   Topology::toJSON()
	//   Topology::clone()
	//   Topology::equals(other)
	//   Topology::cells0d()
	//   Topology::getPointIndices()
	//   Topology::getEdgeIndices()
	//   Topology::getFaceIndices()
	//   Topology::getConnectivity()
	//   Topology::remap(mapping)
	//   Topology::unique()
	//   Topology::fuse(other)
	//   Topology::invert()
	//   Topology::skeleton(ord)
	//   Topology::boundary()
	// //
	// [hypercube] class methods:
	//   hypercube.getCellType(dim)
	//   hypercube.getCellSize(dim)

	var _ = __webpack_require__(1);
	var array1d = _.array1d;
	var cloneDeep = _.cloneDeep;
	var normalizedCell = _.normalizedCell;
	var byLexical = _.byLexical;

	var Bimap = _.Bimap;

	// dim = 0 -> point, dim = 1 -> curve,
	// dim = 2 -> surface, dim = 4 -> volumn'
	// Private constructor, DO NOT call it directly if you don't know what is going on
	// complexes: [ ConnectivityList ]
	// complexes[n]: ConnectivityList for dimension n
	// ConnectivityList: [ CellIndexList ]
	// CellIndexList: [ i_1, i_2, ..., i_CellSize ]
	function Topology(complexes, cellSizes) {
	  // check complexes
	  if (!_.isArray(complexes))
	    throw new Error('Topology(): complexes must be a list of connectiviy list.');

	  var i, j, k, n, connList, ncells, cellSize, cell, cidx;
	  n = complexes.length;
	  for (i = 0; i < n; ++i) {
	    connList = complexes[i];
	    if (!_.isArray(connList))
	      throw new Error('Topology(): connectivity list must be an array.');

	    ncells = connList.length;
	    if (ncells > 0) {
	      cell = connList[0];
	      if (!_.isArray(cell))
	        throw new Error('Topology(): cell index list must be an array.');

	      cellSize = cell.length;
	      for (j = 0; j < ncells; ++j) {
	        cell = connList[j];
	        if (!_.isArray(cell))
	          throw new Error('Topology(): cell index list must be an array.');

	        if (cell.length !== cellSize)
	          throw new Error('Topology(): inconsist cell size.');

	        for (k = 0; k < cellSize; ++k) {
	          cidx = cell[k];
	          if ((cidx | 0) !== cidx)
	            throw new Error('Topology: cell index must be an integer.');
	        }
	      }
	    }
	  }

	  var _complexes = _.cloneDeep(complexes);
	  // _(_complexes).each(function(x, i) {
	  //   _(_complexes[i]).each(function(y, j) {
	  //     _complexes[i][j] = normalizedCell(y);
	  //     // var offset = _.minIndex(y);
	  //     // _complexes[i][j] = _.rotateLeft(y, offset);
	  //   });
	  //   _complexes[i].sort(_.byLexical);
	  // });
	  this._complexes = _complexes;

	  var errs = [];
	  if (_.isArray(cellSizes) && cellSizes.length === this._complexes.length) {
	    this._cellSizes = _.clone(cellSizes);
	  } else {
	    this._cellSizes = this._complexes.map(function(connList, i) {
	      if (connList.length === 0) {
	        errs.push('Topology(): Can not determine the dim of cells in dim ' + i);
	        return -1;
	      }

	      return connList[0].length;
	    });
	    if (errs.length > 0) throw new Error(errs.join('\n'));
	  }
	};

	Topology.prototype.getDim = function() {
	  return this._complexes.length - 1;
	};
	Topology.prototype.__defineGetter__('dim', Topology.prototype.getDim);

	Topology.prototype.getNumOfCellsInDim = function(dim) {
	  if (dim < 0 || dim > this.getDim())
	    throw new Error('Topology::getNumOfCellsInDim(): dim out of bound.');

	  return this._complexes[dim].length;
	};

	Topology.prototype.getCellSizeInDim = function(dim) {
	  if (dim < 0 || dim > this.getDim())
	    throw new Error('Topology::getCellSizeInDim(): dim out of bound.');

	  return this._cellSizes[dim];
	};

	Topology.prototype.toList = function() {
	  return _.cloneDeep(this._complexes);
	};

	Topology.prototype.toJSON = function() {
	  return {
	    complexes: this.toList()
	  };
	};

	Topology.prototype.clone = function() {
	  var copy = new Topology([]);
	  copy._complexes = this.toList();
	  copy._cellSizes = _.cloneDeep(this._cellSizes);
	  return copy;
	};

	Topology.prototype.normalized = function() {
	  var copy = cloneDeep(this._complexes);
	  copy.forEach(function(x, i) {
	    x.forEach(function(y, j) {
	      x[j] = normalizedCell(y);
	    });
	    x.sort(byLexical);
	  });
	  return new Topology(copy, this._cellSizes);
	};

	Topology.prototype.equals = function(other) {
	  if (this.getDim() !== other.getDim())
	    return false;

	  var i, dim = this.getDim();
	  for (i = 0; i <= dim; ++i) {
	    if (this.getCellSizeInDim(i) !== other.getCellSizeInDim(i))
	      return false;
	  }

	  var j, ncells;
	  for (i = 0; i <= dim; ++i) {
	    ncells = this.getNumOfCellsInDim(i);
	    for (j = 0; j < ncells; ++j) {
	      if (!_.isEqual(this._complexes[i][j], other._complexes[i][j]))
	        return false;
	    }
	  }

	  return true;
	};

	Topology.prototype.getCellsInDim = function(dim) {
	  return _.cloneDeep(this._complexes[dim]);
	};

	Topology.prototype.getMaxCells = function() {
	  return this.getCellsInDim(this.getDim());
	};

	Topology.prototype.getPointIndices = function() {
	  return this._complexes[0].map(function(x) { return x[0]; });
	};

	// Topology.prototype.remap = function(mapping) {

	// };

	// Topology.prototype.unique = function() {

	// };

	// Topology.prototype.fuse = function(other) {

	// };

	// Topology.prototype.invert = function() {

	// };

	// Topology.prototype.skeleton = function(ord) {

	// };

	Topology.prototype.boundary = function() {
	  throw new Error('Topology::boundary(): is not implemented.');
	};

	// function __static__() {}

	// Topology.fromJSON = function(json) {
	//   json = typeof json === "string" ? JSON.parse(json) : json;
	//   var complexes = new Array();
	//   var topology = new Topology();

	//   json.complexes.forEach(function(complex) {
	//     complexes.push(new Uint32Array(complex));
	//   } );

	//   topology.complexes = complexes;

	//   return topology;
	// };

	// function makeForEach(size) {
	//   return function(arr, fn) {
	//     var i = 0, len = arr.length, ind = 0;
	//     while (i < len) {
	//       fn(arr.subarray(i, i + size), ind, arr);
	//       i = i + size;
	//       ind = ind + 1;
	//     }
	//   };
	// }

	// Topology.prototype._computeTopology = function(complex, dim) {
	//   complex || (complex = [[]]);
	//   var complexes = new Array();
	//   var complexTemp, complexNext;
	//   var complexNextLength;
	//   var complexLength;
	//   var cellDim;
	//   var d, c, i, j, k;
	//   var exchange1, exchange2;

	//   // guess dim:
	//   if ( typeof dim === 'undefined' &&
	//        complex && complex[0] &&
	//        Array.isArray(complex[0])) {
	//     dim = this.getDimFromCellSize(complex[0].length);
	//   }

	//   if (Array.isArray(complex)) {
	//     complex = _flat(complex);
	//   }

	//   if (dim >= 0) {
	//     // complexes[0] = new Uint32Array();
	//     complexes[dim] = new Uint32Array(complex);
	//   }

	//   var forEach, tmp, cellSize, cellTopo;
	//   for (d = dim; d > 1; d -= 1) {
	//     cellSize = this.getCellSize(d);
	//     forEach = makeForEach(cellSize);
	//     cellTopo = this.cellTopologies[d - 1];
	//     tmp = [];
	//     forEach(complexes[d], function(globalConn, ind) {
	//       cellTopo.forEach(function(cellConn) {
	//         cellConn.forEach(function(i) {
	//           tmp.push(globalConn[i]);
	//         } );
	//       } );
	//     } );
	//     complexes[d-1] = new Uint32Array(tmp);
	//   }
	//   this.complexes = complexes;
	//   if (dim > 0) {
	//     complexes[0] = this.cells0d();
	//   }
	//   return this;
	// };

	// Topology.prototype.__defineGetter__('dim', function() {
	//   return this.complexes.length - 1;
	// } );

	// Topology.prototype.__defineGetter__('maxCells', function() {
	//   return this.complexes[this.dim];
	// } );

	// function __queries__() {}

	// Topology.prototype.toJSON = function() {
	//   var json = {};
	//   var complexes = [];

	//   this.complexes.forEach(function(complex) {
	//     complexes.push(_toArray(complex));
	//   } );

	//   json.complexes = complexes;
	//   json.dim = this.dim;

	//   return json;
	// };

	// Topology.prototype.clone = function() {
	//   var clone = new this.constructor();
	//   var dim = this.dim;
	//   var complexes = new Array();
	//   var i;

	//   this.complexes.forEach(function(complex, i) {
	//     complexes[i] = new Uint32Array(complex);
	//   } );

	//   clone.complexes = complexes;

	//   return clone;
	// };

	// Topology.prototype.equals = function(other) {
	//   var complexes1 = this.complexes;
	//   var complexes2 = other.complexes;
	//   var dim1 = this.dim;
	//   var dim2 = other.dim;
	//   var i;

	//   if (dim1 !== dim2) return false;
	//   for (i = 0; i < dim1; i += 1) {
	//     if (!_areEqual(complexes1[i], complexes2[i])) return false;
	//   }
	//   return true;
	// };
	// Topology.prototype.isEqualTo = Topology.prototype.equals;

	// Topology.prototype.cells0d = function() {
	//   var complexes = this.complexes || [[]];
	//   var cells1d = complexes[1] || [];
	//   var length = cells1d.length;
	//   var cells0d = new Uint32Array(length);
	//   var i, j;
	//   var k = 0;
	//   var found;

	//   var tmp = [];
	//   for (i = 0; i < length; ++i) {
	//     tmp[cells1d[i]] = 1;
	//   }

	//   var len = tmp.length;
	//   for (i = 0; i < len; ++i) {
	//     if (tmp[i] === 1) {
	//       cells0d[k++] = i;
	//     }
	//   }

	//   return cells0d.subarray(0,k);
	// };

	// // Must be override
	// Topology.prototype.cellTopologies = [];
	// Topology.prototype.cellDimTypeMap = {};
	// Topology.prototype.cellDimSizeMap = {};
	// Topology.prototype.cellSizeDimMap = {};

	// Topology.prototype.getCellType = function(dim) {
	//   dim || (dim = this.dim);
	//   return this.cellDimTypeMap[dim];
	// };

	// Topology.prototype.getCellSize = function(dim) {
	//   dim || (dim = this.dim);
	//   return this.cellDimSizeMap[dim];
	// };

	// Topology.prototype.getNumOfCellsInDim = function(dim) {
	//   var cellSize = this.getCellSize(dim);
	//   return this.complexes[dim].length / cellSize;
	// };

	// Topology.prototype.getDimFromCellSize = function(cellSize) {
	//   return this.cellSizeDimMap[cellSize];
	// };

	// Topology.prototype.getPointIndices = function() {
	//   return _toArray(this.complexes[0]);
	// };

	// Topology.prototype.getEdgeIndices = function() {
	//   var forEach = makeForEach(2);
	//   var out = [];
	//   forEach(this.complexes[1], function(val) {
	//     out.push(_toArray(val));
	//   } );
	//   return out;
	// };

	// Topology.prototype.getFaceIndices = function() {
	//   var forEach = makeForEach(3);
	//   var out = [];
	//   forEach(this.complexes[2], function(val) {
	//     out.push(_toArray(val));
	//   } );
	//   return out;
	// };

	// Topology.prototype.getConnectivity = function() {
	//   return this.maxCells;
	// };

	// function __commands__() {}

	// Topology.prototype.remap = function(mapping) {
	//   var length;
	//   var i;

	//   this.complexes
	//     .forEach(function(complex) {
	//       length = complex.length;
	//       for (var i = 0; i < length; i += 1) {
	//         complex[i] = mapping[complex[i]];
	//       }
	//     } );

	//   return this;
	// };

	// Topology.prototype.unique = function() {
	//   var dim = this.dim;
	//   var complex = this.complexes[dim];
	//   var cellSize = this.getCellSize(dim);

	//   var each = makeForEach(cellSize);
	//   var cells = [], seen = {};

	//   // for each cell in complex, use sorted index make a hash key
	//   each(complex, function(cell) {
	//     var cellCopy = Array.prototype.slice.call(cell);
	//     var key = cellCopy.slice().sort().join(',');
	//     if (!seen[key]) {
	//       cells.push(cellCopy);
	//       seen[key] = true;
	//     }
	//   } );

	//   this._computeTopology(cells);

	//   return this;
	// };


	// function concatFloat32(a, b) {
	//   var aLen = a.length, bLen = b.length;
	//   var len = aLen + bLen;
	//   var out = new Float32Array(len);
	//   var i;

	//   for (i = 0; i < aLen; ++i) {
	//     out[i] = a[i];
	//   }

	//   for (i = 0; i < bLen; ++i) {
	//     out[i+aLen] = b[i];
	//   }

	//   return out;
	// }

	// // var a = new Float32Array([1,2,3,4]);
	// // var b = new Float32Array([1,2,3,4]);
	// // var c = concatFloat32(a, b)
	// // console.log("c = ", c);

	// Topology.prototype.fuse = function(other) {
	//   if (!(this.dim === other.dim)) {
	//     throw new Error( 'Expect this.dim === other.dim but ' +
	//                      this.dim === other.dim );
	//   }

	//   var dim = this.dim;
	//   var i = 0;
	//   for (i = 0; i <= dim; ++i) {
	//     this.complexes[i] = concatFloat32(this.complexes[i], other.complexes[i]);
	//   }

	//   return this;
	// };

	// Topology.prototype.invert = function() {
	//   var dim = this.dim;
	//   var complex = this.complexes[dim];
	//   var length = complex.length;
	//   var cellSize = this.getCellSize();
	//   var cells = [];
	//   var cell;
	//   var i, j;

	//   for (i = 0; i < length; i += cellSize) {
	//     cell = [];
	//     for (j = 0; j < cellSize; j += 1) {
	//       cell.unshift(complex[i+j]);
	//     }
	//     cells.push(cell);
	//   }

	//   this._computeTopology(cells);
	// };

	// Topology.prototype.skeleton = function(ord) {
	//   var dim = this.dim;
	//   ord = ord === undefined ? dim - 1 : ord;
	//   var out = dim - ord;

	//   while (out--) this.complexes.pop();

	//   return this;
	// };

	// Topology.prototype.boundary = function() {
	//   var dim = this.dim - 1;

	//   this.skeleton(dim);

	//   var complexes = this.complexes;
	//   // var cellLength = dim + 1;
	//   var cellLength = this.getCellSize();
	//   var cells = complexes[dim];
	//   var cellsLength = cells.length;
	//   var cellsSize = cellsLength / cellLength;
	//   var sortedCells = new Uint32Array(cells);
	//   var notBoundaryCells = new Uint8Array(cellsSize);
	//   var boundary;
	//   var boundarySize = cellsSize;
	//   var cell;
	//   var equal;
	//   var i, j, b, c;

	//   for (i = 0; i < cellsLength; i += cellLength) {
	//     _quickSort(sortedCells.subarray(i, i + cellLength));
	//   }
	//   for (c = 0; c < cellsSize; c += 1) {
	//     cell = sortedCells.subarray(c * cellLength, c * cellLength + cellLength);
	//     if (!notBoundaryCells[c]) {
	//       for (i = c + 1; i < cellsSize; i += 1) {
	//         equal = true;
	//         for (j = 0; j < cellLength && equal; j += 1) {
	//           equal &= sortedCells[i*cellLength+j] === cell[j];
	//         }
	//         notBoundaryCells[c] |= equal;
	//         notBoundaryCells[i] |= equal;
	//       }
	//     }
	//   }
	//   for (c = 0; c < cellsSize; c += 1) {
	//     boundarySize -= notBoundaryCells[c];
	//   }
	//   boundary = new Uint32Array(boundarySize * cellLength);
	//   for (c = 0, b = 0; c < cellsSize; c += 1) {
	//     if (!notBoundaryCells[c]) {
	//       for (i = 0; i < cellLength; i += 1) {
	//         boundary[b++] = cells[c*cellLength+i];
	//       }
	//     }
	//   }

	//   this._computeTopology(boundary, dim);
	//   return this;
	// };


	// dim = 0 -> point, dim = 1 -> line
	// dim = 2 -> quad, dim = 3 -> hexahedron
	var HYPERCUBE_DIM_CELLSIZE_BIMAP = new Bimap([
	  [0, 1],
	  [1, 2],
	  [2, 4],
	  [3, 8]
	]);

	// line -> two points
	function hypercubeCellBoundary1(cell) {
	  var p1 = [ cell[0] ];
	  var p2 = [ cell[1] ];
	  return [ p1, p2 ];
	};

	// quad -> four lines
	function hypercubeCellBoundary2(cell) {
	  var e1 = [ cell[0], cell[1] ];
	  var e2 = [ cell[1], cell[2] ];
	  var e3 = [ cell[2], cell[3] ];
	  var e4 = [ cell[3], cell[0] ];
	  return [ e1, e2, e3, e4 ];
	};

	// brick -> six quads
	function hypercubeCellBoundary3(cell) {
	  var v1 = cell[0], v2 = cell[1], v3 = cell[2], v4 = cell[3];
	  var v5 = cell[4], v6 = cell[5], v7 = cell[6], v8 = cell[7];
	  var f1 = [ v1, v4, v3, v2 ];
	  var f2 = [ v1, v2, v6, v5 ];
	  var f3 = [ v2, v3, v7, v6 ];
	  var f4 = [ v3, v4, v8, v7 ];
	  var f5 = [ v1, v5, v8, v4 ];
	  var f6 = [ v5, v6, v7, v8 ];
	  return [ f1, f2, f3, f4, f5, f6 ];
	};

	function hypercubeSkeleton(conn, dim) {
	  var getCellBoundary;
	  if (dim === 1)
	    getCellBoundary = hypercubeCellBoundary1;
	  else if (dim === 2)
	    getCellBoundary = hypercubeCellBoundary2;
	  else if (dim === 3)
	    getCellBoundary = hypercubeCellBoundary3;
	  else
	    throw new Error('hypercubeBoundaryCells(conn, dim): dim (' +
	                       dim + ') is not valid.');

	  var hashCell = function(cell) {
	    return normalizedCell(cell).join(',');
	  };

	  var seen = {}, skeleton = [];
	  conn.forEach(function(cell) {
	    var boundaryCells = getCellBoundary(cell);
	    boundaryCells.forEach(function(bdryCell) {
	      var key = hashCell(bdryCell);
	      if (!seen[key]) {
	        skeleton.push(bdryCell);
	        seen[key] = true;
	      }
	    });
	  });
	  return skeleton;
	}

	function hypercube0_(conn) {
	  if (typeof conn[0] === 'number')
	    return [ conn.map(function(idx) { return [idx]; }) ];
	  return [ cloneDeep(conn) ];
	}

	function hypercube1_(conn) {
	  var complexes = array1d(2, function() { return null; });
	  complexes[1] = cloneDeep(conn);
	  complexes[0] = hypercubeSkeleton(complexes[1], 1);
	  return complexes;
	}

	function hypercube2_(conn) {
	  var complexes = array1d(3, function() { return null; });
	  complexes[2] = cloneDeep(conn);
	  complexes[1] = hypercubeSkeleton(complexes[2], 2);
	  complexes[0] = hypercubeSkeleton(complexes[1], 1);
	  return complexes;
	}

	function hypercube3_(conn) {
	  var complexes = array1d(4, function() { return null; });
	  complexes[3] = cloneDeep(conn);
	  complexes[2] = hypercubeSkeleton(complexes[3], 3);
	  complexes[1] = hypercubeSkeleton(complexes[2], 2);
	  complexes[0] = hypercubeSkeleton(complexes[1], 1);
	  return complexes;
	}

	function hypercube(conn, dim) {
	  if (dim === 0) {
	    return new Topology(hypercube0_(conn));
	  } else if (dim === 1) {
	    return new Topology(hypercube1_(conn));
	  } else if (dim === 2) {
	    return new Topology(hypercube2_(conn));
	  } else if (dim === 3) {
	    return new Topology(hypercube3_(conn));
	  }

	  throw new Error('hypercube(conn, dim): dim must be one of 0,1,2,3.');
	};

	// dim = 0 -> point, dim = 1 -> line
	// dim = 2 -> triangle, dim = 3 -> tetrahedron
	function simplex(conn, dim) {
	  var complexes = [];
	  return new Topology(complexes);
	};

	simplex.prototype = Object.create(Topology.prototype);
	simplex.prototype.constructor = simplex;

	exports.Topology = Topology;
	exports.hypercube = hypercube;
	exports.simplex = simplex;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// feutils
	var numeric = __webpack_require__(6);
	var size = numeric.size;
	var eye = numeric.eye;
	var div = numeric.div;
	var norm2 = numeric.norm2;

	function genISORm(xyz, tangents) {
	  var tmp = size(tangents);
	  var sdim = tmp[0], ntan = tmp[1];
	  if (sdim === ntan) {
	    return eye(sdim);
	  } else {
	    var e1 = tangents.map(function(row) {
	      return [row[0]];
	    });

	    e1 = div(e1, norm2(e1));
	    switch (ntan) {
	    case 1:
	      return e1;
	      break;
	    case 2:
	      throw new Error('genISORm: ntan = ' + ntan + ' is not implemented.');
	      break;
	    default:
	      throw new Error('genISORm: incorrect size of tangents, ntan = ' + ntan);
	    }

	  }
	}

	exports.genISORm = genISORm;

	// theta is a vector.
	function skewmat(theta) {
	  var n = theta.length, s;
	  if (n === 3) {
	    s = [
	      [0, -theta[2], theta[1] ],
	      [theta[3], 0, -theta[0] ],
	      [-theta[1], theta[0], 0 ]
	    ];
	  } else if (n === 2) {
	    s = [-theta[1], theta[0]];
	  } else {
	    throw new Error('skewmat(theta): theta must be a vector of 2 or 3.');
	  }
	  return s;
	}

	exports.skewmat = skewmat;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// fens

	var _ = __webpack_require__(1);
	var cloneDeep = _.cloneDeep;
	var embed = _.embed;
	var check = _.check;
	var assert = _.assert;
	var defineContract = _.defineContract;
	var isMatrixOfDimension = _.isMatrixOfDimension;
	var vectorOfDimension = _.vectorOfDimension;
	var PointSet = __webpack_require__(7).PointSet;

	var _input_contract_fens_options_ = defineContract(function(o) {
	  assert.object(o);
	  assert.assigned(o.xyz);

	  if (!isMatrixOfDimension(o.xyz, '*', 1) &&
	      !isMatrixOfDimension(o.xyz, '*', 2) &&
	      !isMatrixOfDimension(o.xyz, '*', 3) &&
	      !check.instance(o.xyz, PointSet)) {
	    throw new Error('Not valid xyz for fens.');
	  }

	}, 'Input is not a valid fens option.');

	function FeNodeSet(options) {
	  if (check.instance(options.xyz, PointSet)) {
	    this._xyz = options.xyz.clone();
	  } else {
	    this._xyz = new PointSet(options.xyz);
	  }
	}

	FeNodeSet.prototype.dim = function() {
	  return this._xyz.getRn();
	};

	FeNodeSet.prototype.xyz = function() {
	  return this._xyz.toList();
	};

	FeNodeSet.prototype.xyzById = function(id) {
	  return this._xyz.get(id - 1);
	};

	FeNodeSet.prototype.get = FeNodeSet.prototype.xyzById;

	FeNodeSet.prototype.xyzIter = function() {
	  var i = 0, xyz = this._xyz, len = xyz.getSize();
	  return {
	    hasNext: function() { return i < len; },
	    next: function() { return xyz.get(i++); }
	  };
	};

	FeNodeSet.prototype.xyz3 = function() {
	  return this._xyz.embed(3).toList();
	};

	FeNodeSet.prototype.xyz3ById = function(id) {
	  return embed(this._xyz.get(id-1), 3);
	};

	FeNodeSet.prototype.xyz3Iter = function() {
	  var it = this.xyzIter();
	  return {
	    hasNext: function() { return it.hasNext(); },
	    next: function() { return embed(it.next(), 3); }
	  };
	};

	FeNodeSet.prototype.count = function() {
	  return this._xyz.getSize();
	};

	FeNodeSet.prototype.boxSelect = function(options) {
	  if (!options || !options.bounds || options.bounds.length !== 2*this.dim())
	    throw new Error('FeNodeSet::boxSelect() invalid options.bounds');

	  var bounds = cloneDeep(options.bounds);
	  var i, len = bounds.length;
	  var inflate;

	  if (typeof options.inflate === 'number') {
	    inflate = Math.abs(options.inflate);
	    for (i = 0; i < len; ++i) {
	      if (i % 2 == 0) bounds[i] -= inflate;
	      else bounds[i] += inflate;
	    }
	  }

	  var dim = this.dim(), nfens = this.nfens();
	  var id, xyz, out = [];
	  for (id = 1; id <= nfens; ++id) {
	    xyz = this.xyzById(id);
	    if (isInside(xyz, bounds)) {
	      out.push(id);
	    }
	  }

	  function isInside(xyz, bounds) {
	    var i, dim = xyz.length, res = true;
	    var val, left, right;
	    for (i = 0; i < dim; ++i) {
	      val = xyz[i];
	      left = bounds[2*i];
	      right = bounds[2*i+1];
	      if (val < left || val > right) return false;
	    }
	    return res;
	  }

	  return out;
	};

	FeNodeSet.prototype.nfens = FeNodeSet.prototype.count;

	exports.FeNodeSet = FeNodeSet;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// gcellset

	// FUNCTIONS:
	//   GCellSet(topology)
	//   Manifold1GCellSet(topology, otherDimension, axisSymm)
	//   L2(options)
	// //
	// [GCellSet] constructor:
	//   GCellSet(topology)
	// //
	// [GCellSet] instance methods:
	//   GCellSet::type()
	//   GCellSet::boundaryGCellSetConstructor()
	//   GCellSet::boundaryCellType()
	//   GCellSet::boundary()
	//   GCellSet::dim()
	//   GCellSet::cellSize()
	//   GCellSet::id()
	//   GCellSet::conn()
	//   GCellSet::jacobianMatrix(nder, x)
	//   GCellSet::bfun(paramCoords)
	//   GCellSet::bfundpar(paramCoords)
	//   GCellSet::bfundsp(nder, x)
	//   GCellSet::cat()
	//   GCellSet::count()
	//   GCellSet::isInParametric(paramCoords)
	//   GCellSet::map2parametric(x, c)
	//   GCellSet::subset(indices)
	//   GCellSet::clone()
	//   GCellSet::updateConnectivity()
	// //
	// [Manifold1GCellSet] constructor:
	//   Manifold1GCellSet(topology, otherDimension, axisSymm)
	// //
	// [Manifold1GCellSet] instance methods:
	//   Manifold1GCellSet::dim()
	//   Manifold1GCellSet::otherDimension(conn, N, x)
	//   Manifold1GCellSet::axisSymm()
	//   Manifold1GCellSet::jacobian(conn, N, J, x)
	//   Manifold1GCellSet::jacobianCurve(conn, N, J, x)
	//   Manifold1GCellSet::jacobianSurface(conn, N, J, x)
	//   Manifold1GCellSet::jacobianVolumn(conn, N, J, x)
	//   Manifold1GCellSet::jacobianInDim(conn, N, J, x, dim)
	// //
	// [L2] constructor:
	//   L2(options)
	// //
	// [L2] instance methods:
	//   L2::cellSize()
	//   L2::type()
	//   L2::bfun(paramCoords)
	//   L2::bfundpar(paramCoords)


	var _ = __webpack_require__(1);
	var uuid = _.uuid;
	var noop = _.noop;
	var defineContract = _.defineContract;
	var assert = _.assert;
	var check = _.check;
	var matrixOfDimension = _.contracts.matrixOfDimension;
	var vectorOfDimension = _.contracts.vectorOfDimension;

	var numeric = __webpack_require__(6);
	var size = numeric.size;
	var norm = numeric.norm;
	var nthColumn = numeric.nthColumn;
	var dot = numeric.dot;
	var transpose = numeric.transpose;
	var feutils = __webpack_require__(9);
	var skewmat = feutils.skewmat;
	var hypercube = __webpack_require__(8).hypercube;

	// Supposed to be private
	// TODO: support lookup by label.
	function GCellSet(topology) {
	  var cellSizeFromTopology = topology.getCellSizeInDim(topology.getDim());
	  var cellSizeShouldBe = this.cellSize();
	  if (cellSizeFromTopology !== cellSizeShouldBe)
	    throw new Error('GCellSet(): cellSize of the topology dismatch.');

	  var dimFromTopology = topology.getDim();
	  var dimShouldBe = this.dim();
	  if (dimFromTopology !== dimShouldBe)
	    throw new Error('GCellSet(): dim of the topology dismatch.');

	  this._id = uuid();
	  this._topology = topology;
	}
	exports.GCellSet = GCellSet;

	// For visualization.
	GCellSet.prototype.topology = function() {
	  return this._topology;
	};

	// For visualization.
	GCellSet.prototype.vertices = function() {
	  return this._topology.getPointIndices();
	};

	// For visualization.
	GCellSet.prototype.edges = function() {
	  return this._topology.getCellsInDim(1);
	};

	// For visualization.
	GCellSet.prototype.triangles = function() {
	  return this._topology.getCellsInDim(2);
	};

	GCellSet.prototype.type = function() {
	  throw new Error('GCellSet::type(): is not implemented.');
	};

	GCellSet.prototype.boundaryGCellSetConstructor = function() {
	  throw new Error('GCellSet::getBoundaryGCellSetConstructor(): is not implemented.');
	};

	GCellSet.prototype.boundaryCellType = function() {
	  var C = this.boundaryGCellSetConstructor();
	  return C.prototype.type.call(null);
	};

	GCellSet.prototype.boundary = function() {
	  var C = this.boundaryGCellSetConstructor();
	  var boundaryTopology = this._topology.boundary();
	  return new C(boundaryTopology);
	};

	GCellSet.prototype.dim = function() {
	  throw new Error('GCellSet::dim(): is not implemented.');
	};

	GCellSet.prototype.cellSize = function() {
	  throw new Error('GCellSet::cellSize(): is not implemented.');
	};
	GCellSet.prototype.nfens = GCellSet.prototype.cellSize;

	GCellSet.prototype.id = function() {
	  return this._id;
	};

	GCellSet.prototype.conn = function() {
	  return this._topology.getMaxCells();
	};

	// jacobianMatrix :: GCellSet -> NodalDerivativesInParametricDomain -> NodalCoordinatesInSpatialDomain
	//                   -> JacobianMatrix
	// NodalDerivativesInParametricDomain :: 2D JS array of dimension this.cellSize() by this.dim()
	// NodalCoordinatesInSpatialDomain :: 2D JS array of dimension this.cellSize() by this.dim()
	// JacobianMatrix :: 2D JS array of dimension this.dim() by this.dim()
	GCellSet.prototype.jacobianMatrix = function(nder, x) {
	  var m = this.cellSize(), n = this.dim();
	  matrixOfDimension(
	    m,
	    n,
	    'NodalDerivativesInParametricDomain is not a matrix of ' + m + ' x ' + n
	  )(nder);

	  matrixOfDimension(
	    m,
	    n,
	    'NodalCoordinatesInSpatialDomain is not a matix of ' + m + ' x ' + n
	  )(x);

	  return numeric.mul(numeric.transpose(x), nder);
	};

	// bfun :: GCellSet -> ParametricCoordinates
	//         -> NodalContributionVector
	// ParametricCoordinates :: 1D JS array of length this.dim()
	// NodalContributionVector :: 1D JS array of length this.cellSize()
	// bfun: basis function in parametric domain.
	// Required to be overrided by subclasss.
	GCellSet.prototype.bfun = function(paramCoords) {
	  throw new Error('GCellSet::bfun(): is not implemented.');
	};

	// bfundpar :: GCellSet -> ParametricCoordinates
	//             -> NodalDerivativesInParametricDomain
	// ParametricCoordinates :: 1D JS array of length this.dim()
	// NodalDerivativesInParametricDomain :: 2D JS array of dimension this.cellSize() by this.dim()
	// bfundpar: derivatives of the basis function in parametric domain.
	// Required to be overrided by subclasss.
	GCellSet.prototype.bfundpar = function(paramCoords) {
	  throw new Error('GCellSet::bfundpar(): is not implemented.');
	};

	// bfundsp :: GCellSet -> NodalDerivativesInParametricDomain -> NodalCoordinatesInSpatialDomain
	//            -> NodalDerivativesInSpatialDomain
	// NodalDerivativesInParametricDomain :: 2D JS array of dimension this.cellSize() by this.dim()
	// NodalCoordinatesInSpatialDomain :: 2D JS array of dimension this.cellSize() by this.dim()
	// NodalDerivativesInSpatialDomain :: 2D JS array of dimension this.cellSize() by this.dim()
	// bfundsp: derivatives of the basis functions in spatical domain.
	var _input_contract_funct_bfundsp_ = function(m, n) {
	  return defineContract(function(nder, x) {
	    matrixOfDimension(
	      m,
	      n,
	      'NodalDerivativesInParametricDomain is not a matrix of ' + m + ' x ' + n
	    )(nder);

	    matrixOfDimension(
	      m,
	      n,
	      'NodalCoordinatesInSpatialDomain is not a matix of ' + m + ' x ' + n
	    )(x);
	  }, 'Input is invalid for bfundsp');
	};

	var _contract_funct_J_ = function(n) {
	  return defineContract(function(J) {
	    matrixOfDimension(n,n)(J);
	  },'J is not a matrix of ' + n + ' x ' + n);
	};

	var _output_contract_funct_bfundsp_ = function(m, n) {
	  return defineContract(function(mat) {
	    matrixOfDimension(m, n)(mat);
	  }, 'Output is invalid for bfunsp, it is not ' + m + ' by ' + n);
	};

	GCellSet.prototype.bfundsp = function(nder, x) {
	  var m = this.cellSize(), n = this.dim();

	  _input_contract_funct_bfundsp_(m, n)(nder, x);
	  var J = numeric.mul(numeric.transpose(x), nder);
	  _contract_funct_J_(n)(J);

	  var res = numeric.dot(nder, numeric.inv(J));
	  _output_contract_funct_bfundsp_(m, n)(res);

	  return res;
	};

	GCellSet.prototype.cat = function() {
	  throw new Error('GCellSet::cat(): is not implemented.');
	};

	// count: return number of cells.
	GCellSet.prototype.count = function() {
	  return this._topology.getNumOfCellsInDim(this._topology.getDim());
	};
	GCellSet.prototype.size = GCellSet.prototype.count;

	// number of nodes this gcellset connect
	GCellSet.prototype.nfens = function() {
	  return this._topology.getNumOfCellsInDim(0);
	};

	// isInParametric :: GCellSet -> ParametricCoordinates
	//                   -> bool
	// ParametricCoordinates :: 1D JS array of length this.dim()
	// isInParametric: Check if given parametric coordinates are
	//   inside the element parametric domain.
	GCellSet.prototype.isInParametric = function(paramCoords) {
	  throw new Error('GCellSet::isInParametric(): is not implemented.');
	};

	// map2parametric :: GCellSet -> NodalCoordinatesInSpatialDomain -> SpatialCoordinates
	//                   -> ParametricCoordinates
	// SpatialCoordinates :: 1D JS array of length this.dim()
	// ParametricCoordinates :: 1D JS array of length this.dim()
	// map2parametric: Returns the parametric coordinates for given spatial coordinates
	GCellSet.prototype.map2parametric = function(x, c) {
	  throw new Error('GCellSet::map2parametric(): is not implemented.');
	};

	// subset :: GCellSet -> Indices
	//           -> GCellSet
	// Indices :: [ Int ]
	// subset: Return a new GCellSet which is a subset of self by given indices.
	// index starts from zero
	function subset(conn, indices) {
	  var newConn = [];
	  indices.forEach(function(idx) {
	    return newConn.push(conn[idx]);
	  });
	  return newConn;
	}
	GCellSet.prototype.subset = function(indices) {
	  throw new Error('GCellSet::subset(): is not implemented.');
	};

	GCellSet.prototype.clone = function() {
	  throw new Error('GCellSet::clone(): is not implemented.');
	};

	GCellSet.prototype.updateConnectivity = function() {
	  throw new Error('GCellSet::updateConnectivity(): is not implemented.');
	};

	function Manifold1GCellSet(topology, otherDimension, axisSymm) {
	  this._otherDimension = (typeof otherDimension === 'number' || typeof otherDimension === 'function') ?
	    otherDimension : 1.0;
	  this._axisSymm = typeof axisSymm !== 'undefined' ? (!!axisSymm) : false;
	  GCellSet.call(this, topology);
	}

	Manifold1GCellSet.prototype = Object.create(GCellSet.prototype);
	Manifold1GCellSet.prototype.constructor = Manifold1GCellSet;

	Manifold1GCellSet.prototype.dim = function() { return 1; };

	Manifold1GCellSet.prototype.otherDimension = function(conn, N, x) {
	  if (typeof this._otherDimension === 'function')
	    return this._otherDimension(conn, N, x);
	  return this._otherDimension;
	};

	Manifold1GCellSet.prototype.axisSymm = function() { return this._axisSymm; };

	var _input_contract_m1_jac_ = _.defineContract(function(conn, N, J, x) {
	  // console.log("x = ", x);
	  // console.log("J = ", J);
	  // console.log("N = ", N);
	  // console.log("conn = ", conn);
	  return;
	  vectorOfDimension(2)(conn);
	  matrixOfDimension(2, '*')(N);
	  matrixOfDimension('*', 1)(J);
	  matrixOfDimension(2, 2)(x);
	}, 'input is not valid for mainfold 1 gcellset jacobian.');

	var _output_contract_jac_ = _.defineContract(function(jac) {
	  assert.number(jac);
	}, 'jac is not a number');

	// jacobian :: GCellSet -> ConnectivityList -> NodalContributionVector -> JacobianMatrix
	//             -> NodalCoordinatesInSpatialDomain
	//             -> ManifoldJacobian
	// ConnectivityList :: 1D JS array of dimension this.cellSize()
	// NodalContributionVector :: 1D JS array of length this.cellSize()
	// JacobianMatrix :: 2D JS array of dimension this.dim() by this.dim()
	// NodalCoordinatesInSpatialDomain :: 2D JS array of dimension this.cellSize() by this.dim()
	// ManifoldJacobian :: number
	Manifold1GCellSet.prototype.jacobian = function(conn, N, J, x) {
	  _input_contract_m1_jac_(conn, N, J, x);

	  var jac = this.jacobianCurve(conn, N, J, x);

	  _output_contract_jac_(jac);
	  return jac;
	};

	// jacobian :: GCellSet -> ConnectivityList -> NodalContributionVector -> JacobianMatrix
	//             -> NodalCoordinatesInSpatialDomain
	//             -> ManifoldJacobian
	// ConnectivityList :: 1D JS array of dimension this.cellSize()
	// NodalContributionVector :: 1D JS array of length this.cellSize()
	// JacobianMatrix :: 2D JS array of dimension this.dim() by this.dim()
	// NodalCoordinatesInSpatialDomain :: 2D JS array of dimension this.cellSize() by this.dim()
	// ManifoldJacobian :: number
	Manifold1GCellSet.prototype.jacobianCurve = function(conn, N, J, x) {
	  _input_contract_m1_jac_(conn, N, J, x);

	  var vec = numeric.transpose(J)[0];
	  var jac = numeric.norm2(vec);

	  _output_contract_jac_(jac);
	  return jac;
	};

	// jacobian :: GCellSet -> ConnectivityList -> NodalContributionVector -> JacobianMatrix
	//             -> NodalCoordinatesInSpatialDomain
	//             -> ManifoldJacobian
	// ConnectivityList :: 1D JS array of dimension this.cellSize()
	// NodalContributionVector :: 1D JS array of length this.cellSize()
	// JacobianMatrix :: 2D JS array of dimension this.dim() by this.dim()
	// NodalCoordinatesInSpatialDomain :: 2D JS array of dimension this.cellSize() by this.dim()
	// ManifoldJacobian :: number
	// For the one-dimensional cell, the surface Jacobian is
	//     (i) the product of the curve Jacobian and the other dimension
	//     (units of length);
	//     or, when used as axially symmetric
	//     (ii) the product of the curve Jacobian and the circumference of
	//     the circle through the point pc.
	Manifold1GCellSet.prototype.jacobianSurface = function(conn, N, J, x) {
	  _input_contract_m1_jac_(conn, N, J, x);

	  var jac;
	  if (this.axisSymm()) {
	    var m = this.cellSize(), n = this.dim();
	    matrixOfDimension(m, 1)(N);
	    matrixOfDimension(m, n)(x);
	    var xyz = numeric.mul(numeric.transpose(N), x)[0];
	    jac = this.jacobianCurve(conn, N, J, x) * 2 * Math.PI * xyz[0];
	  } else {
	    jac = this.jacobianCurve(conn, N, J, x) * this.otherDimension(conn, N, x);
	  }

	  _output_contract_jac_(jac);
	  return jac;
	};

	// jacobian :: GCellSet -> ConnectivityList -> NodalContributionVector -> JacobianMatrix
	//             -> NodalCoordinatesInSpatialDomain
	//             -> ManifoldJacobian
	// ConnectivityList :: 1D JS array of dimension this.cellSize()
	// NodalContributionVector :: 1D JS array of length this.cellSize()
	// JacobianMatrix :: 2D JS array of dimension this.dim() by this.dim()
	// NodalCoordinatesInSpatialDomain :: 2D JS array of dimension this.cellSize() by this.dim()
	// ManifoldJacobian :: number
	// For the one-dimensional cell, the volume Jacobian is
	//     (i) the product of the curve Jacobian and the other dimension
	//     (units of length squared);
	//     or, when used as axially symmetric
	//     (ii) the product of the curve Jacobian and the circumference of
	//     the circle through the point pc and the other dimension (units of
	//     length)
	Manifold1GCellSet.prototype.jacobianVolumn = function(conn, N, J, x) {
	  _input_contract_m1_jac_(conn, N, J, x);

	  var jac;
	  if (this.axisSymm()) {
	    var m = this.cellSize(), n = this.dim();
	    var xyz = numeric.mul(numeric.transpose(N), x)[0];
	    jac = this.jacobianCurve(conn, N, J, x) * 2 * Math.PI * xyz[0] * this.otherDimension(conn, N, x);
	  } else {
	    jac = this.jacobianCurve(conn, N, J, x) * this.otherDimension(conn, N, x);
	  }

	  _output_contract_jac_(jac);
	  return jac;
	};

	// jacobian :: GCellSet -> ConnectivityList -> NodalContributionVector -> JacobianMatrix
	//             -> NodalCoordinatesInSpatialDomain -> Dimension
	//             -> ManifoldJacobian
	// ConnectivityList :: 1D JS array of dimension this.cellSize()
	// NodalContributionVector :: 1D JS array of length this.cellSize()
	// JacobianMatrix :: 2D JS array of dimension this.dim() by this.dim()
	// NodalCoordinatesInSpatialDomain :: 2D JS array of dimension this.cellSize() by this.dim()
	// Dimension :: int
	// ManifoldJacobian :: number
	// jacobianInDim: A convinient wrapper for jacobianCurve, jacobianSurface, jacobianVolumn
	Manifold1GCellSet.prototype.jacobianInDim = function(conn, N, J, x, dim) {
	  _input_contract_m1_jac_(conn, N, J, x);

	  var jac;

	  switch (dim) {
	  case 3:
	    jac = this.jacobianVolumn(conn, N, J, x);
	    break;
	  case 2:
	    jac = this.jacobianSurface(conn, N, J, x);
	    break;
	  case 1:
	    jac = this.jacobianCurve(conn, N, J, x);
	    break;
	  default:
	    throw new Error('Manifold1GCellSet::jacobianInDim(): wrong dimension ' + dim);
	  }

	  _output_contract_jac_(jac);
	  return jac;
	};

	function Manifold2GCellSet(topology, otherDimension, axisSymm) {
	  this._otherDimension = (typeof otherDimension === 'number' || typeof otherDimension === 'function') ?
	    otherDimension : 1.0;
	  this._axisSymm = typeof axisSymm !== 'undefined' ? (!!axisSymm) : false;
	  GCellSet.call(this, topology);
	}
	exports.Manifold2GCellSet = Manifold2GCellSet;
	Manifold2GCellSet.prototype = Object.create(GCellSet.prototype);
	Manifold2GCellSet.prototype.constructor = Manifold2GCellSet;

	Manifold2GCellSet.prototype.dim = function() { return 2; };

	Manifold2GCellSet.prototype.otherDimension = function(conn, N, x) {
	  if (typeof this._otherDimension === 'function')
	    return this._otherDimension(conn, N, x);
	  return this._otherDimension;
	};

	Manifold2GCellSet.prototype.axisSymm = function() { return this._axisSymm; };

	Manifold2GCellSet.prototype.jacobian = function(conn, N, J, x) {
	  return this.jacobianSurface(conn, N, J, x);
	};

	Manifold2GCellSet.prototype.jacobianInDim = function(conn, N, J, x, dim) {
	  switch (dim) {
	  case 3:
	    return this.jacobianVolumn(conn, N, J, x);
	  case 2:
	    return this.jacobianSurface(conn, N, J, x);
	  default:
	    throw new Error('Manifold2GCellSet::jacobianInDim(): unsupported dim ' + dim);
	  }
	};

	Manifold2GCellSet.prototype.jacobianSurface = function(conn, N, J, x) {
	  var tmp = size(J), sdim = tmp[0], ntan = tmp[1];
	  var jac;
	  if (ntan === 2) {
	    if (sdim === ntan) {
	      jac = J[0][0]*J[1][1] - J[1][0]*J[0][1];
	    } else {
	      jac = skewmat(nthColumn(J, 1));
	      jac = dot(jac, nthColumn(J, 2));
	      jac = norm(jac);
	    }
	  } else {
	    throw new Error('Manifold2GCellSet::jacobianSurface(): is not implemented when ntan is not 2');
	  }
	  return jac;
	};

	Manifold2GCellSet.prototype.jacobianVolumn = function(conn, N, J, x) {
	  var xyz, jac;
	  if (this.axisSymm()) {
	    xyz = dot(transpose(N), x);
	    jac = this.jacobianSurface(conn, N, J, x)*2*Math.PI*xyz[0];
	  } else {
	    jac = this.jacobianSurface(conn, N, J, x)*this.otherDimension(conn, N, x);
	  }
	  return jac;
	};

	var _input_contract_gcellset_ = defineContract(function(options) {
	  assert.object(options);
	  assert.assigned(options.conn);
	  matrixOfDimension('*', '*')(options.conn);
	}, 'input is not a valid gcellset option.');

	var _input_contract_L2_ = defineContract(function(options) {
	  _input_contract_gcellset_(options);

	  matrixOfDimension('*', 2)(options.conn);
	  if (check.assigned(options.otherDimension)) {
	    assert.number(options.otherDimension);
	  }

	  if (check.assigned(options.axisSymm)) {
	    assert.boolean(options.axisSymm);
	  }
	}, 'input is not a valid L2 option.');

	function L2(options) {
	  _input_contract_L2_(options);

	  var conn = options.conn;
	  var otherDimension = check.assigned(options.otherDimension) ?
	        options.otherDimension : 1.0;
	  var axisSymm = check.assigned(options.axisSymm) ?
	        options.axisSymm : false;

	  var topology = hypercube(conn, 1);
	  Manifold1GCellSet.call(this, topology, otherDimension, axisSymm);
	}

	L2.prototype = Object.create(Manifold1GCellSet.prototype);
	L2.prototype.constructor = L2;
	L2.prototype.boundaryGCellSetConstructor = function() {
	  // TODO:
	  return P1;
	};

	L2.prototype.subset = function(indices) {
	  var conn = subset(this.conn(), indices);
	  return new L2({
	    conn: conn,
	    axisSymm: this.axisSymm(),
	    otherDimension: this._otherDimension
	  });
	};

	L2.prototype.triangles = function() { return []; };

	L2.prototype.cellSize = function() { return 2; };

	L2.prototype.type = function() { return 'L2'; };

	var _input_contract_l2_param_coords_ = defineContract(function(paramCoords) {
	  vectorOfDimension(1)(paramCoords);
	}, 'input is not a valid l2 param coords, which should be of vector of dimension 1.');

	L2.prototype.bfun = function(paramCoords) {
	  _input_contract_l2_param_coords_(paramCoords);

	  var x = paramCoords[0];
	  var out = [
	    [ 0.5 * (1 - x) ],
	    [ 0.5 * (1 + x) ]
	  ];
	  return out;
	};

	L2.prototype.bfundpar = function(paramCoords) {
	  _input_contract_l2_param_coords_(paramCoords);

	  return [
	    [ -0.5 ],
	    [ +0.5 ]
	  ];
	};

	exports.L2 = L2;

	function Q4(options) {
	  var conn = options.conn;
	  var otherDimension = check.assigned(options.otherDimension) ?
	        options.otherDimension : 1.0;
	  var axisSymm = check.assigned(options.axisSymm) ?
	        options.axisSymm : false;

	  var topology = hypercube(conn, 2);
	  Manifold2GCellSet.call(this, topology, otherDimension, axisSymm);
	}
	exports.Q4 = Q4;
	Q4.prototype = Object.create(Manifold2GCellSet.prototype);
	Q4.prototype.constructor = Q4;

	Q4.prototype.subset = function(indices) {
	  var conn = subset(this.conn(), indices);
	  return new Q4({
	    conn: conn,
	    axisSymm: this.axisSymm(),
	    otherDimension: this._otherDimension
	  });
	};

	Q4.prototype.cellSize = function() { return 4; };

	Q4.prototype.type = function() { return 'Q4'; };

	Q4.prototype.boundaryGCellSetConstructor = function() {
	  return L2;
	};

	Q4.prototype.triangles = function() {
	  var quads = this._topology.getCellsInDim(2);
	  var triangles = [];

	  quads.forEach(function(quad) {
	    var t1 = [quad[0], quad[1], quad[2]];
	    var t2 = [quad[2], quad[3], quad[0]];
	    triangles.push(t1, t2);
	  });

	  return triangles;
	};

	// paramCoords: vec:2
	// return: mat:4,1
	Q4.prototype.bfun = function(paramCoords) {
	  var one_minus_xi = (1 - paramCoords[0]);
	  var one_plus_xi  = (1 + paramCoords[0]);
	  var one_minus_eta = (1 - paramCoords[1]);
	  var one_plus_eta  = (1 + paramCoords[1]);

	  var val = [
	    [0.25 * one_minus_xi * one_minus_eta],
	    [0.25 * one_plus_xi  * one_minus_eta],
	    [0.25 * one_plus_xi  * one_plus_eta],
	    [0.25 * one_minus_xi * one_plus_eta]
	  ];
	  return val;
	};

	// paramCoords: vec:2
	// return: mat:4,1
	Q4.prototype.bfundpar = function(paramCoords) {
	  var xi = paramCoords[0], eta = paramCoords[1];
	  var val = [
	    [-(1. - eta) * 0.25, -(1. - xi) * 0.25],
	    [(1. - eta) * 0.25, -(1. + xi) * 0.25],
	    [(1. + eta) * 0.25, (1. + xi) * 0.25],
	    [-(1. + eta) * 0.25, (1. - xi) * 0.25]
	  ];
	  return val;
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// field

	var _ = __webpack_require__(1);
	var check = _.check;
	var assert = _.assert;
	var isVectorOfDimension = _.isVectorOfDimension;
	var array2d = _.array2d;
	var array1d = _.array1d;
	var defineContract = _.defineContract;
	var matrixOfDimension = _.contracts.matrixOfDimension;
	var PointSet = __webpack_require__(7).PointSet;
	var FeNodeSet = __webpack_require__(10).FeNodeSet;

	var _input_contract_field_option_ = defineContract(function(o) {
	  assert.object(o);
	  if (check.assigned(o.values)) {
	    matrixOfDimension('*', '*', 'values is not a valid matrix.')(o.values);
	  } else if (check.assigned(o.nfens) && check.assigned(o.dim)) {
	    assert.integer(o.nfens);
	    assert.integer(o.dim);
	    if (o.nfens < 0) throw new Error('nfens must > 0.');
	    if (o.dim < 0) throw new Error('dim must > 0');
	  } else if (check.assigned(o.fens)) {
	    assert.instance(o.fens, FeNodeSet);
	  } else if (check.assigned(o.pointset)) {
	    assert.instance(o.pointset, PointSet);
	  } else {
	    throw new Error('');
	  }

	  if (check.assigned(o.ebcs)) {
	    assert.array(o.ebcs, 'ebcs must be a array of valid EBC object');
	  }

	}, 'Input is not a valid Field option.');

	function Field(options) {
	  _input_contract_field_option_(options);

	  if (check.assigned(options.values)) {
	    this._values = new PointSet(options.values);
	  } else if (check.assigned(options.pointset)) {
	    this._values = options.pointset.clone();
	  } else if (check.assigned(options.fens)) {
	    this._values = new PointSet(options.fens.xyz());
	  } else if (check.assigned(options.nfens) && check.assigned(options.dim)) {
	    this._values = new PointSet(options.nfens, options.dim);
	  }

	  if (check.assigned(options.ebcs)) {
	    // TODO: merge ebcs
	    // +1 because the id and direction index starts from 1;
	    var prescribed = array2d(this.nfens() + 1, this.dim() + 1, false);
	    var prescribedValues =  array2d(this.nfens() + 1, this.dim() + 1, 0);
	    this._prescribed = prescribed;
	    this._prescribedValues = prescribedValues;

	    options.ebcs.forEach(function(ebc) {
	      // TODO: make sure ebc object is valid;
	      // ebc.fenids.forEach(function(fenid, i) {
	      //   var comp = ebc.component[i];
	      //   prescribed[fenid][comp] = !!(ebc.prescribed[i]);
	      //   prescribedValues[fenid][comp] = ebc.value[i];
	      // });
	      ebc.applyToField_(this);
	    }, this);
	  }

	  this._eqnums = null;
	  this._neqns = -1;
	}

	Field.prototype.nfens = function() {
	  return this._values.getSize();
	};

	Field.prototype.neqns = function() {
	  if (!this._eqnums) this._numberEqnums_();
	  return this._neqns;
	};

	Field.prototype.dim = function() {
	  return this._values.getRn();
	};

	Field.prototype.values = function() {
	  return this._values.toList();
	};

	Field.prototype.map = function(fn) {
	  var newValues = this._values.toList().map(fn);
	  var newField = new Field({
	    values: newValues
	  });
	  var id = function(x) { return x; };
	  newField._neqns = this._neqns;
	  newField._eqnums = this._eqnums.map(id);
	  newField._prescribed = this._prescribed.map(id);
	  newField._prescribedValues = this._prescribedValues.map(function(x, i) {
	    if (newField._prescribed[i])
	      return fn(x, i);
	    else
	      return x;
	  });
	};

	// Get value vector by Id
	// Return: vec:this.dim()
	Field.prototype.get = function(id) {
	  var idx = id - 1;
	  return this._values.get(idx);
	};

	// For visualization.
	Field.prototype.pointset = function() {
	  return this._values;
	};

	Field.prototype.isPrescribed = function(id, direction) {
	  if (!this._prescribed) return false;
	  return this._prescribed[id][direction];
	};

	Field.prototype.prescribedValue = function(id, direction) {
	  if (this.isPrescribed(id, direction))
	    return this._prescribedValues[id][direction];
	  return 0;
	};

	Field.prototype.setPrescribedValue_ = function(id, dir, val) {
	  // console.log("val = ", val);
	  // console.log("dir = ", dir);
	  // console.log("id = ", id);
	  // console.log("this._prescribed = ", this._prescribed);
	  this._prescribed[id][dir] = true;
	  this._prescribedValues[id][dir] = val;
	  this._values.setAtDir_(id-1, dir-1, val);
	};

	Field.prototype._numberEqnums_ = function() {
	  var eqnums = array2d(this.nfens() + 1, this.dim() + 1, 0);

	  var count = 0, nfens = this.nfens(), dim = this.dim();
	  var i, j;
	  for (i = 1; i <= nfens; ++i) {
	    for (j = 1; j <= dim; ++j) {
	      if (!this.isPrescribed(i, j)) {
	        count++;
	        eqnums[i][j] = count;
	      } else {
	        eqnums[i][j] = 0;
	      }
	    }
	  }
	  this._eqnums = eqnums;
	  this._neqns = count;
	};

	Field.prototype.eqnum = function(id, direction) {
	  if (!this._eqnums) this._numberEqnums_();
	  if (id < 1 || id > this.nfens()) throw new Error('Field::eqnum(): id out of range.');
	  if (direction < 1 || direction > this.dim()) throw new Error('Field::eqnum(): direction out of range.');
	  return this._eqnums[id][direction];
	};

	Field.prototype.gatherEqnumsVector = function(conn) {
	  var vec = [], dim = this.dim();
	  conn.forEach(function(fenid) {
	    var i, eqnum;
	    for (i = 1; i <= dim; ++i) {
	      vec.push(this.eqnum(fenid, i));
	    }
	  }, this);
	  return vec;
	};

	Field.prototype.gatherValuesMatrix = function(conn) {
	  var len = conn.length, dim = this.dim();
	  var mat = array1d(len, null);
	  conn.forEach(function(fenid, i) {
	    var idx = fenid - 1;
	    mat[i] = this._values.get(idx);
	  }, this);
	  return mat;
	};

	// return: vec(conn.length)
	Field.prototype.gatherPrescirbedValues = function(conn) {
	  var vec = [], dim = this.dim();
	  conn.forEach(function(id) {
	    var dir;
	    for (dir = 1; dir <= dim; ++dir) {
	      vec.push(this.prescribedValue(id, dir));
	    }
	  }, this);
	  return vec;
	};

	Field.prototype.scatterSystemVector_ = function(vec) {
	  var neqns = this.neqns();
	  if (!isVectorOfDimension(vec, neqns))
	    throw new Error('Field::scatterSystemVector(): vec is not a vector of ' +
	                    'dimension ' + neqns);

	  if (!this._eqnums) this._numberEqnums_();

	  var eqnums = this._eqnums;
	  var nfens = this.nfens();
	  var dim = this.dim();
	  var values = this._values;
	  var i, j, en, val;

	  for (i = 1; i <= nfens; ++i) {
	    for (j = 1; j <= dim; ++j) {
	      en = eqnums[i][j];
	      if (en !== 0) {
	        val = vec[en - 1];
	        values.setAtDir_(i-1, j-1, val);
	      }
	    }
	  }
	};

	exports.Field = Field;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// materialproperty

	var _ = __webpack_require__(1);
	var assert = _.assert;
	var check = _.check;
	var matrixOfDimension = _.contracts.matrixOfDimension;
	var mat6x6 = matrixOfDimension(6, 6);
	var diag = _.numeric.diag;
	var transpose = _.numeric.transpose;
	var add = _.numeric.add;
	var dot = _.numeric.dot;
	var mul = _.numeric.mul;

	function MaterialProperty(props) {
	  this._rho = (props && typeof props.rho === 'number') ? props.rho : 1.0;
	}

	MaterialProperty.prototype.rho = function() { return this._rho; };
	exports.MaterialProperty = MaterialProperty;

	var _input_contract_LinElIsoProp_ = _.defineContract(function(props) {
	  assert.object(props, 'props is not a JS object');
	  assert.undefined(props.G, 'props.G should not be set, it is compute from E and nu.');
	  assert.positive(props.E, 'props.E is not a positive number.');
	  if (check.assigned(props.nu)) {
	    assert.number(props.nu, 'props.nu is not a number.');
	    if (props.nu < 0) throw new Error('props.nu < 0.');
	  }
	}, 'input is not a valid linear elasitc iso property.');

	function LinElIso(props) {
	  _input_contract_LinElIsoProp_(props);

	  MaterialProperty.call(this, props);
	  this._E = props.E;
	  this._nu = props.nu;
	  if (!check.assigned(this._nu)) this._nu = 0.0;
	}
	exports.LinElIso = LinElIso;

	LinElIso.prototype = Object.create(MaterialProperty.prototype);
	LinElIso.prototype.constructor = LinElIso;

	LinElIso.prototype.E = function() { return this._E; };
	LinElIso.prototype.nu = function() { return this._nu; };
	LinElIso.prototype.G = function() {
	  if (!this._G)
	    this._G = 0.5 * this._E/(1+this._nu);
	  return this._G;
	};

	var _output_contract_D_ = mat6x6;
	LinElIso.prototype.D = function() {
	  // compute D;
	  if (!this._D) {
	    var E = this.E(), nu = this.nu(), G = this.G();
	    var lambda = E*nu / ( (1+nu) * (1-2*nu) );
	    var mu = E / (2 * (1 + nu));
	    var mI = diag([1, 1, 1, 0.5, 0.5, 0.5]);
	    var m1 = transpose([[1, 1, 1, 0, 0, 0]]);
	    this._D = add(mul(lambda, dot(m1, transpose(m1))), mul(2*mu,  mI));
	  }

	  _output_contract_D_(this._D);
	  return this._D;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// material

	var _ = __webpack_require__(1);
	var check = _.check;
	var assert = _.assert;
	var defineContract = _.defineContract;
	var property = __webpack_require__(13);
	var LinElIso = property.LinElIso;
	var numeric = __webpack_require__(6);
	var ix = numeric.ix;
	var ixUpdate = numeric.ixUpdate;
	var mul = numeric.mul;
	var div = numeric.div;
	var dot = numeric.dot;
	var add = numeric.add;

	function Material() {}

	Material.prototype.newState = function() {
	  throw new Error('Material::newState(): is not implemented.');
	};

	Material.prototype.update = function() {
	  throw new Error('Material::update(): is not implemented.');
	};
	exports.Material = Material;

	var _input_contract_linel_uniax_prop_ = defineContract(function(o) {
	  assert.object(o);
	  if (!check.instance(o.property, LinElIso)) {
	    throw new Error('input is not a instance of LinElIso.');
	  }
	}, 'Input is not a valid option for DeforSSLinElUniax');

	function DeforSSLinElUniax(options) {
	  _input_contract_linel_uniax_prop_(options);
	  this._prop = options.property;
	}

	DeforSSLinElUniax.prototype = Object.create(Material.prototype);
	DeforSSLinElUniax.prototype.constructor = DeforSSLinElUniax;

	// return: mat:(1,1)
	DeforSSLinElUniax.prototype.tangentModuli = function() {
	  return [ [this._prop.E()] ];
	};

	exports.DeforSSLinElUniax = DeforSSLinElUniax;

	var _input_contract_linel_biax_prop_ = defineContract(function(o) {
	  assert.object(o);
	  if (!check.instance(o.property, LinElIso)) {
	    throw new Error('input is not a instance of LinElIso.');
	  }
	}, 'Input is not a valid option for DeforSSLinElBiax');

	function DeforSSLinElBiax(options) {
	  _input_contract_linel_uniax_prop_(options);
	  this._prop = options.property;
	  this._reduction = options.reduction || 'strain';
	}
	exports.DeforSSLinElBiax = DeforSSLinElBiax;

	DeforSSLinElBiax.prototype = Object.create(Material.prototype);
	DeforSSLinElBiax.prototype.constructor = DeforSSLinElBiax;

	// return: mat:(3, 3) or mat:(4, 4)
	DeforSSLinElBiax.prototype.tangentModuli = function() {
	  var D = this._prop.D();
	  var reduced, Dt;
	  if (this._reduction === 'strain') {
	    reduced = ix(D, [1, 2, 4], [1, 2, 4]);
	  } else if (this._reduction === 'axisSymm') {
	    reduced = ix(D, [1, 2, 3, 4], [1, 2, 3, 4]);
	  } else if (this._reduction === 'stress') {
	    Dt = ix(D, [1,2], [1,2]);
	    Dt = add(Dt, mul(-1, div(dot(ix(D, [1,2], [3]), ix(D, [3], [1,2])), D[2][2])));
	    reduced = ix(D, [1,2,4], [1,2,4]);
	    reduced = ixUpdate(reduced, [1,2], [1,2], Dt);
	  } else {
	    throw new Error('DeforSSLinElBiax::tangentModuli() is ');
	  }

	  return reduced;
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// feblock
	var _ = __webpack_require__(1);
	var assert = _.assert;
	var check = _.check;
	var array2d = _.array2d;
	var array1d = _.array1d;
	var defineContract = _.defineContract;
	var isMatrixOfDimension = _.isMatrixOfDimension;
	var numeric = __webpack_require__(6);
	var size = numeric.size;
	var transpose = numeric.transpose;
	var dot = numeric.dot;
	var add = numeric.add;
	var mul = numeric.mul;
	var inv = numeric.inv;
	var norm = numeric.norm;
	var ixUpdate = numeric.ixUpdate;
	var colon = numeric.colon;
	var Material = __webpack_require__(14).Material;
	var GCellSet = __webpack_require__(11).GCellSet;
	var IntegrationRule = __webpack_require__(18).IntegrationRule;
	var ElementMatrix = __webpack_require__(21).ElementMatrix;
	var ElementVector = __webpack_require__(22).ElementVector;

	function Feblock() {}

	Feblock.prototype.gcells = function() {
	  return this._gcells;
	};

	Feblock.prototype.topology = function() {
	  return this._gcells.topology();
	};

	var _input_contract_deforss_option = defineContract(function(o) {
	  assert.object(o);
	  if (!check.instance(o.material, Material))
	    throw new Error('options.material is not a instance of Material');

	  if (!check.instance(o.gcells, GCellSet))
	    throw new Error('options.gcells is not a instance of GCellSet');

	  if (!check.instance(o.integrationRule, IntegrationRule))
	    throw new Error('options.integrationRule is not a instance of integrationRule');

	}, 'Input is not valid DeforSS option.');

	function DeforSS(options) {
	  _input_contract_deforss_option(options);
	  this._mater = options.material;
	  this._gcells = options.gcells;
	  this._ir = options.integrationRule;
	  if (check.assigned(options.rm)) {
	    this._rm = options.rm;
	  }

	  var dim = this._gcells.dim();
	  switch (dim) {
	  case 1:
	    this.hBlmat = this._blmat1;
	    break;
	  case 2:
	    if (this._gcells.axisSymm())
	      throw new Error('DeforSS::hBlmat() for axixSymm, dim = ' + dim + ' is not implemented.');
	    else
	      this.hBlmat = this._blmat2;
	    break;
	  default:
	    throw new Error('DeforSS::hBlmat() for dim ' + dim + ' is not implemented.');
	  }
	}
	DeforSS.prototype = Object.create(Feblock.prototype);
	DeforSS.prototype.constructor = DeforSS;

	DeforSS.prototype._blmat1 = function(N, Ndersp, c, Rm) {
	  var nfn = size(Ndersp, 1);
	  var dim = size(c, 2);
	  var B = array2d(1, nfn*dim, 0);
	  var i, indices;

	  var s, dimi_1, from, to, span;

	  if (Rm) {
	    s = Rm.map(function(row) {
	      return row[0];
	    });

	    for (i = 1; i <= nfn; ++i) {
	      from = dim*(i-1);
	      to = dim*i-1;
	      span = to - from;
	      indices = array1d(span+1, function(x) {
	        return from + x;
	      });
	      indices.forEach(function(idx, j) {
	        B[0][idx] = Ndersp[i-1][0]*s[j];
	      });
	    }
	  } else {
	    throw new Error('_blmat1: not implmented when !Rm');
	  }
	  return B;

	};


	DeforSS.prototype._blmat2 = function(N, Ndersp, c, Rm) {
	  var nfn = size(Ndersp, 1);
	  var dim = size(c, 2);
	  var B = array2d(3, nfn*dim, 0);
	  var i, cols, vals;

	  if (Rm) {
	    for (i = 1; i <= nfn; ++i) {
	      cols = colon(dim*(i-1)+1, dim*i);
	      vals = [
	        [ Ndersp[i-1][0], 0 ],
	        [ 0, Ndersp[i-1][1] ],
	        [ Ndersp[i-1][1], Ndersp[i-1][0] ]
	      ];
	      // console.log("B = ", B);
	      // console.log("cols = ", cols);
	      // console.log("vals = ", vals);
	      B = ixUpdate(B, ':', cols, vals);
	      // console.log("B = ", B);
	    }
	  } else
	    throw new Error('_blmat1: not implmented when !Rm');
	  return B;
	};

	// In:
	//   geom: Geometry Field
	//   geom: Displacemeent Field
	// out: [ ElementMatrix ]
	// out: { matrices: [ 2D JS Array of dimension cellSize x cellSize ] }
	//  eqnums: [ 1D JS Array of dimension cellSize ] }
	DeforSS.prototype.stiffness = function(geom, u) {
	  // _input_contract_stiffness_(geom, u);
	  var gcells = this._gcells;
	  var cellSize = gcells.cellSize();
	  var ir = this._ir;

	  var pc = ir.paramCoords();
	  var w = ir.weights();
	  var npts = ir.npts();

	  var Ns = [], Nders = [];
	  var j;
	  for (j = 0; j < npts; ++j) {
	    Ns[j] = gcells.bfun(pc[j]);
	    Nders[j] = gcells.bfundpar(pc[j]);
	  }

	  var rmh = null;
	  if (typeof this._rm === 'function')
	    rmh = this._rm;
	  var rm = this._rm;
	  var mat = this._mater;

	  var conns = gcells.conn();
	  // labels??
	  var numCells = gcells.count();
	  var Ke = new Array(numCells);
	  var eqnums = new Array(numCells);

	  var dim = geom.dim();
	  // console.log("dim = ", dim);
	  var i;
	  for (i = 0; i < numCells; ++i) {
	    eqnums[i] = u.gatherEqnumsVector(conns[i]);
	    Ke[i] = array2d(dim*cellSize, dim*cellSize, 0);
	  }

	  var allIds = array1d(geom.nfens(), function(i) { return i + 1; });
	  var xs = geom.gatherValuesMatrix(allIds);

	  var conn, x, c, J, Ndersp, Jac, B, D, delta;
	  for (i = 0; i < numCells; ++i) {
	    conn = conns[i];
	    x = conn.map(function(id) { return xs[id-1]; });

	    for (j = 0; j < npts; ++j) {
	      c = dot(transpose(Ns[j]), x);
	      J = dot(transpose(x), Nders[j]);
	      // console.log("c = ", c);
	      // console.log("J = ", J);
	      if (rmh)
	        rm = rmh(c, J);

	      if (rm) {
	        // TODO: figure out rm
	        Ndersp = dot(Nders[j], inv(dot(transpose(rm), J)));
	      } else {
	        Ndersp = dot(Nders[j], inv(J));
	      }
	      // console.log("Ndersp = ", Ndersp);

	      Jac = gcells.jacobianVolumn(conn, Ns[j], J, x);
	      if (Jac < 0) throw new Error('Non-positive Jacobian');

	      // TODO: _hBlmat
	      B = this.hBlmat(Ns[j], Ndersp, c, rm);
	      // console.log("B = ", B);
	      // size(B)
	      // console.log("size(B) = ", size(B));
	      D = mat.tangentModuli({ xyz: c });
	      // console.log("D = ", D);

	      // var jw = Jac*w[j];
	      // var mid = mul(D, Jac*w[j]);
	      // console.log("mid = ", mid);
	      // console.log("B = ", B);
	      // console.log("B' = ", transpose(B));
	      // console.log("dot(transpose(B), mid) = ", dot(transpose(B), mid));

	      // console.log("Jac = ", Jac);
	      // console.log("mul(D, Jac*w[j]) = ", mul(D, Jac*w[j]));
	      // console.log("dot(transpose(B), mul(D, Jac*w[j])) = ", dot(transpose(B), mul(D, Jac*w[j])));
	      delta = dot(dot(transpose(B), mul(D, Jac*w[j])), B);
	      // console.log("delta = ", delta);
	      // console.log("delta = ", delta);

	      // delta = dot(dot(transpose(B), mul(D, Jac*w[j])), B);
	      // console.log("Ke[j] = ", Ke[j]);
	      Ke[i] = add(Ke[i], delta);
	      // console.log("Ke[j] = ", Ke[j]);
	    }
	  }

	  var elementMatrix = Ke.map(function(mat, i) {
	    return new ElementMatrix(mat, eqnums[i]);
	  });

	  return elementMatrix;
	};


	DeforSS.prototype.noneZeroEBCLoads = function(geom, u) {
	  var gcells = this._gcells;
	  var ncells = gcells.count();
	  var conns = gcells.conn();

	  var evs = [];

	  var i, conn, pu, feb, ems, Ke, f, eqnums;
	  for (i = 0; i < ncells; ++i) {
	    conn = conns[i];
	    pu = u.gatherPrescirbedValues(conn);
	    if (norm(pu) !== 0) {
	      // console.log("this._gcells.subset(i) = ", this._gcells.subset([i]));
	      feb = new DeforSS({
	        material: this._mater,
	        gcells: this._gcells.subset([i]),
	        integrationRule: this._ir,
	        rm: this._rm
	      });
	      // this._gcells = this._gcells.subset([i]);
	      ems = feb.stiffness(geom, u);
	      // console.log("ems = ", ems);
	      Ke = ems[0].matrix;
	      // console.log("Ke = ", Ke);

	      f = mul(-1, dot(Ke, pu));
	      // console.log("f = ", f);
	      eqnums = u.gatherEqnumsVector(conn);
	      evs.push(new ElementVector(f, eqnums));
	    }
	  }
	  return evs;
	};

	exports.DeforSS = DeforSS;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// system
	var _ = __webpack_require__(1);
	var isVector = _.isArray;
	var matrix = __webpack_require__(21);
	var vector = __webpack_require__(22);
	var SparseSystemMatrix = matrix.SparseSystemMatrix;
	var SparseSystemVector = vector.SparseSystemVector;

	exports.matrix = matrix;
	exports.vector = vector;

	// Return a full vector (1d js array).
	function mldivide(A, b) {
	  if (A instanceof SparseSystemMatrix && b instanceof SparseSystemVector) {
	    return A.dokMatrix().solveSparseVector(b.sparseVector()).toList();
	  } else if (A instanceof SparseSystemMatrix && isVector(b)) {
	    return A.dokMatrix().solveVector(b);
	  }

	  throw new Error('system.solve(): unsupported type A and b.');
	}

	exports.mldivide = mldivide;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// nodalload
	var _  = __webpack_require__(1);
	var check = _.check;
	var ElementVector = __webpack_require__(22).ElementVector;

	function NodalLoad(options) {
	  var ids = options.ids || options.id;
	  var dirs = options.dirs || options.dir;
	  var magns = options.magns || options.magn;

	  if (!check.array(ids)) ids = [ids];
	  if (!check.array(dirs)) dirs = [dirs];
	  if (!check.array(magns)) magns = [magns];
	  this._ids = ids;
	  this._dirs = dirs;
	  this._magns = magns;
	}

	NodalLoad.prototype.loads = function(u) {
	  var i, j, en;
	  var id, dir;
	  var val;
	  var nids = this._ids.length, ndirs = this._dirs.length;
	  var vec = [], eqnums = [];
	  for (i = 0; i < nids; ++i) {
	    id = this._ids[i];
	    for (j = 0; j < ndirs; ++j) {
	      dir = this._dirs[j];
	      en = u.eqnum(id, dir);
	      val = this._magns[j];
	      vec.push(val);
	      eqnums.push(en);
	    }
	  }
	  return new ElementVector(vec, eqnums);
	};

	exports.NodalLoad = NodalLoad;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// core.numeric.integrationrule

	var _ = __webpack_require__(1);
	var numeric = __webpack_require__(6);
	var transpose = numeric.transpose;
	var cloneDeep = _.cloneDeep;

	function IntegrationRule() {}

	// paramCoords :: IntegrationRule -> ParametricCoordinates
	// ParametricCoordinates :: 2D JS array of dimension npts by dim
	IntegrationRule.prototype.paramCoords = function() {
	  throw new Error('IntegrationRule::paramCoords(): must be overrided by subclass.');
	};

	// weights :: IntegrationRule -> Weights
	// Weights :: 1D JS array of dimension npts
	IntegrationRule.prototype.weights = function() {
	  throw new Error('IntegrationRule::weights(): must be overrided by subclass.');
	};

	// npts :: IntegrationRule -> Int
	IntegrationRule.prototype.npts = function() {
	  throw new Error('IntegrationRule::npts(): must be overrided by subclass.');
	};

	// dim :: IntegrationRule -> Int
	IntegrationRule.prototype.dim = function() {
	  throw new Error('IntegrationRule::dim(): must be overrided by subclass.');
	};

	exports.IntegrationRule = IntegrationRule;

	// GaussRule :: Dimension -> Order -> GaussRule
	// Dimension :: Int
	// Order :: Int
	// dim: {1, 2, 3} D
	// order: number of points along one dimension
	function GaussRule(dim, order) {
	  // TODO: some parameter validation here.
	  // dim in { 1, 2, 3 }

	  var pcs, ws;
	  switch(order) {
	  case 1:
	    pcs = [ 0 ];
	    ws  = [ 2 ];
	    break;
	  case 2:
	    pcs = [ -0.577350269189626, 0.577350269189626 ];
	    ws  = [ 1, 1 ];
	    break;
	  case 3:
	    pcs = [ -0.774596669241483, 0, 0.774596669241483 ];
	    ws  = [ 0.5555555555555556, 0.8888888888888889, 0.5555555555555556 ];
	    break;
	  case 4:
	    pcs = [ -0.86113631159405, -0.33998104358486, 0.33998104358486, 0.86113631159405 ];
	    ws  = [ 0.34785484513745, 0.65214515486255, 0.65214515486255, 0.34785484513745 ];
	    break;
	  default:
	    throw new Error('GaussRule(dim, order): for order = ' + order +
	                    ' is not implemented.');
	  }

	  var paramCoords, weights, i, j, k;
	  switch(dim) {
	  case 1:
	    paramCoords = transpose([ pcs ]);
	    weights = ws;
	    break;
	  case 2:
	    paramCoords = [];
	    weights = [];
	    for (i = 0; i < order; ++i) {
	      for (j = 0; j < order; ++j) {
	        paramCoords.push([ pcs[i], pcs[j] ]);
	        weights.push(ws[i] * ws[j]);
	      }
	    }
	    break;
	  case 3:
	    paramCoords = [];
	    weights = [];
	    for (i = 0; i < order; ++i) {
	      for (j = 0; j < order; ++j) {
	        for (k = 0; k < order; ++k) {
	          paramCoords.push([ pcs[i], pcs[j], pcs[k] ]);
	          weights.push(ws[i] * ws[j] * ws[k]);
	        }
	      }
	    }
	    break;
	  default:
	    throw new Error('GaussRule(dim, order): for dim = ' + dim +
	                    ' is not implemented.');
	  }

	  this._paramCoords = paramCoords;
	  this._weights = weights;
	}

	GaussRule.prototype = Object.create(IntegrationRule.prototype);
	GaussRule.prototype.constructor = GaussRule;

	GaussRule.prototype.paramCoords = function() {
	  return cloneDeep(this._paramCoords);
	};

	GaussRule.prototype.weights = function() {
	  return cloneDeep(this._weights);
	};

	GaussRule.prototype.npts = function() {
	  return this._paramCoords.length;
	};

	GaussRule.prototype.dim = function() {
	  return this._paramCoords[0].length;
	};

	exports.GaussRule = GaussRule;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// ebc
	var _ = __webpack_require__(1);
	var check = _.check;
	var isArray = _.isArray;
	var isIterator = _.isIterator;
	var iteratorFromList = _.iteratorFromList;

	function EBC(options) {
	  if (check.function(options.id))
	    this._idIterFn = options.id;
	  else if (options.id === 'all')
	    this._idIterFn = function(u) {
	      var i = 0, nfens = u.nfens();
	      return {
	        hasNext: function() { return i < nfens; },
	        next: function() { return ++i; }
	      };
	    };
	  else if (check.array(options.id))
	    this._idIterFn = function() { return iteratorFromList(options.id); };
	  else if (check.number(options.id))
	    this._idIterFn = function() { return iteratorFromList([options.id]); };
	  else
	    throw new Error('EBC(): options.id is not valid.');

	  if (check.array(options.value))
	    this._valFn = function(id, dir, idx, u) { return options.value[idx]; };
	  else if (check.number(options.value))
	    this._valFn = function(id, dir, idx, u) { return options.value; };
	  else if (check.function(options.value))
	    this._valFn = options.value;
	  else
	    throw new Error('EBC(): options.value is not valid.');

	  if (check.number(options.dir))
	    this._dirs = [options.dir];
	  else if (check.array(options.dir))
	    this._dirs = options.dir;
	  else
	    throw new Error('EBC(): options.dir is not valid.');

	}

	exports.EBC = EBC;

	EBC.prototype.applyToField_ = function(u) {
	  var idIter = this._idIterFn(u), valFn = this._valFn;
	  var dirs = this._dirs, id, idx = 0;

	  while (idIter.hasNext()) {
	    id = idIter.next();
	    dirs.forEach(function(dir) {
	      var val = valFn(id, dir, idx, u);
	      u.setPrescribedValue_(id, dir, val);
	    });
	    ++idx;
	  }
	};

	exports.EBC;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// mesh
	var FeNodeSet = __webpack_require__(10).FeNodeSet;
	var Q4 = __webpack_require__(11).Q4;

	function Mesh(fens, gcells) {
	  this.fens = fens;
	  this.gcells = gcells;
	}

	function L2x2() {
	  var fens, gcells;
	  fens = new FeNodeSet({
	    xyz: [
	      [1/2, 0],
	      [1, 0],
	      [1, 1/2],
	      [1/2, 1/2],
	      [1, 1],
	      [1/2, 1],
	      [0, 1],
	      [0, 1/2]
	    ]
	  });
	  gcells = new Q4({
	    conn: [
	      [1, 2, 3, 4],
	      [4, 3, 5, 6],
	      [4, 6, 7, 8]
	    ]
	  });

	  return new Mesh(fens, gcells);
	}

	exports.L2x2 = L2x2;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// system.matrix
	var _ = __webpack_require__(1);
	var iteratorFromList = _.iteratorFromList;
	var isArray = _.isArray;
	var isIterator = _.isIterator;
	var numeric = __webpack_require__(6);
	var mldivide = numeric.mldivide;
	var DokSparseMatrix = numeric.DokSparseMatrix;

	function ElementMatrix(mat, eqnums) {
	  // TODO: input check
	  this.matrix = mat;
	  this.eqnums = eqnums;
	}
	exports.ElementMatrix = ElementMatrix;

	function assemble_(dest, sources) {
	  // TODO: ensure sources of made of ElementMatrix;
	  if (!isIterator(sources)) {
	    if (isArray(sources))
	      sources = iteratorFromList(sources);
	    else
	      throw new Error('assemble_(dest, sources): sources must be a iterator or array.');
	  }

	  var Ke;
	  while (sources.hasNext()) {

	    Ke = sources.next();
	    var mat = Ke.matrix, eqnums = Ke.eqnums;

	    var noneZeroIndices = eqnums.map(function(globalIndex, localIndex) {
	      return {
	        globalIndex: globalIndex,
	        localIndex: localIndex
	      };
	    }).filter(function(item) {
	      return item.globalIndex !== 0;
	    });

	    noneZeroIndices.forEach(function(item0) {
	      // Notice the equation number starts from 1.
	      var globalRowIndex = item0.globalIndex - 1;
	      var localRowIndex = item0.localIndex;
	      noneZeroIndices.forEach(function(item1) {
	        var globalColIndex = item1.globalIndex - 1;
	        var localColIndex = item1.localIndex;

	        var oldVal = dest.at(globalRowIndex, globalColIndex);

	        // TODO: use mat.at()
	        var elementContribution = mat[localRowIndex][localColIndex];
	        dest.set_(globalRowIndex, globalColIndex, oldVal + elementContribution);
	      });
	    });
	  }
	}

	function SparseSystemMatrix(nrows, ncols, kes) {
	  this._kes = kes;
	  this._nrows = nrows;
	  this._ncols = ncols;
	  this._dokMatrix = null;
	}

	SparseSystemMatrix.prototype._assemble_ = function() {
	  this._dokMatrix = new DokSparseMatrix([], this._nrows, this._ncols);
	  assemble_(this._dokMatrix, this._kes);
	};

	SparseSystemMatrix.prototype.dokMatrix = function() {
	  if (this._dokMatrix == null) this._assemble_();
	  return this._dokMatrix;
	};

	SparseSystemMatrix.prototype.toFull = function() {
	  return this.dokMatrix().toFull();
	};

	SparseSystemMatrix.prototype.mldivide = function(vec) {
	  var mat = this.dokMatrix();
	  return mldivide(mat, vec);
	};

	exports.SparseSystemMatrix = SparseSystemMatrix;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/*global require*/
	// system.vector
	var _ = __webpack_require__(1);
	var iteratorFromList = _.iteratorFromList;
	var isArray = _.isArray;
	var isIterator = _.isIterator;
	var numeric = __webpack_require__(6);
	var SparseVector = numeric.SparseVector;
	// var mldivide = numeric.mldivide;

	function ElementVector(vec, eqnums) {
	  // TODO: input check
	  this.vector = vec;
	  this.eqnums = eqnums;
	}
	exports.ElementVector = ElementVector;

	function SparseSystemVector(dim, elementVectors) {
	  // console.log("elementVectors = ", elementVectors);
	  this._dim = dim;
	  this._evs = elementVectors;
	  this._sparseVector = null;
	}
	exports.SparseSystemVector = SparseSystemVector;

	SparseSystemVector.prototype._assemble_ = function() {
	  var sources = this._evs;
	  var dest = new SparseVector([], this._dim);

	  if (!isIterator(sources)) {
	    if (isArray(sources))
	      sources = iteratorFromList(sources);
	    else
	      throw new Error('SparseSystemVector::_assemble_: evs must be a iterator or array.');
	  }

	  var ev, vec, ens;
	  while (sources.hasNext()) {
	    ev = sources.next();

	    vec = ev.vector;
	    ens = ev.eqnums;
	    ens.forEach(function(en, i) {
	      if (en !== 0) {
	        var val = vec[i];
	        var idx = en - 1;
	        var was = dest.at(idx);
	        dest.set_(idx, was + val);
	      }
	    });
	  }
	  this._sparseVector = dest;
	};

	SparseSystemVector.prototype.sparseVector = function() {
	  if (this._sparseVector === null) this._assemble_();
	  return this._sparseVector;
	};

	SparseSystemVector.prototype.toFull = function() {
	  return this.sparseVector().toFull();
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
	//
	// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
	//
	// Originally from narwhal.js (http://narwhaljs.org)
	// Copyright (c) 2009 Thomas Robinson <280north.com>
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the 'Software'), to
	// deal in the Software without restriction, including without limitation the
	// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
	// sell copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
	// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

	// when used in node, this will actually load the util module we depend on
	// versus loading the builtin util module as happens otherwise
	// this is a bug in node module loading as far as I am concerned
	var util = __webpack_require__(27);

	var pSlice = Array.prototype.slice;
	var hasOwn = Object.prototype.hasOwnProperty;

	// 1. The assert module provides functions that throw
	// AssertionError's when particular conditions are not met. The
	// assert module must conform to the following interface.

	var assert = module.exports = ok;

	// 2. The AssertionError is defined in assert.
	// new assert.AssertionError({ message: message,
	//                             actual: actual,
	//                             expected: expected })

	assert.AssertionError = function AssertionError(options) {
	  this.name = 'AssertionError';
	  this.actual = options.actual;
	  this.expected = options.expected;
	  this.operator = options.operator;
	  if (options.message) {
	    this.message = options.message;
	    this.generatedMessage = false;
	  } else {
	    this.message = getMessage(this);
	    this.generatedMessage = true;
	  }
	  var stackStartFunction = options.stackStartFunction || fail;

	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, stackStartFunction);
	  }
	  else {
	    // non v8 browsers so we can have a stacktrace
	    var err = new Error();
	    if (err.stack) {
	      var out = err.stack;

	      // try to strip useless frames
	      var fn_name = stackStartFunction.name;
	      var idx = out.indexOf('\n' + fn_name);
	      if (idx >= 0) {
	        // once we have located the function frame
	        // we need to strip out everything before it (and its line)
	        var next_line = out.indexOf('\n', idx + 1);
	        out = out.substring(next_line + 1);
	      }

	      this.stack = out;
	    }
	  }
	};

	// assert.AssertionError instanceof Error
	util.inherits(assert.AssertionError, Error);

	function replacer(key, value) {
	  if (util.isUndefined(value)) {
	    return '' + value;
	  }
	  if (util.isNumber(value) && !isFinite(value)) {
	    return value.toString();
	  }
	  if (util.isFunction(value) || util.isRegExp(value)) {
	    return value.toString();
	  }
	  return value;
	}

	function truncate(s, n) {
	  if (util.isString(s)) {
	    return s.length < n ? s : s.slice(0, n);
	  } else {
	    return s;
	  }
	}

	function getMessage(self) {
	  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
	         self.operator + ' ' +
	         truncate(JSON.stringify(self.expected, replacer), 128);
	}

	// At present only the three keys mentioned above are used and
	// understood by the spec. Implementations or sub modules can pass
	// other keys to the AssertionError's constructor - they will be
	// ignored.

	// 3. All of the following functions must throw an AssertionError
	// when a corresponding condition is not met, with a message that
	// may be undefined if not provided.  All assertion methods provide
	// both the actual and expected values to the assertion error for
	// display purposes.

	function fail(actual, expected, message, operator, stackStartFunction) {
	  throw new assert.AssertionError({
	    message: message,
	    actual: actual,
	    expected: expected,
	    operator: operator,
	    stackStartFunction: stackStartFunction
	  });
	}

	// EXTENSION! allows for well behaved errors defined elsewhere.
	assert.fail = fail;

	// 4. Pure assertion tests whether a value is truthy, as determined
	// by !!guard.
	// assert.ok(guard, message_opt);
	// This statement is equivalent to assert.equal(true, !!guard,
	// message_opt);. To test strictly for the value true, use
	// assert.strictEqual(true, guard, message_opt);.

	function ok(value, message) {
	  if (!value) fail(value, true, message, '==', assert.ok);
	}
	assert.ok = ok;

	// 5. The equality assertion tests shallow, coercive equality with
	// ==.
	// assert.equal(actual, expected, message_opt);

	assert.equal = function equal(actual, expected, message) {
	  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
	};

	// 6. The non-equality assertion tests for whether two objects are not equal
	// with != assert.notEqual(actual, expected, message_opt);

	assert.notEqual = function notEqual(actual, expected, message) {
	  if (actual == expected) {
	    fail(actual, expected, message, '!=', assert.notEqual);
	  }
	};

	// 7. The equivalence assertion tests a deep equality relation.
	// assert.deepEqual(actual, expected, message_opt);

	assert.deepEqual = function deepEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected)) {
	    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
	  }
	};

	function _deepEqual(actual, expected) {
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;

	  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
	    if (actual.length != expected.length) return false;

	    for (var i = 0; i < actual.length; i++) {
	      if (actual[i] !== expected[i]) return false;
	    }

	    return true;

	  // 7.2. If the expected value is a Date object, the actual value is
	  // equivalent if it is also a Date object that refers to the same time.
	  } else if (util.isDate(actual) && util.isDate(expected)) {
	    return actual.getTime() === expected.getTime();

	  // 7.3 If the expected value is a RegExp object, the actual value is
	  // equivalent if it is also a RegExp object with the same source and
	  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
	    return actual.source === expected.source &&
	           actual.global === expected.global &&
	           actual.multiline === expected.multiline &&
	           actual.lastIndex === expected.lastIndex &&
	           actual.ignoreCase === expected.ignoreCase;

	  // 7.4. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if (!util.isObject(actual) && !util.isObject(expected)) {
	    return actual == expected;

	  // 7.5 For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected);
	  }
	}

	function isArguments(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	}

	function objEquiv(a, b) {
	  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
	    return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  // if one is a primitive, the other must be same
	  if (util.isPrimitive(a) || util.isPrimitive(b)) {
	    return a === b;
	  }
	  var aIsArgs = isArguments(a),
	      bIsArgs = isArguments(b);
	  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
	    return false;
	  if (aIsArgs) {
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return _deepEqual(a, b);
	  }
	  var ka = objectKeys(a),
	      kb = objectKeys(b),
	      key, i;
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!_deepEqual(a[key], b[key])) return false;
	  }
	  return true;
	}

	// 8. The non-equivalence assertion tests for any deep inequality.
	// assert.notDeepEqual(actual, expected, message_opt);

	assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected)) {
	    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
	  }
	};

	// 9. The strict equality assertion tests strict equality, as determined by ===.
	// assert.strictEqual(actual, expected, message_opt);

	assert.strictEqual = function strictEqual(actual, expected, message) {
	  if (actual !== expected) {
	    fail(actual, expected, message, '===', assert.strictEqual);
	  }
	};

	// 10. The strict non-equality assertion tests for strict inequality, as
	// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

	assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
	  if (actual === expected) {
	    fail(actual, expected, message, '!==', assert.notStrictEqual);
	  }
	};

	function expectedException(actual, expected) {
	  if (!actual || !expected) {
	    return false;
	  }

	  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
	    return expected.test(actual);
	  } else if (actual instanceof expected) {
	    return true;
	  } else if (expected.call({}, actual) === true) {
	    return true;
	  }

	  return false;
	}

	function _throws(shouldThrow, block, expected, message) {
	  var actual;

	  if (util.isString(expected)) {
	    message = expected;
	    expected = null;
	  }

	  try {
	    block();
	  } catch (e) {
	    actual = e;
	  }

	  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
	            (message ? ' ' + message : '.');

	  if (shouldThrow && !actual) {
	    fail(actual, expected, 'Missing expected exception' + message);
	  }

	  if (!shouldThrow && expectedException(actual, expected)) {
	    fail(actual, expected, 'Got unwanted exception' + message);
	  }

	  if ((shouldThrow && actual && expected &&
	      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
	    throw actual;
	  }
	}

	// 11. Expected to throw an error:
	// assert.throws(block, Error_opt, message_opt);

	assert.throws = function(block, /*optional*/error, /*optional*/message) {
	  _throws.apply(this, [true].concat(pSlice.call(arguments)));
	};

	// EXTENSION! This is annoying to write outside this module.
	assert.doesNotThrow = function(block, /*optional*/message) {
	  _throws.apply(this, [false].concat(pSlice.call(arguments)));
	};

	assert.ifError = function(err) { if (err) {throw err;}};

	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    if (hasOwn.call(obj, key)) keys.push(key);
	  }
	  return keys;
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/**
	 * @license
	 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
	 * Build: `lodash -o ./dist/lodash.compat.js`
	 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <http://lodash.com/license>
	 */
	;(function() {

	  /** Used as a safe reference for `undefined` in pre ES5 environments */
	  var undefined;

	  /** Used to pool arrays and objects used internally */
	  var arrayPool = [],
	      objectPool = [];

	  /** Used to generate unique IDs */
	  var idCounter = 0;

	  /** Used internally to indicate various things */
	  var indicatorObject = {};

	  /** Used to prefix keys to avoid issues with `__proto__` and properties on `Object.prototype` */
	  var keyPrefix = +new Date + '';

	  /** Used as the size when optimizations are enabled for large arrays */
	  var largeArraySize = 75;

	  /** Used as the max size of the `arrayPool` and `objectPool` */
	  var maxPoolSize = 40;

	  /** Used to detect and test whitespace */
	  var whitespace = (
	    // whitespace
	    ' \t\x0B\f\xA0\ufeff' +

	    // line terminators
	    '\n\r\u2028\u2029' +

	    // unicode category "Zs" space separators
	    '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
	  );

	  /** Used to match empty string literals in compiled template source */
	  var reEmptyStringLeading = /\b__p \+= '';/g,
	      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
	      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

	  /**
	   * Used to match ES6 template delimiters
	   * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-literals-string-literals
	   */
	  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

	  /** Used to match regexp flags from their coerced string values */
	  var reFlags = /\w*$/;

	  /** Used to detected named functions */
	  var reFuncName = /^\s*function[ \n\r\t]+\w/;

	  /** Used to match "interpolate" template delimiters */
	  var reInterpolate = /<%=([\s\S]+?)%>/g;

	  /** Used to match leading whitespace and zeros to be removed */
	  var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');

	  /** Used to ensure capturing order of template delimiters */
	  var reNoMatch = /($^)/;

	  /** Used to detect functions containing a `this` reference */
	  var reThis = /\bthis\b/;

	  /** Used to match unescaped characters in compiled string literals */
	  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

	  /** Used to assign default `context` object properties */
	  var contextProps = [
	    'Array', 'Boolean', 'Date', 'Error', 'Function', 'Math', 'Number', 'Object',
	    'RegExp', 'String', '_', 'attachEvent', 'clearTimeout', 'isFinite', 'isNaN',
	    'parseInt', 'setTimeout'
	  ];

	  /** Used to fix the JScript [[DontEnum]] bug */
	  var shadowedProps = [
	    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
	    'toLocaleString', 'toString', 'valueOf'
	  ];

	  /** Used to make template sourceURLs easier to identify */
	  var templateCounter = 0;

	  /** `Object#toString` result shortcuts */
	  var argsClass = '[object Arguments]',
	      arrayClass = '[object Array]',
	      boolClass = '[object Boolean]',
	      dateClass = '[object Date]',
	      errorClass = '[object Error]',
	      funcClass = '[object Function]',
	      numberClass = '[object Number]',
	      objectClass = '[object Object]',
	      regexpClass = '[object RegExp]',
	      stringClass = '[object String]';

	  /** Used to identify object classifications that `_.clone` supports */
	  var cloneableClasses = {};
	  cloneableClasses[funcClass] = false;
	  cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
	  cloneableClasses[boolClass] = cloneableClasses[dateClass] =
	  cloneableClasses[numberClass] = cloneableClasses[objectClass] =
	  cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

	  /** Used as an internal `_.debounce` options object */
	  var debounceOptions = {
	    'leading': false,
	    'maxWait': 0,
	    'trailing': false
	  };

	  /** Used as the property descriptor for `__bindData__` */
	  var descriptor = {
	    'configurable': false,
	    'enumerable': false,
	    'value': null,
	    'writable': false
	  };

	  /** Used as the data object for `iteratorTemplate` */
	  var iteratorData = {
	    'args': '',
	    'array': null,
	    'bottom': '',
	    'firstArg': '',
	    'init': '',
	    'keys': null,
	    'loop': '',
	    'shadowedProps': null,
	    'support': null,
	    'top': '',
	    'useHas': false
	  };

	  /** Used to determine if values are of the language type Object */
	  var objectTypes = {
	    'boolean': false,
	    'function': true,
	    'object': true,
	    'number': false,
	    'string': false,
	    'undefined': false
	  };

	  /** Used to escape characters for inclusion in compiled string literals */
	  var stringEscapes = {
	    '\\': '\\',
	    "'": "'",
	    '\n': 'n',
	    '\r': 'r',
	    '\t': 't',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  /** Used as a reference to the global object */
	  var root = (objectTypes[typeof window] && window) || this;

	  /** Detect free variable `exports` */
	  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

	  /** Detect free variable `module` */
	  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

	  /** Detect the popular CommonJS extension `module.exports` */
	  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

	  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
	  var freeGlobal = objectTypes[typeof global] && global;
	  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
	    root = freeGlobal;
	  }

	  /*--------------------------------------------------------------------------*/

	  /**
	   * The base implementation of `_.indexOf` without support for binary searches
	   * or `fromIndex` constraints.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {*} value The value to search for.
	   * @param {number} [fromIndex=0] The index to search from.
	   * @returns {number} Returns the index of the matched value or `-1`.
	   */
	  function baseIndexOf(array, value, fromIndex) {
	    var index = (fromIndex || 0) - 1,
	        length = array ? array.length : 0;

	    while (++index < length) {
	      if (array[index] === value) {
	        return index;
	      }
	    }
	    return -1;
	  }

	  /**
	   * An implementation of `_.contains` for cache objects that mimics the return
	   * signature of `_.indexOf` by returning `0` if the value is found, else `-1`.
	   *
	   * @private
	   * @param {Object} cache The cache object to inspect.
	   * @param {*} value The value to search for.
	   * @returns {number} Returns `0` if `value` is found, else `-1`.
	   */
	  function cacheIndexOf(cache, value) {
	    var type = typeof value;
	    cache = cache.cache;

	    if (type == 'boolean' || value == null) {
	      return cache[value] ? 0 : -1;
	    }
	    if (type != 'number' && type != 'string') {
	      type = 'object';
	    }
	    var key = type == 'number' ? value : keyPrefix + value;
	    cache = (cache = cache[type]) && cache[key];

	    return type == 'object'
	      ? (cache && baseIndexOf(cache, value) > -1 ? 0 : -1)
	      : (cache ? 0 : -1);
	  }

	  /**
	   * Adds a given value to the corresponding cache object.
	   *
	   * @private
	   * @param {*} value The value to add to the cache.
	   */
	  function cachePush(value) {
	    var cache = this.cache,
	        type = typeof value;

	    if (type == 'boolean' || value == null) {
	      cache[value] = true;
	    } else {
	      if (type != 'number' && type != 'string') {
	        type = 'object';
	      }
	      var key = type == 'number' ? value : keyPrefix + value,
	          typeCache = cache[type] || (cache[type] = {});

	      if (type == 'object') {
	        (typeCache[key] || (typeCache[key] = [])).push(value);
	      } else {
	        typeCache[key] = true;
	      }
	    }
	  }

	  /**
	   * Used by `_.max` and `_.min` as the default callback when a given
	   * collection is a string value.
	   *
	   * @private
	   * @param {string} value The character to inspect.
	   * @returns {number} Returns the code unit of given character.
	   */
	  function charAtCallback(value) {
	    return value.charCodeAt(0);
	  }

	  /**
	   * Used by `sortBy` to compare transformed `collection` elements, stable sorting
	   * them in ascending order.
	   *
	   * @private
	   * @param {Object} a The object to compare to `b`.
	   * @param {Object} b The object to compare to `a`.
	   * @returns {number} Returns the sort order indicator of `1` or `-1`.
	   */
	  function compareAscending(a, b) {
	    var ac = a.criteria,
	        bc = b.criteria,
	        index = -1,
	        length = ac.length;

	    while (++index < length) {
	      var value = ac[index],
	          other = bc[index];

	      if (value !== other) {
	        if (value > other || typeof value == 'undefined') {
	          return 1;
	        }
	        if (value < other || typeof other == 'undefined') {
	          return -1;
	        }
	      }
	    }
	    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
	    // that causes it, under certain circumstances, to return the same value for
	    // `a` and `b`. See https://github.com/jashkenas/underscore/pull/1247
	    //
	    // This also ensures a stable sort in V8 and other engines.
	    // See http://code.google.com/p/v8/issues/detail?id=90
	    return a.index - b.index;
	  }

	  /**
	   * Creates a cache object to optimize linear searches of large arrays.
	   *
	   * @private
	   * @param {Array} [array=[]] The array to search.
	   * @returns {null|Object} Returns the cache object or `null` if caching should not be used.
	   */
	  function createCache(array) {
	    var index = -1,
	        length = array.length,
	        first = array[0],
	        mid = array[(length / 2) | 0],
	        last = array[length - 1];

	    if (first && typeof first == 'object' &&
	        mid && typeof mid == 'object' && last && typeof last == 'object') {
	      return false;
	    }
	    var cache = getObject();
	    cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;

	    var result = getObject();
	    result.array = array;
	    result.cache = cache;
	    result.push = cachePush;

	    while (++index < length) {
	      result.push(array[index]);
	    }
	    return result;
	  }

	  /**
	   * Used by `template` to escape characters for inclusion in compiled
	   * string literals.
	   *
	   * @private
	   * @param {string} match The matched character to escape.
	   * @returns {string} Returns the escaped character.
	   */
	  function escapeStringChar(match) {
	    return '\\' + stringEscapes[match];
	  }

	  /**
	   * Gets an array from the array pool or creates a new one if the pool is empty.
	   *
	   * @private
	   * @returns {Array} The array from the pool.
	   */
	  function getArray() {
	    return arrayPool.pop() || [];
	  }

	  /**
	   * Gets an object from the object pool or creates a new one if the pool is empty.
	   *
	   * @private
	   * @returns {Object} The object from the pool.
	   */
	  function getObject() {
	    return objectPool.pop() || {
	      'array': null,
	      'cache': null,
	      'criteria': null,
	      'false': false,
	      'index': 0,
	      'null': false,
	      'number': null,
	      'object': null,
	      'push': null,
	      'string': null,
	      'true': false,
	      'undefined': false,
	      'value': null
	    };
	  }

	  /**
	   * Checks if `value` is a DOM node in IE < 9.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if the `value` is a DOM node, else `false`.
	   */
	  function isNode(value) {
	    // IE < 9 presents DOM nodes as `Object` objects except they have `toString`
	    // methods that are `typeof` "string" and still can coerce nodes to strings
	    return typeof value.toString != 'function' && typeof (value + '') == 'string';
	  }

	  /**
	   * Releases the given array back to the array pool.
	   *
	   * @private
	   * @param {Array} [array] The array to release.
	   */
	  function releaseArray(array) {
	    array.length = 0;
	    if (arrayPool.length < maxPoolSize) {
	      arrayPool.push(array);
	    }
	  }

	  /**
	   * Releases the given object back to the object pool.
	   *
	   * @private
	   * @param {Object} [object] The object to release.
	   */
	  function releaseObject(object) {
	    var cache = object.cache;
	    if (cache) {
	      releaseObject(cache);
	    }
	    object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
	    if (objectPool.length < maxPoolSize) {
	      objectPool.push(object);
	    }
	  }

	  /**
	   * Slices the `collection` from the `start` index up to, but not including,
	   * the `end` index.
	   *
	   * Note: This function is used instead of `Array#slice` to support node lists
	   * in IE < 9 and to ensure dense arrays are returned.
	   *
	   * @private
	   * @param {Array|Object|string} collection The collection to slice.
	   * @param {number} start The start index.
	   * @param {number} end The end index.
	   * @returns {Array} Returns the new array.
	   */
	  function slice(array, start, end) {
	    start || (start = 0);
	    if (typeof end == 'undefined') {
	      end = array ? array.length : 0;
	    }
	    var index = -1,
	        length = end - start || 0,
	        result = Array(length < 0 ? 0 : length);

	    while (++index < length) {
	      result[index] = array[start + index];
	    }
	    return result;
	  }

	  /*--------------------------------------------------------------------------*/

	  /**
	   * Create a new `lodash` function using the given context object.
	   *
	   * @static
	   * @memberOf _
	   * @category Utilities
	   * @param {Object} [context=root] The context object.
	   * @returns {Function} Returns the `lodash` function.
	   */
	  function runInContext(context) {
	    // Avoid issues with some ES3 environments that attempt to use values, named
	    // after built-in constructors like `Object`, for the creation of literals.
	    // ES5 clears this up by stating that literals must use built-in constructors.
	    // See http://es5.github.io/#x11.1.5.
	    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

	    /** Native constructor references */
	    var Array = context.Array,
	        Boolean = context.Boolean,
	        Date = context.Date,
	        Error = context.Error,
	        Function = context.Function,
	        Math = context.Math,
	        Number = context.Number,
	        Object = context.Object,
	        RegExp = context.RegExp,
	        String = context.String,
	        TypeError = context.TypeError;

	    /**
	     * Used for `Array` method references.
	     *
	     * Normally `Array.prototype` would suffice, however, using an array literal
	     * avoids issues in Narwhal.
	     */
	    var arrayRef = [];

	    /** Used for native method references */
	    var errorProto = Error.prototype,
	        objectProto = Object.prototype,
	        stringProto = String.prototype;

	    /** Used to restore the original `_` reference in `noConflict` */
	    var oldDash = context._;

	    /** Used to resolve the internal [[Class]] of values */
	    var toString = objectProto.toString;

	    /** Used to detect if a method is native */
	    var reNative = RegExp('^' +
	      String(toString)
	        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	        .replace(/toString| for [^\]]+/g, '.*?') + '$'
	    );

	    /** Native method shortcuts */
	    var ceil = Math.ceil,
	        clearTimeout = context.clearTimeout,
	        floor = Math.floor,
	        fnToString = Function.prototype.toString,
	        getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
	        hasOwnProperty = objectProto.hasOwnProperty,
	        push = arrayRef.push,
	        propertyIsEnumerable = objectProto.propertyIsEnumerable,
	        setTimeout = context.setTimeout,
	        splice = arrayRef.splice,
	        unshift = arrayRef.unshift;

	    /** Used to set meta data on functions */
	    var defineProperty = (function() {
	      // IE 8 only accepts DOM elements
	      try {
	        var o = {},
	            func = isNative(func = Object.defineProperty) && func,
	            result = func(o, o, o) && func;
	      } catch(e) { }
	      return result;
	    }());

	    /* Native method shortcuts for methods with the same name as other `lodash` methods */
	    var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
	        nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
	        nativeIsFinite = context.isFinite,
	        nativeIsNaN = context.isNaN,
	        nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
	        nativeMax = Math.max,
	        nativeMin = Math.min,
	        nativeParseInt = context.parseInt,
	        nativeRandom = Math.random;

	    /** Used to lookup a built-in constructor by [[Class]] */
	    var ctorByClass = {};
	    ctorByClass[arrayClass] = Array;
	    ctorByClass[boolClass] = Boolean;
	    ctorByClass[dateClass] = Date;
	    ctorByClass[funcClass] = Function;
	    ctorByClass[objectClass] = Object;
	    ctorByClass[numberClass] = Number;
	    ctorByClass[regexpClass] = RegExp;
	    ctorByClass[stringClass] = String;

	    /** Used to avoid iterating non-enumerable properties in IE < 9 */
	    var nonEnumProps = {};
	    nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
	    nonEnumProps[boolClass] = nonEnumProps[stringClass] = { 'constructor': true, 'toString': true, 'valueOf': true };
	    nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = { 'constructor': true, 'toString': true };
	    nonEnumProps[objectClass] = { 'constructor': true };

	    (function() {
	      var length = shadowedProps.length;
	      while (length--) {
	        var key = shadowedProps[length];
	        for (var className in nonEnumProps) {
	          if (hasOwnProperty.call(nonEnumProps, className) && !hasOwnProperty.call(nonEnumProps[className], key)) {
	            nonEnumProps[className][key] = false;
	          }
	        }
	      }
	    }());

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates a `lodash` object which wraps the given value to enable intuitive
	     * method chaining.
	     *
	     * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
	     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
	     * and `unshift`
	     *
	     * Chaining is supported in custom builds as long as the `value` method is
	     * implicitly or explicitly included in the build.
	     *
	     * The chainable wrapper functions are:
	     * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
	     * `compose`, `concat`, `countBy`, `create`, `createCallback`, `curry`,
	     * `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`,
	     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
	     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
	     * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
	     * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`,
	     * `range`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
	     * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`,
	     * `union`, `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`,
	     * and `zip`
	     *
	     * The non-chainable wrapper functions are:
	     * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
	     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
	     * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
	     * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
	     * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
	     * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
	     * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
	     * `template`, `unescape`, `uniqueId`, and `value`
	     *
	     * The wrapper functions `first` and `last` return wrapped values when `n` is
	     * provided, otherwise they return unwrapped values.
	     *
	     * Explicit chaining can be enabled by using the `_.chain` method.
	     *
	     * @name _
	     * @constructor
	     * @category Chaining
	     * @param {*} value The value to wrap in a `lodash` instance.
	     * @returns {Object} Returns a `lodash` instance.
	     * @example
	     *
	     * var wrapped = _([1, 2, 3]);
	     *
	     * // returns an unwrapped value
	     * wrapped.reduce(function(sum, num) {
	     *   return sum + num;
	     * });
	     * // => 6
	     *
	     * // returns a wrapped value
	     * var squares = wrapped.map(function(num) {
	     *   return num * num;
	     * });
	     *
	     * _.isArray(squares);
	     * // => false
	     *
	     * _.isArray(squares.value());
	     * // => true
	     */
	    function lodash(value) {
	      // don't wrap if already wrapped, even if wrapped by a different `lodash` constructor
	      return (value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__'))
	       ? value
	       : new lodashWrapper(value);
	    }

	    /**
	     * A fast path for creating `lodash` wrapper objects.
	     *
	     * @private
	     * @param {*} value The value to wrap in a `lodash` instance.
	     * @param {boolean} chainAll A flag to enable chaining for all methods
	     * @returns {Object} Returns a `lodash` instance.
	     */
	    function lodashWrapper(value, chainAll) {
	      this.__chain__ = !!chainAll;
	      this.__wrapped__ = value;
	    }
	    // ensure `new lodashWrapper` is an instance of `lodash`
	    lodashWrapper.prototype = lodash.prototype;

	    /**
	     * An object used to flag environments features.
	     *
	     * @static
	     * @memberOf _
	     * @type Object
	     */
	    var support = lodash.support = {};

	    (function() {
	      var ctor = function() { this.x = 1; },
	          object = { '0': 1, 'length': 1 },
	          props = [];

	      ctor.prototype = { 'valueOf': 1, 'y': 1 };
	      for (var key in new ctor) { props.push(key); }
	      for (key in arguments) { }

	      /**
	       * Detect if an `arguments` object's [[Class]] is resolvable (all but Firefox < 4, IE < 9).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.argsClass = toString.call(arguments) == argsClass;

	      /**
	       * Detect if `arguments` objects are `Object` objects (all but Narwhal and Opera < 10.5).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.argsObject = arguments.constructor == Object && !(arguments instanceof Array);

	      /**
	       * Detect if `name` or `message` properties of `Error.prototype` are
	       * enumerable by default. (IE < 9, Safari < 5.1)
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') || propertyIsEnumerable.call(errorProto, 'name');

	      /**
	       * Detect if `prototype` properties are enumerable by default.
	       *
	       * Firefox < 3.6, Opera > 9.50 - Opera < 11.60, and Safari < 5.1
	       * (if the prototype or a property on the prototype has been set)
	       * incorrectly sets a function's `prototype` property [[Enumerable]]
	       * value to `true`.
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.enumPrototypes = propertyIsEnumerable.call(ctor, 'prototype');

	      /**
	       * Detect if functions can be decompiled by `Function#toString`
	       * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);

	      /**
	       * Detect if `Function#name` is supported (all but IE).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.funcNames = typeof Function.name == 'string';

	      /**
	       * Detect if `arguments` object indexes are non-enumerable
	       * (Firefox < 4, IE < 9, PhantomJS, Safari < 5.1).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.nonEnumArgs = key != 0;

	      /**
	       * Detect if properties shadowing those on `Object.prototype` are non-enumerable.
	       *
	       * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
	       * made non-enumerable as well (a.k.a the JScript [[DontEnum]] bug).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.nonEnumShadows = !/valueOf/.test(props);

	      /**
	       * Detect if own properties are iterated after inherited properties (all but IE < 9).
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.ownLast = props[0] != 'x';

	      /**
	       * Detect if `Array#shift` and `Array#splice` augment array-like objects correctly.
	       *
	       * Firefox < 10, IE compatibility mode, and IE < 9 have buggy Array `shift()`
	       * and `splice()` functions that fail to remove the last element, `value[0]`,
	       * of array-like objects even though the `length` property is set to `0`.
	       * The `shift()` method is buggy in IE 8 compatibility mode, while `splice()`
	       * is buggy regardless of mode in IE < 9 and buggy in compatibility mode in IE 9.
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.spliceObjects = (arrayRef.splice.call(object, 0, 1), !object[0]);

	      /**
	       * Detect lack of support for accessing string characters by index.
	       *
	       * IE < 8 can't access characters by index and IE 8 can only access
	       * characters by index on string literals.
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      support.unindexedChars = ('x'[0] + Object('x')[0]) != 'xx';

	      /**
	       * Detect if a DOM node's [[Class]] is resolvable (all but IE < 9)
	       * and that the JS engine errors when attempting to coerce an object to
	       * a string without a `toString` function.
	       *
	       * @memberOf _.support
	       * @type boolean
	       */
	      try {
	        support.nodeClass = !(toString.call(document) == objectClass && !({ 'toString': 0 } + ''));
	      } catch(e) {
	        support.nodeClass = true;
	      }
	    }(1));

	    /**
	     * By default, the template delimiters used by Lo-Dash are similar to those in
	     * embedded Ruby (ERB). Change the following template settings to use alternative
	     * delimiters.
	     *
	     * @static
	     * @memberOf _
	     * @type Object
	     */
	    lodash.templateSettings = {

	      /**
	       * Used to detect `data` property values to be HTML-escaped.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'escape': /<%-([\s\S]+?)%>/g,

	      /**
	       * Used to detect code to be evaluated.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'evaluate': /<%([\s\S]+?)%>/g,

	      /**
	       * Used to detect `data` property values to inject.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'interpolate': reInterpolate,

	      /**
	       * Used to reference the data object in the template text.
	       *
	       * @memberOf _.templateSettings
	       * @type string
	       */
	      'variable': '',

	      /**
	       * Used to import variables into the compiled template.
	       *
	       * @memberOf _.templateSettings
	       * @type Object
	       */
	      'imports': {

	        /**
	         * A reference to the `lodash` function.
	         *
	         * @memberOf _.templateSettings.imports
	         * @type Function
	         */
	        '_': lodash
	      }
	    };

	    /*--------------------------------------------------------------------------*/

	    /**
	     * The template used to create iterator functions.
	     *
	     * @private
	     * @param {Object} data The data object used to populate the text.
	     * @returns {string} Returns the interpolated text.
	     */
	    var iteratorTemplate = function(obj) {

	      var __p = 'var index, iterable = ' +
	      (obj.firstArg) +
	      ', result = ' +
	      (obj.init) +
	      ';\nif (!iterable) return result;\n' +
	      (obj.top) +
	      ';';
	       if (obj.array) {
	      __p += '\nvar length = iterable.length; index = -1;\nif (' +
	      (obj.array) +
	      ') {  ';
	       if (support.unindexedChars) {
	      __p += '\n  if (isString(iterable)) {\n    iterable = iterable.split(\'\')\n  }  ';
	       }
	      __p += '\n  while (++index < length) {\n    ' +
	      (obj.loop) +
	      ';\n  }\n}\nelse {  ';
	       } else if (support.nonEnumArgs) {
	      __p += '\n  var length = iterable.length; index = -1;\n  if (length && isArguments(iterable)) {\n    while (++index < length) {\n      index += \'\';\n      ' +
	      (obj.loop) +
	      ';\n    }\n  } else {  ';
	       }

	       if (support.enumPrototypes) {
	      __p += '\n  var skipProto = typeof iterable == \'function\';\n  ';
	       }

	       if (support.enumErrorProps) {
	      __p += '\n  var skipErrorProps = iterable === errorProto || iterable instanceof Error;\n  ';
	       }

	          var conditions = [];    if (support.enumPrototypes) { conditions.push('!(skipProto && index == "prototype")'); }    if (support.enumErrorProps)  { conditions.push('!(skipErrorProps && (index == "message" || index == "name"))'); }

	       if (obj.useHas && obj.keys) {
	      __p += '\n  var ownIndex = -1,\n      ownProps = objectTypes[typeof iterable] && keys(iterable),\n      length = ownProps ? ownProps.length : 0;\n\n  while (++ownIndex < length) {\n    index = ownProps[ownIndex];\n';
	          if (conditions.length) {
	      __p += '    if (' +
	      (conditions.join(' && ')) +
	      ') {\n  ';
	       }
	      __p +=
	      (obj.loop) +
	      ';    ';
	       if (conditions.length) {
	      __p += '\n    }';
	       }
	      __p += '\n  }  ';
	       } else {
	      __p += '\n  for (index in iterable) {\n';
	          if (obj.useHas) { conditions.push("hasOwnProperty.call(iterable, index)"); }    if (conditions.length) {
	      __p += '    if (' +
	      (conditions.join(' && ')) +
	      ') {\n  ';
	       }
	      __p +=
	      (obj.loop) +
	      ';    ';
	       if (conditions.length) {
	      __p += '\n    }';
	       }
	      __p += '\n  }    ';
	       if (support.nonEnumShadows) {
	      __p += '\n\n  if (iterable !== objectProto) {\n    var ctor = iterable.constructor,\n        isProto = iterable === (ctor && ctor.prototype),\n        className = iterable === stringProto ? stringClass : iterable === errorProto ? errorClass : toString.call(iterable),\n        nonEnum = nonEnumProps[className];\n      ';
	       for (k = 0; k < 7; k++) {
	      __p += '\n    index = \'' +
	      (obj.shadowedProps[k]) +
	      '\';\n    if ((!(isProto && nonEnum[index]) && hasOwnProperty.call(iterable, index))';
	              if (!obj.useHas) {
	      __p += ' || (!nonEnum[index] && iterable[index] !== objectProto[index])';
	       }
	      __p += ') {\n      ' +
	      (obj.loop) +
	      ';\n    }      ';
	       }
	      __p += '\n  }    ';
	       }

	       }

	       if (obj.array || support.nonEnumArgs) {
	      __p += '\n}';
	       }
	      __p +=
	      (obj.bottom) +
	      ';\nreturn result';

	      return __p
	    };

	    /*--------------------------------------------------------------------------*/

	    /**
	     * The base implementation of `_.bind` that creates the bound function and
	     * sets its meta data.
	     *
	     * @private
	     * @param {Array} bindData The bind data array.
	     * @returns {Function} Returns the new bound function.
	     */
	    function baseBind(bindData) {
	      var func = bindData[0],
	          partialArgs = bindData[2],
	          thisArg = bindData[4];

	      function bound() {
	        // `Function#bind` spec
	        // http://es5.github.io/#x15.3.4.5
	        if (partialArgs) {
	          // avoid `arguments` object deoptimizations by using `slice` instead
	          // of `Array.prototype.slice.call` and not assigning `arguments` to a
	          // variable as a ternary expression
	          var args = slice(partialArgs);
	          push.apply(args, arguments);
	        }
	        // mimic the constructor's `return` behavior
	        // http://es5.github.io/#x13.2.2
	        if (this instanceof bound) {
	          // ensure `new bound` is an instance of `func`
	          var thisBinding = baseCreate(func.prototype),
	              result = func.apply(thisBinding, args || arguments);
	          return isObject(result) ? result : thisBinding;
	        }
	        return func.apply(thisArg, args || arguments);
	      }
	      setBindData(bound, bindData);
	      return bound;
	    }

	    /**
	     * The base implementation of `_.clone` without argument juggling or support
	     * for `thisArg` binding.
	     *
	     * @private
	     * @param {*} value The value to clone.
	     * @param {boolean} [isDeep=false] Specify a deep clone.
	     * @param {Function} [callback] The function to customize cloning values.
	     * @param {Array} [stackA=[]] Tracks traversed source objects.
	     * @param {Array} [stackB=[]] Associates clones with source counterparts.
	     * @returns {*} Returns the cloned value.
	     */
	    function baseClone(value, isDeep, callback, stackA, stackB) {
	      if (callback) {
	        var result = callback(value);
	        if (typeof result != 'undefined') {
	          return result;
	        }
	      }
	      // inspect [[Class]]
	      var isObj = isObject(value);
	      if (isObj) {
	        var className = toString.call(value);
	        if (!cloneableClasses[className] || (!support.nodeClass && isNode(value))) {
	          return value;
	        }
	        var ctor = ctorByClass[className];
	        switch (className) {
	          case boolClass:
	          case dateClass:
	            return new ctor(+value);

	          case numberClass:
	          case stringClass:
	            return new ctor(value);

	          case regexpClass:
	            result = ctor(value.source, reFlags.exec(value));
	            result.lastIndex = value.lastIndex;
	            return result;
	        }
	      } else {
	        return value;
	      }
	      var isArr = isArray(value);
	      if (isDeep) {
	        // check for circular references and return corresponding clone
	        var initedStack = !stackA;
	        stackA || (stackA = getArray());
	        stackB || (stackB = getArray());

	        var length = stackA.length;
	        while (length--) {
	          if (stackA[length] == value) {
	            return stackB[length];
	          }
	        }
	        result = isArr ? ctor(value.length) : {};
	      }
	      else {
	        result = isArr ? slice(value) : assign({}, value);
	      }
	      // add array properties assigned by `RegExp#exec`
	      if (isArr) {
	        if (hasOwnProperty.call(value, 'index')) {
	          result.index = value.index;
	        }
	        if (hasOwnProperty.call(value, 'input')) {
	          result.input = value.input;
	        }
	      }
	      // exit for shallow clone
	      if (!isDeep) {
	        return result;
	      }
	      // add the source value to the stack of traversed objects
	      // and associate it with its clone
	      stackA.push(value);
	      stackB.push(result);

	      // recursively populate clone (susceptible to call stack limits)
	      (isArr ? baseEach : forOwn)(value, function(objValue, key) {
	        result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
	      });

	      if (initedStack) {
	        releaseArray(stackA);
	        releaseArray(stackB);
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `_.create` without support for assigning
	     * properties to the created object.
	     *
	     * @private
	     * @param {Object} prototype The object to inherit from.
	     * @returns {Object} Returns the new object.
	     */
	    function baseCreate(prototype, properties) {
	      return isObject(prototype) ? nativeCreate(prototype) : {};
	    }
	    // fallback for browsers without `Object.create`
	    if (!nativeCreate) {
	      baseCreate = (function() {
	        function Object() {}
	        return function(prototype) {
	          if (isObject(prototype)) {
	            Object.prototype = prototype;
	            var result = new Object;
	            Object.prototype = null;
	          }
	          return result || context.Object();
	        };
	      }());
	    }

	    /**
	     * The base implementation of `_.createCallback` without support for creating
	     * "_.pluck" or "_.where" style callbacks.
	     *
	     * @private
	     * @param {*} [func=identity] The value to convert to a callback.
	     * @param {*} [thisArg] The `this` binding of the created callback.
	     * @param {number} [argCount] The number of arguments the callback accepts.
	     * @returns {Function} Returns a callback function.
	     */
	    function baseCreateCallback(func, thisArg, argCount) {
	      if (typeof func != 'function') {
	        return identity;
	      }
	      // exit early for no `thisArg` or already bound by `Function#bind`
	      if (typeof thisArg == 'undefined' || !('prototype' in func)) {
	        return func;
	      }
	      var bindData = func.__bindData__;
	      if (typeof bindData == 'undefined') {
	        if (support.funcNames) {
	          bindData = !func.name;
	        }
	        bindData = bindData || !support.funcDecomp;
	        if (!bindData) {
	          var source = fnToString.call(func);
	          if (!support.funcNames) {
	            bindData = !reFuncName.test(source);
	          }
	          if (!bindData) {
	            // checks if `func` references the `this` keyword and stores the result
	            bindData = reThis.test(source);
	            setBindData(func, bindData);
	          }
	        }
	      }
	      // exit early if there are no `this` references or `func` is bound
	      if (bindData === false || (bindData !== true && bindData[1] & 1)) {
	        return func;
	      }
	      switch (argCount) {
	        case 1: return function(value) {
	          return func.call(thisArg, value);
	        };
	        case 2: return function(a, b) {
	          return func.call(thisArg, a, b);
	        };
	        case 3: return function(value, index, collection) {
	          return func.call(thisArg, value, index, collection);
	        };
	        case 4: return function(accumulator, value, index, collection) {
	          return func.call(thisArg, accumulator, value, index, collection);
	        };
	      }
	      return bind(func, thisArg);
	    }

	    /**
	     * The base implementation of `createWrapper` that creates the wrapper and
	     * sets its meta data.
	     *
	     * @private
	     * @param {Array} bindData The bind data array.
	     * @returns {Function} Returns the new function.
	     */
	    function baseCreateWrapper(bindData) {
	      var func = bindData[0],
	          bitmask = bindData[1],
	          partialArgs = bindData[2],
	          partialRightArgs = bindData[3],
	          thisArg = bindData[4],
	          arity = bindData[5];

	      var isBind = bitmask & 1,
	          isBindKey = bitmask & 2,
	          isCurry = bitmask & 4,
	          isCurryBound = bitmask & 8,
	          key = func;

	      function bound() {
	        var thisBinding = isBind ? thisArg : this;
	        if (partialArgs) {
	          var args = slice(partialArgs);
	          push.apply(args, arguments);
	        }
	        if (partialRightArgs || isCurry) {
	          args || (args = slice(arguments));
	          if (partialRightArgs) {
	            push.apply(args, partialRightArgs);
	          }
	          if (isCurry && args.length < arity) {
	            bitmask |= 16 & ~32;
	            return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
	          }
	        }
	        args || (args = arguments);
	        if (isBindKey) {
	          func = thisBinding[key];
	        }
	        if (this instanceof bound) {
	          thisBinding = baseCreate(func.prototype);
	          var result = func.apply(thisBinding, args);
	          return isObject(result) ? result : thisBinding;
	        }
	        return func.apply(thisBinding, args);
	      }
	      setBindData(bound, bindData);
	      return bound;
	    }

	    /**
	     * The base implementation of `_.difference` that accepts a single array
	     * of values to exclude.
	     *
	     * @private
	     * @param {Array} array The array to process.
	     * @param {Array} [values] The array of values to exclude.
	     * @returns {Array} Returns a new array of filtered values.
	     */
	    function baseDifference(array, values) {
	      var index = -1,
	          indexOf = getIndexOf(),
	          length = array ? array.length : 0,
	          isLarge = length >= largeArraySize && indexOf === baseIndexOf,
	          result = [];

	      if (isLarge) {
	        var cache = createCache(values);
	        if (cache) {
	          indexOf = cacheIndexOf;
	          values = cache;
	        } else {
	          isLarge = false;
	        }
	      }
	      while (++index < length) {
	        var value = array[index];
	        if (indexOf(values, value) < 0) {
	          result.push(value);
	        }
	      }
	      if (isLarge) {
	        releaseObject(values);
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `_.flatten` without support for callback
	     * shorthands or `thisArg` binding.
	     *
	     * @private
	     * @param {Array} array The array to flatten.
	     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
	     * @param {boolean} [isStrict=false] A flag to restrict flattening to arrays and `arguments` objects.
	     * @param {number} [fromIndex=0] The index to start from.
	     * @returns {Array} Returns a new flattened array.
	     */
	    function baseFlatten(array, isShallow, isStrict, fromIndex) {
	      var index = (fromIndex || 0) - 1,
	          length = array ? array.length : 0,
	          result = [];

	      while (++index < length) {
	        var value = array[index];

	        if (value && typeof value == 'object' && typeof value.length == 'number'
	            && (isArray(value) || isArguments(value))) {
	          // recursively flatten arrays (susceptible to call stack limits)
	          if (!isShallow) {
	            value = baseFlatten(value, isShallow, isStrict);
	          }
	          var valIndex = -1,
	              valLength = value.length,
	              resIndex = result.length;

	          result.length += valLength;
	          while (++valIndex < valLength) {
	            result[resIndex++] = value[valIndex];
	          }
	        } else if (!isStrict) {
	          result.push(value);
	        }
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `_.isEqual`, without support for `thisArg` binding,
	     * that allows partial "_.where" style comparisons.
	     *
	     * @private
	     * @param {*} a The value to compare.
	     * @param {*} b The other value to compare.
	     * @param {Function} [callback] The function to customize comparing values.
	     * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
	     * @param {Array} [stackA=[]] Tracks traversed `a` objects.
	     * @param {Array} [stackB=[]] Tracks traversed `b` objects.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     */
	    function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
	      // used to indicate that when comparing objects, `a` has at least the properties of `b`
	      if (callback) {
	        var result = callback(a, b);
	        if (typeof result != 'undefined') {
	          return !!result;
	        }
	      }
	      // exit early for identical values
	      if (a === b) {
	        // treat `+0` vs. `-0` as not equal
	        return a !== 0 || (1 / a == 1 / b);
	      }
	      var type = typeof a,
	          otherType = typeof b;

	      // exit early for unlike primitive values
	      if (a === a &&
	          !(a && objectTypes[type]) &&
	          !(b && objectTypes[otherType])) {
	        return false;
	      }
	      // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
	      // http://es5.github.io/#x15.3.4.4
	      if (a == null || b == null) {
	        return a === b;
	      }
	      // compare [[Class]] names
	      var className = toString.call(a),
	          otherClass = toString.call(b);

	      if (className == argsClass) {
	        className = objectClass;
	      }
	      if (otherClass == argsClass) {
	        otherClass = objectClass;
	      }
	      if (className != otherClass) {
	        return false;
	      }
	      switch (className) {
	        case boolClass:
	        case dateClass:
	          // coerce dates and booleans to numbers, dates to milliseconds and booleans
	          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
	          return +a == +b;

	        case numberClass:
	          // treat `NaN` vs. `NaN` as equal
	          return (a != +a)
	            ? b != +b
	            // but treat `+0` vs. `-0` as not equal
	            : (a == 0 ? (1 / a == 1 / b) : a == +b);

	        case regexpClass:
	        case stringClass:
	          // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
	          // treat string primitives and their corresponding object instances as equal
	          return a == String(b);
	      }
	      var isArr = className == arrayClass;
	      if (!isArr) {
	        // unwrap any `lodash` wrapped values
	        var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
	            bWrapped = hasOwnProperty.call(b, '__wrapped__');

	        if (aWrapped || bWrapped) {
	          return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
	        }
	        // exit for functions and DOM nodes
	        if (className != objectClass || (!support.nodeClass && (isNode(a) || isNode(b)))) {
	          return false;
	        }
	        // in older versions of Opera, `arguments` objects have `Array` constructors
	        var ctorA = !support.argsObject && isArguments(a) ? Object : a.constructor,
	            ctorB = !support.argsObject && isArguments(b) ? Object : b.constructor;

	        // non `Object` object instances with different constructors are not equal
	        if (ctorA != ctorB &&
	              !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
	              ('constructor' in a && 'constructor' in b)
	            ) {
	          return false;
	        }
	      }
	      // assume cyclic structures are equal
	      // the algorithm for detecting cyclic structures is adapted from ES 5.1
	      // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
	      var initedStack = !stackA;
	      stackA || (stackA = getArray());
	      stackB || (stackB = getArray());

	      var length = stackA.length;
	      while (length--) {
	        if (stackA[length] == a) {
	          return stackB[length] == b;
	        }
	      }
	      var size = 0;
	      result = true;

	      // add `a` and `b` to the stack of traversed objects
	      stackA.push(a);
	      stackB.push(b);

	      // recursively compare objects and arrays (susceptible to call stack limits)
	      if (isArr) {
	        // compare lengths to determine if a deep comparison is necessary
	        length = a.length;
	        size = b.length;
	        result = size == length;

	        if (result || isWhere) {
	          // deep compare the contents, ignoring non-numeric properties
	          while (size--) {
	            var index = length,
	                value = b[size];

	            if (isWhere) {
	              while (index--) {
	                if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
	                  break;
	                }
	              }
	            } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
	              break;
	            }
	          }
	        }
	      }
	      else {
	        // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
	        // which, in this case, is more costly
	        forIn(b, function(value, key, b) {
	          if (hasOwnProperty.call(b, key)) {
	            // count the number of properties.
	            size++;
	            // deep compare each property value.
	            return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
	          }
	        });

	        if (result && !isWhere) {
	          // ensure both objects have the same number of properties
	          forIn(a, function(value, key, a) {
	            if (hasOwnProperty.call(a, key)) {
	              // `size` will be `-1` if `a` has more properties than `b`
	              return (result = --size > -1);
	            }
	          });
	        }
	      }
	      stackA.pop();
	      stackB.pop();

	      if (initedStack) {
	        releaseArray(stackA);
	        releaseArray(stackB);
	      }
	      return result;
	    }

	    /**
	     * The base implementation of `_.merge` without argument juggling or support
	     * for `thisArg` binding.
	     *
	     * @private
	     * @param {Object} object The destination object.
	     * @param {Object} source The source object.
	     * @param {Function} [callback] The function to customize merging properties.
	     * @param {Array} [stackA=[]] Tracks traversed source objects.
	     * @param {Array} [stackB=[]] Associates values with source counterparts.
	     */
	    function baseMerge(object, source, callback, stackA, stackB) {
	      (isArray(source) ? forEach : forOwn)(source, function(source, key) {
	        var found,
	            isArr,
	            result = source,
	            value = object[key];

	        if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
	          // avoid merging previously merged cyclic sources
	          var stackLength = stackA.length;
	          while (stackLength--) {
	            if ((found = stackA[stackLength] == source)) {
	              value = stackB[stackLength];
	              break;
	            }
	          }
	          if (!found) {
	            var isShallow;
	            if (callback) {
	              result = callback(value, source);
	              if ((isShallow = typeof result != 'undefined')) {
	                value = result;
	              }
	            }
	            if (!isShallow) {
	              value = isArr
	                ? (isArray(value) ? value : [])
	                : (isPlainObject(value) ? value : {});
	            }
	            // add `source` and associated `value` to the stack of traversed objects
	            stackA.push(source);
	            stackB.push(value);

	            // recursively merge objects and arrays (susceptible to call stack limits)
	            if (!isShallow) {
	              baseMerge(value, source, callback, stackA, stackB);
	            }
	          }
	        }
	        else {
	          if (callback) {
	            result = callback(value, source);
	            if (typeof result == 'undefined') {
	              result = source;
	            }
	          }
	          if (typeof result != 'undefined') {
	            value = result;
	          }
	        }
	        object[key] = value;
	      });
	    }

	    /**
	     * The base implementation of `_.random` without argument juggling or support
	     * for returning floating-point numbers.
	     *
	     * @private
	     * @param {number} min The minimum possible value.
	     * @param {number} max The maximum possible value.
	     * @returns {number} Returns a random number.
	     */
	    function baseRandom(min, max) {
	      return min + floor(nativeRandom() * (max - min + 1));
	    }

	    /**
	     * The base implementation of `_.uniq` without support for callback shorthands
	     * or `thisArg` binding.
	     *
	     * @private
	     * @param {Array} array The array to process.
	     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
	     * @param {Function} [callback] The function called per iteration.
	     * @returns {Array} Returns a duplicate-value-free array.
	     */
	    function baseUniq(array, isSorted, callback) {
	      var index = -1,
	          indexOf = getIndexOf(),
	          length = array ? array.length : 0,
	          result = [];

	      var isLarge = !isSorted && length >= largeArraySize && indexOf === baseIndexOf,
	          seen = (callback || isLarge) ? getArray() : result;

	      if (isLarge) {
	        var cache = createCache(seen);
	        indexOf = cacheIndexOf;
	        seen = cache;
	      }
	      while (++index < length) {
	        var value = array[index],
	            computed = callback ? callback(value, index, array) : value;

	        if (isSorted
	              ? !index || seen[seen.length - 1] !== computed
	              : indexOf(seen, computed) < 0
	            ) {
	          if (callback || isLarge) {
	            seen.push(computed);
	          }
	          result.push(value);
	        }
	      }
	      if (isLarge) {
	        releaseArray(seen.array);
	        releaseObject(seen);
	      } else if (callback) {
	        releaseArray(seen);
	      }
	      return result;
	    }

	    /**
	     * Creates a function that aggregates a collection, creating an object composed
	     * of keys generated from the results of running each element of the collection
	     * through a callback. The given `setter` function sets the keys and values
	     * of the composed object.
	     *
	     * @private
	     * @param {Function} setter The setter function.
	     * @returns {Function} Returns the new aggregator function.
	     */
	    function createAggregator(setter) {
	      return function(collection, callback, thisArg) {
	        var result = {};
	        callback = lodash.createCallback(callback, thisArg, 3);

	        if (isArray(collection)) {
	          var index = -1,
	              length = collection.length;

	          while (++index < length) {
	            var value = collection[index];
	            setter(result, value, callback(value, index, collection), collection);
	          }
	        } else {
	          baseEach(collection, function(value, key, collection) {
	            setter(result, value, callback(value, key, collection), collection);
	          });
	        }
	        return result;
	      };
	    }

	    /**
	     * Creates a function that, when called, either curries or invokes `func`
	     * with an optional `this` binding and partially applied arguments.
	     *
	     * @private
	     * @param {Function|string} func The function or method name to reference.
	     * @param {number} bitmask The bitmask of method flags to compose.
	     *  The bitmask may be composed of the following flags:
	     *  1 - `_.bind`
	     *  2 - `_.bindKey`
	     *  4 - `_.curry`
	     *  8 - `_.curry` (bound)
	     *  16 - `_.partial`
	     *  32 - `_.partialRight`
	     * @param {Array} [partialArgs] An array of arguments to prepend to those
	     *  provided to the new function.
	     * @param {Array} [partialRightArgs] An array of arguments to append to those
	     *  provided to the new function.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {number} [arity] The arity of `func`.
	     * @returns {Function} Returns the new function.
	     */
	    function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
	      var isBind = bitmask & 1,
	          isBindKey = bitmask & 2,
	          isCurry = bitmask & 4,
	          isCurryBound = bitmask & 8,
	          isPartial = bitmask & 16,
	          isPartialRight = bitmask & 32;

	      if (!isBindKey && !isFunction(func)) {
	        throw new TypeError;
	      }
	      if (isPartial && !partialArgs.length) {
	        bitmask &= ~16;
	        isPartial = partialArgs = false;
	      }
	      if (isPartialRight && !partialRightArgs.length) {
	        bitmask &= ~32;
	        isPartialRight = partialRightArgs = false;
	      }
	      var bindData = func && func.__bindData__;
	      if (bindData && bindData !== true) {
	        // clone `bindData`
	        bindData = slice(bindData);
	        if (bindData[2]) {
	          bindData[2] = slice(bindData[2]);
	        }
	        if (bindData[3]) {
	          bindData[3] = slice(bindData[3]);
	        }
	        // set `thisBinding` is not previously bound
	        if (isBind && !(bindData[1] & 1)) {
	          bindData[4] = thisArg;
	        }
	        // set if previously bound but not currently (subsequent curried functions)
	        if (!isBind && bindData[1] & 1) {
	          bitmask |= 8;
	        }
	        // set curried arity if not yet set
	        if (isCurry && !(bindData[1] & 4)) {
	          bindData[5] = arity;
	        }
	        // append partial left arguments
	        if (isPartial) {
	          push.apply(bindData[2] || (bindData[2] = []), partialArgs);
	        }
	        // append partial right arguments
	        if (isPartialRight) {
	          unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
	        }
	        // merge flags
	        bindData[1] |= bitmask;
	        return createWrapper.apply(null, bindData);
	      }
	      // fast path for `_.bind`
	      var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
	      return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
	    }

	    /**
	     * Creates compiled iteration functions.
	     *
	     * @private
	     * @param {...Object} [options] The compile options object(s).
	     * @param {string} [options.array] Code to determine if the iterable is an array or array-like.
	     * @param {boolean} [options.useHas] Specify using `hasOwnProperty` checks in the object loop.
	     * @param {Function} [options.keys] A reference to `_.keys` for use in own property iteration.
	     * @param {string} [options.args] A comma separated string of iteration function arguments.
	     * @param {string} [options.top] Code to execute before the iteration branches.
	     * @param {string} [options.loop] Code to execute in the object loop.
	     * @param {string} [options.bottom] Code to execute after the iteration branches.
	     * @returns {Function} Returns the compiled function.
	     */
	    function createIterator() {
	      // data properties
	      iteratorData.shadowedProps = shadowedProps;

	      // iterator options
	      iteratorData.array = iteratorData.bottom = iteratorData.loop = iteratorData.top = '';
	      iteratorData.init = 'iterable';
	      iteratorData.useHas = true;

	      // merge options into a template data object
	      for (var object, index = 0; object = arguments[index]; index++) {
	        for (var key in object) {
	          iteratorData[key] = object[key];
	        }
	      }
	      var args = iteratorData.args;
	      iteratorData.firstArg = /^[^,]+/.exec(args)[0];

	      // create the function factory
	      var factory = Function(
	          'baseCreateCallback, errorClass, errorProto, hasOwnProperty, ' +
	          'indicatorObject, isArguments, isArray, isString, keys, objectProto, ' +
	          'objectTypes, nonEnumProps, stringClass, stringProto, toString',
	        'return function(' + args + ') {\n' + iteratorTemplate(iteratorData) + '\n}'
	      );

	      // return the compiled function
	      return factory(
	        baseCreateCallback, errorClass, errorProto, hasOwnProperty,
	        indicatorObject, isArguments, isArray, isString, iteratorData.keys, objectProto,
	        objectTypes, nonEnumProps, stringClass, stringProto, toString
	      );
	    }

	    /**
	     * Used by `escape` to convert characters to HTML entities.
	     *
	     * @private
	     * @param {string} match The matched character to escape.
	     * @returns {string} Returns the escaped character.
	     */
	    function escapeHtmlChar(match) {
	      return htmlEscapes[match];
	    }

	    /**
	     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
	     * customized, this method returns the custom method, otherwise it returns
	     * the `baseIndexOf` function.
	     *
	     * @private
	     * @returns {Function} Returns the "indexOf" function.
	     */
	    function getIndexOf() {
	      var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
	      return result;
	    }

	    /**
	     * Checks if `value` is a native function.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
	     */
	    function isNative(value) {
	      return typeof value == 'function' && reNative.test(value);
	    }

	    /**
	     * Sets `this` binding data on a given function.
	     *
	     * @private
	     * @param {Function} func The function to set data on.
	     * @param {Array} value The data array to set.
	     */
	    var setBindData = !defineProperty ? noop : function(func, value) {
	      descriptor.value = value;
	      defineProperty(func, '__bindData__', descriptor);
	    };

	    /**
	     * A fallback implementation of `isPlainObject` which checks if a given value
	     * is an object created by the `Object` constructor, assuming objects created
	     * by the `Object` constructor have no inherited enumerable properties and that
	     * there are no `Object.prototype` extensions.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	     */
	    function shimIsPlainObject(value) {
	      var ctor,
	          result;

	      // avoid non Object objects, `arguments` objects, and DOM elements
	      if (!(value && toString.call(value) == objectClass) ||
	          (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor)) ||
	          (!support.argsClass && isArguments(value)) ||
	          (!support.nodeClass && isNode(value))) {
	        return false;
	      }
	      // IE < 9 iterates inherited properties before own properties. If the first
	      // iterated property is an object's own property then there are no inherited
	      // enumerable properties.
	      if (support.ownLast) {
	        forIn(value, function(value, key, object) {
	          result = hasOwnProperty.call(object, key);
	          return false;
	        });
	        return result !== false;
	      }
	      // In most environments an object's own properties are iterated before
	      // its inherited properties. If the last iterated property is an object's
	      // own property then there are no inherited enumerable properties.
	      forIn(value, function(value, key) {
	        result = key;
	      });
	      return typeof result == 'undefined' || hasOwnProperty.call(value, result);
	    }

	    /**
	     * Used by `unescape` to convert HTML entities to characters.
	     *
	     * @private
	     * @param {string} match The matched character to unescape.
	     * @returns {string} Returns the unescaped character.
	     */
	    function unescapeHtmlChar(match) {
	      return htmlUnescapes[match];
	    }

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Checks if `value` is an `arguments` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
	     * @example
	     *
	     * (function() { return _.isArguments(arguments); })(1, 2, 3);
	     * // => true
	     *
	     * _.isArguments([1, 2, 3]);
	     * // => false
	     */
	    function isArguments(value) {
	      return value && typeof value == 'object' && typeof value.length == 'number' &&
	        toString.call(value) == argsClass || false;
	    }
	    // fallback for browsers that can't detect `arguments` objects by [[Class]]
	    if (!support.argsClass) {
	      isArguments = function(value) {
	        return value && typeof value == 'object' && typeof value.length == 'number' &&
	          hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee') || false;
	      };
	    }

	    /**
	     * Checks if `value` is an array.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
	     * @example
	     *
	     * (function() { return _.isArray(arguments); })();
	     * // => false
	     *
	     * _.isArray([1, 2, 3]);
	     * // => true
	     */
	    var isArray = nativeIsArray || function(value) {
	      return value && typeof value == 'object' && typeof value.length == 'number' &&
	        toString.call(value) == arrayClass || false;
	    };

	    /**
	     * A fallback implementation of `Object.keys` which produces an array of the
	     * given object's own enumerable property names.
	     *
	     * @private
	     * @type Function
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns an array of property names.
	     */
	    var shimKeys = createIterator({
	      'args': 'object',
	      'init': '[]',
	      'top': 'if (!(objectTypes[typeof object])) return result',
	      'loop': 'result.push(index)'
	    });

	    /**
	     * Creates an array composed of the own enumerable property names of an object.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns an array of property names.
	     * @example
	     *
	     * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
	     * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
	     */
	    var keys = !nativeKeys ? shimKeys : function(object) {
	      if (!isObject(object)) {
	        return [];
	      }
	      if ((support.enumPrototypes && typeof object == 'function') ||
	          (support.nonEnumArgs && object.length && isArguments(object))) {
	        return shimKeys(object);
	      }
	      return nativeKeys(object);
	    };

	    /** Reusable iterator options shared by `each`, `forIn`, and `forOwn` */
	    var eachIteratorOptions = {
	      'args': 'collection, callback, thisArg',
	      'top': "callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3)",
	      'array': "typeof length == 'number'",
	      'keys': keys,
	      'loop': 'if (callback(iterable[index], index, collection) === false) return result'
	    };

	    /** Reusable iterator options for `assign` and `defaults` */
	    var defaultsIteratorOptions = {
	      'args': 'object, source, guard',
	      'top':
	        'var args = arguments,\n' +
	        '    argsIndex = 0,\n' +
	        "    argsLength = typeof guard == 'number' ? 2 : args.length;\n" +
	        'while (++argsIndex < argsLength) {\n' +
	        '  iterable = args[argsIndex];\n' +
	        '  if (iterable && objectTypes[typeof iterable]) {',
	      'keys': keys,
	      'loop': "if (typeof result[index] == 'undefined') result[index] = iterable[index]",
	      'bottom': '  }\n}'
	    };

	    /** Reusable iterator options for `forIn` and `forOwn` */
	    var forOwnIteratorOptions = {
	      'top': 'if (!objectTypes[typeof iterable]) return result;\n' + eachIteratorOptions.top,
	      'array': false
	    };

	    /**
	     * Used to convert characters to HTML entities:
	     *
	     * Though the `>` character is escaped for symmetry, characters like `>` and `/`
	     * don't require escaping in HTML and have no special meaning unless they're part
	     * of a tag or an unquoted attribute value.
	     * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
	     */
	    var htmlEscapes = {
	      '&': '&amp;',
	      '<': '&lt;',
	      '>': '&gt;',
	      '"': '&quot;',
	      "'": '&#39;'
	    };

	    /** Used to convert HTML entities to characters */
	    var htmlUnescapes = invert(htmlEscapes);

	    /** Used to match HTML entities and HTML characters */
	    var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g'),
	        reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');

	    /**
	     * A function compiled to iterate `arguments` objects, arrays, objects, and
	     * strings consistenly across environments, executing the callback for each
	     * element in the collection. The callback is bound to `thisArg` and invoked
	     * with three arguments; (value, index|key, collection). Callbacks may exit
	     * iteration early by explicitly returning `false`.
	     *
	     * @private
	     * @type Function
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array|Object|string} Returns `collection`.
	     */
	    var baseEach = createIterator(eachIteratorOptions);

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Assigns own enumerable properties of source object(s) to the destination
	     * object. Subsequent sources will overwrite property assignments of previous
	     * sources. If a callback is provided it will be executed to produce the
	     * assigned values. The callback is bound to `thisArg` and invoked with two
	     * arguments; (objectValue, sourceValue).
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @alias extend
	     * @category Objects
	     * @param {Object} object The destination object.
	     * @param {...Object} [source] The source objects.
	     * @param {Function} [callback] The function to customize assigning values.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns the destination object.
	     * @example
	     *
	     * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
	     * // => { 'name': 'fred', 'employer': 'slate' }
	     *
	     * var defaults = _.partialRight(_.assign, function(a, b) {
	     *   return typeof a == 'undefined' ? b : a;
	     * });
	     *
	     * var object = { 'name': 'barney' };
	     * defaults(object, { 'name': 'fred', 'employer': 'slate' });
	     * // => { 'name': 'barney', 'employer': 'slate' }
	     */
	    var assign = createIterator(defaultsIteratorOptions, {
	      'top':
	        defaultsIteratorOptions.top.replace(';',
	          ';\n' +
	          "if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {\n" +
	          '  var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);\n' +
	          "} else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {\n" +
	          '  callback = args[--argsLength];\n' +
	          '}'
	        ),
	      'loop': 'result[index] = callback ? callback(result[index], iterable[index]) : iterable[index]'
	    });

	    /**
	     * Creates a clone of `value`. If `isDeep` is `true` nested objects will also
	     * be cloned, otherwise they will be assigned by reference. If a callback
	     * is provided it will be executed to produce the cloned values. If the
	     * callback returns `undefined` cloning will be handled by the method instead.
	     * The callback is bound to `thisArg` and invoked with one argument; (value).
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to clone.
	     * @param {boolean} [isDeep=false] Specify a deep clone.
	     * @param {Function} [callback] The function to customize cloning values.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the cloned value.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * var shallow = _.clone(characters);
	     * shallow[0] === characters[0];
	     * // => true
	     *
	     * var deep = _.clone(characters, true);
	     * deep[0] === characters[0];
	     * // => false
	     *
	     * _.mixin({
	     *   'clone': _.partialRight(_.clone, function(value) {
	     *     return _.isElement(value) ? value.cloneNode(false) : undefined;
	     *   })
	     * });
	     *
	     * var clone = _.clone(document.body);
	     * clone.childNodes.length;
	     * // => 0
	     */
	    function clone(value, isDeep, callback, thisArg) {
	      // allows working with "Collections" methods without using their `index`
	      // and `collection` arguments for `isDeep` and `callback`
	      if (typeof isDeep != 'boolean' && isDeep != null) {
	        thisArg = callback;
	        callback = isDeep;
	        isDeep = false;
	      }
	      return baseClone(value, isDeep, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
	    }

	    /**
	     * Creates a deep clone of `value`. If a callback is provided it will be
	     * executed to produce the cloned values. If the callback returns `undefined`
	     * cloning will be handled by the method instead. The callback is bound to
	     * `thisArg` and invoked with one argument; (value).
	     *
	     * Note: This method is loosely based on the structured clone algorithm. Functions
	     * and DOM nodes are **not** cloned. The enumerable properties of `arguments` objects and
	     * objects created by constructors other than `Object` are cloned to plain `Object` objects.
	     * See http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to deep clone.
	     * @param {Function} [callback] The function to customize cloning values.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the deep cloned value.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * var deep = _.cloneDeep(characters);
	     * deep[0] === characters[0];
	     * // => false
	     *
	     * var view = {
	     *   'label': 'docs',
	     *   'node': element
	     * };
	     *
	     * var clone = _.cloneDeep(view, function(value) {
	     *   return _.isElement(value) ? value.cloneNode(true) : undefined;
	     * });
	     *
	     * clone.node == view.node;
	     * // => false
	     */
	    function cloneDeep(value, callback, thisArg) {
	      return baseClone(value, true, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
	    }

	    /**
	     * Creates an object that inherits from the given `prototype` object. If a
	     * `properties` object is provided its own enumerable properties are assigned
	     * to the created object.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} prototype The object to inherit from.
	     * @param {Object} [properties] The properties to assign to the object.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * function Shape() {
	     *   this.x = 0;
	     *   this.y = 0;
	     * }
	     *
	     * function Circle() {
	     *   Shape.call(this);
	     * }
	     *
	     * Circle.prototype = _.create(Shape.prototype, { 'constructor': Circle });
	     *
	     * var circle = new Circle;
	     * circle instanceof Circle;
	     * // => true
	     *
	     * circle instanceof Shape;
	     * // => true
	     */
	    function create(prototype, properties) {
	      var result = baseCreate(prototype);
	      return properties ? assign(result, properties) : result;
	    }

	    /**
	     * Assigns own enumerable properties of source object(s) to the destination
	     * object for all destination properties that resolve to `undefined`. Once a
	     * property is set, additional defaults of the same property will be ignored.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Objects
	     * @param {Object} object The destination object.
	     * @param {...Object} [source] The source objects.
	     * @param- {Object} [guard] Allows working with `_.reduce` without using its
	     *  `key` and `object` arguments as sources.
	     * @returns {Object} Returns the destination object.
	     * @example
	     *
	     * var object = { 'name': 'barney' };
	     * _.defaults(object, { 'name': 'fred', 'employer': 'slate' });
	     * // => { 'name': 'barney', 'employer': 'slate' }
	     */
	    var defaults = createIterator(defaultsIteratorOptions);

	    /**
	     * This method is like `_.findIndex` except that it returns the key of the
	     * first element that passes the callback check, instead of the element itself.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to search.
	     * @param {Function|Object|string} [callback=identity] The function called per
	     *  iteration. If a property name or object is provided it will be used to
	     *  create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
	     * @example
	     *
	     * var characters = {
	     *   'barney': {  'age': 36, 'blocked': false },
	     *   'fred': {    'age': 40, 'blocked': true },
	     *   'pebbles': { 'age': 1,  'blocked': false }
	     * };
	     *
	     * _.findKey(characters, function(chr) {
	     *   return chr.age < 40;
	     * });
	     * // => 'barney' (property order is not guaranteed across environments)
	     *
	     * // using "_.where" callback shorthand
	     * _.findKey(characters, { 'age': 1 });
	     * // => 'pebbles'
	     *
	     * // using "_.pluck" callback shorthand
	     * _.findKey(characters, 'blocked');
	     * // => 'fred'
	     */
	    function findKey(object, callback, thisArg) {
	      var result;
	      callback = lodash.createCallback(callback, thisArg, 3);
	      forOwn(object, function(value, key, object) {
	        if (callback(value, key, object)) {
	          result = key;
	          return false;
	        }
	      });
	      return result;
	    }

	    /**
	     * This method is like `_.findKey` except that it iterates over elements
	     * of a `collection` in the opposite order.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to search.
	     * @param {Function|Object|string} [callback=identity] The function called per
	     *  iteration. If a property name or object is provided it will be used to
	     *  create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
	     * @example
	     *
	     * var characters = {
	     *   'barney': {  'age': 36, 'blocked': true },
	     *   'fred': {    'age': 40, 'blocked': false },
	     *   'pebbles': { 'age': 1,  'blocked': true }
	     * };
	     *
	     * _.findLastKey(characters, function(chr) {
	     *   return chr.age < 40;
	     * });
	     * // => returns `pebbles`, assuming `_.findKey` returns `barney`
	     *
	     * // using "_.where" callback shorthand
	     * _.findLastKey(characters, { 'age': 40 });
	     * // => 'fred'
	     *
	     * // using "_.pluck" callback shorthand
	     * _.findLastKey(characters, 'blocked');
	     * // => 'pebbles'
	     */
	    function findLastKey(object, callback, thisArg) {
	      var result;
	      callback = lodash.createCallback(callback, thisArg, 3);
	      forOwnRight(object, function(value, key, object) {
	        if (callback(value, key, object)) {
	          result = key;
	          return false;
	        }
	      });
	      return result;
	    }

	    /**
	     * Iterates over own and inherited enumerable properties of an object,
	     * executing the callback for each property. The callback is bound to `thisArg`
	     * and invoked with three arguments; (value, key, object). Callbacks may exit
	     * iteration early by explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Objects
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Shape() {
	     *   this.x = 0;
	     *   this.y = 0;
	     * }
	     *
	     * Shape.prototype.move = function(x, y) {
	     *   this.x += x;
	     *   this.y += y;
	     * };
	     *
	     * _.forIn(new Shape, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
	     */
	    var forIn = createIterator(eachIteratorOptions, forOwnIteratorOptions, {
	      'useHas': false
	    });

	    /**
	     * This method is like `_.forIn` except that it iterates over elements
	     * of a `collection` in the opposite order.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Shape() {
	     *   this.x = 0;
	     *   this.y = 0;
	     * }
	     *
	     * Shape.prototype.move = function(x, y) {
	     *   this.x += x;
	     *   this.y += y;
	     * };
	     *
	     * _.forInRight(new Shape, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'move', 'y', and 'x' assuming `_.forIn ` logs 'x', 'y', and 'move'
	     */
	    function forInRight(object, callback, thisArg) {
	      var pairs = [];

	      forIn(object, function(value, key) {
	        pairs.push(key, value);
	      });

	      var length = pairs.length;
	      callback = baseCreateCallback(callback, thisArg, 3);
	      while (length--) {
	        if (callback(pairs[length--], pairs[length], object) === false) {
	          break;
	        }
	      }
	      return object;
	    }

	    /**
	     * Iterates over own enumerable properties of an object, executing the callback
	     * for each property. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, key, object). Callbacks may exit iteration early by
	     * explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Objects
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
	     *   console.log(key);
	     * });
	     * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
	     */
	    var forOwn = createIterator(eachIteratorOptions, forOwnIteratorOptions);

	    /**
	     * This method is like `_.forOwn` except that it iterates over elements
	     * of a `collection` in the opposite order.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * _.forOwnRight({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'length', '1', and '0' assuming `_.forOwn` logs '0', '1', and 'length'
	     */
	    function forOwnRight(object, callback, thisArg) {
	      var props = keys(object),
	          length = props.length;

	      callback = baseCreateCallback(callback, thisArg, 3);
	      while (length--) {
	        var key = props[length];
	        if (callback(object[key], key, object) === false) {
	          break;
	        }
	      }
	      return object;
	    }

	    /**
	     * Creates a sorted array of property names of all enumerable properties,
	     * own and inherited, of `object` that have function values.
	     *
	     * @static
	     * @memberOf _
	     * @alias methods
	     * @category Objects
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns an array of property names that have function values.
	     * @example
	     *
	     * _.functions(_);
	     * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
	     */
	    function functions(object) {
	      var result = [];
	      forIn(object, function(value, key) {
	        if (isFunction(value)) {
	          result.push(key);
	        }
	      });
	      return result.sort();
	    }

	    /**
	     * Checks if the specified property name exists as a direct property of `object`,
	     * instead of an inherited property.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to inspect.
	     * @param {string} key The name of the property to check.
	     * @returns {boolean} Returns `true` if key is a direct property, else `false`.
	     * @example
	     *
	     * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
	     * // => true
	     */
	    function has(object, key) {
	      return object ? hasOwnProperty.call(object, key) : false;
	    }

	    /**
	     * Creates an object composed of the inverted keys and values of the given object.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to invert.
	     * @returns {Object} Returns the created inverted object.
	     * @example
	     *
	     * _.invert({ 'first': 'fred', 'second': 'barney' });
	     * // => { 'fred': 'first', 'barney': 'second' }
	     */
	    function invert(object) {
	      var index = -1,
	          props = keys(object),
	          length = props.length,
	          result = {};

	      while (++index < length) {
	        var key = props[index];
	        result[object[key]] = key;
	      }
	      return result;
	    }

	    /**
	     * Checks if `value` is a boolean value.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a boolean value, else `false`.
	     * @example
	     *
	     * _.isBoolean(null);
	     * // => false
	     */
	    function isBoolean(value) {
	      return value === true || value === false ||
	        value && typeof value == 'object' && toString.call(value) == boolClass || false;
	    }

	    /**
	     * Checks if `value` is a date.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a date, else `false`.
	     * @example
	     *
	     * _.isDate(new Date);
	     * // => true
	     */
	    function isDate(value) {
	      return value && typeof value == 'object' && toString.call(value) == dateClass || false;
	    }

	    /**
	     * Checks if `value` is a DOM element.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a DOM element, else `false`.
	     * @example
	     *
	     * _.isElement(document.body);
	     * // => true
	     */
	    function isElement(value) {
	      return value && value.nodeType === 1 || false;
	    }

	    /**
	     * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
	     * length of `0` and objects with no own enumerable properties are considered
	     * "empty".
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Array|Object|string} value The value to inspect.
	     * @returns {boolean} Returns `true` if the `value` is empty, else `false`.
	     * @example
	     *
	     * _.isEmpty([1, 2, 3]);
	     * // => false
	     *
	     * _.isEmpty({});
	     * // => true
	     *
	     * _.isEmpty('');
	     * // => true
	     */
	    function isEmpty(value) {
	      var result = true;
	      if (!value) {
	        return result;
	      }
	      var className = toString.call(value),
	          length = value.length;

	      if ((className == arrayClass || className == stringClass ||
	          (support.argsClass ? className == argsClass : isArguments(value))) ||
	          (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
	        return !length;
	      }
	      forOwn(value, function() {
	        return (result = false);
	      });
	      return result;
	    }

	    /**
	     * Performs a deep comparison between two values to determine if they are
	     * equivalent to each other. If a callback is provided it will be executed
	     * to compare values. If the callback returns `undefined` comparisons will
	     * be handled by the method instead. The callback is bound to `thisArg` and
	     * invoked with two arguments; (a, b).
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} a The value to compare.
	     * @param {*} b The other value to compare.
	     * @param {Function} [callback] The function to customize comparing values.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     * @example
	     *
	     * var object = { 'name': 'fred' };
	     * var copy = { 'name': 'fred' };
	     *
	     * object == copy;
	     * // => false
	     *
	     * _.isEqual(object, copy);
	     * // => true
	     *
	     * var words = ['hello', 'goodbye'];
	     * var otherWords = ['hi', 'goodbye'];
	     *
	     * _.isEqual(words, otherWords, function(a, b) {
	     *   var reGreet = /^(?:hello|hi)$/i,
	     *       aGreet = _.isString(a) && reGreet.test(a),
	     *       bGreet = _.isString(b) && reGreet.test(b);
	     *
	     *   return (aGreet || bGreet) ? (aGreet == bGreet) : undefined;
	     * });
	     * // => true
	     */
	    function isEqual(a, b, callback, thisArg) {
	      return baseIsEqual(a, b, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 2));
	    }

	    /**
	     * Checks if `value` is, or can be coerced to, a finite number.
	     *
	     * Note: This is not the same as native `isFinite` which will return true for
	     * booleans and empty strings. See http://es5.github.io/#x15.1.2.5.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is finite, else `false`.
	     * @example
	     *
	     * _.isFinite(-101);
	     * // => true
	     *
	     * _.isFinite('10');
	     * // => true
	     *
	     * _.isFinite(true);
	     * // => false
	     *
	     * _.isFinite('');
	     * // => false
	     *
	     * _.isFinite(Infinity);
	     * // => false
	     */
	    function isFinite(value) {
	      return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
	    }

	    /**
	     * Checks if `value` is a function.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
	     * @example
	     *
	     * _.isFunction(_);
	     * // => true
	     */
	    function isFunction(value) {
	      return typeof value == 'function';
	    }
	    // fallback for older versions of Chrome and Safari
	    if (isFunction(/x/)) {
	      isFunction = function(value) {
	        return typeof value == 'function' && toString.call(value) == funcClass;
	      };
	    }

	    /**
	     * Checks if `value` is the language type of Object.
	     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
	     * @example
	     *
	     * _.isObject({});
	     * // => true
	     *
	     * _.isObject([1, 2, 3]);
	     * // => true
	     *
	     * _.isObject(1);
	     * // => false
	     */
	    function isObject(value) {
	      // check if the value is the ECMAScript language type of Object
	      // http://es5.github.io/#x8
	      // and avoid a V8 bug
	      // http://code.google.com/p/v8/issues/detail?id=2291
	      return !!(value && objectTypes[typeof value]);
	    }

	    /**
	     * Checks if `value` is `NaN`.
	     *
	     * Note: This is not the same as native `isNaN` which will return `true` for
	     * `undefined` and other non-numeric values. See http://es5.github.io/#x15.1.2.4.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is `NaN`, else `false`.
	     * @example
	     *
	     * _.isNaN(NaN);
	     * // => true
	     *
	     * _.isNaN(new Number(NaN));
	     * // => true
	     *
	     * isNaN(undefined);
	     * // => true
	     *
	     * _.isNaN(undefined);
	     * // => false
	     */
	    function isNaN(value) {
	      // `NaN` as a primitive is the only value that is not equal to itself
	      // (perform the [[Class]] check first to avoid errors with some host objects in IE)
	      return isNumber(value) && value != +value;
	    }

	    /**
	     * Checks if `value` is `null`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is `null`, else `false`.
	     * @example
	     *
	     * _.isNull(null);
	     * // => true
	     *
	     * _.isNull(undefined);
	     * // => false
	     */
	    function isNull(value) {
	      return value === null;
	    }

	    /**
	     * Checks if `value` is a number.
	     *
	     * Note: `NaN` is considered a number. See http://es5.github.io/#x8.5.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
	     * @example
	     *
	     * _.isNumber(8.4 * 5);
	     * // => true
	     */
	    function isNumber(value) {
	      return typeof value == 'number' ||
	        value && typeof value == 'object' && toString.call(value) == numberClass || false;
	    }

	    /**
	     * Checks if `value` is an object created by the `Object` constructor.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	     * @example
	     *
	     * function Shape() {
	     *   this.x = 0;
	     *   this.y = 0;
	     * }
	     *
	     * _.isPlainObject(new Shape);
	     * // => false
	     *
	     * _.isPlainObject([1, 2, 3]);
	     * // => false
	     *
	     * _.isPlainObject({ 'x': 0, 'y': 0 });
	     * // => true
	     */
	    var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
	      if (!(value && toString.call(value) == objectClass) || (!support.argsClass && isArguments(value))) {
	        return false;
	      }
	      var valueOf = value.valueOf,
	          objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

	      return objProto
	        ? (value == objProto || getPrototypeOf(value) == objProto)
	        : shimIsPlainObject(value);
	    };

	    /**
	     * Checks if `value` is a regular expression.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a regular expression, else `false`.
	     * @example
	     *
	     * _.isRegExp(/fred/);
	     * // => true
	     */
	    function isRegExp(value) {
	      return value && objectTypes[typeof value] && toString.call(value) == regexpClass || false;
	    }

	    /**
	     * Checks if `value` is a string.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
	     * @example
	     *
	     * _.isString('fred');
	     * // => true
	     */
	    function isString(value) {
	      return typeof value == 'string' ||
	        value && typeof value == 'object' && toString.call(value) == stringClass || false;
	    }

	    /**
	     * Checks if `value` is `undefined`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if the `value` is `undefined`, else `false`.
	     * @example
	     *
	     * _.isUndefined(void 0);
	     * // => true
	     */
	    function isUndefined(value) {
	      return typeof value == 'undefined';
	    }

	    /**
	     * Creates an object with the same keys as `object` and values generated by
	     * running each own enumerable property of `object` through the callback.
	     * The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, key, object).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new object with values of the results of each `callback` execution.
	     * @example
	     *
	     * _.mapValues({ 'a': 1, 'b': 2, 'c': 3} , function(num) { return num * 3; });
	     * // => { 'a': 3, 'b': 6, 'c': 9 }
	     *
	     * var characters = {
	     *   'fred': { 'name': 'fred', 'age': 40 },
	     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
	     * };
	     *
	     * // using "_.pluck" callback shorthand
	     * _.mapValues(characters, 'age');
	     * // => { 'fred': 40, 'pebbles': 1 }
	     */
	    function mapValues(object, callback, thisArg) {
	      var result = {};
	      callback = lodash.createCallback(callback, thisArg, 3);

	      forOwn(object, function(value, key, object) {
	        result[key] = callback(value, key, object);
	      });
	      return result;
	    }

	    /**
	     * Recursively merges own enumerable properties of the source object(s), that
	     * don't resolve to `undefined` into the destination object. Subsequent sources
	     * will overwrite property assignments of previous sources. If a callback is
	     * provided it will be executed to produce the merged values of the destination
	     * and source properties. If the callback returns `undefined` merging will
	     * be handled by the method instead. The callback is bound to `thisArg` and
	     * invoked with two arguments; (objectValue, sourceValue).
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The destination object.
	     * @param {...Object} [source] The source objects.
	     * @param {Function} [callback] The function to customize merging properties.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns the destination object.
	     * @example
	     *
	     * var names = {
	     *   'characters': [
	     *     { 'name': 'barney' },
	     *     { 'name': 'fred' }
	     *   ]
	     * };
	     *
	     * var ages = {
	     *   'characters': [
	     *     { 'age': 36 },
	     *     { 'age': 40 }
	     *   ]
	     * };
	     *
	     * _.merge(names, ages);
	     * // => { 'characters': [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred', 'age': 40 }] }
	     *
	     * var food = {
	     *   'fruits': ['apple'],
	     *   'vegetables': ['beet']
	     * };
	     *
	     * var otherFood = {
	     *   'fruits': ['banana'],
	     *   'vegetables': ['carrot']
	     * };
	     *
	     * _.merge(food, otherFood, function(a, b) {
	     *   return _.isArray(a) ? a.concat(b) : undefined;
	     * });
	     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot] }
	     */
	    function merge(object) {
	      var args = arguments,
	          length = 2;

	      if (!isObject(object)) {
	        return object;
	      }
	      // allows working with `_.reduce` and `_.reduceRight` without using
	      // their `index` and `collection` arguments
	      if (typeof args[2] != 'number') {
	        length = args.length;
	      }
	      if (length > 3 && typeof args[length - 2] == 'function') {
	        var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
	      } else if (length > 2 && typeof args[length - 1] == 'function') {
	        callback = args[--length];
	      }
	      var sources = slice(arguments, 1, length),
	          index = -1,
	          stackA = getArray(),
	          stackB = getArray();

	      while (++index < length) {
	        baseMerge(object, sources[index], callback, stackA, stackB);
	      }
	      releaseArray(stackA);
	      releaseArray(stackB);
	      return object;
	    }

	    /**
	     * Creates a shallow clone of `object` excluding the specified properties.
	     * Property names may be specified as individual arguments or as arrays of
	     * property names. If a callback is provided it will be executed for each
	     * property of `object` omitting the properties the callback returns truey
	     * for. The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, key, object).
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The source object.
	     * @param {Function|...string|string[]} [callback] The properties to omit or the
	     *  function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns an object without the omitted properties.
	     * @example
	     *
	     * _.omit({ 'name': 'fred', 'age': 40 }, 'age');
	     * // => { 'name': 'fred' }
	     *
	     * _.omit({ 'name': 'fred', 'age': 40 }, function(value) {
	     *   return typeof value == 'number';
	     * });
	     * // => { 'name': 'fred' }
	     */
	    function omit(object, callback, thisArg) {
	      var result = {};
	      if (typeof callback != 'function') {
	        var props = [];
	        forIn(object, function(value, key) {
	          props.push(key);
	        });
	        props = baseDifference(props, baseFlatten(arguments, true, false, 1));

	        var index = -1,
	            length = props.length;

	        while (++index < length) {
	          var key = props[index];
	          result[key] = object[key];
	        }
	      } else {
	        callback = lodash.createCallback(callback, thisArg, 3);
	        forIn(object, function(value, key, object) {
	          if (!callback(value, key, object)) {
	            result[key] = value;
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * Creates a two dimensional array of an object's key-value pairs,
	     * i.e. `[[key1, value1], [key2, value2]]`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns new array of key-value pairs.
	     * @example
	     *
	     * _.pairs({ 'barney': 36, 'fred': 40 });
	     * // => [['barney', 36], ['fred', 40]] (property order is not guaranteed across environments)
	     */
	    function pairs(object) {
	      var index = -1,
	          props = keys(object),
	          length = props.length,
	          result = Array(length);

	      while (++index < length) {
	        var key = props[index];
	        result[index] = [key, object[key]];
	      }
	      return result;
	    }

	    /**
	     * Creates a shallow clone of `object` composed of the specified properties.
	     * Property names may be specified as individual arguments or as arrays of
	     * property names. If a callback is provided it will be executed for each
	     * property of `object` picking the properties the callback returns truey
	     * for. The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, key, object).
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The source object.
	     * @param {Function|...string|string[]} [callback] The function called per
	     *  iteration or property names to pick, specified as individual property
	     *  names or arrays of property names.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns an object composed of the picked properties.
	     * @example
	     *
	     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, 'name');
	     * // => { 'name': 'fred' }
	     *
	     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, function(value, key) {
	     *   return key.charAt(0) != '_';
	     * });
	     * // => { 'name': 'fred' }
	     */
	    function pick(object, callback, thisArg) {
	      var result = {};
	      if (typeof callback != 'function') {
	        var index = -1,
	            props = baseFlatten(arguments, true, false, 1),
	            length = isObject(object) ? props.length : 0;

	        while (++index < length) {
	          var key = props[index];
	          if (key in object) {
	            result[key] = object[key];
	          }
	        }
	      } else {
	        callback = lodash.createCallback(callback, thisArg, 3);
	        forIn(object, function(value, key, object) {
	          if (callback(value, key, object)) {
	            result[key] = value;
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * An alternative to `_.reduce` this method transforms `object` to a new
	     * `accumulator` object which is the result of running each of its own
	     * enumerable properties through a callback, with each callback execution
	     * potentially mutating the `accumulator` object. The callback is bound to
	     * `thisArg` and invoked with four arguments; (accumulator, value, key, object).
	     * Callbacks may exit iteration early by explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Array|Object} object The object to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [accumulator] The custom accumulator value.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * var squares = _.transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(result, num) {
	     *   num *= num;
	     *   if (num % 2) {
	     *     return result.push(num) < 3;
	     *   }
	     * });
	     * // => [1, 9, 25]
	     *
	     * var mapped = _.transform({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
	     *   result[key] = num * 3;
	     * });
	     * // => { 'a': 3, 'b': 6, 'c': 9 }
	     */
	    function transform(object, callback, accumulator, thisArg) {
	      var isArr = isArray(object);
	      if (accumulator == null) {
	        if (isArr) {
	          accumulator = [];
	        } else {
	          var ctor = object && object.constructor,
	              proto = ctor && ctor.prototype;

	          accumulator = baseCreate(proto);
	        }
	      }
	      if (callback) {
	        callback = lodash.createCallback(callback, thisArg, 4);
	        (isArr ? baseEach : forOwn)(object, function(value, index, object) {
	          return callback(accumulator, value, index, object);
	        });
	      }
	      return accumulator;
	    }

	    /**
	     * Creates an array composed of the own enumerable property values of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Objects
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns an array of property values.
	     * @example
	     *
	     * _.values({ 'one': 1, 'two': 2, 'three': 3 });
	     * // => [1, 2, 3] (property order is not guaranteed across environments)
	     */
	    function values(object) {
	      var index = -1,
	          props = keys(object),
	          length = props.length,
	          result = Array(length);

	      while (++index < length) {
	        result[index] = object[props[index]];
	      }
	      return result;
	    }

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates an array of elements from the specified indexes, or keys, of the
	     * `collection`. Indexes may be specified as individual arguments or as arrays
	     * of indexes.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {...(number|number[]|string|string[])} [index] The indexes of `collection`
	     *   to retrieve, specified as individual indexes or arrays of indexes.
	     * @returns {Array} Returns a new array of elements corresponding to the
	     *  provided indexes.
	     * @example
	     *
	     * _.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
	     * // => ['a', 'c', 'e']
	     *
	     * _.at(['fred', 'barney', 'pebbles'], 0, 2);
	     * // => ['fred', 'pebbles']
	     */
	    function at(collection) {
	      var args = arguments,
	          index = -1,
	          props = baseFlatten(args, true, false, 1),
	          length = (args[2] && args[2][args[1]] === collection) ? 1 : props.length,
	          result = Array(length);

	      if (support.unindexedChars && isString(collection)) {
	        collection = collection.split('');
	      }
	      while(++index < length) {
	        result[index] = collection[props[index]];
	      }
	      return result;
	    }

	    /**
	     * Checks if a given value is present in a collection using strict equality
	     * for comparisons, i.e. `===`. If `fromIndex` is negative, it is used as the
	     * offset from the end of the collection.
	     *
	     * @static
	     * @memberOf _
	     * @alias include
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {*} target The value to check for.
	     * @param {number} [fromIndex=0] The index to search from.
	     * @returns {boolean} Returns `true` if the `target` element is found, else `false`.
	     * @example
	     *
	     * _.contains([1, 2, 3], 1);
	     * // => true
	     *
	     * _.contains([1, 2, 3], 1, 2);
	     * // => false
	     *
	     * _.contains({ 'name': 'fred', 'age': 40 }, 'fred');
	     * // => true
	     *
	     * _.contains('pebbles', 'eb');
	     * // => true
	     */
	    function contains(collection, target, fromIndex) {
	      var index = -1,
	          indexOf = getIndexOf(),
	          length = collection ? collection.length : 0,
	          result = false;

	      fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
	      if (isArray(collection)) {
	        result = indexOf(collection, target, fromIndex) > -1;
	      } else if (typeof length == 'number') {
	        result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
	      } else {
	        baseEach(collection, function(value) {
	          if (++index >= fromIndex) {
	            return !(result = value === target);
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of `collection` through the callback. The corresponding value
	     * of each key is the number of times the key was returned by the callback.
	     * The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
	     * // => { '4': 1, '6': 2 }
	     *
	     * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
	     * // => { '4': 1, '6': 2 }
	     *
	     * _.countBy(['one', 'two', 'three'], 'length');
	     * // => { '3': 2, '5': 1 }
	     */
	    var countBy = createAggregator(function(result, value, key) {
	      (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
	    });

	    /**
	     * Checks if the given callback returns truey value for **all** elements of
	     * a collection. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias all
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {boolean} Returns `true` if all elements passed the callback check,
	     *  else `false`.
	     * @example
	     *
	     * _.every([true, 1, null, 'yes']);
	     * // => false
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.every(characters, 'age');
	     * // => true
	     *
	     * // using "_.where" callback shorthand
	     * _.every(characters, { 'age': 36 });
	     * // => false
	     */
	    function every(collection, callback, thisArg) {
	      var result = true;
	      callback = lodash.createCallback(callback, thisArg, 3);

	      if (isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          if (!(result = !!callback(collection[index], index, collection))) {
	            break;
	          }
	        }
	      } else {
	        baseEach(collection, function(value, index, collection) {
	          return (result = !!callback(value, index, collection));
	        });
	      }
	      return result;
	    }

	    /**
	     * Iterates over elements of a collection, returning an array of all elements
	     * the callback returns truey for. The callback is bound to `thisArg` and
	     * invoked with three arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias select
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new array of elements that passed the callback check.
	     * @example
	     *
	     * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
	     * // => [2, 4, 6]
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36, 'blocked': false },
	     *   { 'name': 'fred',   'age': 40, 'blocked': true }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.filter(characters, 'blocked');
	     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
	     *
	     * // using "_.where" callback shorthand
	     * _.filter(characters, { 'age': 36 });
	     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
	     */
	    function filter(collection, callback, thisArg) {
	      var result = [];
	      callback = lodash.createCallback(callback, thisArg, 3);

	      if (isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          var value = collection[index];
	          if (callback(value, index, collection)) {
	            result.push(value);
	          }
	        }
	      } else {
	        baseEach(collection, function(value, index, collection) {
	          if (callback(value, index, collection)) {
	            result.push(value);
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * Iterates over elements of a collection, returning the first element that
	     * the callback returns truey for. The callback is bound to `thisArg` and
	     * invoked with three arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias detect, findWhere
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the found element, else `undefined`.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'age': 36, 'blocked': false },
	     *   { 'name': 'fred',    'age': 40, 'blocked': true },
	     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
	     * ];
	     *
	     * _.find(characters, function(chr) {
	     *   return chr.age < 40;
	     * });
	     * // => { 'name': 'barney', 'age': 36, 'blocked': false }
	     *
	     * // using "_.where" callback shorthand
	     * _.find(characters, { 'age': 1 });
	     * // =>  { 'name': 'pebbles', 'age': 1, 'blocked': false }
	     *
	     * // using "_.pluck" callback shorthand
	     * _.find(characters, 'blocked');
	     * // => { 'name': 'fred', 'age': 40, 'blocked': true }
	     */
	    function find(collection, callback, thisArg) {
	      callback = lodash.createCallback(callback, thisArg, 3);

	      if (isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          var value = collection[index];
	          if (callback(value, index, collection)) {
	            return value;
	          }
	        }
	      } else {
	        var result;
	        baseEach(collection, function(value, index, collection) {
	          if (callback(value, index, collection)) {
	            result = value;
	            return false;
	          }
	        });
	        return result;
	      }
	    }

	    /**
	     * This method is like `_.find` except that it iterates over elements
	     * of a `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the found element, else `undefined`.
	     * @example
	     *
	     * _.findLast([1, 2, 3, 4], function(num) {
	     *   return num % 2 == 1;
	     * });
	     * // => 3
	     */
	    function findLast(collection, callback, thisArg) {
	      var result;
	      callback = lodash.createCallback(callback, thisArg, 3);
	      forEachRight(collection, function(value, index, collection) {
	        if (callback(value, index, collection)) {
	          result = value;
	          return false;
	        }
	      });
	      return result;
	    }

	    /**
	     * Iterates over elements of a collection, executing the callback for each
	     * element. The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, index|key, collection). Callbacks may exit iteration early by
	     * explicitly returning `false`.
	     *
	     * Note: As with other "Collections" methods, objects with a `length` property
	     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
	     * may be used for object iteration.
	     *
	     * @static
	     * @memberOf _
	     * @alias each
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array|Object|string} Returns `collection`.
	     * @example
	     *
	     * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
	     * // => logs each number and returns '1,2,3'
	     *
	     * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
	     * // => logs each number and returns the object (property order is not guaranteed across environments)
	     */
	    function forEach(collection, callback, thisArg) {
	      if (callback && typeof thisArg == 'undefined' && isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          if (callback(collection[index], index, collection) === false) {
	            break;
	          }
	        }
	      } else {
	        baseEach(collection, callback, thisArg);
	      }
	      return collection;
	    }

	    /**
	     * This method is like `_.forEach` except that it iterates over elements
	     * of a `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @alias eachRight
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array|Object|string} Returns `collection`.
	     * @example
	     *
	     * _([1, 2, 3]).forEachRight(function(num) { console.log(num); }).join(',');
	     * // => logs each number from right to left and returns '3,2,1'
	     */
	    function forEachRight(collection, callback, thisArg) {
	      var iterable = collection,
	          length = collection ? collection.length : 0;

	      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
	      if (isArray(collection)) {
	        while (length--) {
	          if (callback(collection[length], length, collection) === false) {
	            break;
	          }
	        }
	      } else {
	        if (typeof length != 'number') {
	          var props = keys(collection);
	          length = props.length;
	        } else if (support.unindexedChars && isString(collection)) {
	          iterable = collection.split('');
	        }
	        baseEach(collection, function(value, key, collection) {
	          key = props ? props[--length] : --length;
	          return callback(iterable[key], key, collection);
	        });
	      }
	      return collection;
	    }

	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of a collection through the callback. The corresponding value
	     * of each key is an array of the elements responsible for generating the key.
	     * The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
	     * // => { '4': [4.2], '6': [6.1, 6.4] }
	     *
	     * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
	     * // => { '4': [4.2], '6': [6.1, 6.4] }
	     *
	     * // using "_.pluck" callback shorthand
	     * _.groupBy(['one', 'two', 'three'], 'length');
	     * // => { '3': ['one', 'two'], '5': ['three'] }
	     */
	    var groupBy = createAggregator(function(result, value, key) {
	      (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
	    });

	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of the collection through the given callback. The corresponding
	     * value of each key is the last element responsible for generating the key.
	     * The callback is bound to `thisArg` and invoked with three arguments;
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * var keys = [
	     *   { 'dir': 'left', 'code': 97 },
	     *   { 'dir': 'right', 'code': 100 }
	     * ];
	     *
	     * _.indexBy(keys, 'dir');
	     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
	     *
	     * _.indexBy(keys, function(key) { return String.fromCharCode(key.code); });
	     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
	     *
	     * _.indexBy(characters, function(key) { this.fromCharCode(key.code); }, String);
	     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
	     */
	    var indexBy = createAggregator(function(result, value, key) {
	      result[key] = value;
	    });

	    /**
	     * Invokes the method named by `methodName` on each element in the `collection`
	     * returning an array of the results of each invoked method. Additional arguments
	     * will be provided to each invoked method. If `methodName` is a function it
	     * will be invoked for, and `this` bound to, each element in the `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|string} methodName The name of the method to invoke or
	     *  the function invoked per iteration.
	     * @param {...*} [arg] Arguments to invoke the method with.
	     * @returns {Array} Returns a new array of the results of each invoked method.
	     * @example
	     *
	     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
	     * // => [[1, 5, 7], [1, 2, 3]]
	     *
	     * _.invoke([123, 456], String.prototype.split, '');
	     * // => [['1', '2', '3'], ['4', '5', '6']]
	     */
	    function invoke(collection, methodName) {
	      var args = slice(arguments, 2),
	          index = -1,
	          isFunc = typeof methodName == 'function',
	          length = collection ? collection.length : 0,
	          result = Array(typeof length == 'number' ? length : 0);

	      forEach(collection, function(value) {
	        result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
	      });
	      return result;
	    }

	    /**
	     * Creates an array of values by running each element in the collection
	     * through the callback. The callback is bound to `thisArg` and invoked with
	     * three arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias collect
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new array of the results of each `callback` execution.
	     * @example
	     *
	     * _.map([1, 2, 3], function(num) { return num * 3; });
	     * // => [3, 6, 9]
	     *
	     * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
	     * // => [3, 6, 9] (property order is not guaranteed across environments)
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.map(characters, 'name');
	     * // => ['barney', 'fred']
	     */
	    function map(collection, callback, thisArg) {
	      var index = -1,
	          length = collection ? collection.length : 0,
	          result = Array(typeof length == 'number' ? length : 0);

	      callback = lodash.createCallback(callback, thisArg, 3);
	      if (isArray(collection)) {
	        while (++index < length) {
	          result[index] = callback(collection[index], index, collection);
	        }
	      } else {
	        baseEach(collection, function(value, key, collection) {
	          result[++index] = callback(value, key, collection);
	        });
	      }
	      return result;
	    }

	    /**
	     * Retrieves the maximum value of a collection. If the collection is empty or
	     * falsey `-Infinity` is returned. If a callback is provided it will be executed
	     * for each value in the collection to generate the criterion by which the value
	     * is ranked. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, index, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the maximum value.
	     * @example
	     *
	     * _.max([4, 2, 8, 6]);
	     * // => 8
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * _.max(characters, function(chr) { return chr.age; });
	     * // => { 'name': 'fred', 'age': 40 };
	     *
	     * // using "_.pluck" callback shorthand
	     * _.max(characters, 'age');
	     * // => { 'name': 'fred', 'age': 40 };
	     */
	    function max(collection, callback, thisArg) {
	      var computed = -Infinity,
	          result = computed;

	      // allows working with functions like `_.map` without using
	      // their `index` argument as a callback
	      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
	        callback = null;
	      }
	      if (callback == null && isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          var value = collection[index];
	          if (value > result) {
	            result = value;
	          }
	        }
	      } else {
	        callback = (callback == null && isString(collection))
	          ? charAtCallback
	          : lodash.createCallback(callback, thisArg, 3);

	        baseEach(collection, function(value, index, collection) {
	          var current = callback(value, index, collection);
	          if (current > computed) {
	            computed = current;
	            result = value;
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * Retrieves the minimum value of a collection. If the collection is empty or
	     * falsey `Infinity` is returned. If a callback is provided it will be executed
	     * for each value in the collection to generate the criterion by which the value
	     * is ranked. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, index, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the minimum value.
	     * @example
	     *
	     * _.min([4, 2, 8, 6]);
	     * // => 2
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * _.min(characters, function(chr) { return chr.age; });
	     * // => { 'name': 'barney', 'age': 36 };
	     *
	     * // using "_.pluck" callback shorthand
	     * _.min(characters, 'age');
	     * // => { 'name': 'barney', 'age': 36 };
	     */
	    function min(collection, callback, thisArg) {
	      var computed = Infinity,
	          result = computed;

	      // allows working with functions like `_.map` without using
	      // their `index` argument as a callback
	      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
	        callback = null;
	      }
	      if (callback == null && isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          var value = collection[index];
	          if (value < result) {
	            result = value;
	          }
	        }
	      } else {
	        callback = (callback == null && isString(collection))
	          ? charAtCallback
	          : lodash.createCallback(callback, thisArg, 3);

	        baseEach(collection, function(value, index, collection) {
	          var current = callback(value, index, collection);
	          if (current < computed) {
	            computed = current;
	            result = value;
	          }
	        });
	      }
	      return result;
	    }

	    /**
	     * Retrieves the value of a specified property from all elements in the collection.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {string} property The name of the property to pluck.
	     * @returns {Array} Returns a new array of property values.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * _.pluck(characters, 'name');
	     * // => ['barney', 'fred']
	     */
	    var pluck = map;

	    /**
	     * Reduces a collection to a value which is the accumulated result of running
	     * each element in the collection through the callback, where each successive
	     * callback execution consumes the return value of the previous execution. If
	     * `accumulator` is not provided the first element of the collection will be
	     * used as the initial `accumulator` value. The callback is bound to `thisArg`
	     * and invoked with four arguments; (accumulator, value, index|key, collection).
	     *
	     * @static
	     * @memberOf _
	     * @alias foldl, inject
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [accumulator] Initial value of the accumulator.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * var sum = _.reduce([1, 2, 3], function(sum, num) {
	     *   return sum + num;
	     * });
	     * // => 6
	     *
	     * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
	     *   result[key] = num * 3;
	     *   return result;
	     * }, {});
	     * // => { 'a': 3, 'b': 6, 'c': 9 }
	     */
	    function reduce(collection, callback, accumulator, thisArg) {
	      var noaccum = arguments.length < 3;
	      callback = lodash.createCallback(callback, thisArg, 4);

	      if (isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        if (noaccum) {
	          accumulator = collection[++index];
	        }
	        while (++index < length) {
	          accumulator = callback(accumulator, collection[index], index, collection);
	        }
	      } else {
	        baseEach(collection, function(value, index, collection) {
	          accumulator = noaccum
	            ? (noaccum = false, value)
	            : callback(accumulator, value, index, collection)
	        });
	      }
	      return accumulator;
	    }

	    /**
	     * This method is like `_.reduce` except that it iterates over elements
	     * of a `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @alias foldr
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [callback=identity] The function called per iteration.
	     * @param {*} [accumulator] Initial value of the accumulator.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * var list = [[0, 1], [2, 3], [4, 5]];
	     * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
	     * // => [4, 5, 2, 3, 0, 1]
	     */
	    function reduceRight(collection, callback, accumulator, thisArg) {
	      var noaccum = arguments.length < 3;
	      callback = lodash.createCallback(callback, thisArg, 4);
	      forEachRight(collection, function(value, index, collection) {
	        accumulator = noaccum
	          ? (noaccum = false, value)
	          : callback(accumulator, value, index, collection);
	      });
	      return accumulator;
	    }

	    /**
	     * The opposite of `_.filter` this method returns the elements of a
	     * collection that the callback does **not** return truey for.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new array of elements that failed the callback check.
	     * @example
	     *
	     * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
	     * // => [1, 3, 5]
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36, 'blocked': false },
	     *   { 'name': 'fred',   'age': 40, 'blocked': true }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.reject(characters, 'blocked');
	     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
	     *
	     * // using "_.where" callback shorthand
	     * _.reject(characters, { 'age': 36 });
	     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
	     */
	    function reject(collection, callback, thisArg) {
	      callback = lodash.createCallback(callback, thisArg, 3);
	      return filter(collection, function(value, index, collection) {
	        return !callback(value, index, collection);
	      });
	    }

	    /**
	     * Retrieves a random element or `n` random elements from a collection.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to sample.
	     * @param {number} [n] The number of elements to sample.
	     * @param- {Object} [guard] Allows working with functions like `_.map`
	     *  without using their `index` arguments as `n`.
	     * @returns {Array} Returns the random sample(s) of `collection`.
	     * @example
	     *
	     * _.sample([1, 2, 3, 4]);
	     * // => 2
	     *
	     * _.sample([1, 2, 3, 4], 2);
	     * // => [3, 1]
	     */
	    function sample(collection, n, guard) {
	      if (collection && typeof collection.length != 'number') {
	        collection = values(collection);
	      } else if (support.unindexedChars && isString(collection)) {
	        collection = collection.split('');
	      }
	      if (n == null || guard) {
	        return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
	      }
	      var result = shuffle(collection);
	      result.length = nativeMin(nativeMax(0, n), result.length);
	      return result;
	    }

	    /**
	     * Creates an array of shuffled values, using a version of the Fisher-Yates
	     * shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to shuffle.
	     * @returns {Array} Returns a new shuffled collection.
	     * @example
	     *
	     * _.shuffle([1, 2, 3, 4, 5, 6]);
	     * // => [4, 1, 6, 3, 5, 2]
	     */
	    function shuffle(collection) {
	      var index = -1,
	          length = collection ? collection.length : 0,
	          result = Array(typeof length == 'number' ? length : 0);

	      forEach(collection, function(value) {
	        var rand = baseRandom(0, ++index);
	        result[index] = result[rand];
	        result[rand] = value;
	      });
	      return result;
	    }

	    /**
	     * Gets the size of the `collection` by returning `collection.length` for arrays
	     * and array-like objects or the number of own enumerable properties for objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to inspect.
	     * @returns {number} Returns `collection.length` or number of own enumerable properties.
	     * @example
	     *
	     * _.size([1, 2]);
	     * // => 2
	     *
	     * _.size({ 'one': 1, 'two': 2, 'three': 3 });
	     * // => 3
	     *
	     * _.size('pebbles');
	     * // => 7
	     */
	    function size(collection) {
	      var length = collection ? collection.length : 0;
	      return typeof length == 'number' ? length : keys(collection).length;
	    }

	    /**
	     * Checks if the callback returns a truey value for **any** element of a
	     * collection. The function returns as soon as it finds a passing value and
	     * does not iterate over the entire collection. The callback is bound to
	     * `thisArg` and invoked with three arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias any
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {boolean} Returns `true` if any element passed the callback check,
	     *  else `false`.
	     * @example
	     *
	     * _.some([null, 0, 'yes', false], Boolean);
	     * // => true
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36, 'blocked': false },
	     *   { 'name': 'fred',   'age': 40, 'blocked': true }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.some(characters, 'blocked');
	     * // => true
	     *
	     * // using "_.where" callback shorthand
	     * _.some(characters, { 'age': 1 });
	     * // => false
	     */
	    function some(collection, callback, thisArg) {
	      var result;
	      callback = lodash.createCallback(callback, thisArg, 3);

	      if (isArray(collection)) {
	        var index = -1,
	            length = collection.length;

	        while (++index < length) {
	          if ((result = callback(collection[index], index, collection))) {
	            break;
	          }
	        }
	      } else {
	        baseEach(collection, function(value, index, collection) {
	          return !(result = callback(value, index, collection));
	        });
	      }
	      return !!result;
	    }

	    /**
	     * Creates an array of elements, sorted in ascending order by the results of
	     * running each element in a collection through the callback. This method
	     * performs a stable sort, that is, it will preserve the original sort order
	     * of equal elements. The callback is bound to `thisArg` and invoked with
	     * three arguments; (value, index|key, collection).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an array of property names is provided for `callback` the collection
	     * will be sorted by each property value.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Array|Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new array of sorted elements.
	     * @example
	     *
	     * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
	     * // => [3, 1, 2]
	     *
	     * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
	     * // => [3, 1, 2]
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'age': 36 },
	     *   { 'name': 'fred',    'age': 40 },
	     *   { 'name': 'barney',  'age': 26 },
	     *   { 'name': 'fred',    'age': 30 }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.map(_.sortBy(characters, 'age'), _.values);
	     * // => [['barney', 26], ['fred', 30], ['barney', 36], ['fred', 40]]
	     *
	     * // sorting by multiple properties
	     * _.map(_.sortBy(characters, ['name', 'age']), _.values);
	     * // = > [['barney', 26], ['barney', 36], ['fred', 30], ['fred', 40]]
	     */
	    function sortBy(collection, callback, thisArg) {
	      var index = -1,
	          isArr = isArray(callback),
	          length = collection ? collection.length : 0,
	          result = Array(typeof length == 'number' ? length : 0);

	      if (!isArr) {
	        callback = lodash.createCallback(callback, thisArg, 3);
	      }
	      forEach(collection, function(value, key, collection) {
	        var object = result[++index] = getObject();
	        if (isArr) {
	          object.criteria = map(callback, function(key) { return value[key]; });
	        } else {
	          (object.criteria = getArray())[0] = callback(value, key, collection);
	        }
	        object.index = index;
	        object.value = value;
	      });

	      length = result.length;
	      result.sort(compareAscending);
	      while (length--) {
	        var object = result[length];
	        result[length] = object.value;
	        if (!isArr) {
	          releaseArray(object.criteria);
	        }
	        releaseObject(object);
	      }
	      return result;
	    }

	    /**
	     * Converts the `collection` to an array.
	     *
	     * @static
	     * @memberOf _
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to convert.
	     * @returns {Array} Returns the new converted array.
	     * @example
	     *
	     * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
	     * // => [2, 3, 4]
	     */
	    function toArray(collection) {
	      if (collection && typeof collection.length == 'number') {
	        return (support.unindexedChars && isString(collection))
	          ? collection.split('')
	          : slice(collection);
	      }
	      return values(collection);
	    }

	    /**
	     * Performs a deep comparison of each element in a `collection` to the given
	     * `properties` object, returning an array of all elements that have equivalent
	     * property values.
	     *
	     * @static
	     * @memberOf _
	     * @type Function
	     * @category Collections
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Object} props The object of property values to filter by.
	     * @returns {Array} Returns a new array of elements that have the given properties.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36, 'pets': ['hoppy'] },
	     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
	     * ];
	     *
	     * _.where(characters, { 'age': 36 });
	     * // => [{ 'name': 'barney', 'age': 36, 'pets': ['hoppy'] }]
	     *
	     * _.where(characters, { 'pets': ['dino'] });
	     * // => [{ 'name': 'fred', 'age': 40, 'pets': ['baby puss', 'dino'] }]
	     */
	    var where = filter;

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates an array with all falsey values removed. The values `false`, `null`,
	     * `0`, `""`, `undefined`, and `NaN` are all falsey.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to compact.
	     * @returns {Array} Returns a new array of filtered values.
	     * @example
	     *
	     * _.compact([0, 1, false, 2, '', 3]);
	     * // => [1, 2, 3]
	     */
	    function compact(array) {
	      var index = -1,
	          length = array ? array.length : 0,
	          result = [];

	      while (++index < length) {
	        var value = array[index];
	        if (value) {
	          result.push(value);
	        }
	      }
	      return result;
	    }

	    /**
	     * Creates an array excluding all values of the provided arrays using strict
	     * equality for comparisons, i.e. `===`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to process.
	     * @param {...Array} [values] The arrays of values to exclude.
	     * @returns {Array} Returns a new array of filtered values.
	     * @example
	     *
	     * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
	     * // => [1, 3, 4]
	     */
	    function difference(array) {
	      return baseDifference(array, baseFlatten(arguments, true, true, 1));
	    }

	    /**
	     * This method is like `_.find` except that it returns the index of the first
	     * element that passes the callback check, instead of the element itself.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to search.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {number} Returns the index of the found element, else `-1`.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'age': 36, 'blocked': false },
	     *   { 'name': 'fred',    'age': 40, 'blocked': true },
	     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
	     * ];
	     *
	     * _.findIndex(characters, function(chr) {
	     *   return chr.age < 20;
	     * });
	     * // => 2
	     *
	     * // using "_.where" callback shorthand
	     * _.findIndex(characters, { 'age': 36 });
	     * // => 0
	     *
	     * // using "_.pluck" callback shorthand
	     * _.findIndex(characters, 'blocked');
	     * // => 1
	     */
	    function findIndex(array, callback, thisArg) {
	      var index = -1,
	          length = array ? array.length : 0;

	      callback = lodash.createCallback(callback, thisArg, 3);
	      while (++index < length) {
	        if (callback(array[index], index, array)) {
	          return index;
	        }
	      }
	      return -1;
	    }

	    /**
	     * This method is like `_.findIndex` except that it iterates over elements
	     * of a `collection` from right to left.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to search.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {number} Returns the index of the found element, else `-1`.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'age': 36, 'blocked': true },
	     *   { 'name': 'fred',    'age': 40, 'blocked': false },
	     *   { 'name': 'pebbles', 'age': 1,  'blocked': true }
	     * ];
	     *
	     * _.findLastIndex(characters, function(chr) {
	     *   return chr.age > 30;
	     * });
	     * // => 1
	     *
	     * // using "_.where" callback shorthand
	     * _.findLastIndex(characters, { 'age': 36 });
	     * // => 0
	     *
	     * // using "_.pluck" callback shorthand
	     * _.findLastIndex(characters, 'blocked');
	     * // => 2
	     */
	    function findLastIndex(array, callback, thisArg) {
	      var length = array ? array.length : 0;
	      callback = lodash.createCallback(callback, thisArg, 3);
	      while (length--) {
	        if (callback(array[length], length, array)) {
	          return length;
	        }
	      }
	      return -1;
	    }

	    /**
	     * Gets the first element or first `n` elements of an array. If a callback
	     * is provided elements at the beginning of the array are returned as long
	     * as the callback returns truey. The callback is bound to `thisArg` and
	     * invoked with three arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias head, take
	     * @category Arrays
	     * @param {Array} array The array to query.
	     * @param {Function|Object|number|string} [callback] The function called
	     *  per element or the number of elements to return. If a property name or
	     *  object is provided it will be used to create a "_.pluck" or "_.where"
	     *  style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the first element(s) of `array`.
	     * @example
	     *
	     * _.first([1, 2, 3]);
	     * // => 1
	     *
	     * _.first([1, 2, 3], 2);
	     * // => [1, 2]
	     *
	     * _.first([1, 2, 3], function(num) {
	     *   return num < 3;
	     * });
	     * // => [1, 2]
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
	     *   { 'name': 'fred',    'blocked': false, 'employer': 'slate' },
	     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.first(characters, 'blocked');
	     * // => [{ 'name': 'barney', 'blocked': true, 'employer': 'slate' }]
	     *
	     * // using "_.where" callback shorthand
	     * _.pluck(_.first(characters, { 'employer': 'slate' }), 'name');
	     * // => ['barney', 'fred']
	     */
	    function first(array, callback, thisArg) {
	      var n = 0,
	          length = array ? array.length : 0;

	      if (typeof callback != 'number' && callback != null) {
	        var index = -1;
	        callback = lodash.createCallback(callback, thisArg, 3);
	        while (++index < length && callback(array[index], index, array)) {
	          n++;
	        }
	      } else {
	        n = callback;
	        if (n == null || thisArg) {
	          return array ? array[0] : undefined;
	        }
	      }
	      return slice(array, 0, nativeMin(nativeMax(0, n), length));
	    }

	    /**
	     * Flattens a nested array (the nesting can be to any depth). If `isShallow`
	     * is truey, the array will only be flattened a single level. If a callback
	     * is provided each element of the array is passed through the callback before
	     * flattening. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to flatten.
	     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new flattened array.
	     * @example
	     *
	     * _.flatten([1, [2], [3, [[4]]]]);
	     * // => [1, 2, 3, 4];
	     *
	     * _.flatten([1, [2], [3, [[4]]]], true);
	     * // => [1, 2, 3, [[4]]];
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 30, 'pets': ['hoppy'] },
	     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.flatten(characters, 'pets');
	     * // => ['hoppy', 'baby puss', 'dino']
	     */
	    function flatten(array, isShallow, callback, thisArg) {
	      // juggle arguments
	      if (typeof isShallow != 'boolean' && isShallow != null) {
	        thisArg = callback;
	        callback = (typeof isShallow != 'function' && thisArg && thisArg[isShallow] === array) ? null : isShallow;
	        isShallow = false;
	      }
	      if (callback != null) {
	        array = map(array, callback, thisArg);
	      }
	      return baseFlatten(array, isShallow);
	    }

	    /**
	     * Gets the index at which the first occurrence of `value` is found using
	     * strict equality for comparisons, i.e. `===`. If the array is already sorted
	     * providing `true` for `fromIndex` will run a faster binary search.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
	     *  to perform a binary search on a sorted array.
	     * @returns {number} Returns the index of the matched value or `-1`.
	     * @example
	     *
	     * _.indexOf([1, 2, 3, 1, 2, 3], 2);
	     * // => 1
	     *
	     * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
	     * // => 4
	     *
	     * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
	     * // => 2
	     */
	    function indexOf(array, value, fromIndex) {
	      if (typeof fromIndex == 'number') {
	        var length = array ? array.length : 0;
	        fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0);
	      } else if (fromIndex) {
	        var index = sortedIndex(array, value);
	        return array[index] === value ? index : -1;
	      }
	      return baseIndexOf(array, value, fromIndex);
	    }

	    /**
	     * Gets all but the last element or last `n` elements of an array. If a
	     * callback is provided elements at the end of the array are excluded from
	     * the result as long as the callback returns truey. The callback is bound
	     * to `thisArg` and invoked with three arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to query.
	     * @param {Function|Object|number|string} [callback=1] The function called
	     *  per element or the number of elements to exclude. If a property name or
	     *  object is provided it will be used to create a "_.pluck" or "_.where"
	     *  style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a slice of `array`.
	     * @example
	     *
	     * _.initial([1, 2, 3]);
	     * // => [1, 2]
	     *
	     * _.initial([1, 2, 3], 2);
	     * // => [1]
	     *
	     * _.initial([1, 2, 3], function(num) {
	     *   return num > 1;
	     * });
	     * // => [1]
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
	     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
	     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.initial(characters, 'blocked');
	     * // => [{ 'name': 'barney',  'blocked': false, 'employer': 'slate' }]
	     *
	     * // using "_.where" callback shorthand
	     * _.pluck(_.initial(characters, { 'employer': 'na' }), 'name');
	     * // => ['barney', 'fred']
	     */
	    function initial(array, callback, thisArg) {
	      var n = 0,
	          length = array ? array.length : 0;

	      if (typeof callback != 'number' && callback != null) {
	        var index = length;
	        callback = lodash.createCallback(callback, thisArg, 3);
	        while (index-- && callback(array[index], index, array)) {
	          n++;
	        }
	      } else {
	        n = (callback == null || thisArg) ? 1 : callback || n;
	      }
	      return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
	    }

	    /**
	     * Creates an array of unique values present in all provided arrays using
	     * strict equality for comparisons, i.e. `===`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {...Array} [array] The arrays to inspect.
	     * @returns {Array} Returns an array of shared values.
	     * @example
	     *
	     * _.intersection([1, 2, 3], [5, 2, 1, 4], [2, 1]);
	     * // => [1, 2]
	     */
	    function intersection() {
	      var args = [],
	          argsIndex = -1,
	          argsLength = arguments.length,
	          caches = getArray(),
	          indexOf = getIndexOf(),
	          trustIndexOf = indexOf === baseIndexOf,
	          seen = getArray();

	      while (++argsIndex < argsLength) {
	        var value = arguments[argsIndex];
	        if (isArray(value) || isArguments(value)) {
	          args.push(value);
	          caches.push(trustIndexOf && value.length >= largeArraySize &&
	            createCache(argsIndex ? args[argsIndex] : seen));
	        }
	      }
	      var array = args[0],
	          index = -1,
	          length = array ? array.length : 0,
	          result = [];

	      outer:
	      while (++index < length) {
	        var cache = caches[0];
	        value = array[index];

	        if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
	          argsIndex = argsLength;
	          (cache || seen).push(value);
	          while (--argsIndex) {
	            cache = caches[argsIndex];
	            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
	              continue outer;
	            }
	          }
	          result.push(value);
	        }
	      }
	      while (argsLength--) {
	        cache = caches[argsLength];
	        if (cache) {
	          releaseObject(cache);
	        }
	      }
	      releaseArray(caches);
	      releaseArray(seen);
	      return result;
	    }

	    /**
	     * Gets the last element or last `n` elements of an array. If a callback is
	     * provided elements at the end of the array are returned as long as the
	     * callback returns truey. The callback is bound to `thisArg` and invoked
	     * with three arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to query.
	     * @param {Function|Object|number|string} [callback] The function called
	     *  per element or the number of elements to return. If a property name or
	     *  object is provided it will be used to create a "_.pluck" or "_.where"
	     *  style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {*} Returns the last element(s) of `array`.
	     * @example
	     *
	     * _.last([1, 2, 3]);
	     * // => 3
	     *
	     * _.last([1, 2, 3], 2);
	     * // => [2, 3]
	     *
	     * _.last([1, 2, 3], function(num) {
	     *   return num > 1;
	     * });
	     * // => [2, 3]
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
	     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
	     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.pluck(_.last(characters, 'blocked'), 'name');
	     * // => ['fred', 'pebbles']
	     *
	     * // using "_.where" callback shorthand
	     * _.last(characters, { 'employer': 'na' });
	     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
	     */
	    function last(array, callback, thisArg) {
	      var n = 0,
	          length = array ? array.length : 0;

	      if (typeof callback != 'number' && callback != null) {
	        var index = length;
	        callback = lodash.createCallback(callback, thisArg, 3);
	        while (index-- && callback(array[index], index, array)) {
	          n++;
	        }
	      } else {
	        n = callback;
	        if (n == null || thisArg) {
	          return array ? array[length - 1] : undefined;
	        }
	      }
	      return slice(array, nativeMax(0, length - n));
	    }

	    /**
	     * Gets the index at which the last occurrence of `value` is found using strict
	     * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
	     * as the offset from the end of the collection.
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @param {number} [fromIndex=array.length-1] The index to search from.
	     * @returns {number} Returns the index of the matched value or `-1`.
	     * @example
	     *
	     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
	     * // => 4
	     *
	     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
	     * // => 1
	     */
	    function lastIndexOf(array, value, fromIndex) {
	      var index = array ? array.length : 0;
	      if (typeof fromIndex == 'number') {
	        index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
	      }
	      while (index--) {
	        if (array[index] === value) {
	          return index;
	        }
	      }
	      return -1;
	    }

	    /**
	     * Removes all provided values from the given array using strict equality for
	     * comparisons, i.e. `===`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to modify.
	     * @param {...*} [value] The values to remove.
	     * @returns {Array} Returns `array`.
	     * @example
	     *
	     * var array = [1, 2, 3, 1, 2, 3];
	     * _.pull(array, 2, 3);
	     * console.log(array);
	     * // => [1, 1]
	     */
	    function pull(array) {
	      var args = arguments,
	          argsIndex = 0,
	          argsLength = args.length,
	          length = array ? array.length : 0;

	      while (++argsIndex < argsLength) {
	        var index = -1,
	            value = args[argsIndex];
	        while (++index < length) {
	          if (array[index] === value) {
	            splice.call(array, index--, 1);
	            length--;
	          }
	        }
	      }
	      return array;
	    }

	    /**
	     * Creates an array of numbers (positive and/or negative) progressing from
	     * `start` up to but not including `end`. If `start` is less than `stop` a
	     * zero-length range is created unless a negative `step` is specified.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {number} [start=0] The start of the range.
	     * @param {number} end The end of the range.
	     * @param {number} [step=1] The value to increment or decrement by.
	     * @returns {Array} Returns a new range array.
	     * @example
	     *
	     * _.range(4);
	     * // => [0, 1, 2, 3]
	     *
	     * _.range(1, 5);
	     * // => [1, 2, 3, 4]
	     *
	     * _.range(0, 20, 5);
	     * // => [0, 5, 10, 15]
	     *
	     * _.range(0, -4, -1);
	     * // => [0, -1, -2, -3]
	     *
	     * _.range(1, 4, 0);
	     * // => [1, 1, 1]
	     *
	     * _.range(0);
	     * // => []
	     */
	    function range(start, end, step) {
	      start = +start || 0;
	      step = typeof step == 'number' ? step : (+step || 1);

	      if (end == null) {
	        end = start;
	        start = 0;
	      }
	      // use `Array(length)` so engines like Chakra and V8 avoid slower modes
	      // http://youtu.be/XAqIpGU8ZZk#t=17m25s
	      var index = -1,
	          length = nativeMax(0, ceil((end - start) / (step || 1))),
	          result = Array(length);

	      while (++index < length) {
	        result[index] = start;
	        start += step;
	      }
	      return result;
	    }

	    /**
	     * Removes all elements from an array that the callback returns truey for
	     * and returns an array of removed elements. The callback is bound to `thisArg`
	     * and invoked with three arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to modify.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a new array of removed elements.
	     * @example
	     *
	     * var array = [1, 2, 3, 4, 5, 6];
	     * var evens = _.remove(array, function(num) { return num % 2 == 0; });
	     *
	     * console.log(array);
	     * // => [1, 3, 5]
	     *
	     * console.log(evens);
	     * // => [2, 4, 6]
	     */
	    function remove(array, callback, thisArg) {
	      var index = -1,
	          length = array ? array.length : 0,
	          result = [];

	      callback = lodash.createCallback(callback, thisArg, 3);
	      while (++index < length) {
	        var value = array[index];
	        if (callback(value, index, array)) {
	          result.push(value);
	          splice.call(array, index--, 1);
	          length--;
	        }
	      }
	      return result;
	    }

	    /**
	     * The opposite of `_.initial` this method gets all but the first element or
	     * first `n` elements of an array. If a callback function is provided elements
	     * at the beginning of the array are excluded from the result as long as the
	     * callback returns truey. The callback is bound to `thisArg` and invoked
	     * with three arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias drop, tail
	     * @category Arrays
	     * @param {Array} array The array to query.
	     * @param {Function|Object|number|string} [callback=1] The function called
	     *  per element or the number of elements to exclude. If a property name or
	     *  object is provided it will be used to create a "_.pluck" or "_.where"
	     *  style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a slice of `array`.
	     * @example
	     *
	     * _.rest([1, 2, 3]);
	     * // => [2, 3]
	     *
	     * _.rest([1, 2, 3], 2);
	     * // => [3]
	     *
	     * _.rest([1, 2, 3], function(num) {
	     *   return num < 3;
	     * });
	     * // => [3]
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
	     *   { 'name': 'fred',    'blocked': false,  'employer': 'slate' },
	     *   { 'name': 'pebbles', 'blocked': true, 'employer': 'na' }
	     * ];
	     *
	     * // using "_.pluck" callback shorthand
	     * _.pluck(_.rest(characters, 'blocked'), 'name');
	     * // => ['fred', 'pebbles']
	     *
	     * // using "_.where" callback shorthand
	     * _.rest(characters, { 'employer': 'slate' });
	     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
	     */
	    function rest(array, callback, thisArg) {
	      if (typeof callback != 'number' && callback != null) {
	        var n = 0,
	            index = -1,
	            length = array ? array.length : 0;

	        callback = lodash.createCallback(callback, thisArg, 3);
	        while (++index < length && callback(array[index], index, array)) {
	          n++;
	        }
	      } else {
	        n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
	      }
	      return slice(array, n);
	    }

	    /**
	     * Uses a binary search to determine the smallest index at which a value
	     * should be inserted into a given sorted array in order to maintain the sort
	     * order of the array. If a callback is provided it will be executed for
	     * `value` and each element of `array` to compute their sort ranking. The
	     * callback is bound to `thisArg` and invoked with one argument; (value).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {number} Returns the index at which `value` should be inserted
	     *  into `array`.
	     * @example
	     *
	     * _.sortedIndex([20, 30, 50], 40);
	     * // => 2
	     *
	     * // using "_.pluck" callback shorthand
	     * _.sortedIndex([{ 'x': 20 }, { 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
	     * // => 2
	     *
	     * var dict = {
	     *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'fourty': 40, 'fifty': 50 }
	     * };
	     *
	     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
	     *   return dict.wordToNumber[word];
	     * });
	     * // => 2
	     *
	     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
	     *   return this.wordToNumber[word];
	     * }, dict);
	     * // => 2
	     */
	    function sortedIndex(array, value, callback, thisArg) {
	      var low = 0,
	          high = array ? array.length : low;

	      // explicitly reference `identity` for better inlining in Firefox
	      callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity;
	      value = callback(value);

	      while (low < high) {
	        var mid = (low + high) >>> 1;
	        (callback(array[mid]) < value)
	          ? low = mid + 1
	          : high = mid;
	      }
	      return low;
	    }

	    /**
	     * Creates an array of unique values, in order, of the provided arrays using
	     * strict equality for comparisons, i.e. `===`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {...Array} [array] The arrays to inspect.
	     * @returns {Array} Returns an array of combined values.
	     * @example
	     *
	     * _.union([1, 2, 3], [5, 2, 1, 4], [2, 1]);
	     * // => [1, 2, 3, 5, 4]
	     */
	    function union() {
	      return baseUniq(baseFlatten(arguments, true, true));
	    }

	    /**
	     * Creates a duplicate-value-free version of an array using strict equality
	     * for comparisons, i.e. `===`. If the array is sorted, providing
	     * `true` for `isSorted` will use a faster algorithm. If a callback is provided
	     * each element of `array` is passed through the callback before uniqueness
	     * is computed. The callback is bound to `thisArg` and invoked with three
	     * arguments; (value, index, array).
	     *
	     * If a property name is provided for `callback` the created "_.pluck" style
	     * callback will return the property value of the given element.
	     *
	     * If an object is provided for `callback` the created "_.where" style callback
	     * will return `true` for elements that have the properties of the given object,
	     * else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias unique
	     * @category Arrays
	     * @param {Array} array The array to process.
	     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
	     * @param {Function|Object|string} [callback=identity] The function called
	     *  per iteration. If a property name or object is provided it will be used
	     *  to create a "_.pluck" or "_.where" style callback, respectively.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns a duplicate-value-free array.
	     * @example
	     *
	     * _.uniq([1, 2, 1, 3, 1]);
	     * // => [1, 2, 3]
	     *
	     * _.uniq([1, 1, 2, 2, 3], true);
	     * // => [1, 2, 3]
	     *
	     * _.uniq(['A', 'b', 'C', 'a', 'B', 'c'], function(letter) { return letter.toLowerCase(); });
	     * // => ['A', 'b', 'C']
	     *
	     * _.uniq([1, 2.5, 3, 1.5, 2, 3.5], function(num) { return this.floor(num); }, Math);
	     * // => [1, 2.5, 3]
	     *
	     * // using "_.pluck" callback shorthand
	     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
	     * // => [{ 'x': 1 }, { 'x': 2 }]
	     */
	    function uniq(array, isSorted, callback, thisArg) {
	      // juggle arguments
	      if (typeof isSorted != 'boolean' && isSorted != null) {
	        thisArg = callback;
	        callback = (typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array) ? null : isSorted;
	        isSorted = false;
	      }
	      if (callback != null) {
	        callback = lodash.createCallback(callback, thisArg, 3);
	      }
	      return baseUniq(array, isSorted, callback);
	    }

	    /**
	     * Creates an array excluding all provided values using strict equality for
	     * comparisons, i.e. `===`.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {Array} array The array to filter.
	     * @param {...*} [value] The values to exclude.
	     * @returns {Array} Returns a new array of filtered values.
	     * @example
	     *
	     * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
	     * // => [2, 3, 4]
	     */
	    function without(array) {
	      return baseDifference(array, slice(arguments, 1));
	    }

	    /**
	     * Creates an array that is the symmetric difference of the provided arrays.
	     * See http://en.wikipedia.org/wiki/Symmetric_difference.
	     *
	     * @static
	     * @memberOf _
	     * @category Arrays
	     * @param {...Array} [array] The arrays to inspect.
	     * @returns {Array} Returns an array of values.
	     * @example
	     *
	     * _.xor([1, 2, 3], [5, 2, 1, 4]);
	     * // => [3, 5, 4]
	     *
	     * _.xor([1, 2, 5], [2, 3, 5], [3, 4, 5]);
	     * // => [1, 4, 5]
	     */
	    function xor() {
	      var index = -1,
	          length = arguments.length;

	      while (++index < length) {
	        var array = arguments[index];
	        if (isArray(array) || isArguments(array)) {
	          var result = result
	            ? baseUniq(baseDifference(result, array).concat(baseDifference(array, result)))
	            : array;
	        }
	      }
	      return result || [];
	    }

	    /**
	     * Creates an array of grouped elements, the first of which contains the first
	     * elements of the given arrays, the second of which contains the second
	     * elements of the given arrays, and so on.
	     *
	     * @static
	     * @memberOf _
	     * @alias unzip
	     * @category Arrays
	     * @param {...Array} [array] Arrays to process.
	     * @returns {Array} Returns a new array of grouped elements.
	     * @example
	     *
	     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
	     * // => [['fred', 30, true], ['barney', 40, false]]
	     */
	    function zip() {
	      var array = arguments.length > 1 ? arguments : arguments[0],
	          index = -1,
	          length = array ? max(pluck(array, 'length')) : 0,
	          result = Array(length < 0 ? 0 : length);

	      while (++index < length) {
	        result[index] = pluck(array, index);
	      }
	      return result;
	    }

	    /**
	     * Creates an object composed from arrays of `keys` and `values`. Provide
	     * either a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`
	     * or two arrays, one of `keys` and one of corresponding `values`.
	     *
	     * @static
	     * @memberOf _
	     * @alias object
	     * @category Arrays
	     * @param {Array} keys The array of keys.
	     * @param {Array} [values=[]] The array of values.
	     * @returns {Object} Returns an object composed of the given keys and
	     *  corresponding values.
	     * @example
	     *
	     * _.zipObject(['fred', 'barney'], [30, 40]);
	     * // => { 'fred': 30, 'barney': 40 }
	     */
	    function zipObject(keys, values) {
	      var index = -1,
	          length = keys ? keys.length : 0,
	          result = {};

	      if (!values && length && !isArray(keys[0])) {
	        values = [];
	      }
	      while (++index < length) {
	        var key = keys[index];
	        if (values) {
	          result[key] = values[index];
	        } else if (key) {
	          result[key[0]] = key[1];
	        }
	      }
	      return result;
	    }

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates a function that executes `func`, with  the `this` binding and
	     * arguments of the created function, only after being called `n` times.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {number} n The number of times the function must be called before
	     *  `func` is executed.
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * var saves = ['profile', 'settings'];
	     *
	     * var done = _.after(saves.length, function() {
	     *   console.log('Done saving!');
	     * });
	     *
	     * _.forEach(saves, function(type) {
	     *   asyncSave({ 'type': type, 'complete': done });
	     * });
	     * // => logs 'Done saving!', after all saves have completed
	     */
	    function after(n, func) {
	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      return function() {
	        if (--n < 1) {
	          return func.apply(this, arguments);
	        }
	      };
	    }

	    /**
	     * Creates a function that, when called, invokes `func` with the `this`
	     * binding of `thisArg` and prepends any additional `bind` arguments to those
	     * provided to the bound function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to bind.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {...*} [arg] Arguments to be partially applied.
	     * @returns {Function} Returns the new bound function.
	     * @example
	     *
	     * var func = function(greeting) {
	     *   return greeting + ' ' + this.name;
	     * };
	     *
	     * func = _.bind(func, { 'name': 'fred' }, 'hi');
	     * func();
	     * // => 'hi fred'
	     */
	    function bind(func, thisArg) {
	      return arguments.length > 2
	        ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
	        : createWrapper(func, 1, null, null, thisArg);
	    }

	    /**
	     * Binds methods of an object to the object itself, overwriting the existing
	     * method. Method names may be specified as individual arguments or as arrays
	     * of method names. If no method names are provided all the function properties
	     * of `object` will be bound.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Object} object The object to bind and assign the bound methods to.
	     * @param {...string} [methodName] The object method names to
	     *  bind, specified as individual method names or arrays of method names.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * var view = {
	     *   'label': 'docs',
	     *   'onClick': function() { console.log('clicked ' + this.label); }
	     * };
	     *
	     * _.bindAll(view);
	     * jQuery('#docs').on('click', view.onClick);
	     * // => logs 'clicked docs', when the button is clicked
	     */
	    function bindAll(object) {
	      var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object),
	          index = -1,
	          length = funcs.length;

	      while (++index < length) {
	        var key = funcs[index];
	        object[key] = createWrapper(object[key], 1, null, null, object);
	      }
	      return object;
	    }

	    /**
	     * Creates a function that, when called, invokes the method at `object[key]`
	     * and prepends any additional `bindKey` arguments to those provided to the bound
	     * function. This method differs from `_.bind` by allowing bound functions to
	     * reference methods that will be redefined or don't yet exist.
	     * See http://michaux.ca/articles/lazy-function-definition-pattern.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Object} object The object the method belongs to.
	     * @param {string} key The key of the method.
	     * @param {...*} [arg] Arguments to be partially applied.
	     * @returns {Function} Returns the new bound function.
	     * @example
	     *
	     * var object = {
	     *   'name': 'fred',
	     *   'greet': function(greeting) {
	     *     return greeting + ' ' + this.name;
	     *   }
	     * };
	     *
	     * var func = _.bindKey(object, 'greet', 'hi');
	     * func();
	     * // => 'hi fred'
	     *
	     * object.greet = function(greeting) {
	     *   return greeting + 'ya ' + this.name + '!';
	     * };
	     *
	     * func();
	     * // => 'hiya fred!'
	     */
	    function bindKey(object, key) {
	      return arguments.length > 2
	        ? createWrapper(key, 19, slice(arguments, 2), null, object)
	        : createWrapper(key, 3, null, null, object);
	    }

	    /**
	     * Creates a function that is the composition of the provided functions,
	     * where each function consumes the return value of the function that follows.
	     * For example, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
	     * Each function is executed with the `this` binding of the composed function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {...Function} [func] Functions to compose.
	     * @returns {Function} Returns the new composed function.
	     * @example
	     *
	     * var realNameMap = {
	     *   'pebbles': 'penelope'
	     * };
	     *
	     * var format = function(name) {
	     *   name = realNameMap[name.toLowerCase()] || name;
	     *   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
	     * };
	     *
	     * var greet = function(formatted) {
	     *   return 'Hiya ' + formatted + '!';
	     * };
	     *
	     * var welcome = _.compose(greet, format);
	     * welcome('pebbles');
	     * // => 'Hiya Penelope!'
	     */
	    function compose() {
	      var funcs = arguments,
	          length = funcs.length;

	      while (length--) {
	        if (!isFunction(funcs[length])) {
	          throw new TypeError;
	        }
	      }
	      return function() {
	        var args = arguments,
	            length = funcs.length;

	        while (length--) {
	          args = [funcs[length].apply(this, args)];
	        }
	        return args[0];
	      };
	    }

	    /**
	     * Creates a function which accepts one or more arguments of `func` that when
	     * invoked either executes `func` returning its result, if all `func` arguments
	     * have been provided, or returns a function that accepts one or more of the
	     * remaining `func` arguments, and so on. The arity of `func` can be specified
	     * if `func.length` is not sufficient.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to curry.
	     * @param {number} [arity=func.length] The arity of `func`.
	     * @returns {Function} Returns the new curried function.
	     * @example
	     *
	     * var curried = _.curry(function(a, b, c) {
	     *   console.log(a + b + c);
	     * });
	     *
	     * curried(1)(2)(3);
	     * // => 6
	     *
	     * curried(1, 2)(3);
	     * // => 6
	     *
	     * curried(1, 2, 3);
	     * // => 6
	     */
	    function curry(func, arity) {
	      arity = typeof arity == 'number' ? arity : (+arity || func.length);
	      return createWrapper(func, 4, null, null, null, arity);
	    }

	    /**
	     * Creates a function that will delay the execution of `func` until after
	     * `wait` milliseconds have elapsed since the last time it was invoked.
	     * Provide an options object to indicate that `func` should be invoked on
	     * the leading and/or trailing edge of the `wait` timeout. Subsequent calls
	     * to the debounced function will return the result of the last `func` call.
	     *
	     * Note: If `leading` and `trailing` options are `true` `func` will be called
	     * on the trailing edge of the timeout only if the the debounced function is
	     * invoked more than once during the `wait` timeout.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to debounce.
	     * @param {number} wait The number of milliseconds to delay.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.leading=false] Specify execution on the leading edge of the timeout.
	     * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's called.
	     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
	     * @returns {Function} Returns the new debounced function.
	     * @example
	     *
	     * // avoid costly calculations while the window size is in flux
	     * var lazyLayout = _.debounce(calculateLayout, 150);
	     * jQuery(window).on('resize', lazyLayout);
	     *
	     * // execute `sendMail` when the click event is fired, debouncing subsequent calls
	     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
	     *   'leading': true,
	     *   'trailing': false
	     * });
	     *
	     * // ensure `batchLog` is executed once after 1 second of debounced calls
	     * var source = new EventSource('/stream');
	     * source.addEventListener('message', _.debounce(batchLog, 250, {
	     *   'maxWait': 1000
	     * }, false);
	     */
	    function debounce(func, wait, options) {
	      var args,
	          maxTimeoutId,
	          result,
	          stamp,
	          thisArg,
	          timeoutId,
	          trailingCall,
	          lastCalled = 0,
	          maxWait = false,
	          trailing = true;

	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      wait = nativeMax(0, wait) || 0;
	      if (options === true) {
	        var leading = true;
	        trailing = false;
	      } else if (isObject(options)) {
	        leading = options.leading;
	        maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
	        trailing = 'trailing' in options ? options.trailing : trailing;
	      }
	      var delayed = function() {
	        var remaining = wait - (now() - stamp);
	        if (remaining <= 0) {
	          if (maxTimeoutId) {
	            clearTimeout(maxTimeoutId);
	          }
	          var isCalled = trailingCall;
	          maxTimeoutId = timeoutId = trailingCall = undefined;
	          if (isCalled) {
	            lastCalled = now();
	            result = func.apply(thisArg, args);
	            if (!timeoutId && !maxTimeoutId) {
	              args = thisArg = null;
	            }
	          }
	        } else {
	          timeoutId = setTimeout(delayed, remaining);
	        }
	      };

	      var maxDelayed = function() {
	        if (timeoutId) {
	          clearTimeout(timeoutId);
	        }
	        maxTimeoutId = timeoutId = trailingCall = undefined;
	        if (trailing || (maxWait !== wait)) {
	          lastCalled = now();
	          result = func.apply(thisArg, args);
	          if (!timeoutId && !maxTimeoutId) {
	            args = thisArg = null;
	          }
	        }
	      };

	      return function() {
	        args = arguments;
	        stamp = now();
	        thisArg = this;
	        trailingCall = trailing && (timeoutId || !leading);

	        if (maxWait === false) {
	          var leadingCall = leading && !timeoutId;
	        } else {
	          if (!maxTimeoutId && !leading) {
	            lastCalled = stamp;
	          }
	          var remaining = maxWait - (stamp - lastCalled),
	              isCalled = remaining <= 0;

	          if (isCalled) {
	            if (maxTimeoutId) {
	              maxTimeoutId = clearTimeout(maxTimeoutId);
	            }
	            lastCalled = stamp;
	            result = func.apply(thisArg, args);
	          }
	          else if (!maxTimeoutId) {
	            maxTimeoutId = setTimeout(maxDelayed, remaining);
	          }
	        }
	        if (isCalled && timeoutId) {
	          timeoutId = clearTimeout(timeoutId);
	        }
	        else if (!timeoutId && wait !== maxWait) {
	          timeoutId = setTimeout(delayed, wait);
	        }
	        if (leadingCall) {
	          isCalled = true;
	          result = func.apply(thisArg, args);
	        }
	        if (isCalled && !timeoutId && !maxTimeoutId) {
	          args = thisArg = null;
	        }
	        return result;
	      };
	    }

	    /**
	     * Defers executing the `func` function until the current call stack has cleared.
	     * Additional arguments will be provided to `func` when it is invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to defer.
	     * @param {...*} [arg] Arguments to invoke the function with.
	     * @returns {number} Returns the timer id.
	     * @example
	     *
	     * _.defer(function(text) { console.log(text); }, 'deferred');
	     * // logs 'deferred' after one or more milliseconds
	     */
	    function defer(func) {
	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      var args = slice(arguments, 1);
	      return setTimeout(function() { func.apply(undefined, args); }, 1);
	    }

	    /**
	     * Executes the `func` function after `wait` milliseconds. Additional arguments
	     * will be provided to `func` when it is invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to delay.
	     * @param {number} wait The number of milliseconds to delay execution.
	     * @param {...*} [arg] Arguments to invoke the function with.
	     * @returns {number} Returns the timer id.
	     * @example
	     *
	     * _.delay(function(text) { console.log(text); }, 1000, 'later');
	     * // => logs 'later' after one second
	     */
	    function delay(func, wait) {
	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      var args = slice(arguments, 2);
	      return setTimeout(function() { func.apply(undefined, args); }, wait);
	    }

	    /**
	     * Creates a function that memoizes the result of `func`. If `resolver` is
	     * provided it will be used to determine the cache key for storing the result
	     * based on the arguments provided to the memoized function. By default, the
	     * first argument provided to the memoized function is used as the cache key.
	     * The `func` is executed with the `this` binding of the memoized function.
	     * The result cache is exposed as the `cache` property on the memoized function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to have its output memoized.
	     * @param {Function} [resolver] A function used to resolve the cache key.
	     * @returns {Function} Returns the new memoizing function.
	     * @example
	     *
	     * var fibonacci = _.memoize(function(n) {
	     *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
	     * });
	     *
	     * fibonacci(9)
	     * // => 34
	     *
	     * var data = {
	     *   'fred': { 'name': 'fred', 'age': 40 },
	     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
	     * };
	     *
	     * // modifying the result cache
	     * var get = _.memoize(function(name) { return data[name]; }, _.identity);
	     * get('pebbles');
	     * // => { 'name': 'pebbles', 'age': 1 }
	     *
	     * get.cache.pebbles.name = 'penelope';
	     * get('pebbles');
	     * // => { 'name': 'penelope', 'age': 1 }
	     */
	    function memoize(func, resolver) {
	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      var memoized = function() {
	        var cache = memoized.cache,
	            key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];

	        return hasOwnProperty.call(cache, key)
	          ? cache[key]
	          : (cache[key] = func.apply(this, arguments));
	      }
	      memoized.cache = {};
	      return memoized;
	    }

	    /**
	     * Creates a function that is restricted to execute `func` once. Repeat calls to
	     * the function will return the value of the first call. The `func` is executed
	     * with the `this` binding of the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * var initialize = _.once(createApplication);
	     * initialize();
	     * initialize();
	     * // `initialize` executes `createApplication` once
	     */
	    function once(func) {
	      var ran,
	          result;

	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      return function() {
	        if (ran) {
	          return result;
	        }
	        ran = true;
	        result = func.apply(this, arguments);

	        // clear the `func` variable so the function may be garbage collected
	        func = null;
	        return result;
	      };
	    }

	    /**
	     * Creates a function that, when called, invokes `func` with any additional
	     * `partial` arguments prepended to those provided to the new function. This
	     * method is similar to `_.bind` except it does **not** alter the `this` binding.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to partially apply arguments to.
	     * @param {...*} [arg] Arguments to be partially applied.
	     * @returns {Function} Returns the new partially applied function.
	     * @example
	     *
	     * var greet = function(greeting, name) { return greeting + ' ' + name; };
	     * var hi = _.partial(greet, 'hi');
	     * hi('fred');
	     * // => 'hi fred'
	     */
	    function partial(func) {
	      return createWrapper(func, 16, slice(arguments, 1));
	    }

	    /**
	     * This method is like `_.partial` except that `partial` arguments are
	     * appended to those provided to the new function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to partially apply arguments to.
	     * @param {...*} [arg] Arguments to be partially applied.
	     * @returns {Function} Returns the new partially applied function.
	     * @example
	     *
	     * var defaultsDeep = _.partialRight(_.merge, _.defaults);
	     *
	     * var options = {
	     *   'variable': 'data',
	     *   'imports': { 'jq': $ }
	     * };
	     *
	     * defaultsDeep(options, _.templateSettings);
	     *
	     * options.variable
	     * // => 'data'
	     *
	     * options.imports
	     * // => { '_': _, 'jq': $ }
	     */
	    function partialRight(func) {
	      return createWrapper(func, 32, null, slice(arguments, 1));
	    }

	    /**
	     * Creates a function that, when executed, will only call the `func` function
	     * at most once per every `wait` milliseconds. Provide an options object to
	     * indicate that `func` should be invoked on the leading and/or trailing edge
	     * of the `wait` timeout. Subsequent calls to the throttled function will
	     * return the result of the last `func` call.
	     *
	     * Note: If `leading` and `trailing` options are `true` `func` will be called
	     * on the trailing edge of the timeout only if the the throttled function is
	     * invoked more than once during the `wait` timeout.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {Function} func The function to throttle.
	     * @param {number} wait The number of milliseconds to throttle executions to.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.leading=true] Specify execution on the leading edge of the timeout.
	     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
	     * @returns {Function} Returns the new throttled function.
	     * @example
	     *
	     * // avoid excessively updating the position while scrolling
	     * var throttled = _.throttle(updatePosition, 100);
	     * jQuery(window).on('scroll', throttled);
	     *
	     * // execute `renewToken` when the click event is fired, but not more than once every 5 minutes
	     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
	     *   'trailing': false
	     * }));
	     */
	    function throttle(func, wait, options) {
	      var leading = true,
	          trailing = true;

	      if (!isFunction(func)) {
	        throw new TypeError;
	      }
	      if (options === false) {
	        leading = false;
	      } else if (isObject(options)) {
	        leading = 'leading' in options ? options.leading : leading;
	        trailing = 'trailing' in options ? options.trailing : trailing;
	      }
	      debounceOptions.leading = leading;
	      debounceOptions.maxWait = wait;
	      debounceOptions.trailing = trailing;

	      return debounce(func, wait, debounceOptions);
	    }

	    /**
	     * Creates a function that provides `value` to the wrapper function as its
	     * first argument. Additional arguments provided to the function are appended
	     * to those provided to the wrapper function. The wrapper is executed with
	     * the `this` binding of the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Functions
	     * @param {*} value The value to wrap.
	     * @param {Function} wrapper The wrapper function.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var p = _.wrap(_.escape, function(func, text) {
	     *   return '<p>' + func(text) + '</p>';
	     * });
	     *
	     * p('Fred, Wilma, & Pebbles');
	     * // => '<p>Fred, Wilma, &amp; Pebbles</p>'
	     */
	    function wrap(value, wrapper) {
	      return createWrapper(wrapper, 16, [value]);
	    }

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates a function that returns `value`.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {*} value The value to return from the new function.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var object = { 'name': 'fred' };
	     * var getter = _.constant(object);
	     * getter() === object;
	     * // => true
	     */
	    function constant(value) {
	      return function() {
	        return value;
	      };
	    }

	    /**
	     * Produces a callback bound to an optional `thisArg`. If `func` is a property
	     * name the created callback will return the property value for a given element.
	     * If `func` is an object the created callback will return `true` for elements
	     * that contain the equivalent object properties, otherwise it will return `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {*} [func=identity] The value to convert to a callback.
	     * @param {*} [thisArg] The `this` binding of the created callback.
	     * @param {number} [argCount] The number of arguments the callback accepts.
	     * @returns {Function} Returns a callback function.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * // wrap to create custom callback shorthands
	     * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
	     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
	     *   return !match ? func(callback, thisArg) : function(object) {
	     *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
	     *   };
	     * });
	     *
	     * _.filter(characters, 'age__gt38');
	     * // => [{ 'name': 'fred', 'age': 40 }]
	     */
	    function createCallback(func, thisArg, argCount) {
	      var type = typeof func;
	      if (func == null || type == 'function') {
	        return baseCreateCallback(func, thisArg, argCount);
	      }
	      // handle "_.pluck" style callback shorthands
	      if (type != 'object') {
	        return property(func);
	      }
	      var props = keys(func),
	          key = props[0],
	          a = func[key];

	      // handle "_.where" style callback shorthands
	      if (props.length == 1 && a === a && !isObject(a)) {
	        // fast path the common case of providing an object with a single
	        // property containing a primitive value
	        return function(object) {
	          var b = object[key];
	          return a === b && (a !== 0 || (1 / a == 1 / b));
	        };
	      }
	      return function(object) {
	        var length = props.length,
	            result = false;

	        while (length--) {
	          if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
	            break;
	          }
	        }
	        return result;
	      };
	    }

	    /**
	     * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
	     * corresponding HTML entities.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} string The string to escape.
	     * @returns {string} Returns the escaped string.
	     * @example
	     *
	     * _.escape('Fred, Wilma, & Pebbles');
	     * // => 'Fred, Wilma, &amp; Pebbles'
	     */
	    function escape(string) {
	      return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
	    }

	    /**
	     * This method returns the first argument provided to it.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {*} value Any value.
	     * @returns {*} Returns `value`.
	     * @example
	     *
	     * var object = { 'name': 'fred' };
	     * _.identity(object) === object;
	     * // => true
	     */
	    function identity(value) {
	      return value;
	    }

	    /**
	     * Adds function properties of a source object to the destination object.
	     * If `object` is a function methods will be added to its prototype as well.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {Function|Object} [object=lodash] object The destination object.
	     * @param {Object} source The object of functions to add.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.chain=true] Specify whether the functions added are chainable.
	     * @example
	     *
	     * function capitalize(string) {
	     *   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	     * }
	     *
	     * _.mixin({ 'capitalize': capitalize });
	     * _.capitalize('fred');
	     * // => 'Fred'
	     *
	     * _('fred').capitalize().value();
	     * // => 'Fred'
	     *
	     * _.mixin({ 'capitalize': capitalize }, { 'chain': false });
	     * _('fred').capitalize();
	     * // => 'Fred'
	     */
	    function mixin(object, source, options) {
	      var chain = true,
	          methodNames = source && functions(source);

	      if (!source || (!options && !methodNames.length)) {
	        if (options == null) {
	          options = source;
	        }
	        ctor = lodashWrapper;
	        source = object;
	        object = lodash;
	        methodNames = functions(source);
	      }
	      if (options === false) {
	        chain = false;
	      } else if (isObject(options) && 'chain' in options) {
	        chain = options.chain;
	      }
	      var ctor = object,
	          isFunc = isFunction(ctor);

	      forEach(methodNames, function(methodName) {
	        var func = object[methodName] = source[methodName];
	        if (isFunc) {
	          ctor.prototype[methodName] = function() {
	            var chainAll = this.__chain__,
	                value = this.__wrapped__,
	                args = [value];

	            push.apply(args, arguments);
	            var result = func.apply(object, args);
	            if (chain || chainAll) {
	              if (value === result && isObject(result)) {
	                return this;
	              }
	              result = new ctor(result);
	              result.__chain__ = chainAll;
	            }
	            return result;
	          };
	        }
	      });
	    }

	    /**
	     * Reverts the '_' variable to its previous value and returns a reference to
	     * the `lodash` function.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @returns {Function} Returns the `lodash` function.
	     * @example
	     *
	     * var lodash = _.noConflict();
	     */
	    function noConflict() {
	      context._ = oldDash;
	      return this;
	    }

	    /**
	     * A no-operation function.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @example
	     *
	     * var object = { 'name': 'fred' };
	     * _.noop(object) === undefined;
	     * // => true
	     */
	    function noop() {
	      // no operation performed
	    }

	    /**
	     * Gets the number of milliseconds that have elapsed since the Unix epoch
	     * (1 January 1970 00:00:00 UTC).
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @example
	     *
	     * var stamp = _.now();
	     * _.defer(function() { console.log(_.now() - stamp); });
	     * // => logs the number of milliseconds it took for the deferred function to be called
	     */
	    var now = isNative(now = Date.now) && now || function() {
	      return new Date().getTime();
	    };

	    /**
	     * Converts the given value into an integer of the specified radix.
	     * If `radix` is `undefined` or `0` a `radix` of `10` is used unless the
	     * `value` is a hexadecimal, in which case a `radix` of `16` is used.
	     *
	     * Note: This method avoids differences in native ES3 and ES5 `parseInt`
	     * implementations. See http://es5.github.io/#E.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} value The value to parse.
	     * @param {number} [radix] The radix used to interpret the value to parse.
	     * @returns {number} Returns the new integer value.
	     * @example
	     *
	     * _.parseInt('08');
	     * // => 8
	     */
	    var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function(value, radix) {
	      // Firefox < 21 and Opera < 15 follow the ES3 specified implementation of `parseInt`
	      return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
	    };

	    /**
	     * Creates a "_.pluck" style function, which returns the `key` value of a
	     * given object.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} key The name of the property to retrieve.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'fred',   'age': 40 },
	     *   { 'name': 'barney', 'age': 36 }
	     * ];
	     *
	     * var getName = _.property('name');
	     *
	     * _.map(characters, getName);
	     * // => ['barney', 'fred']
	     *
	     * _.sortBy(characters, getName);
	     * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
	     */
	    function property(key) {
	      return function(object) {
	        return object[key];
	      };
	    }

	    /**
	     * Produces a random number between `min` and `max` (inclusive). If only one
	     * argument is provided a number between `0` and the given number will be
	     * returned. If `floating` is truey or either `min` or `max` are floats a
	     * floating-point number will be returned instead of an integer.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {number} [min=0] The minimum possible value.
	     * @param {number} [max=1] The maximum possible value.
	     * @param {boolean} [floating=false] Specify returning a floating-point number.
	     * @returns {number} Returns a random number.
	     * @example
	     *
	     * _.random(0, 5);
	     * // => an integer between 0 and 5
	     *
	     * _.random(5);
	     * // => also an integer between 0 and 5
	     *
	     * _.random(5, true);
	     * // => a floating-point number between 0 and 5
	     *
	     * _.random(1.2, 5.2);
	     * // => a floating-point number between 1.2 and 5.2
	     */
	    function random(min, max, floating) {
	      var noMin = min == null,
	          noMax = max == null;

	      if (floating == null) {
	        if (typeof min == 'boolean' && noMax) {
	          floating = min;
	          min = 1;
	        }
	        else if (!noMax && typeof max == 'boolean') {
	          floating = max;
	          noMax = true;
	        }
	      }
	      if (noMin && noMax) {
	        max = 1;
	      }
	      min = +min || 0;
	      if (noMax) {
	        max = min;
	        min = 0;
	      } else {
	        max = +max || 0;
	      }
	      if (floating || min % 1 || max % 1) {
	        var rand = nativeRandom();
	        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand +'').length - 1)))), max);
	      }
	      return baseRandom(min, max);
	    }

	    /**
	     * Resolves the value of property `key` on `object`. If `key` is a function
	     * it will be invoked with the `this` binding of `object` and its result returned,
	     * else the property value is returned. If `object` is falsey then `undefined`
	     * is returned.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {Object} object The object to inspect.
	     * @param {string} key The name of the property to resolve.
	     * @returns {*} Returns the resolved value.
	     * @example
	     *
	     * var object = {
	     *   'cheese': 'crumpets',
	     *   'stuff': function() {
	     *     return 'nonsense';
	     *   }
	     * };
	     *
	     * _.result(object, 'cheese');
	     * // => 'crumpets'
	     *
	     * _.result(object, 'stuff');
	     * // => 'nonsense'
	     */
	    function result(object, key) {
	      if (object) {
	        var value = object[key];
	        return isFunction(value) ? object[key]() : value;
	      }
	    }

	    /**
	     * A micro-templating method that handles arbitrary delimiters, preserves
	     * whitespace, and correctly escapes quotes within interpolated code.
	     *
	     * Note: In the development build, `_.template` utilizes sourceURLs for easier
	     * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
	     *
	     * For more information on precompiling templates see:
	     * http://lodash.com/custom-builds
	     *
	     * For more information on Chrome extension sandboxes see:
	     * http://developer.chrome.com/stable/extensions/sandboxingEval.html
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} text The template text.
	     * @param {Object} data The data object used to populate the text.
	     * @param {Object} [options] The options object.
	     * @param {RegExp} [options.escape] The "escape" delimiter.
	     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
	     * @param {Object} [options.imports] An object to import into the template as local variables.
	     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
	     * @param {string} [sourceURL] The sourceURL of the template's compiled source.
	     * @param {string} [variable] The data object variable name.
	     * @returns {Function|string} Returns a compiled function when no `data` object
	     *  is given, else it returns the interpolated text.
	     * @example
	     *
	     * // using the "interpolate" delimiter to create a compiled template
	     * var compiled = _.template('hello <%= name %>');
	     * compiled({ 'name': 'fred' });
	     * // => 'hello fred'
	     *
	     * // using the "escape" delimiter to escape HTML in data property values
	     * _.template('<b><%- value %></b>', { 'value': '<script>' });
	     * // => '<b>&lt;script&gt;</b>'
	     *
	     * // using the "evaluate" delimiter to generate HTML
	     * var list = '<% _.forEach(people, function(name) { %><li><%- name %></li><% }); %>';
	     * _.template(list, { 'people': ['fred', 'barney'] });
	     * // => '<li>fred</li><li>barney</li>'
	     *
	     * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
	     * _.template('hello ${ name }', { 'name': 'pebbles' });
	     * // => 'hello pebbles'
	     *
	     * // using the internal `print` function in "evaluate" delimiters
	     * _.template('<% print("hello " + name); %>!', { 'name': 'barney' });
	     * // => 'hello barney!'
	     *
	     * // using a custom template delimiters
	     * _.templateSettings = {
	     *   'interpolate': /{{([\s\S]+?)}}/g
	     * };
	     *
	     * _.template('hello {{ name }}!', { 'name': 'mustache' });
	     * // => 'hello mustache!'
	     *
	     * // using the `imports` option to import jQuery
	     * var list = '<% jq.each(people, function(name) { %><li><%- name %></li><% }); %>';
	     * _.template(list, { 'people': ['fred', 'barney'] }, { 'imports': { 'jq': jQuery } });
	     * // => '<li>fred</li><li>barney</li>'
	     *
	     * // using the `sourceURL` option to specify a custom sourceURL for the template
	     * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
	     * compiled(data);
	     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
	     *
	     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
	     * var compiled = _.template('hi <%= data.name %>!', null, { 'variable': 'data' });
	     * compiled.source;
	     * // => function(data) {
	     *   var __t, __p = '', __e = _.escape;
	     *   __p += 'hi ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
	     *   return __p;
	     * }
	     *
	     * // using the `source` property to inline compiled templates for meaningful
	     * // line numbers in error messages and a stack trace
	     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
	     *   var JST = {\
	     *     "main": ' + _.template(mainText).source + '\
	     *   };\
	     * ');
	     */
	    function template(text, data, options) {
	      // based on John Resig's `tmpl` implementation
	      // http://ejohn.org/blog/javascript-micro-templating/
	      // and Laura Doktorova's doT.js
	      // https://github.com/olado/doT
	      var settings = lodash.templateSettings;
	      text = String(text || '');

	      // avoid missing dependencies when `iteratorTemplate` is not defined
	      options = defaults({}, options, settings);

	      var imports = defaults({}, options.imports, settings.imports),
	          importsKeys = keys(imports),
	          importsValues = values(imports);

	      var isEvaluating,
	          index = 0,
	          interpolate = options.interpolate || reNoMatch,
	          source = "__p += '";

	      // compile the regexp to match each delimiter
	      var reDelimiters = RegExp(
	        (options.escape || reNoMatch).source + '|' +
	        interpolate.source + '|' +
	        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
	        (options.evaluate || reNoMatch).source + '|$'
	      , 'g');

	      text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
	        interpolateValue || (interpolateValue = esTemplateValue);

	        // escape characters that cannot be included in string literals
	        source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);

	        // replace delimiters with snippets
	        if (escapeValue) {
	          source += "' +\n__e(" + escapeValue + ") +\n'";
	        }
	        if (evaluateValue) {
	          isEvaluating = true;
	          source += "';\n" + evaluateValue + ";\n__p += '";
	        }
	        if (interpolateValue) {
	          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
	        }
	        index = offset + match.length;

	        // the JS engine embedded in Adobe products requires returning the `match`
	        // string in order to produce the correct `offset` value
	        return match;
	      });

	      source += "';\n";

	      // if `variable` is not specified, wrap a with-statement around the generated
	      // code to add the data object to the top of the scope chain
	      var variable = options.variable,
	          hasVariable = variable;

	      if (!hasVariable) {
	        variable = 'obj';
	        source = 'with (' + variable + ') {\n' + source + '\n}\n';
	      }
	      // cleanup code by stripping empty strings
	      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
	        .replace(reEmptyStringMiddle, '$1')
	        .replace(reEmptyStringTrailing, '$1;');

	      // frame code as the function body
	      source = 'function(' + variable + ') {\n' +
	        (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') +
	        "var __t, __p = '', __e = _.escape" +
	        (isEvaluating
	          ? ', __j = Array.prototype.join;\n' +
	            "function print() { __p += __j.call(arguments, '') }\n"
	          : ';\n'
	        ) +
	        source +
	        'return __p\n}';

	      // Use a sourceURL for easier debugging.
	      // http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
	      var sourceURL = '\n/*\n//# sourceURL=' + (options.sourceURL || '/lodash/template/source[' + (templateCounter++) + ']') + '\n*/';

	      try {
	        var result = Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
	      } catch(e) {
	        e.source = source;
	        throw e;
	      }
	      if (data) {
	        return result(data);
	      }
	      // provide the compiled function's source by its `toString` method, in
	      // supported environments, or the `source` property as a convenience for
	      // inlining compiled templates during the build process
	      result.source = source;
	      return result;
	    }

	    /**
	     * Executes the callback `n` times, returning an array of the results
	     * of each callback execution. The callback is bound to `thisArg` and invoked
	     * with one argument; (index).
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {number} n The number of times to execute the callback.
	     * @param {Function} callback The function called per iteration.
	     * @param {*} [thisArg] The `this` binding of `callback`.
	     * @returns {Array} Returns an array of the results of each `callback` execution.
	     * @example
	     *
	     * var diceRolls = _.times(3, _.partial(_.random, 1, 6));
	     * // => [3, 6, 4]
	     *
	     * _.times(3, function(n) { mage.castSpell(n); });
	     * // => calls `mage.castSpell(n)` three times, passing `n` of `0`, `1`, and `2` respectively
	     *
	     * _.times(3, function(n) { this.cast(n); }, mage);
	     * // => also calls `mage.castSpell(n)` three times
	     */
	    function times(n, callback, thisArg) {
	      n = (n = +n) > -1 ? n : 0;
	      var index = -1,
	          result = Array(n);

	      callback = baseCreateCallback(callback, thisArg, 1);
	      while (++index < n) {
	        result[index] = callback(index);
	      }
	      return result;
	    }

	    /**
	     * The inverse of `_.escape` this method converts the HTML entities
	     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their
	     * corresponding characters.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} string The string to unescape.
	     * @returns {string} Returns the unescaped string.
	     * @example
	     *
	     * _.unescape('Fred, Barney &amp; Pebbles');
	     * // => 'Fred, Barney & Pebbles'
	     */
	    function unescape(string) {
	      return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
	    }

	    /**
	     * Generates a unique ID. If `prefix` is provided the ID will be appended to it.
	     *
	     * @static
	     * @memberOf _
	     * @category Utilities
	     * @param {string} [prefix] The value to prefix the ID with.
	     * @returns {string} Returns the unique ID.
	     * @example
	     *
	     * _.uniqueId('contact_');
	     * // => 'contact_104'
	     *
	     * _.uniqueId();
	     * // => '105'
	     */
	    function uniqueId(prefix) {
	      var id = ++idCounter;
	      return String(prefix == null ? '' : prefix) + id;
	    }

	    /*--------------------------------------------------------------------------*/

	    /**
	     * Creates a `lodash` object that wraps the given value with explicit
	     * method chaining enabled.
	     *
	     * @static
	     * @memberOf _
	     * @category Chaining
	     * @param {*} value The value to wrap.
	     * @returns {Object} Returns the wrapper object.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney',  'age': 36 },
	     *   { 'name': 'fred',    'age': 40 },
	     *   { 'name': 'pebbles', 'age': 1 }
	     * ];
	     *
	     * var youngest = _.chain(characters)
	     *     .sortBy('age')
	     *     .map(function(chr) { return chr.name + ' is ' + chr.age; })
	     *     .first()
	     *     .value();
	     * // => 'pebbles is 1'
	     */
	    function chain(value) {
	      value = new lodashWrapper(value);
	      value.__chain__ = true;
	      return value;
	    }

	    /**
	     * Invokes `interceptor` with the `value` as the first argument and then
	     * returns `value`. The purpose of this method is to "tap into" a method
	     * chain in order to perform operations on intermediate results within
	     * the chain.
	     *
	     * @static
	     * @memberOf _
	     * @category Chaining
	     * @param {*} value The value to provide to `interceptor`.
	     * @param {Function} interceptor The function to invoke.
	     * @returns {*} Returns `value`.
	     * @example
	     *
	     * _([1, 2, 3, 4])
	     *  .tap(function(array) { array.pop(); })
	     *  .reverse()
	     *  .value();
	     * // => [3, 2, 1]
	     */
	    function tap(value, interceptor) {
	      interceptor(value);
	      return value;
	    }

	    /**
	     * Enables explicit method chaining on the wrapper object.
	     *
	     * @name chain
	     * @memberOf _
	     * @category Chaining
	     * @returns {*} Returns the wrapper object.
	     * @example
	     *
	     * var characters = [
	     *   { 'name': 'barney', 'age': 36 },
	     *   { 'name': 'fred',   'age': 40 }
	     * ];
	     *
	     * // without explicit chaining
	     * _(characters).first();
	     * // => { 'name': 'barney', 'age': 36 }
	     *
	     * // with explicit chaining
	     * _(characters).chain()
	     *   .first()
	     *   .pick('age')
	     *   .value();
	     * // => { 'age': 36 }
	     */
	    function wrapperChain() {
	      this.__chain__ = true;
	      return this;
	    }

	    /**
	     * Produces the `toString` result of the wrapped value.
	     *
	     * @name toString
	     * @memberOf _
	     * @category Chaining
	     * @returns {string} Returns the string result.
	     * @example
	     *
	     * _([1, 2, 3]).toString();
	     * // => '1,2,3'
	     */
	    function wrapperToString() {
	      return String(this.__wrapped__);
	    }

	    /**
	     * Extracts the wrapped value.
	     *
	     * @name valueOf
	     * @memberOf _
	     * @alias value
	     * @category Chaining
	     * @returns {*} Returns the wrapped value.
	     * @example
	     *
	     * _([1, 2, 3]).valueOf();
	     * // => [1, 2, 3]
	     */
	    function wrapperValueOf() {
	      return this.__wrapped__;
	    }

	    /*--------------------------------------------------------------------------*/

	    // add functions that return wrapped values when chaining
	    lodash.after = after;
	    lodash.assign = assign;
	    lodash.at = at;
	    lodash.bind = bind;
	    lodash.bindAll = bindAll;
	    lodash.bindKey = bindKey;
	    lodash.chain = chain;
	    lodash.compact = compact;
	    lodash.compose = compose;
	    lodash.constant = constant;
	    lodash.countBy = countBy;
	    lodash.create = create;
	    lodash.createCallback = createCallback;
	    lodash.curry = curry;
	    lodash.debounce = debounce;
	    lodash.defaults = defaults;
	    lodash.defer = defer;
	    lodash.delay = delay;
	    lodash.difference = difference;
	    lodash.filter = filter;
	    lodash.flatten = flatten;
	    lodash.forEach = forEach;
	    lodash.forEachRight = forEachRight;
	    lodash.forIn = forIn;
	    lodash.forInRight = forInRight;
	    lodash.forOwn = forOwn;
	    lodash.forOwnRight = forOwnRight;
	    lodash.functions = functions;
	    lodash.groupBy = groupBy;
	    lodash.indexBy = indexBy;
	    lodash.initial = initial;
	    lodash.intersection = intersection;
	    lodash.invert = invert;
	    lodash.invoke = invoke;
	    lodash.keys = keys;
	    lodash.map = map;
	    lodash.mapValues = mapValues;
	    lodash.max = max;
	    lodash.memoize = memoize;
	    lodash.merge = merge;
	    lodash.min = min;
	    lodash.omit = omit;
	    lodash.once = once;
	    lodash.pairs = pairs;
	    lodash.partial = partial;
	    lodash.partialRight = partialRight;
	    lodash.pick = pick;
	    lodash.pluck = pluck;
	    lodash.property = property;
	    lodash.pull = pull;
	    lodash.range = range;
	    lodash.reject = reject;
	    lodash.remove = remove;
	    lodash.rest = rest;
	    lodash.shuffle = shuffle;
	    lodash.sortBy = sortBy;
	    lodash.tap = tap;
	    lodash.throttle = throttle;
	    lodash.times = times;
	    lodash.toArray = toArray;
	    lodash.transform = transform;
	    lodash.union = union;
	    lodash.uniq = uniq;
	    lodash.values = values;
	    lodash.where = where;
	    lodash.without = without;
	    lodash.wrap = wrap;
	    lodash.xor = xor;
	    lodash.zip = zip;
	    lodash.zipObject = zipObject;

	    // add aliases
	    lodash.collect = map;
	    lodash.drop = rest;
	    lodash.each = forEach;
	    lodash.eachRight = forEachRight;
	    lodash.extend = assign;
	    lodash.methods = functions;
	    lodash.object = zipObject;
	    lodash.select = filter;
	    lodash.tail = rest;
	    lodash.unique = uniq;
	    lodash.unzip = zip;

	    // add functions to `lodash.prototype`
	    mixin(lodash);

	    /*--------------------------------------------------------------------------*/

	    // add functions that return unwrapped values when chaining
	    lodash.clone = clone;
	    lodash.cloneDeep = cloneDeep;
	    lodash.contains = contains;
	    lodash.escape = escape;
	    lodash.every = every;
	    lodash.find = find;
	    lodash.findIndex = findIndex;
	    lodash.findKey = findKey;
	    lodash.findLast = findLast;
	    lodash.findLastIndex = findLastIndex;
	    lodash.findLastKey = findLastKey;
	    lodash.has = has;
	    lodash.identity = identity;
	    lodash.indexOf = indexOf;
	    lodash.isArguments = isArguments;
	    lodash.isArray = isArray;
	    lodash.isBoolean = isBoolean;
	    lodash.isDate = isDate;
	    lodash.isElement = isElement;
	    lodash.isEmpty = isEmpty;
	    lodash.isEqual = isEqual;
	    lodash.isFinite = isFinite;
	    lodash.isFunction = isFunction;
	    lodash.isNaN = isNaN;
	    lodash.isNull = isNull;
	    lodash.isNumber = isNumber;
	    lodash.isObject = isObject;
	    lodash.isPlainObject = isPlainObject;
	    lodash.isRegExp = isRegExp;
	    lodash.isString = isString;
	    lodash.isUndefined = isUndefined;
	    lodash.lastIndexOf = lastIndexOf;
	    lodash.mixin = mixin;
	    lodash.noConflict = noConflict;
	    lodash.noop = noop;
	    lodash.now = now;
	    lodash.parseInt = parseInt;
	    lodash.random = random;
	    lodash.reduce = reduce;
	    lodash.reduceRight = reduceRight;
	    lodash.result = result;
	    lodash.runInContext = runInContext;
	    lodash.size = size;
	    lodash.some = some;
	    lodash.sortedIndex = sortedIndex;
	    lodash.template = template;
	    lodash.unescape = unescape;
	    lodash.uniqueId = uniqueId;

	    // add aliases
	    lodash.all = every;
	    lodash.any = some;
	    lodash.detect = find;
	    lodash.findWhere = find;
	    lodash.foldl = reduce;
	    lodash.foldr = reduceRight;
	    lodash.include = contains;
	    lodash.inject = reduce;

	    mixin(function() {
	      var source = {}
	      forOwn(lodash, function(func, methodName) {
	        if (!lodash.prototype[methodName]) {
	          source[methodName] = func;
	        }
	      });
	      return source;
	    }(), false);

	    /*--------------------------------------------------------------------------*/

	    // add functions capable of returning wrapped and unwrapped values when chaining
	    lodash.first = first;
	    lodash.last = last;
	    lodash.sample = sample;

	    // add aliases
	    lodash.take = first;
	    lodash.head = first;

	    forOwn(lodash, function(func, methodName) {
	      var callbackable = methodName !== 'sample';
	      if (!lodash.prototype[methodName]) {
	        lodash.prototype[methodName]= function(n, guard) {
	          var chainAll = this.__chain__,
	              result = func(this.__wrapped__, n, guard);

	          return !chainAll && (n == null || (guard && !(callbackable && typeof n == 'function')))
	            ? result
	            : new lodashWrapper(result, chainAll);
	        };
	      }
	    });

	    /*--------------------------------------------------------------------------*/

	    /**
	     * The semantic version number.
	     *
	     * @static
	     * @memberOf _
	     * @type string
	     */
	    lodash.VERSION = '2.4.1';

	    // add "Chaining" functions to the wrapper
	    lodash.prototype.chain = wrapperChain;
	    lodash.prototype.toString = wrapperToString;
	    lodash.prototype.value = wrapperValueOf;
	    lodash.prototype.valueOf = wrapperValueOf;

	    // add `Array` functions that return unwrapped values
	    baseEach(['join', 'pop', 'shift'], function(methodName) {
	      var func = arrayRef[methodName];
	      lodash.prototype[methodName] = function() {
	        var chainAll = this.__chain__,
	            result = func.apply(this.__wrapped__, arguments);

	        return chainAll
	          ? new lodashWrapper(result, chainAll)
	          : result;
	      };
	    });

	    // add `Array` functions that return the existing wrapped value
	    baseEach(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
	      var func = arrayRef[methodName];
	      lodash.prototype[methodName] = function() {
	        func.apply(this.__wrapped__, arguments);
	        return this;
	      };
	    });

	    // add `Array` functions that return new wrapped values
	    baseEach(['concat', 'slice', 'splice'], function(methodName) {
	      var func = arrayRef[methodName];
	      lodash.prototype[methodName] = function() {
	        return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
	      };
	    });

	    // avoid array-like object bugs with `Array#shift` and `Array#splice`
	    // in IE < 9, Firefox < 10, Narwhal, and RingoJS
	    if (!support.spliceObjects) {
	      baseEach(['pop', 'shift', 'splice'], function(methodName) {
	        var func = arrayRef[methodName],
	            isSplice = methodName == 'splice';

	        lodash.prototype[methodName] = function() {
	          var chainAll = this.__chain__,
	              value = this.__wrapped__,
	              result = func.apply(value, arguments);

	          if (value.length === 0) {
	            delete value[0];
	          }
	          return (chainAll || isSplice)
	            ? new lodashWrapper(result, chainAll)
	            : result;
	        };
	      });
	    }

	    return lodash;
	  }

	  /*--------------------------------------------------------------------------*/

	  // expose Lo-Dash
	  var _ = runInContext();

	  // some AMD build optimizers like r.js check for condition patterns like the following:
	  if (true) {
	    // Expose Lo-Dash to the global object even when an AMD loader is present in
	    // case Lo-Dash is loaded with a RequireJS shim config.
	    // See http://requirejs.org/docs/api.html#config-shim
	    root._ = _;

	    // define as an anonymous module so, through path mapping, it can be
	    // referenced as the "underscore" module
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	  // check for `exports` after `define` in case a build optimizer adds an `exports` object
	  else if (freeExports && freeModule) {
	    // in Node.js or RingoJS
	    if (moduleExports) {
	      (freeModule.exports = _)._ = _;
	    }
	    // in Narwhal or Rhino -require
	    else {
	      freeExports._ = _;
	    }
	  }
	  else {
	    // in a browser or Rhino
	    root._ = _;
	  }
	}.call(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(28)(module), (function() { return this; }())))

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	var numeric = (false)?(function numeric() {}):(exports);
	if(typeof global !== "undefined") { global.numeric = numeric; }

	numeric.version = "1.2.6";

	// 1. Utility functions
	numeric.bench = function bench (f,interval) {
	    var t1,t2,n,i;
	    if(typeof interval === "undefined") { interval = 15; }
	    n = 0.5;
	    t1 = new Date();
	    while(1) {
	        n*=2;
	        for(i=n;i>3;i-=4) { f(); f(); f(); f(); }
	        while(i>0) { f(); i--; }
	        t2 = new Date();
	        if(t2-t1 > interval) break;
	    }
	    for(i=n;i>3;i-=4) { f(); f(); f(); f(); }
	    while(i>0) { f(); i--; }
	    t2 = new Date();
	    return 1000*(3*n-1)/(t2-t1);
	}

	numeric._myIndexOf = (function _myIndexOf(w) {
	    var n = this.length,k;
	    for(k=0;k<n;++k) if(this[k]===w) return k;
	    return -1;
	});
	numeric.myIndexOf = (Array.prototype.indexOf)?Array.prototype.indexOf:numeric._myIndexOf;

	numeric.Function = Function;
	numeric.precision = 4;
	numeric.largeArray = 50;

	numeric.prettyPrint = function prettyPrint(x) {
	    function fmtnum(x) {
	        if(x === 0) { return '0'; }
	        if(isNaN(x)) { return 'NaN'; }
	        if(x<0) { return '-'+fmtnum(-x); }
	        if(isFinite(x)) {
	            var scale = Math.floor(Math.log(x) / Math.log(10));
	            var normalized = x / Math.pow(10,scale);
	            var basic = normalized.toPrecision(numeric.precision);
	            if(parseFloat(basic) === 10) { scale++; normalized = 1; basic = normalized.toPrecision(numeric.precision); }
	            return parseFloat(basic).toString()+'e'+scale.toString();
	        }
	        return 'Infinity';
	    }
	    var ret = [];
	    function foo(x) {
	        var k;
	        if(typeof x === "undefined") { ret.push(Array(numeric.precision+8).join(' ')); return false; }
	        if(typeof x === "string") { ret.push('"'+x+'"'); return false; }
	        if(typeof x === "boolean") { ret.push(x.toString()); return false; }
	        if(typeof x === "number") {
	            var a = fmtnum(x);
	            var b = x.toPrecision(numeric.precision);
	            var c = parseFloat(x.toString()).toString();
	            var d = [a,b,c,parseFloat(b).toString(),parseFloat(c).toString()];
	            for(k=1;k<d.length;k++) { if(d[k].length < a.length) a = d[k]; }
	            ret.push(Array(numeric.precision+8-a.length).join(' ')+a);
	            return false;
	        }
	        if(x === null) { ret.push("null"); return false; }
	        if(typeof x === "function") { 
	            ret.push(x.toString());
	            var flag = false;
	            for(k in x) { if(x.hasOwnProperty(k)) { 
	                if(flag) ret.push(',\n');
	                else ret.push('\n{');
	                flag = true; 
	                ret.push(k); 
	                ret.push(': \n'); 
	                foo(x[k]); 
	            } }
	            if(flag) ret.push('}\n');
	            return true;
	        }
	        if(x instanceof Array) {
	            if(x.length > numeric.largeArray) { ret.push('...Large Array...'); return true; }
	            var flag = false;
	            ret.push('[');
	            for(k=0;k<x.length;k++) { if(k>0) { ret.push(','); if(flag) ret.push('\n '); } flag = foo(x[k]); }
	            ret.push(']');
	            return true;
	        }
	        ret.push('{');
	        var flag = false;
	        for(k in x) { if(x.hasOwnProperty(k)) { if(flag) ret.push(',\n'); flag = true; ret.push(k); ret.push(': \n'); foo(x[k]); } }
	        ret.push('}');
	        return true;
	    }
	    foo(x);
	    return ret.join('');
	}

	numeric.parseDate = function parseDate(d) {
	    function foo(d) {
	        if(typeof d === 'string') { return Date.parse(d.replace(/-/g,'/')); }
	        if(!(d instanceof Array)) { throw new Error("parseDate: parameter must be arrays of strings"); }
	        var ret = [],k;
	        for(k=0;k<d.length;k++) { ret[k] = foo(d[k]); }
	        return ret;
	    }
	    return foo(d);
	}

	numeric.parseFloat = function parseFloat_(d) {
	    function foo(d) {
	        if(typeof d === 'string') { return parseFloat(d); }
	        if(!(d instanceof Array)) { throw new Error("parseFloat: parameter must be arrays of strings"); }
	        var ret = [],k;
	        for(k=0;k<d.length;k++) { ret[k] = foo(d[k]); }
	        return ret;
	    }
	    return foo(d);
	}

	numeric.parseCSV = function parseCSV(t) {
	    var foo = t.split('\n');
	    var j,k;
	    var ret = [];
	    var pat = /(([^'",]*)|('[^']*')|("[^"]*")),/g;
	    var patnum = /^\s*(([+-]?[0-9]+(\.[0-9]*)?(e[+-]?[0-9]+)?)|([+-]?[0-9]*(\.[0-9]+)?(e[+-]?[0-9]+)?))\s*$/;
	    var stripper = function(n) { return n.substr(0,n.length-1); }
	    var count = 0;
	    for(k=0;k<foo.length;k++) {
	      var bar = (foo[k]+",").match(pat),baz;
	      if(bar.length>0) {
	          ret[count] = [];
	          for(j=0;j<bar.length;j++) {
	              baz = stripper(bar[j]);
	              if(patnum.test(baz)) { ret[count][j] = parseFloat(baz); }
	              else ret[count][j] = baz;
	          }
	          count++;
	      }
	    }
	    return ret;
	}

	numeric.toCSV = function toCSV(A) {
	    var s = numeric.dim(A);
	    var i,j,m,n,row,ret;
	    m = s[0];
	    n = s[1];
	    ret = [];
	    for(i=0;i<m;i++) {
	        row = [];
	        for(j=0;j<m;j++) { row[j] = A[i][j].toString(); }
	        ret[i] = row.join(', ');
	    }
	    return ret.join('\n')+'\n';
	}

	numeric.getURL = function getURL(url) {
	    var client = new XMLHttpRequest();
	    client.open("GET",url,false);
	    client.send();
	    return client;
	}

	numeric.imageURL = function imageURL(img) {
	    function base64(A) {
	        var n = A.length, i,x,y,z,p,q,r,s;
	        var key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	        var ret = "";
	        for(i=0;i<n;i+=3) {
	            x = A[i];
	            y = A[i+1];
	            z = A[i+2];
	            p = x >> 2;
	            q = ((x & 3) << 4) + (y >> 4);
	            r = ((y & 15) << 2) + (z >> 6);
	            s = z & 63;
	            if(i+1>=n) { r = s = 64; }
	            else if(i+2>=n) { s = 64; }
	            ret += key.charAt(p) + key.charAt(q) + key.charAt(r) + key.charAt(s);
	            }
	        return ret;
	    }
	    function crc32Array (a,from,to) {
	        if(typeof from === "undefined") { from = 0; }
	        if(typeof to === "undefined") { to = a.length; }
	        var table = [0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3,
	                     0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91, 
	                     0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7,
	                     0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5, 
	                     0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B, 
	                     0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59, 
	                     0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F,
	                     0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924, 0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D,
	                     0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433,
	                     0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01, 
	                     0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457, 
	                     0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65, 
	                     0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB, 
	                     0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9, 
	                     0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F, 
	                     0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD, 
	                     0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683, 
	                     0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1, 
	                     0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7, 
	                     0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5, 
	                     0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B, 
	                     0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79, 
	                     0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236, 0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 
	                     0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D, 
	                     0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713, 
	                     0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 
	                     0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777, 
	                     0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45, 
	                     0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB, 
	                     0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9, 
	                     0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF, 
	                     0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D];
	     
	        var crc = -1, y = 0, n = a.length,i;

	        for (i = from; i < to; i++) {
	            y = (crc ^ a[i]) & 0xFF;
	            crc = (crc >>> 8) ^ table[y];
	        }
	     
	        return crc ^ (-1);
	    }

	    var h = img[0].length, w = img[0][0].length, s1, s2, next,k,length,a,b,i,j,adler32,crc32;
	    var stream = [
	                  137, 80, 78, 71, 13, 10, 26, 10,                           //  0: PNG signature
	                  0,0,0,13,                                                  //  8: IHDR Chunk length
	                  73, 72, 68, 82,                                            // 12: "IHDR" 
	                  (w >> 24) & 255, (w >> 16) & 255, (w >> 8) & 255, w&255,   // 16: Width
	                  (h >> 24) & 255, (h >> 16) & 255, (h >> 8) & 255, h&255,   // 20: Height
	                  8,                                                         // 24: bit depth
	                  2,                                                         // 25: RGB
	                  0,                                                         // 26: deflate
	                  0,                                                         // 27: no filter
	                  0,                                                         // 28: no interlace
	                  -1,-2,-3,-4,                                               // 29: CRC
	                  -5,-6,-7,-8,                                               // 33: IDAT Chunk length
	                  73, 68, 65, 84,                                            // 37: "IDAT"
	                  // RFC 1950 header starts here
	                  8,                                                         // 41: RFC1950 CMF
	                  29                                                         // 42: RFC1950 FLG
	                  ];
	    crc32 = crc32Array(stream,12,29);
	    stream[29] = (crc32>>24)&255;
	    stream[30] = (crc32>>16)&255;
	    stream[31] = (crc32>>8)&255;
	    stream[32] = (crc32)&255;
	    s1 = 1;
	    s2 = 0;
	    for(i=0;i<h;i++) {
	        if(i<h-1) { stream.push(0); }
	        else { stream.push(1); }
	        a = (3*w+1+(i===0))&255; b = ((3*w+1+(i===0))>>8)&255;
	        stream.push(a); stream.push(b);
	        stream.push((~a)&255); stream.push((~b)&255);
	        if(i===0) stream.push(0);
	        for(j=0;j<w;j++) {
	            for(k=0;k<3;k++) {
	                a = img[k][i][j];
	                if(a>255) a = 255;
	                else if(a<0) a=0;
	                else a = Math.round(a);
	                s1 = (s1 + a )%65521;
	                s2 = (s2 + s1)%65521;
	                stream.push(a);
	            }
	        }
	        stream.push(0);
	    }
	    adler32 = (s2<<16)+s1;
	    stream.push((adler32>>24)&255);
	    stream.push((adler32>>16)&255);
	    stream.push((adler32>>8)&255);
	    stream.push((adler32)&255);
	    length = stream.length - 41;
	    stream[33] = (length>>24)&255;
	    stream[34] = (length>>16)&255;
	    stream[35] = (length>>8)&255;
	    stream[36] = (length)&255;
	    crc32 = crc32Array(stream,37);
	    stream.push((crc32>>24)&255);
	    stream.push((crc32>>16)&255);
	    stream.push((crc32>>8)&255);
	    stream.push((crc32)&255);
	    stream.push(0);
	    stream.push(0);
	    stream.push(0);
	    stream.push(0);
	//    a = stream.length;
	    stream.push(73);  // I
	    stream.push(69);  // E
	    stream.push(78);  // N
	    stream.push(68);  // D
	    stream.push(174); // CRC1
	    stream.push(66);  // CRC2
	    stream.push(96);  // CRC3
	    stream.push(130); // CRC4
	    return 'data:image/png;base64,'+base64(stream);
	}

	// 2. Linear algebra with Arrays.
	numeric._dim = function _dim(x) {
	    var ret = [];
	    while(typeof x === "object") { ret.push(x.length); x = x[0]; }
	    return ret;
	}

	numeric.dim = function dim(x) {
	    var y,z;
	    if(typeof x === "object") {
	        y = x[0];
	        if(typeof y === "object") {
	            z = y[0];
	            if(typeof z === "object") {
	                return numeric._dim(x);
	            }
	            return [x.length,y.length];
	        }
	        return [x.length];
	    }
	    return [];
	}

	numeric.mapreduce = function mapreduce(body,init) {
	    return Function('x','accum','_s','_k',
	            'if(typeof accum === "undefined") accum = '+init+';\n'+
	            'if(typeof x === "number") { var xi = x; '+body+'; return accum; }\n'+
	            'if(typeof _s === "undefined") _s = numeric.dim(x);\n'+
	            'if(typeof _k === "undefined") _k = 0;\n'+
	            'var _n = _s[_k];\n'+
	            'var i,xi;\n'+
	            'if(_k < _s.length-1) {\n'+
	            '    for(i=_n-1;i>=0;i--) {\n'+
	            '        accum = arguments.callee(x[i],accum,_s,_k+1);\n'+
	            '    }'+
	            '    return accum;\n'+
	            '}\n'+
	            'for(i=_n-1;i>=1;i-=2) { \n'+
	            '    xi = x[i];\n'+
	            '    '+body+';\n'+
	            '    xi = x[i-1];\n'+
	            '    '+body+';\n'+
	            '}\n'+
	            'if(i === 0) {\n'+
	            '    xi = x[i];\n'+
	            '    '+body+'\n'+
	            '}\n'+
	            'return accum;'
	            );
	}
	numeric.mapreduce2 = function mapreduce2(body,setup) {
	    return Function('x',
	            'var n = x.length;\n'+
	            'var i,xi;\n'+setup+';\n'+
	            'for(i=n-1;i!==-1;--i) { \n'+
	            '    xi = x[i];\n'+
	            '    '+body+';\n'+
	            '}\n'+
	            'return accum;'
	            );
	}


	numeric.same = function same(x,y) {
	    var i,n;
	    if(!(x instanceof Array) || !(y instanceof Array)) { return false; }
	    n = x.length;
	    if(n !== y.length) { return false; }
	    for(i=0;i<n;i++) {
	        if(x[i] === y[i]) { continue; }
	        if(typeof x[i] === "object") { if(!same(x[i],y[i])) return false; }
	        else { return false; }
	    }
	    return true;
	}

	numeric.rep = function rep(s,v,k) {
	    if(typeof k === "undefined") { k=0; }
	    var n = s[k], ret = Array(n), i;
	    if(k === s.length-1) {
	        for(i=n-2;i>=0;i-=2) { ret[i+1] = v; ret[i] = v; }
	        if(i===-1) { ret[0] = v; }
	        return ret;
	    }
	    for(i=n-1;i>=0;i--) { ret[i] = numeric.rep(s,v,k+1); }
	    return ret;
	}


	numeric.dotMMsmall = function dotMMsmall(x,y) {
	    var i,j,k,p,q,r,ret,foo,bar,woo,i0,k0,p0,r0;
	    p = x.length; q = y.length; r = y[0].length;
	    ret = Array(p);
	    for(i=p-1;i>=0;i--) {
	        foo = Array(r);
	        bar = x[i];
	        for(k=r-1;k>=0;k--) {
	            woo = bar[q-1]*y[q-1][k];
	            for(j=q-2;j>=1;j-=2) {
	                i0 = j-1;
	                woo += bar[j]*y[j][k] + bar[i0]*y[i0][k];
	            }
	            if(j===0) { woo += bar[0]*y[0][k]; }
	            foo[k] = woo;
	        }
	        ret[i] = foo;
	    }
	    return ret;
	}
	numeric._getCol = function _getCol(A,j,x) {
	    var n = A.length, i;
	    for(i=n-1;i>0;--i) {
	        x[i] = A[i][j];
	        --i;
	        x[i] = A[i][j];
	    }
	    if(i===0) x[0] = A[0][j];
	}
	numeric.dotMMbig = function dotMMbig(x,y){
	    var gc = numeric._getCol, p = y.length, v = Array(p);
	    var m = x.length, n = y[0].length, A = new Array(m), xj;
	    var VV = numeric.dotVV;
	    var i,j,k,z;
	    --p;
	    --m;
	    for(i=m;i!==-1;--i) A[i] = Array(n);
	    --n;
	    for(i=n;i!==-1;--i) {
	        gc(y,i,v);
	        for(j=m;j!==-1;--j) {
	            z=0;
	            xj = x[j];
	            A[j][i] = VV(xj,v);
	        }
	    }
	    return A;
	}

	numeric.dotMV = function dotMV(x,y) {
	    var p = x.length, q = y.length,i;
	    var ret = Array(p), dotVV = numeric.dotVV;
	    for(i=p-1;i>=0;i--) { ret[i] = dotVV(x[i],y); }
	    return ret;
	}

	numeric.dotVM = function dotVM(x,y) {
	    var i,j,k,p,q,r,ret,foo,bar,woo,i0,k0,p0,r0,s1,s2,s3,baz,accum;
	    p = x.length; q = y[0].length;
	    ret = Array(q);
	    for(k=q-1;k>=0;k--) {
	        woo = x[p-1]*y[p-1][k];
	        for(j=p-2;j>=1;j-=2) {
	            i0 = j-1;
	            woo += x[j]*y[j][k] + x[i0]*y[i0][k];
	        }
	        if(j===0) { woo += x[0]*y[0][k]; }
	        ret[k] = woo;
	    }
	    return ret;
	}

	numeric.dotVV = function dotVV(x,y) {
	    var i,n=x.length,i1,ret = x[n-1]*y[n-1];
	    for(i=n-2;i>=1;i-=2) {
	        i1 = i-1;
	        ret += x[i]*y[i] + x[i1]*y[i1];
	    }
	    if(i===0) { ret += x[0]*y[0]; }
	    return ret;
	}

	numeric.dot = function dot(x,y) {
	    var d = numeric.dim;
	    switch(d(x).length*1000+d(y).length) {
	    case 2002:
	        if(y.length < 10) return numeric.dotMMsmall(x,y);
	        else return numeric.dotMMbig(x,y);
	    case 2001: return numeric.dotMV(x,y);
	    case 1002: return numeric.dotVM(x,y);
	    case 1001: return numeric.dotVV(x,y);
	    case 1000: return numeric.mulVS(x,y);
	    case 1: return numeric.mulSV(x,y);
	    case 0: return x*y;
	    default: throw new Error('numeric.dot only works on vectors and matrices');
	    }
	}

	numeric.diag = function diag(d) {
	    var i,i1,j,n = d.length, A = Array(n), Ai;
	    for(i=n-1;i>=0;i--) {
	        Ai = Array(n);
	        i1 = i+2;
	        for(j=n-1;j>=i1;j-=2) {
	            Ai[j] = 0;
	            Ai[j-1] = 0;
	        }
	        if(j>i) { Ai[j] = 0; }
	        Ai[i] = d[i];
	        for(j=i-1;j>=1;j-=2) {
	            Ai[j] = 0;
	            Ai[j-1] = 0;
	        }
	        if(j===0) { Ai[0] = 0; }
	        A[i] = Ai;
	    }
	    return A;
	}
	numeric.getDiag = function(A) {
	    var n = Math.min(A.length,A[0].length),i,ret = Array(n);
	    for(i=n-1;i>=1;--i) {
	        ret[i] = A[i][i];
	        --i;
	        ret[i] = A[i][i];
	    }
	    if(i===0) {
	        ret[0] = A[0][0];
	    }
	    return ret;
	}

	numeric.identity = function identity(n) { return numeric.diag(numeric.rep([n],1)); }
	numeric.pointwise = function pointwise(params,body,setup) {
	    if(typeof setup === "undefined") { setup = ""; }
	    var fun = [];
	    var k;
	    var avec = /\[i\]$/,p,thevec = '';
	    var haveret = false;
	    for(k=0;k<params.length;k++) {
	        if(avec.test(params[k])) {
	            p = params[k].substring(0,params[k].length-3);
	            thevec = p;
	        } else { p = params[k]; }
	        if(p==='ret') haveret = true;
	        fun.push(p);
	    }
	    fun[params.length] = '_s';
	    fun[params.length+1] = '_k';
	    fun[params.length+2] = (
	            'if(typeof _s === "undefined") _s = numeric.dim('+thevec+');\n'+
	            'if(typeof _k === "undefined") _k = 0;\n'+
	            'var _n = _s[_k];\n'+
	            'var i'+(haveret?'':', ret = Array(_n)')+';\n'+
	            'if(_k < _s.length-1) {\n'+
	            '    for(i=_n-1;i>=0;i--) ret[i] = arguments.callee('+params.join(',')+',_s,_k+1);\n'+
	            '    return ret;\n'+
	            '}\n'+
	            setup+'\n'+
	            'for(i=_n-1;i!==-1;--i) {\n'+
	            '    '+body+'\n'+
	            '}\n'+
	            'return ret;'
	            );
	    return Function.apply(null,fun);
	}
	numeric.pointwise2 = function pointwise2(params,body,setup) {
	    if(typeof setup === "undefined") { setup = ""; }
	    var fun = [];
	    var k;
	    var avec = /\[i\]$/,p,thevec = '';
	    var haveret = false;
	    for(k=0;k<params.length;k++) {
	        if(avec.test(params[k])) {
	            p = params[k].substring(0,params[k].length-3);
	            thevec = p;
	        } else { p = params[k]; }
	        if(p==='ret') haveret = true;
	        fun.push(p);
	    }
	    fun[params.length] = (
	            'var _n = '+thevec+'.length;\n'+
	            'var i'+(haveret?'':', ret = Array(_n)')+';\n'+
	            setup+'\n'+
	            'for(i=_n-1;i!==-1;--i) {\n'+
	            body+'\n'+
	            '}\n'+
	            'return ret;'
	            );
	    return Function.apply(null,fun);
	}
	numeric._biforeach = (function _biforeach(x,y,s,k,f) {
	    if(k === s.length-1) { f(x,y); return; }
	    var i,n=s[k];
	    for(i=n-1;i>=0;i--) { _biforeach(typeof x==="object"?x[i]:x,typeof y==="object"?y[i]:y,s,k+1,f); }
	});
	numeric._biforeach2 = (function _biforeach2(x,y,s,k,f) {
	    if(k === s.length-1) { return f(x,y); }
	    var i,n=s[k],ret = Array(n);
	    for(i=n-1;i>=0;--i) { ret[i] = _biforeach2(typeof x==="object"?x[i]:x,typeof y==="object"?y[i]:y,s,k+1,f); }
	    return ret;
	});
	numeric._foreach = (function _foreach(x,s,k,f) {
	    if(k === s.length-1) { f(x); return; }
	    var i,n=s[k];
	    for(i=n-1;i>=0;i--) { _foreach(x[i],s,k+1,f); }
	});
	numeric._foreach2 = (function _foreach2(x,s,k,f) {
	    if(k === s.length-1) { return f(x); }
	    var i,n=s[k], ret = Array(n);
	    for(i=n-1;i>=0;i--) { ret[i] = _foreach2(x[i],s,k+1,f); }
	    return ret;
	});

	/*numeric.anyV = numeric.mapreduce('if(xi) return true;','false');
	numeric.allV = numeric.mapreduce('if(!xi) return false;','true');
	numeric.any = function(x) { if(typeof x.length === "undefined") return x; return numeric.anyV(x); }
	numeric.all = function(x) { if(typeof x.length === "undefined") return x; return numeric.allV(x); }*/

	numeric.ops2 = {
	        add: '+',
	        sub: '-',
	        mul: '*',
	        div: '/',
	        mod: '%',
	        and: '&&',
	        or:  '||',
	        eq:  '===',
	        neq: '!==',
	        lt:  '<',
	        gt:  '>',
	        leq: '<=',
	        geq: '>=',
	        band: '&',
	        bor: '|',
	        bxor: '^',
	        lshift: '<<',
	        rshift: '>>',
	        rrshift: '>>>'
	};
	numeric.opseq = {
	        addeq: '+=',
	        subeq: '-=',
	        muleq: '*=',
	        diveq: '/=',
	        modeq: '%=',
	        lshifteq: '<<=',
	        rshifteq: '>>=',
	        rrshifteq: '>>>=',
	        bandeq: '&=',
	        boreq: '|=',
	        bxoreq: '^='
	};
	numeric.mathfuns = ['abs','acos','asin','atan','ceil','cos',
	                    'exp','floor','log','round','sin','sqrt','tan',
	                    'isNaN','isFinite'];
	numeric.mathfuns2 = ['atan2','pow','max','min'];
	numeric.ops1 = {
	        neg: '-',
	        not: '!',
	        bnot: '~',
	        clone: ''
	};
	numeric.mapreducers = {
	        any: ['if(xi) return true;','var accum = false;'],
	        all: ['if(!xi) return false;','var accum = true;'],
	        sum: ['accum += xi;','var accum = 0;'],
	        prod: ['accum *= xi;','var accum = 1;'],
	        norm2Squared: ['accum += xi*xi;','var accum = 0;'],
	        norminf: ['accum = max(accum,abs(xi));','var accum = 0, max = Math.max, abs = Math.abs;'],
	        norm1: ['accum += abs(xi)','var accum = 0, abs = Math.abs;'],
	        sup: ['accum = max(accum,xi);','var accum = -Infinity, max = Math.max;'],
	        inf: ['accum = min(accum,xi);','var accum = Infinity, min = Math.min;']
	};

	(function () {
	    var i,o;
	    for(i=0;i<numeric.mathfuns2.length;++i) {
	        o = numeric.mathfuns2[i];
	        numeric.ops2[o] = o;
	    }
	    for(i in numeric.ops2) {
	        if(numeric.ops2.hasOwnProperty(i)) {
	            o = numeric.ops2[i];
	            var code, codeeq, setup = '';
	            if(numeric.myIndexOf.call(numeric.mathfuns2,i)!==-1) {
	                setup = 'var '+o+' = Math.'+o+';\n';
	                code = function(r,x,y) { return r+' = '+o+'('+x+','+y+')'; };
	                codeeq = function(x,y) { return x+' = '+o+'('+x+','+y+')'; };
	            } else {
	                code = function(r,x,y) { return r+' = '+x+' '+o+' '+y; };
	                if(numeric.opseq.hasOwnProperty(i+'eq')) {
	                    codeeq = function(x,y) { return x+' '+o+'= '+y; };
	                } else {
	                    codeeq = function(x,y) { return x+' = '+x+' '+o+' '+y; };                    
	                }
	            }
	            numeric[i+'VV'] = numeric.pointwise2(['x[i]','y[i]'],code('ret[i]','x[i]','y[i]'),setup);
	            numeric[i+'SV'] = numeric.pointwise2(['x','y[i]'],code('ret[i]','x','y[i]'),setup);
	            numeric[i+'VS'] = numeric.pointwise2(['x[i]','y'],code('ret[i]','x[i]','y'),setup);
	            numeric[i] = Function(
	                    'var n = arguments.length, i, x = arguments[0], y;\n'+
	                    'var VV = numeric.'+i+'VV, VS = numeric.'+i+'VS, SV = numeric.'+i+'SV;\n'+
	                    'var dim = numeric.dim;\n'+
	                    'for(i=1;i!==n;++i) { \n'+
	                    '  y = arguments[i];\n'+
	                    '  if(typeof x === "object") {\n'+
	                    '      if(typeof y === "object") x = numeric._biforeach2(x,y,dim(x),0,VV);\n'+
	                    '      else x = numeric._biforeach2(x,y,dim(x),0,VS);\n'+
	                    '  } else if(typeof y === "object") x = numeric._biforeach2(x,y,dim(y),0,SV);\n'+
	                    '  else '+codeeq('x','y')+'\n'+
	                    '}\nreturn x;\n');
	            numeric[o] = numeric[i];
	            numeric[i+'eqV'] = numeric.pointwise2(['ret[i]','x[i]'], codeeq('ret[i]','x[i]'),setup);
	            numeric[i+'eqS'] = numeric.pointwise2(['ret[i]','x'], codeeq('ret[i]','x'),setup);
	            numeric[i+'eq'] = Function(
	                    'var n = arguments.length, i, x = arguments[0], y;\n'+
	                    'var V = numeric.'+i+'eqV, S = numeric.'+i+'eqS\n'+
	                    'var s = numeric.dim(x);\n'+
	                    'for(i=1;i!==n;++i) { \n'+
	                    '  y = arguments[i];\n'+
	                    '  if(typeof y === "object") numeric._biforeach(x,y,s,0,V);\n'+
	                    '  else numeric._biforeach(x,y,s,0,S);\n'+
	                    '}\nreturn x;\n');
	        }
	    }
	    for(i=0;i<numeric.mathfuns2.length;++i) {
	        o = numeric.mathfuns2[i];
	        delete numeric.ops2[o];
	    }
	    for(i=0;i<numeric.mathfuns.length;++i) {
	        o = numeric.mathfuns[i];
	        numeric.ops1[o] = o;
	    }
	    for(i in numeric.ops1) {
	        if(numeric.ops1.hasOwnProperty(i)) {
	            setup = '';
	            o = numeric.ops1[i];
	            if(numeric.myIndexOf.call(numeric.mathfuns,i)!==-1) {
	                if(Math.hasOwnProperty(o)) setup = 'var '+o+' = Math.'+o+';\n';
	            }
	            numeric[i+'eqV'] = numeric.pointwise2(['ret[i]'],'ret[i] = '+o+'(ret[i]);',setup);
	            numeric[i+'eq'] = Function('x',
	                    'if(typeof x !== "object") return '+o+'x\n'+
	                    'var i;\n'+
	                    'var V = numeric.'+i+'eqV;\n'+
	                    'var s = numeric.dim(x);\n'+
	                    'numeric._foreach(x,s,0,V);\n'+
	                    'return x;\n');
	            numeric[i+'V'] = numeric.pointwise2(['x[i]'],'ret[i] = '+o+'(x[i]);',setup);
	            numeric[i] = Function('x',
	                    'if(typeof x !== "object") return '+o+'(x)\n'+
	                    'var i;\n'+
	                    'var V = numeric.'+i+'V;\n'+
	                    'var s = numeric.dim(x);\n'+
	                    'return numeric._foreach2(x,s,0,V);\n');
	        }
	    }
	    for(i=0;i<numeric.mathfuns.length;++i) {
	        o = numeric.mathfuns[i];
	        delete numeric.ops1[o];
	    }
	    for(i in numeric.mapreducers) {
	        if(numeric.mapreducers.hasOwnProperty(i)) {
	            o = numeric.mapreducers[i];
	            numeric[i+'V'] = numeric.mapreduce2(o[0],o[1]);
	            numeric[i] = Function('x','s','k',
	                    o[1]+
	                    'if(typeof x !== "object") {'+
	                    '    xi = x;\n'+
	                    o[0]+';\n'+
	                    '    return accum;\n'+
	                    '}'+
	                    'if(typeof s === "undefined") s = numeric.dim(x);\n'+
	                    'if(typeof k === "undefined") k = 0;\n'+
	                    'if(k === s.length-1) return numeric.'+i+'V(x);\n'+
	                    'var xi;\n'+
	                    'var n = x.length, i;\n'+
	                    'for(i=n-1;i!==-1;--i) {\n'+
	                    '   xi = arguments.callee(x[i]);\n'+
	                    o[0]+';\n'+
	                    '}\n'+
	                    'return accum;\n');
	        }
	    }
	}());

	numeric.truncVV = numeric.pointwise(['x[i]','y[i]'],'ret[i] = round(x[i]/y[i])*y[i];','var round = Math.round;');
	numeric.truncVS = numeric.pointwise(['x[i]','y'],'ret[i] = round(x[i]/y)*y;','var round = Math.round;');
	numeric.truncSV = numeric.pointwise(['x','y[i]'],'ret[i] = round(x/y[i])*y[i];','var round = Math.round;');
	numeric.trunc = function trunc(x,y) {
	    if(typeof x === "object") {
	        if(typeof y === "object") return numeric.truncVV(x,y);
	        return numeric.truncVS(x,y);
	    }
	    if (typeof y === "object") return numeric.truncSV(x,y);
	    return Math.round(x/y)*y;
	}

	numeric.inv = function inv(x) {
	    var s = numeric.dim(x), abs = Math.abs, m = s[0], n = s[1];
	    var A = numeric.clone(x), Ai, Aj;
	    var I = numeric.identity(m), Ii, Ij;
	    var i,j,k,x;
	    for(j=0;j<n;++j) {
	        var i0 = -1;
	        var v0 = -1;
	        for(i=j;i!==m;++i) { k = abs(A[i][j]); if(k>v0) { i0 = i; v0 = k; } }
	        Aj = A[i0]; A[i0] = A[j]; A[j] = Aj;
	        Ij = I[i0]; I[i0] = I[j]; I[j] = Ij;
	        x = Aj[j];
	        for(k=j;k!==n;++k)    Aj[k] /= x; 
	        for(k=n-1;k!==-1;--k) Ij[k] /= x;
	        for(i=m-1;i!==-1;--i) {
	            if(i!==j) {
	                Ai = A[i];
	                Ii = I[i];
	                x = Ai[j];
	                for(k=j+1;k!==n;++k)  Ai[k] -= Aj[k]*x;
	                for(k=n-1;k>0;--k) { Ii[k] -= Ij[k]*x; --k; Ii[k] -= Ij[k]*x; }
	                if(k===0) Ii[0] -= Ij[0]*x;
	            }
	        }
	    }
	    return I;
	}

	numeric.det = function det(x) {
	    var s = numeric.dim(x);
	    if(s.length !== 2 || s[0] !== s[1]) { throw new Error('numeric: det() only works on square matrices'); }
	    var n = s[0], ret = 1,i,j,k,A = numeric.clone(x),Aj,Ai,alpha,temp,k1,k2,k3;
	    for(j=0;j<n-1;j++) {
	        k=j;
	        for(i=j+1;i<n;i++) { if(Math.abs(A[i][j]) > Math.abs(A[k][j])) { k = i; } }
	        if(k !== j) {
	            temp = A[k]; A[k] = A[j]; A[j] = temp;
	            ret *= -1;
	        }
	        Aj = A[j];
	        for(i=j+1;i<n;i++) {
	            Ai = A[i];
	            alpha = Ai[j]/Aj[j];
	            for(k=j+1;k<n-1;k+=2) {
	                k1 = k+1;
	                Ai[k] -= Aj[k]*alpha;
	                Ai[k1] -= Aj[k1]*alpha;
	            }
	            if(k!==n) { Ai[k] -= Aj[k]*alpha; }
	        }
	        if(Aj[j] === 0) { return 0; }
	        ret *= Aj[j];
	    }
	    return ret*A[j][j];
	}

	numeric.transpose = function transpose(x) {
	    var i,j,m = x.length,n = x[0].length, ret=Array(n),A0,A1,Bj;
	    for(j=0;j<n;j++) ret[j] = Array(m);
	    for(i=m-1;i>=1;i-=2) {
	        A1 = x[i];
	        A0 = x[i-1];
	        for(j=n-1;j>=1;--j) {
	            Bj = ret[j]; Bj[i] = A1[j]; Bj[i-1] = A0[j];
	            --j;
	            Bj = ret[j]; Bj[i] = A1[j]; Bj[i-1] = A0[j];
	        }
	        if(j===0) {
	            Bj = ret[0]; Bj[i] = A1[0]; Bj[i-1] = A0[0];
	        }
	    }
	    if(i===0) {
	        A0 = x[0];
	        for(j=n-1;j>=1;--j) {
	            ret[j][0] = A0[j];
	            --j;
	            ret[j][0] = A0[j];
	        }
	        if(j===0) { ret[0][0] = A0[0]; }
	    }
	    return ret;
	}
	numeric.negtranspose = function negtranspose(x) {
	    var i,j,m = x.length,n = x[0].length, ret=Array(n),A0,A1,Bj;
	    for(j=0;j<n;j++) ret[j] = Array(m);
	    for(i=m-1;i>=1;i-=2) {
	        A1 = x[i];
	        A0 = x[i-1];
	        for(j=n-1;j>=1;--j) {
	            Bj = ret[j]; Bj[i] = -A1[j]; Bj[i-1] = -A0[j];
	            --j;
	            Bj = ret[j]; Bj[i] = -A1[j]; Bj[i-1] = -A0[j];
	        }
	        if(j===0) {
	            Bj = ret[0]; Bj[i] = -A1[0]; Bj[i-1] = -A0[0];
	        }
	    }
	    if(i===0) {
	        A0 = x[0];
	        for(j=n-1;j>=1;--j) {
	            ret[j][0] = -A0[j];
	            --j;
	            ret[j][0] = -A0[j];
	        }
	        if(j===0) { ret[0][0] = -A0[0]; }
	    }
	    return ret;
	}

	numeric._random = function _random(s,k) {
	    var i,n=s[k],ret=Array(n), rnd;
	    if(k === s.length-1) {
	        rnd = Math.random;
	        for(i=n-1;i>=1;i-=2) {
	            ret[i] = rnd();
	            ret[i-1] = rnd();
	        }
	        if(i===0) { ret[0] = rnd(); }
	        return ret;
	    }
	    for(i=n-1;i>=0;i--) ret[i] = _random(s,k+1);
	    return ret;
	}
	numeric.random = function random(s) { return numeric._random(s,0); }

	numeric.norm2 = function norm2(x) { return Math.sqrt(numeric.norm2Squared(x)); }

	numeric.linspace = function linspace(a,b,n) {
	    if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
	    if(n<2) { return n===1?[a]:[]; }
	    var i,ret = Array(n);
	    n--;
	    for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
	    return ret;
	}

	numeric.getBlock = function getBlock(x,from,to) {
	    var s = numeric.dim(x);
	    function foo(x,k) {
	        var i,a = from[k], n = to[k]-a, ret = Array(n);
	        if(k === s.length-1) {
	            for(i=n;i>=0;i--) { ret[i] = x[i+a]; }
	            return ret;
	        }
	        for(i=n;i>=0;i--) { ret[i] = foo(x[i+a],k+1); }
	        return ret;
	    }
	    return foo(x,0);
	}

	numeric.setBlock = function setBlock(x,from,to,B) {
	    var s = numeric.dim(x);
	    function foo(x,y,k) {
	        var i,a = from[k], n = to[k]-a;
	        if(k === s.length-1) { for(i=n;i>=0;i--) { x[i+a] = y[i]; } }
	        for(i=n;i>=0;i--) { foo(x[i+a],y[i],k+1); }
	    }
	    foo(x,B,0);
	    return x;
	}

	numeric.getRange = function getRange(A,I,J) {
	    var m = I.length, n = J.length;
	    var i,j;
	    var B = Array(m), Bi, AI;
	    for(i=m-1;i!==-1;--i) {
	        B[i] = Array(n);
	        Bi = B[i];
	        AI = A[I[i]];
	        for(j=n-1;j!==-1;--j) Bi[j] = AI[J[j]];
	    }
	    return B;
	}

	numeric.blockMatrix = function blockMatrix(X) {
	    var s = numeric.dim(X);
	    if(s.length<4) return numeric.blockMatrix([X]);
	    var m=s[0],n=s[1],M,N,i,j,Xij;
	    M = 0; N = 0;
	    for(i=0;i<m;++i) M+=X[i][0].length;
	    for(j=0;j<n;++j) N+=X[0][j][0].length;
	    var Z = Array(M);
	    for(i=0;i<M;++i) Z[i] = Array(N);
	    var I=0,J,ZI,k,l,Xijk;
	    for(i=0;i<m;++i) {
	        J=N;
	        for(j=n-1;j!==-1;--j) {
	            Xij = X[i][j];
	            J -= Xij[0].length;
	            for(k=Xij.length-1;k!==-1;--k) {
	                Xijk = Xij[k];
	                ZI = Z[I+k];
	                for(l = Xijk.length-1;l!==-1;--l) ZI[J+l] = Xijk[l];
	            }
	        }
	        I += X[i][0].length;
	    }
	    return Z;
	}

	numeric.tensor = function tensor(x,y) {
	    if(typeof x === "number" || typeof y === "number") return numeric.mul(x,y);
	    var s1 = numeric.dim(x), s2 = numeric.dim(y);
	    if(s1.length !== 1 || s2.length !== 1) {
	        throw new Error('numeric: tensor product is only defined for vectors');
	    }
	    var m = s1[0], n = s2[0], A = Array(m), Ai, i,j,xi;
	    for(i=m-1;i>=0;i--) {
	        Ai = Array(n);
	        xi = x[i];
	        for(j=n-1;j>=3;--j) {
	            Ai[j] = xi * y[j];
	            --j;
	            Ai[j] = xi * y[j];
	            --j;
	            Ai[j] = xi * y[j];
	            --j;
	            Ai[j] = xi * y[j];
	        }
	        while(j>=0) { Ai[j] = xi * y[j]; --j; }
	        A[i] = Ai;
	    }
	    return A;
	}

	// 3. The Tensor type T
	numeric.T = function T(x,y) { this.x = x; this.y = y; }
	numeric.t = function t(x,y) { return new numeric.T(x,y); }

	numeric.Tbinop = function Tbinop(rr,rc,cr,cc,setup) {
	    var io = numeric.indexOf;
	    if(typeof setup !== "string") {
	        var k;
	        setup = '';
	        for(k in numeric) {
	            if(numeric.hasOwnProperty(k) && (rr.indexOf(k)>=0 || rc.indexOf(k)>=0 || cr.indexOf(k)>=0 || cc.indexOf(k)>=0) && k.length>1) {
	                setup += 'var '+k+' = numeric.'+k+';\n';
	            }
	        }
	    }
	    return Function(['y'],
	            'var x = this;\n'+
	            'if(!(y instanceof numeric.T)) { y = new numeric.T(y); }\n'+
	            setup+'\n'+
	            'if(x.y) {'+
	            '  if(y.y) {'+
	            '    return new numeric.T('+cc+');\n'+
	            '  }\n'+
	            '  return new numeric.T('+cr+');\n'+
	            '}\n'+
	            'if(y.y) {\n'+
	            '  return new numeric.T('+rc+');\n'+
	            '}\n'+
	            'return new numeric.T('+rr+');\n'
	    );
	}

	numeric.T.prototype.add = numeric.Tbinop(
	        'add(x.x,y.x)',
	        'add(x.x,y.x),y.y',
	        'add(x.x,y.x),x.y',
	        'add(x.x,y.x),add(x.y,y.y)');
	numeric.T.prototype.sub = numeric.Tbinop(
	        'sub(x.x,y.x)',
	        'sub(x.x,y.x),neg(y.y)',
	        'sub(x.x,y.x),x.y',
	        'sub(x.x,y.x),sub(x.y,y.y)');
	numeric.T.prototype.mul = numeric.Tbinop(
	        'mul(x.x,y.x)',
	        'mul(x.x,y.x),mul(x.x,y.y)',
	        'mul(x.x,y.x),mul(x.y,y.x)',
	        'sub(mul(x.x,y.x),mul(x.y,y.y)),add(mul(x.x,y.y),mul(x.y,y.x))');

	numeric.T.prototype.reciprocal = function reciprocal() {
	    var mul = numeric.mul, div = numeric.div;
	    if(this.y) {
	        var d = numeric.add(mul(this.x,this.x),mul(this.y,this.y));
	        return new numeric.T(div(this.x,d),div(numeric.neg(this.y),d));
	    }
	    return new T(div(1,this.x));
	}
	numeric.T.prototype.div = function div(y) {
	    if(!(y instanceof numeric.T)) y = new numeric.T(y);
	    if(y.y) { return this.mul(y.reciprocal()); }
	    var div = numeric.div;
	    if(this.y) { return new numeric.T(div(this.x,y.x),div(this.y,y.x)); }
	    return new numeric.T(div(this.x,y.x));
	}
	numeric.T.prototype.dot = numeric.Tbinop(
	        'dot(x.x,y.x)',
	        'dot(x.x,y.x),dot(x.x,y.y)',
	        'dot(x.x,y.x),dot(x.y,y.x)',
	        'sub(dot(x.x,y.x),dot(x.y,y.y)),add(dot(x.x,y.y),dot(x.y,y.x))'
	        );
	numeric.T.prototype.transpose = function transpose() {
	    var t = numeric.transpose, x = this.x, y = this.y;
	    if(y) { return new numeric.T(t(x),t(y)); }
	    return new numeric.T(t(x));
	}
	numeric.T.prototype.transjugate = function transjugate() {
	    var t = numeric.transpose, x = this.x, y = this.y;
	    if(y) { return new numeric.T(t(x),numeric.negtranspose(y)); }
	    return new numeric.T(t(x));
	}
	numeric.Tunop = function Tunop(r,c,s) {
	    if(typeof s !== "string") { s = ''; }
	    return Function(
	            'var x = this;\n'+
	            s+'\n'+
	            'if(x.y) {'+
	            '  '+c+';\n'+
	            '}\n'+
	            r+';\n'
	    );
	}

	numeric.T.prototype.exp = numeric.Tunop(
	        'return new numeric.T(ex)',
	        'return new numeric.T(mul(cos(x.y),ex),mul(sin(x.y),ex))',
	        'var ex = numeric.exp(x.x), cos = numeric.cos, sin = numeric.sin, mul = numeric.mul;');
	numeric.T.prototype.conj = numeric.Tunop(
	        'return new numeric.T(x.x);',
	        'return new numeric.T(x.x,numeric.neg(x.y));');
	numeric.T.prototype.neg = numeric.Tunop(
	        'return new numeric.T(neg(x.x));',
	        'return new numeric.T(neg(x.x),neg(x.y));',
	        'var neg = numeric.neg;');
	numeric.T.prototype.sin = numeric.Tunop(
	        'return new numeric.T(numeric.sin(x.x))',
	        'return x.exp().sub(x.neg().exp()).div(new numeric.T(0,2));');
	numeric.T.prototype.cos = numeric.Tunop(
	        'return new numeric.T(numeric.cos(x.x))',
	        'return x.exp().add(x.neg().exp()).div(2);');
	numeric.T.prototype.abs = numeric.Tunop(
	        'return new numeric.T(numeric.abs(x.x));',
	        'return new numeric.T(numeric.sqrt(numeric.add(mul(x.x,x.x),mul(x.y,x.y))));',
	        'var mul = numeric.mul;');
	numeric.T.prototype.log = numeric.Tunop(
	        'return new numeric.T(numeric.log(x.x));',
	        'var theta = new numeric.T(numeric.atan2(x.y,x.x)), r = x.abs();\n'+
	        'return new numeric.T(numeric.log(r.x),theta.x);');
	numeric.T.prototype.norm2 = numeric.Tunop(
	        'return numeric.norm2(x.x);',
	        'var f = numeric.norm2Squared;\n'+
	        'return Math.sqrt(f(x.x)+f(x.y));');
	numeric.T.prototype.inv = function inv() {
	    var A = this;
	    if(typeof A.y === "undefined") { return new numeric.T(numeric.inv(A.x)); }
	    var n = A.x.length, i, j, k;
	    var Rx = numeric.identity(n),Ry = numeric.rep([n,n],0);
	    var Ax = numeric.clone(A.x), Ay = numeric.clone(A.y);
	    var Aix, Aiy, Ajx, Ajy, Rix, Riy, Rjx, Rjy;
	    var i,j,k,d,d1,ax,ay,bx,by,temp;
	    for(i=0;i<n;i++) {
	        ax = Ax[i][i]; ay = Ay[i][i];
	        d = ax*ax+ay*ay;
	        k = i;
	        for(j=i+1;j<n;j++) {
	            ax = Ax[j][i]; ay = Ay[j][i];
	            d1 = ax*ax+ay*ay;
	            if(d1 > d) { k=j; d = d1; }
	        }
	        if(k!==i) {
	            temp = Ax[i]; Ax[i] = Ax[k]; Ax[k] = temp;
	            temp = Ay[i]; Ay[i] = Ay[k]; Ay[k] = temp;
	            temp = Rx[i]; Rx[i] = Rx[k]; Rx[k] = temp;
	            temp = Ry[i]; Ry[i] = Ry[k]; Ry[k] = temp;
	        }
	        Aix = Ax[i]; Aiy = Ay[i];
	        Rix = Rx[i]; Riy = Ry[i];
	        ax = Aix[i]; ay = Aiy[i];
	        for(j=i+1;j<n;j++) {
	            bx = Aix[j]; by = Aiy[j];
	            Aix[j] = (bx*ax+by*ay)/d;
	            Aiy[j] = (by*ax-bx*ay)/d;
	        }
	        for(j=0;j<n;j++) {
	            bx = Rix[j]; by = Riy[j];
	            Rix[j] = (bx*ax+by*ay)/d;
	            Riy[j] = (by*ax-bx*ay)/d;
	        }
	        for(j=i+1;j<n;j++) {
	            Ajx = Ax[j]; Ajy = Ay[j];
	            Rjx = Rx[j]; Rjy = Ry[j];
	            ax = Ajx[i]; ay = Ajy[i];
	            for(k=i+1;k<n;k++) {
	                bx = Aix[k]; by = Aiy[k];
	                Ajx[k] -= bx*ax-by*ay;
	                Ajy[k] -= by*ax+bx*ay;
	            }
	            for(k=0;k<n;k++) {
	                bx = Rix[k]; by = Riy[k];
	                Rjx[k] -= bx*ax-by*ay;
	                Rjy[k] -= by*ax+bx*ay;
	            }
	        }
	    }
	    for(i=n-1;i>0;i--) {
	        Rix = Rx[i]; Riy = Ry[i];
	        for(j=i-1;j>=0;j--) {
	            Rjx = Rx[j]; Rjy = Ry[j];
	            ax = Ax[j][i]; ay = Ay[j][i];
	            for(k=n-1;k>=0;k--) {
	                bx = Rix[k]; by = Riy[k];
	                Rjx[k] -= ax*bx - ay*by;
	                Rjy[k] -= ax*by + ay*bx;
	            }
	        }
	    }
	    return new numeric.T(Rx,Ry);
	}
	numeric.T.prototype.get = function get(i) {
	    var x = this.x, y = this.y, k = 0, ik, n = i.length;
	    if(y) {
	        while(k<n) {
	            ik = i[k];
	            x = x[ik];
	            y = y[ik];
	            k++;
	        }
	        return new numeric.T(x,y);
	    }
	    while(k<n) {
	        ik = i[k];
	        x = x[ik];
	        k++;
	    }
	    return new numeric.T(x);
	}
	numeric.T.prototype.set = function set(i,v) {
	    var x = this.x, y = this.y, k = 0, ik, n = i.length, vx = v.x, vy = v.y;
	    if(n===0) {
	        if(vy) { this.y = vy; }
	        else if(y) { this.y = undefined; }
	        this.x = x;
	        return this;
	    }
	    if(vy) {
	        if(y) { /* ok */ }
	        else {
	            y = numeric.rep(numeric.dim(x),0);
	            this.y = y;
	        }
	        while(k<n-1) {
	            ik = i[k];
	            x = x[ik];
	            y = y[ik];
	            k++;
	        }
	        ik = i[k];
	        x[ik] = vx;
	        y[ik] = vy;
	        return this;
	    }
	    if(y) {
	        while(k<n-1) {
	            ik = i[k];
	            x = x[ik];
	            y = y[ik];
	            k++;
	        }
	        ik = i[k];
	        x[ik] = vx;
	        if(vx instanceof Array) y[ik] = numeric.rep(numeric.dim(vx),0);
	        else y[ik] = 0;
	        return this;
	    }
	    while(k<n-1) {
	        ik = i[k];
	        x = x[ik];
	        k++;
	    }
	    ik = i[k];
	    x[ik] = vx;
	    return this;
	}
	numeric.T.prototype.getRows = function getRows(i0,i1) {
	    var n = i1-i0+1, j;
	    var rx = Array(n), ry, x = this.x, y = this.y;
	    for(j=i0;j<=i1;j++) { rx[j-i0] = x[j]; }
	    if(y) {
	        ry = Array(n);
	        for(j=i0;j<=i1;j++) { ry[j-i0] = y[j]; }
	        return new numeric.T(rx,ry);
	    }
	    return new numeric.T(rx);
	}
	numeric.T.prototype.setRows = function setRows(i0,i1,A) {
	    var j;
	    var rx = this.x, ry = this.y, x = A.x, y = A.y;
	    for(j=i0;j<=i1;j++) { rx[j] = x[j-i0]; }
	    if(y) {
	        if(!ry) { ry = numeric.rep(numeric.dim(rx),0); this.y = ry; }
	        for(j=i0;j<=i1;j++) { ry[j] = y[j-i0]; }
	    } else if(ry) {
	        for(j=i0;j<=i1;j++) { ry[j] = numeric.rep([x[j-i0].length],0); }
	    }
	    return this;
	}
	numeric.T.prototype.getRow = function getRow(k) {
	    var x = this.x, y = this.y;
	    if(y) { return new numeric.T(x[k],y[k]); }
	    return new numeric.T(x[k]);
	}
	numeric.T.prototype.setRow = function setRow(i,v) {
	    var rx = this.x, ry = this.y, x = v.x, y = v.y;
	    rx[i] = x;
	    if(y) {
	        if(!ry) { ry = numeric.rep(numeric.dim(rx),0); this.y = ry; }
	        ry[i] = y;
	    } else if(ry) {
	        ry = numeric.rep([x.length],0);
	    }
	    return this;
	}

	numeric.T.prototype.getBlock = function getBlock(from,to) {
	    var x = this.x, y = this.y, b = numeric.getBlock;
	    if(y) { return new numeric.T(b(x,from,to),b(y,from,to)); }
	    return new numeric.T(b(x,from,to));
	}
	numeric.T.prototype.setBlock = function setBlock(from,to,A) {
	    if(!(A instanceof numeric.T)) A = new numeric.T(A);
	    var x = this.x, y = this.y, b = numeric.setBlock, Ax = A.x, Ay = A.y;
	    if(Ay) {
	        if(!y) { this.y = numeric.rep(numeric.dim(this),0); y = this.y; }
	        b(x,from,to,Ax);
	        b(y,from,to,Ay);
	        return this;
	    }
	    b(x,from,to,Ax);
	    if(y) b(y,from,to,numeric.rep(numeric.dim(Ax),0));
	}
	numeric.T.rep = function rep(s,v) {
	    var T = numeric.T;
	    if(!(v instanceof T)) v = new T(v);
	    var x = v.x, y = v.y, r = numeric.rep;
	    if(y) return new T(r(s,x),r(s,y));
	    return new T(r(s,x));
	}
	numeric.T.diag = function diag(d) {
	    if(!(d instanceof numeric.T)) d = new numeric.T(d);
	    var x = d.x, y = d.y, diag = numeric.diag;
	    if(y) return new numeric.T(diag(x),diag(y));
	    return new numeric.T(diag(x));
	}
	numeric.T.eig = function eig() {
	    if(this.y) { throw new Error('eig: not implemented for complex matrices.'); }
	    return numeric.eig(this.x);
	}
	numeric.T.identity = function identity(n) { return new numeric.T(numeric.identity(n)); }
	numeric.T.prototype.getDiag = function getDiag() {
	    var n = numeric;
	    var x = this.x, y = this.y;
	    if(y) { return new n.T(n.getDiag(x),n.getDiag(y)); }
	    return new n.T(n.getDiag(x));
	}

	// 4. Eigenvalues of real matrices

	numeric.house = function house(x) {
	    var v = numeric.clone(x);
	    var s = x[0] >= 0 ? 1 : -1;
	    var alpha = s*numeric.norm2(x);
	    v[0] += alpha;
	    var foo = numeric.norm2(v);
	    if(foo === 0) { /* this should not happen */ throw new Error('eig: internal error'); }
	    return numeric.div(v,foo);
	}

	numeric.toUpperHessenberg = function toUpperHessenberg(me) {
	    var s = numeric.dim(me);
	    if(s.length !== 2 || s[0] !== s[1]) { throw new Error('numeric: toUpperHessenberg() only works on square matrices'); }
	    var m = s[0], i,j,k,x,v,A = numeric.clone(me),B,C,Ai,Ci,Q = numeric.identity(m),Qi;
	    for(j=0;j<m-2;j++) {
	        x = Array(m-j-1);
	        for(i=j+1;i<m;i++) { x[i-j-1] = A[i][j]; }
	        if(numeric.norm2(x)>0) {
	            v = numeric.house(x);
	            B = numeric.getBlock(A,[j+1,j],[m-1,m-1]);
	            C = numeric.tensor(v,numeric.dot(v,B));
	            for(i=j+1;i<m;i++) { Ai = A[i]; Ci = C[i-j-1]; for(k=j;k<m;k++) Ai[k] -= 2*Ci[k-j]; }
	            B = numeric.getBlock(A,[0,j+1],[m-1,m-1]);
	            C = numeric.tensor(numeric.dot(B,v),v);
	            for(i=0;i<m;i++) { Ai = A[i]; Ci = C[i]; for(k=j+1;k<m;k++) Ai[k] -= 2*Ci[k-j-1]; }
	            B = Array(m-j-1);
	            for(i=j+1;i<m;i++) B[i-j-1] = Q[i];
	            C = numeric.tensor(v,numeric.dot(v,B));
	            for(i=j+1;i<m;i++) { Qi = Q[i]; Ci = C[i-j-1]; for(k=0;k<m;k++) Qi[k] -= 2*Ci[k]; }
	        }
	    }
	    return {H:A, Q:Q};
	}

	numeric.epsilon = 2.220446049250313e-16;

	numeric.QRFrancis = function(H,maxiter) {
	    if(typeof maxiter === "undefined") { maxiter = 10000; }
	    H = numeric.clone(H);
	    var H0 = numeric.clone(H);
	    var s = numeric.dim(H),m=s[0],x,v,a,b,c,d,det,tr, Hloc, Q = numeric.identity(m), Qi, Hi, B, C, Ci,i,j,k,iter;
	    if(m<3) { return {Q:Q, B:[ [0,m-1] ]}; }
	    var epsilon = numeric.epsilon;
	    for(iter=0;iter<maxiter;iter++) {
	        for(j=0;j<m-1;j++) {
	            if(Math.abs(H[j+1][j]) < epsilon*(Math.abs(H[j][j])+Math.abs(H[j+1][j+1]))) {
	                var QH1 = numeric.QRFrancis(numeric.getBlock(H,[0,0],[j,j]),maxiter);
	                var QH2 = numeric.QRFrancis(numeric.getBlock(H,[j+1,j+1],[m-1,m-1]),maxiter);
	                B = Array(j+1);
	                for(i=0;i<=j;i++) { B[i] = Q[i]; }
	                C = numeric.dot(QH1.Q,B);
	                for(i=0;i<=j;i++) { Q[i] = C[i]; }
	                B = Array(m-j-1);
	                for(i=j+1;i<m;i++) { B[i-j-1] = Q[i]; }
	                C = numeric.dot(QH2.Q,B);
	                for(i=j+1;i<m;i++) { Q[i] = C[i-j-1]; }
	                return {Q:Q,B:QH1.B.concat(numeric.add(QH2.B,j+1))};
	            }
	        }
	        a = H[m-2][m-2]; b = H[m-2][m-1];
	        c = H[m-1][m-2]; d = H[m-1][m-1];
	        tr = a+d;
	        det = (a*d-b*c);
	        Hloc = numeric.getBlock(H, [0,0], [2,2]);
	        if(tr*tr>=4*det) {
	            var s1,s2;
	            s1 = 0.5*(tr+Math.sqrt(tr*tr-4*det));
	            s2 = 0.5*(tr-Math.sqrt(tr*tr-4*det));
	            Hloc = numeric.add(numeric.sub(numeric.dot(Hloc,Hloc),
	                                           numeric.mul(Hloc,s1+s2)),
	                               numeric.diag(numeric.rep([3],s1*s2)));
	        } else {
	            Hloc = numeric.add(numeric.sub(numeric.dot(Hloc,Hloc),
	                                           numeric.mul(Hloc,tr)),
	                               numeric.diag(numeric.rep([3],det)));
	        }
	        x = [Hloc[0][0],Hloc[1][0],Hloc[2][0]];
	        v = numeric.house(x);
	        B = [H[0],H[1],H[2]];
	        C = numeric.tensor(v,numeric.dot(v,B));
	        for(i=0;i<3;i++) { Hi = H[i]; Ci = C[i]; for(k=0;k<m;k++) Hi[k] -= 2*Ci[k]; }
	        B = numeric.getBlock(H, [0,0],[m-1,2]);
	        C = numeric.tensor(numeric.dot(B,v),v);
	        for(i=0;i<m;i++) { Hi = H[i]; Ci = C[i]; for(k=0;k<3;k++) Hi[k] -= 2*Ci[k]; }
	        B = [Q[0],Q[1],Q[2]];
	        C = numeric.tensor(v,numeric.dot(v,B));
	        for(i=0;i<3;i++) { Qi = Q[i]; Ci = C[i]; for(k=0;k<m;k++) Qi[k] -= 2*Ci[k]; }
	        var J;
	        for(j=0;j<m-2;j++) {
	            for(k=j;k<=j+1;k++) {
	                if(Math.abs(H[k+1][k]) < epsilon*(Math.abs(H[k][k])+Math.abs(H[k+1][k+1]))) {
	                    var QH1 = numeric.QRFrancis(numeric.getBlock(H,[0,0],[k,k]),maxiter);
	                    var QH2 = numeric.QRFrancis(numeric.getBlock(H,[k+1,k+1],[m-1,m-1]),maxiter);
	                    B = Array(k+1);
	                    for(i=0;i<=k;i++) { B[i] = Q[i]; }
	                    C = numeric.dot(QH1.Q,B);
	                    for(i=0;i<=k;i++) { Q[i] = C[i]; }
	                    B = Array(m-k-1);
	                    for(i=k+1;i<m;i++) { B[i-k-1] = Q[i]; }
	                    C = numeric.dot(QH2.Q,B);
	                    for(i=k+1;i<m;i++) { Q[i] = C[i-k-1]; }
	                    return {Q:Q,B:QH1.B.concat(numeric.add(QH2.B,k+1))};
	                }
	            }
	            J = Math.min(m-1,j+3);
	            x = Array(J-j);
	            for(i=j+1;i<=J;i++) { x[i-j-1] = H[i][j]; }
	            v = numeric.house(x);
	            B = numeric.getBlock(H, [j+1,j],[J,m-1]);
	            C = numeric.tensor(v,numeric.dot(v,B));
	            for(i=j+1;i<=J;i++) { Hi = H[i]; Ci = C[i-j-1]; for(k=j;k<m;k++) Hi[k] -= 2*Ci[k-j]; }
	            B = numeric.getBlock(H, [0,j+1],[m-1,J]);
	            C = numeric.tensor(numeric.dot(B,v),v);
	            for(i=0;i<m;i++) { Hi = H[i]; Ci = C[i]; for(k=j+1;k<=J;k++) Hi[k] -= 2*Ci[k-j-1]; }
	            B = Array(J-j);
	            for(i=j+1;i<=J;i++) B[i-j-1] = Q[i];
	            C = numeric.tensor(v,numeric.dot(v,B));
	            for(i=j+1;i<=J;i++) { Qi = Q[i]; Ci = C[i-j-1]; for(k=0;k<m;k++) Qi[k] -= 2*Ci[k]; }
	        }
	    }
	    throw new Error('numeric: eigenvalue iteration does not converge -- increase maxiter?');
	}

	numeric.eig = function eig(A,maxiter) {
	    var QH = numeric.toUpperHessenberg(A);
	    var QB = numeric.QRFrancis(QH.H,maxiter);
	    var T = numeric.T;
	    var n = A.length,i,k,flag = false,B = QB.B,H = numeric.dot(QB.Q,numeric.dot(QH.H,numeric.transpose(QB.Q)));
	    var Q = new T(numeric.dot(QB.Q,QH.Q)),Q0;
	    var m = B.length,j;
	    var a,b,c,d,p1,p2,disc,x,y,p,q,n1,n2;
	    var sqrt = Math.sqrt;
	    for(k=0;k<m;k++) {
	        i = B[k][0];
	        if(i === B[k][1]) {
	            // nothing
	        } else {
	            j = i+1;
	            a = H[i][i];
	            b = H[i][j];
	            c = H[j][i];
	            d = H[j][j];
	            if(b === 0 && c === 0) continue;
	            p1 = -a-d;
	            p2 = a*d-b*c;
	            disc = p1*p1-4*p2;
	            if(disc>=0) {
	                if(p1<0) x = -0.5*(p1-sqrt(disc));
	                else     x = -0.5*(p1+sqrt(disc));
	                n1 = (a-x)*(a-x)+b*b;
	                n2 = c*c+(d-x)*(d-x);
	                if(n1>n2) {
	                    n1 = sqrt(n1);
	                    p = (a-x)/n1;
	                    q = b/n1;
	                } else {
	                    n2 = sqrt(n2);
	                    p = c/n2;
	                    q = (d-x)/n2;
	                }
	                Q0 = new T([[q,-p],[p,q]]);
	                Q.setRows(i,j,Q0.dot(Q.getRows(i,j)));
	            } else {
	                x = -0.5*p1;
	                y = 0.5*sqrt(-disc);
	                n1 = (a-x)*(a-x)+b*b;
	                n2 = c*c+(d-x)*(d-x);
	                if(n1>n2) {
	                    n1 = sqrt(n1+y*y);
	                    p = (a-x)/n1;
	                    q = b/n1;
	                    x = 0;
	                    y /= n1;
	                } else {
	                    n2 = sqrt(n2+y*y);
	                    p = c/n2;
	                    q = (d-x)/n2;
	                    x = y/n2;
	                    y = 0;
	                }
	                Q0 = new T([[q,-p],[p,q]],[[x,y],[y,-x]]);
	                Q.setRows(i,j,Q0.dot(Q.getRows(i,j)));
	            }
	        }
	    }
	    var R = Q.dot(A).dot(Q.transjugate()), n = A.length, E = numeric.T.identity(n);
	    for(j=0;j<n;j++) {
	        if(j>0) {
	            for(k=j-1;k>=0;k--) {
	                var Rk = R.get([k,k]), Rj = R.get([j,j]);
	                if(numeric.neq(Rk.x,Rj.x) || numeric.neq(Rk.y,Rj.y)) {
	                    x = R.getRow(k).getBlock([k],[j-1]);
	                    y = E.getRow(j).getBlock([k],[j-1]);
	                    E.set([j,k],(R.get([k,j]).neg().sub(x.dot(y))).div(Rk.sub(Rj)));
	                } else {
	                    E.setRow(j,E.getRow(k));
	                    continue;
	                }
	            }
	        }
	    }
	    for(j=0;j<n;j++) {
	        x = E.getRow(j);
	        E.setRow(j,x.div(x.norm2()));
	    }
	    E = E.transpose();
	    E = Q.transjugate().dot(E);
	    return { lambda:R.getDiag(), E:E };
	};

	// 5. Compressed Column Storage matrices
	numeric.ccsSparse = function ccsSparse(A) {
	    var m = A.length,n,foo, i,j, counts = [];
	    for(i=m-1;i!==-1;--i) {
	        foo = A[i];
	        for(j in foo) {
	            j = parseInt(j);
	            while(j>=counts.length) counts[counts.length] = 0;
	            if(foo[j]!==0) counts[j]++;
	        }
	    }
	    var n = counts.length;
	    var Ai = Array(n+1);
	    Ai[0] = 0;
	    for(i=0;i<n;++i) Ai[i+1] = Ai[i] + counts[i];
	    var Aj = Array(Ai[n]), Av = Array(Ai[n]);
	    for(i=m-1;i!==-1;--i) {
	        foo = A[i];
	        for(j in foo) {
	            if(foo[j]!==0) {
	                counts[j]--;
	                Aj[Ai[j]+counts[j]] = i;
	                Av[Ai[j]+counts[j]] = foo[j];
	            }
	        }
	    }
	    return [Ai,Aj,Av];
	}
	numeric.ccsFull = function ccsFull(A) {
	    var Ai = A[0], Aj = A[1], Av = A[2], s = numeric.ccsDim(A), m = s[0], n = s[1], i,j,j0,j1,k;
	    var B = numeric.rep([m,n],0);
	    for(i=0;i<n;i++) {
	        j0 = Ai[i];
	        j1 = Ai[i+1];
	        for(j=j0;j<j1;++j) { B[Aj[j]][i] = Av[j]; }
	    }
	    return B;
	}
	numeric.ccsTSolve = function ccsTSolve(A,b,x,bj,xj) {
	    var Ai = A[0], Aj = A[1], Av = A[2],m = Ai.length-1, max = Math.max,n=0;
	    if(typeof bj === "undefined") x = numeric.rep([m],0);
	    if(typeof bj === "undefined") bj = numeric.linspace(0,x.length-1);
	    if(typeof xj === "undefined") xj = [];
	    function dfs(j) {
	        var k;
	        if(x[j] !== 0) return;
	        x[j] = 1;
	        for(k=Ai[j];k<Ai[j+1];++k) dfs(Aj[k]);
	        xj[n] = j;
	        ++n;
	    }
	    var i,j,j0,j1,k,l,l0,l1,a;
	    for(i=bj.length-1;i!==-1;--i) { dfs(bj[i]); }
	    xj.length = n;
	    for(i=xj.length-1;i!==-1;--i) { x[xj[i]] = 0; }
	    for(i=bj.length-1;i!==-1;--i) { j = bj[i]; x[j] = b[j]; }
	    for(i=xj.length-1;i!==-1;--i) {
	        j = xj[i];
	        j0 = Ai[j];
	        j1 = max(Ai[j+1],j0);
	        for(k=j0;k!==j1;++k) { if(Aj[k] === j) { x[j] /= Av[k]; break; } }
	        a = x[j];
	        for(k=j0;k!==j1;++k) {
	            l = Aj[k];
	            if(l !== j) x[l] -= a*Av[k];
	        }
	    }
	    return x;
	}
	numeric.ccsDFS = function ccsDFS(n) {
	    this.k = Array(n);
	    this.k1 = Array(n);
	    this.j = Array(n);
	}
	numeric.ccsDFS.prototype.dfs = function dfs(J,Ai,Aj,x,xj,Pinv) {
	    var m = 0,foo,n=xj.length;
	    var k = this.k, k1 = this.k1, j = this.j,km,k11;
	    if(x[J]!==0) return;
	    x[J] = 1;
	    j[0] = J;
	    k[0] = km = Ai[J];
	    k1[0] = k11 = Ai[J+1];
	    while(1) {
	        if(km >= k11) {
	            xj[n] = j[m];
	            if(m===0) return;
	            ++n;
	            --m;
	            km = k[m];
	            k11 = k1[m];
	        } else {
	            foo = Pinv[Aj[km]];
	            if(x[foo] === 0) {
	                x[foo] = 1;
	                k[m] = km;
	                ++m;
	                j[m] = foo;
	                km = Ai[foo];
	                k1[m] = k11 = Ai[foo+1];
	            } else ++km;
	        }
	    }
	}
	numeric.ccsLPSolve = function ccsLPSolve(A,B,x,xj,I,Pinv,dfs) {
	    var Ai = A[0], Aj = A[1], Av = A[2],m = Ai.length-1, n=0;
	    var Bi = B[0], Bj = B[1], Bv = B[2];
	    
	    var i,i0,i1,j,J,j0,j1,k,l,l0,l1,a;
	    i0 = Bi[I];
	    i1 = Bi[I+1];
	    xj.length = 0;
	    for(i=i0;i<i1;++i) { dfs.dfs(Pinv[Bj[i]],Ai,Aj,x,xj,Pinv); }
	    for(i=xj.length-1;i!==-1;--i) { x[xj[i]] = 0; }
	    for(i=i0;i!==i1;++i) { j = Pinv[Bj[i]]; x[j] = Bv[i]; }
	    for(i=xj.length-1;i!==-1;--i) {
	        j = xj[i];
	        j0 = Ai[j];
	        j1 = Ai[j+1];
	        for(k=j0;k<j1;++k) { if(Pinv[Aj[k]] === j) { x[j] /= Av[k]; break; } }
	        a = x[j];
	        for(k=j0;k<j1;++k) {
	            l = Pinv[Aj[k]];
	            if(l !== j) x[l] -= a*Av[k];
	        }
	    }
	    return x;
	}
	numeric.ccsLUP1 = function ccsLUP1(A,threshold) {
	    var m = A[0].length-1;
	    var L = [numeric.rep([m+1],0),[],[]], U = [numeric.rep([m+1], 0),[],[]];
	    var Li = L[0], Lj = L[1], Lv = L[2], Ui = U[0], Uj = U[1], Uv = U[2];
	    var x = numeric.rep([m],0), xj = numeric.rep([m],0);
	    var i,j,k,j0,j1,a,e,c,d,K;
	    var sol = numeric.ccsLPSolve, max = Math.max, abs = Math.abs;
	    var P = numeric.linspace(0,m-1),Pinv = numeric.linspace(0,m-1);
	    var dfs = new numeric.ccsDFS(m);
	    if(typeof threshold === "undefined") { threshold = 1; }
	    for(i=0;i<m;++i) {
	        sol(L,A,x,xj,i,Pinv,dfs);
	        a = -1;
	        e = -1;
	        for(j=xj.length-1;j!==-1;--j) {
	            k = xj[j];
	            if(k <= i) continue;
	            c = abs(x[k]);
	            if(c > a) { e = k; a = c; }
	        }
	        if(abs(x[i])<threshold*a) {
	            j = P[i];
	            a = P[e];
	            P[i] = a; Pinv[a] = i;
	            P[e] = j; Pinv[j] = e;
	            a = x[i]; x[i] = x[e]; x[e] = a;
	        }
	        a = Li[i];
	        e = Ui[i];
	        d = x[i];
	        Lj[a] = P[i];
	        Lv[a] = 1;
	        ++a;
	        for(j=xj.length-1;j!==-1;--j) {
	            k = xj[j];
	            c = x[k];
	            xj[j] = 0;
	            x[k] = 0;
	            if(k<=i) { Uj[e] = k; Uv[e] = c;   ++e; }
	            else     { Lj[a] = P[k]; Lv[a] = c/d; ++a; }
	        }
	        Li[i+1] = a;
	        Ui[i+1] = e;
	    }
	    for(j=Lj.length-1;j!==-1;--j) { Lj[j] = Pinv[Lj[j]]; }
	    return {L:L, U:U, P:P, Pinv:Pinv};
	}
	numeric.ccsDFS0 = function ccsDFS0(n) {
	    this.k = Array(n);
	    this.k1 = Array(n);
	    this.j = Array(n);
	}
	numeric.ccsDFS0.prototype.dfs = function dfs(J,Ai,Aj,x,xj,Pinv,P) {
	    var m = 0,foo,n=xj.length;
	    var k = this.k, k1 = this.k1, j = this.j,km,k11;
	    if(x[J]!==0) return;
	    x[J] = 1;
	    j[0] = J;
	    k[0] = km = Ai[Pinv[J]];
	    k1[0] = k11 = Ai[Pinv[J]+1];
	    while(1) {
	        if(isNaN(km)) throw new Error("Ow!");
	        if(km >= k11) {
	            xj[n] = Pinv[j[m]];
	            if(m===0) return;
	            ++n;
	            --m;
	            km = k[m];
	            k11 = k1[m];
	        } else {
	            foo = Aj[km];
	            if(x[foo] === 0) {
	                x[foo] = 1;
	                k[m] = km;
	                ++m;
	                j[m] = foo;
	                foo = Pinv[foo];
	                km = Ai[foo];
	                k1[m] = k11 = Ai[foo+1];
	            } else ++km;
	        }
	    }
	}
	numeric.ccsLPSolve0 = function ccsLPSolve0(A,B,y,xj,I,Pinv,P,dfs) {
	    var Ai = A[0], Aj = A[1], Av = A[2],m = Ai.length-1, n=0;
	    var Bi = B[0], Bj = B[1], Bv = B[2];
	    
	    var i,i0,i1,j,J,j0,j1,k,l,l0,l1,a;
	    i0 = Bi[I];
	    i1 = Bi[I+1];
	    xj.length = 0;
	    for(i=i0;i<i1;++i) { dfs.dfs(Bj[i],Ai,Aj,y,xj,Pinv,P); }
	    for(i=xj.length-1;i!==-1;--i) { j = xj[i]; y[P[j]] = 0; }
	    for(i=i0;i!==i1;++i) { j = Bj[i]; y[j] = Bv[i]; }
	    for(i=xj.length-1;i!==-1;--i) {
	        j = xj[i];
	        l = P[j];
	        j0 = Ai[j];
	        j1 = Ai[j+1];
	        for(k=j0;k<j1;++k) { if(Aj[k] === l) { y[l] /= Av[k]; break; } }
	        a = y[l];
	        for(k=j0;k<j1;++k) y[Aj[k]] -= a*Av[k];
	        y[l] = a;
	    }
	}
	numeric.ccsLUP0 = function ccsLUP0(A,threshold) {
	    var m = A[0].length-1;
	    var L = [numeric.rep([m+1],0),[],[]], U = [numeric.rep([m+1], 0),[],[]];
	    var Li = L[0], Lj = L[1], Lv = L[2], Ui = U[0], Uj = U[1], Uv = U[2];
	    var y = numeric.rep([m],0), xj = numeric.rep([m],0);
	    var i,j,k,j0,j1,a,e,c,d,K;
	    var sol = numeric.ccsLPSolve0, max = Math.max, abs = Math.abs;
	    var P = numeric.linspace(0,m-1),Pinv = numeric.linspace(0,m-1);
	    var dfs = new numeric.ccsDFS0(m);
	    if(typeof threshold === "undefined") { threshold = 1; }
	    for(i=0;i<m;++i) {
	        sol(L,A,y,xj,i,Pinv,P,dfs);
	        a = -1;
	        e = -1;
	        for(j=xj.length-1;j!==-1;--j) {
	            k = xj[j];
	            if(k <= i) continue;
	            c = abs(y[P[k]]);
	            if(c > a) { e = k; a = c; }
	        }
	        if(abs(y[P[i]])<threshold*a) {
	            j = P[i];
	            a = P[e];
	            P[i] = a; Pinv[a] = i;
	            P[e] = j; Pinv[j] = e;
	        }
	        a = Li[i];
	        e = Ui[i];
	        d = y[P[i]];
	        Lj[a] = P[i];
	        Lv[a] = 1;
	        ++a;
	        for(j=xj.length-1;j!==-1;--j) {
	            k = xj[j];
	            c = y[P[k]];
	            xj[j] = 0;
	            y[P[k]] = 0;
	            if(k<=i) { Uj[e] = k; Uv[e] = c;   ++e; }
	            else     { Lj[a] = P[k]; Lv[a] = c/d; ++a; }
	        }
	        Li[i+1] = a;
	        Ui[i+1] = e;
	    }
	    for(j=Lj.length-1;j!==-1;--j) { Lj[j] = Pinv[Lj[j]]; }
	    return {L:L, U:U, P:P, Pinv:Pinv};
	}
	numeric.ccsLUP = numeric.ccsLUP0;

	numeric.ccsDim = function ccsDim(A) { return [numeric.sup(A[1])+1,A[0].length-1]; }
	numeric.ccsGetBlock = function ccsGetBlock(A,i,j) {
	    var s = numeric.ccsDim(A),m=s[0],n=s[1];
	    if(typeof i === "undefined") { i = numeric.linspace(0,m-1); }
	    else if(typeof i === "number") { i = [i]; }
	    if(typeof j === "undefined") { j = numeric.linspace(0,n-1); }
	    else if(typeof j === "number") { j = [j]; }
	    var p,p0,p1,P = i.length,q,Q = j.length,r,jq,ip;
	    var Bi = numeric.rep([n],0), Bj=[], Bv=[], B = [Bi,Bj,Bv];
	    var Ai = A[0], Aj = A[1], Av = A[2];
	    var x = numeric.rep([m],0),count=0,flags = numeric.rep([m],0);
	    for(q=0;q<Q;++q) {
	        jq = j[q];
	        var q0 = Ai[jq];
	        var q1 = Ai[jq+1];
	        for(p=q0;p<q1;++p) {
	            r = Aj[p];
	            flags[r] = 1;
	            x[r] = Av[p];
	        }
	        for(p=0;p<P;++p) {
	            ip = i[p];
	            if(flags[ip]) {
	                Bj[count] = p;
	                Bv[count] = x[i[p]];
	                ++count;
	            }
	        }
	        for(p=q0;p<q1;++p) {
	            r = Aj[p];
	            flags[r] = 0;
	        }
	        Bi[q+1] = count;
	    }
	    return B;
	}

	numeric.ccsDot = function ccsDot(A,B) {
	    var Ai = A[0], Aj = A[1], Av = A[2];
	    var Bi = B[0], Bj = B[1], Bv = B[2];
	    var sA = numeric.ccsDim(A), sB = numeric.ccsDim(B);
	    var m = sA[0], n = sA[1], o = sB[1];
	    var x = numeric.rep([m],0), flags = numeric.rep([m],0), xj = Array(m);
	    var Ci = numeric.rep([o],0), Cj = [], Cv = [], C = [Ci,Cj,Cv];
	    var i,j,k,j0,j1,i0,i1,l,p,a,b;
	    for(k=0;k!==o;++k) {
	        j0 = Bi[k];
	        j1 = Bi[k+1];
	        p = 0;
	        for(j=j0;j<j1;++j) {
	            a = Bj[j];
	            b = Bv[j];
	            i0 = Ai[a];
	            i1 = Ai[a+1];
	            for(i=i0;i<i1;++i) {
	                l = Aj[i];
	                if(flags[l]===0) {
	                    xj[p] = l;
	                    flags[l] = 1;
	                    p = p+1;
	                }
	                x[l] = x[l] + Av[i]*b;
	            }
	        }
	        j0 = Ci[k];
	        j1 = j0+p;
	        Ci[k+1] = j1;
	        for(j=p-1;j!==-1;--j) {
	            b = j0+j;
	            i = xj[j];
	            Cj[b] = i;
	            Cv[b] = x[i];
	            flags[i] = 0;
	            x[i] = 0;
	        }
	        Ci[k+1] = Ci[k]+p;
	    }
	    return C;
	}

	numeric.ccsLUPSolve = function ccsLUPSolve(LUP,B) {
	    var L = LUP.L, U = LUP.U, P = LUP.P;
	    var Bi = B[0];
	    var flag = false;
	    if(typeof Bi !== "object") { B = [[0,B.length],numeric.linspace(0,B.length-1),B]; Bi = B[0]; flag = true; }
	    var Bj = B[1], Bv = B[2];
	    var n = L[0].length-1, m = Bi.length-1;
	    var x = numeric.rep([n],0), xj = Array(n);
	    var b = numeric.rep([n],0), bj = Array(n);
	    var Xi = numeric.rep([m+1],0), Xj = [], Xv = [];
	    var sol = numeric.ccsTSolve;
	    var i,j,j0,j1,k,J,N=0;
	    for(i=0;i<m;++i) {
	        k = 0;
	        j0 = Bi[i];
	        j1 = Bi[i+1];
	        for(j=j0;j<j1;++j) { 
	            J = LUP.Pinv[Bj[j]];
	            bj[k] = J;
	            b[J] = Bv[j];
	            ++k;
	        }
	        bj.length = k;
	        sol(L,b,x,bj,xj);
	        for(j=bj.length-1;j!==-1;--j) b[bj[j]] = 0;
	        sol(U,x,b,xj,bj);
	        if(flag) return b;
	        for(j=xj.length-1;j!==-1;--j) x[xj[j]] = 0;
	        for(j=bj.length-1;j!==-1;--j) {
	            J = bj[j];
	            Xj[N] = J;
	            Xv[N] = b[J];
	            b[J] = 0;
	            ++N;
	        }
	        Xi[i+1] = N;
	    }
	    return [Xi,Xj,Xv];
	}

	numeric.ccsbinop = function ccsbinop(body,setup) {
	    if(typeof setup === "undefined") setup='';
	    return Function('X','Y',
	            'var Xi = X[0], Xj = X[1], Xv = X[2];\n'+
	            'var Yi = Y[0], Yj = Y[1], Yv = Y[2];\n'+
	            'var n = Xi.length-1,m = Math.max(numeric.sup(Xj),numeric.sup(Yj))+1;\n'+
	            'var Zi = numeric.rep([n+1],0), Zj = [], Zv = [];\n'+
	            'var x = numeric.rep([m],0),y = numeric.rep([m],0);\n'+
	            'var xk,yk,zk;\n'+
	            'var i,j,j0,j1,k,p=0;\n'+
	            setup+
	            'for(i=0;i<n;++i) {\n'+
	            '  j0 = Xi[i]; j1 = Xi[i+1];\n'+
	            '  for(j=j0;j!==j1;++j) {\n'+
	            '    k = Xj[j];\n'+
	            '    x[k] = 1;\n'+
	            '    Zj[p] = k;\n'+
	            '    ++p;\n'+
	            '  }\n'+
	            '  j0 = Yi[i]; j1 = Yi[i+1];\n'+
	            '  for(j=j0;j!==j1;++j) {\n'+
	            '    k = Yj[j];\n'+
	            '    y[k] = Yv[j];\n'+
	            '    if(x[k] === 0) {\n'+
	            '      Zj[p] = k;\n'+
	            '      ++p;\n'+
	            '    }\n'+
	            '  }\n'+
	            '  Zi[i+1] = p;\n'+
	            '  j0 = Xi[i]; j1 = Xi[i+1];\n'+
	            '  for(j=j0;j!==j1;++j) x[Xj[j]] = Xv[j];\n'+
	            '  j0 = Zi[i]; j1 = Zi[i+1];\n'+
	            '  for(j=j0;j!==j1;++j) {\n'+
	            '    k = Zj[j];\n'+
	            '    xk = x[k];\n'+
	            '    yk = y[k];\n'+
	            body+'\n'+
	            '    Zv[j] = zk;\n'+
	            '  }\n'+
	            '  j0 = Xi[i]; j1 = Xi[i+1];\n'+
	            '  for(j=j0;j!==j1;++j) x[Xj[j]] = 0;\n'+
	            '  j0 = Yi[i]; j1 = Yi[i+1];\n'+
	            '  for(j=j0;j!==j1;++j) y[Yj[j]] = 0;\n'+
	            '}\n'+
	            'return [Zi,Zj,Zv];'
	            );
	};

	(function() {
	    var k,A,B,C;
	    for(k in numeric.ops2) {
	        if(isFinite(eval('1'+numeric.ops2[k]+'0'))) A = '[Y[0],Y[1],numeric.'+k+'(X,Y[2])]';
	        else A = 'NaN';
	        if(isFinite(eval('0'+numeric.ops2[k]+'1'))) B = '[X[0],X[1],numeric.'+k+'(X[2],Y)]';
	        else B = 'NaN';
	        if(isFinite(eval('1'+numeric.ops2[k]+'0')) && isFinite(eval('0'+numeric.ops2[k]+'1'))) C = 'numeric.ccs'+k+'MM(X,Y)';
	        else C = 'NaN';
	        numeric['ccs'+k+'MM'] = numeric.ccsbinop('zk = xk '+numeric.ops2[k]+'yk;');
	        numeric['ccs'+k] = Function('X','Y',
	                'if(typeof X === "number") return '+A+';\n'+
	                'if(typeof Y === "number") return '+B+';\n'+
	                'return '+C+';\n'
	                );
	    }
	}());

	numeric.ccsScatter = function ccsScatter(A) {
	    var Ai = A[0], Aj = A[1], Av = A[2];
	    var n = numeric.sup(Aj)+1,m=Ai.length;
	    var Ri = numeric.rep([n],0),Rj=Array(m), Rv = Array(m);
	    var counts = numeric.rep([n],0),i;
	    for(i=0;i<m;++i) counts[Aj[i]]++;
	    for(i=0;i<n;++i) Ri[i+1] = Ri[i] + counts[i];
	    var ptr = Ri.slice(0),k,Aii;
	    for(i=0;i<m;++i) {
	        Aii = Aj[i];
	        k = ptr[Aii];
	        Rj[k] = Ai[i];
	        Rv[k] = Av[i];
	        ptr[Aii]=ptr[Aii]+1;
	    }
	    return [Ri,Rj,Rv];
	}

	numeric.ccsGather = function ccsGather(A) {
	    var Ai = A[0], Aj = A[1], Av = A[2];
	    var n = Ai.length-1,m = Aj.length;
	    var Ri = Array(m), Rj = Array(m), Rv = Array(m);
	    var i,j,j0,j1,p;
	    p=0;
	    for(i=0;i<n;++i) {
	        j0 = Ai[i];
	        j1 = Ai[i+1];
	        for(j=j0;j!==j1;++j) {
	            Rj[p] = i;
	            Ri[p] = Aj[j];
	            Rv[p] = Av[j];
	            ++p;
	        }
	    }
	    return [Ri,Rj,Rv];
	}

	// The following sparse linear algebra routines are deprecated.

	numeric.sdim = function dim(A,ret,k) {
	    if(typeof ret === "undefined") { ret = []; }
	    if(typeof A !== "object") return ret;
	    if(typeof k === "undefined") { k=0; }
	    if(!(k in ret)) { ret[k] = 0; }
	    if(A.length > ret[k]) ret[k] = A.length;
	    var i;
	    for(i in A) {
	        if(A.hasOwnProperty(i)) dim(A[i],ret,k+1);
	    }
	    return ret;
	};

	numeric.sclone = function clone(A,k,n) {
	    if(typeof k === "undefined") { k=0; }
	    if(typeof n === "undefined") { n = numeric.sdim(A).length; }
	    var i,ret = Array(A.length);
	    if(k === n-1) {
	        for(i in A) { if(A.hasOwnProperty(i)) ret[i] = A[i]; }
	        return ret;
	    }
	    for(i in A) {
	        if(A.hasOwnProperty(i)) ret[i] = clone(A[i],k+1,n);
	    }
	    return ret;
	}

	numeric.sdiag = function diag(d) {
	    var n = d.length,i,ret = Array(n),i1,i2,i3;
	    for(i=n-1;i>=1;i-=2) {
	        i1 = i-1;
	        ret[i] = []; ret[i][i] = d[i];
	        ret[i1] = []; ret[i1][i1] = d[i1];
	    }
	    if(i===0) { ret[0] = []; ret[0][0] = d[i]; }
	    return ret;
	}

	numeric.sidentity = function identity(n) { return numeric.sdiag(numeric.rep([n],1)); }

	numeric.stranspose = function transpose(A) {
	    var ret = [], n = A.length, i,j,Ai;
	    for(i in A) {
	        if(!(A.hasOwnProperty(i))) continue;
	        Ai = A[i];
	        for(j in Ai) {
	            if(!(Ai.hasOwnProperty(j))) continue;
	            if(typeof ret[j] !== "object") { ret[j] = []; }
	            ret[j][i] = Ai[j];
	        }
	    }
	    return ret;
	}

	numeric.sLUP = function LUP(A,tol) {
	    throw new Error("The function numeric.sLUP had a bug in it and has been removed. Please use the new numeric.ccsLUP function instead.");
	};

	numeric.sdotMM = function dotMM(A,B) {
	    var p = A.length, q = B.length, BT = numeric.stranspose(B), r = BT.length, Ai, BTk;
	    var i,j,k,accum;
	    var ret = Array(p),reti;
	    for(i=p-1;i>=0;i--) {
	        reti = [];
	        Ai = A[i];
	        for(k=r-1;k>=0;k--) {
	            accum = 0;
	            BTk = BT[k];
	            for(j in Ai) {
	                if(!(Ai.hasOwnProperty(j))) continue;
	                if(j in BTk) { accum += Ai[j]*BTk[j]; }
	            }
	            if(accum) reti[k] = accum;
	        }
	        ret[i] = reti;
	    }
	    return ret;
	}

	numeric.sdotMV = function dotMV(A,x) {
	    var p = A.length, Ai, i,j;
	    var ret = Array(p), accum;
	    for(i=p-1;i>=0;i--) {
	        Ai = A[i];
	        accum = 0;
	        for(j in Ai) {
	            if(!(Ai.hasOwnProperty(j))) continue;
	            if(x[j]) accum += Ai[j]*x[j];
	        }
	        if(accum) ret[i] = accum;
	    }
	    return ret;
	}

	numeric.sdotVM = function dotMV(x,A) {
	    var i,j,Ai,alpha;
	    var ret = [], accum;
	    for(i in x) {
	        if(!x.hasOwnProperty(i)) continue;
	        Ai = A[i];
	        alpha = x[i];
	        for(j in Ai) {
	            if(!Ai.hasOwnProperty(j)) continue;
	            if(!ret[j]) { ret[j] = 0; }
	            ret[j] += alpha*Ai[j];
	        }
	    }
	    return ret;
	}

	numeric.sdotVV = function dotVV(x,y) {
	    var i,ret=0;
	    for(i in x) { if(x[i] && y[i]) ret+= x[i]*y[i]; }
	    return ret;
	}

	numeric.sdot = function dot(A,B) {
	    var m = numeric.sdim(A).length, n = numeric.sdim(B).length;
	    var k = m*1000+n;
	    switch(k) {
	    case 0: return A*B;
	    case 1001: return numeric.sdotVV(A,B);
	    case 2001: return numeric.sdotMV(A,B);
	    case 1002: return numeric.sdotVM(A,B);
	    case 2002: return numeric.sdotMM(A,B);
	    default: throw new Error('numeric.sdot not implemented for tensors of order '+m+' and '+n);
	    }
	}

	numeric.sscatter = function scatter(V) {
	    var n = V[0].length, Vij, i, j, m = V.length, A = [], Aj;
	    for(i=n-1;i>=0;--i) {
	        if(!V[m-1][i]) continue;
	        Aj = A;
	        for(j=0;j<m-2;j++) {
	            Vij = V[j][i];
	            if(!Aj[Vij]) Aj[Vij] = [];
	            Aj = Aj[Vij];
	        }
	        Aj[V[j][i]] = V[j+1][i];
	    }
	    return A;
	}

	numeric.sgather = function gather(A,ret,k) {
	    if(typeof ret === "undefined") ret = [];
	    if(typeof k === "undefined") k = [];
	    var n,i,Ai;
	    n = k.length;
	    for(i in A) {
	        if(A.hasOwnProperty(i)) {
	            k[n] = parseInt(i);
	            Ai = A[i];
	            if(typeof Ai === "number") {
	                if(Ai) {
	                    if(ret.length === 0) {
	                        for(i=n+1;i>=0;--i) ret[i] = [];
	                    }
	                    for(i=n;i>=0;--i) ret[i].push(k[i]);
	                    ret[n+1].push(Ai);
	                }
	            } else gather(Ai,ret,k);
	        }
	    }
	    if(k.length>n) k.pop();
	    return ret;
	}

	// 6. Coordinate matrices
	numeric.cLU = function LU(A) {
	    var I = A[0], J = A[1], V = A[2];
	    var p = I.length, m=0, i,j,k,a,b,c;
	    for(i=0;i<p;i++) if(I[i]>m) m=I[i];
	    m++;
	    var L = Array(m), U = Array(m), left = numeric.rep([m],Infinity), right = numeric.rep([m],-Infinity);
	    var Ui, Uj,alpha;
	    for(k=0;k<p;k++) {
	        i = I[k];
	        j = J[k];
	        if(j<left[i]) left[i] = j;
	        if(j>right[i]) right[i] = j;
	    }
	    for(i=0;i<m-1;i++) { if(right[i] > right[i+1]) right[i+1] = right[i]; }
	    for(i=m-1;i>=1;i--) { if(left[i]<left[i-1]) left[i-1] = left[i]; }
	    var countL = 0, countU = 0;
	    for(i=0;i<m;i++) {
	        U[i] = numeric.rep([right[i]-left[i]+1],0);
	        L[i] = numeric.rep([i-left[i]],0);
	        countL += i-left[i]+1;
	        countU += right[i]-i+1;
	    }
	    for(k=0;k<p;k++) { i = I[k]; U[i][J[k]-left[i]] = V[k]; }
	    for(i=0;i<m-1;i++) {
	        a = i-left[i];
	        Ui = U[i];
	        for(j=i+1;left[j]<=i && j<m;j++) {
	            b = i-left[j];
	            c = right[i]-i;
	            Uj = U[j];
	            alpha = Uj[b]/Ui[a];
	            if(alpha) {
	                for(k=1;k<=c;k++) { Uj[k+b] -= alpha*Ui[k+a]; }
	                L[j][i-left[j]] = alpha;
	            }
	        }
	    }
	    var Ui = [], Uj = [], Uv = [], Li = [], Lj = [], Lv = [];
	    var p,q,foo;
	    p=0; q=0;
	    for(i=0;i<m;i++) {
	        a = left[i];
	        b = right[i];
	        foo = U[i];
	        for(j=i;j<=b;j++) {
	            if(foo[j-a]) {
	                Ui[p] = i;
	                Uj[p] = j;
	                Uv[p] = foo[j-a];
	                p++;
	            }
	        }
	        foo = L[i];
	        for(j=a;j<i;j++) {
	            if(foo[j-a]) {
	                Li[q] = i;
	                Lj[q] = j;
	                Lv[q] = foo[j-a];
	                q++;
	            }
	        }
	        Li[q] = i;
	        Lj[q] = i;
	        Lv[q] = 1;
	        q++;
	    }
	    return {U:[Ui,Uj,Uv], L:[Li,Lj,Lv]};
	};

	numeric.cLUsolve = function LUsolve(lu,b) {
	    var L = lu.L, U = lu.U, ret = numeric.clone(b);
	    var Li = L[0], Lj = L[1], Lv = L[2];
	    var Ui = U[0], Uj = U[1], Uv = U[2];
	    var p = Ui.length, q = Li.length;
	    var m = ret.length,i,j,k;
	    k = 0;
	    for(i=0;i<m;i++) {
	        while(Lj[k] < i) {
	            ret[i] -= Lv[k]*ret[Lj[k]];
	            k++;
	        }
	        k++;
	    }
	    k = p-1;
	    for(i=m-1;i>=0;i--) {
	        while(Uj[k] > i) {
	            ret[i] -= Uv[k]*ret[Uj[k]];
	            k--;
	        }
	        ret[i] /= Uv[k];
	        k--;
	    }
	    return ret;
	};

	numeric.cgrid = function grid(n,shape) {
	    if(typeof n === "number") n = [n,n];
	    var ret = numeric.rep(n,-1);
	    var i,j,count;
	    if(typeof shape !== "function") {
	        switch(shape) {
	        case 'L':
	            shape = function(i,j) { return (i>=n[0]/2 || j<n[1]/2); }
	            break;
	        default:
	            shape = function(i,j) { return true; };
	            break;
	        }
	    }
	    count=0;
	    for(i=1;i<n[0]-1;i++) for(j=1;j<n[1]-1;j++) 
	        if(shape(i,j)) {
	            ret[i][j] = count;
	            count++;
	        }
	    return ret;
	}

	numeric.cdelsq = function delsq(g) {
	    var dir = [[-1,0],[0,-1],[0,1],[1,0]];
	    var s = numeric.dim(g), m = s[0], n = s[1], i,j,k,p,q;
	    var Li = [], Lj = [], Lv = [];
	    for(i=1;i<m-1;i++) for(j=1;j<n-1;j++) {
	        if(g[i][j]<0) continue;
	        for(k=0;k<4;k++) {
	            p = i+dir[k][0];
	            q = j+dir[k][1];
	            if(g[p][q]<0) continue;
	            Li.push(g[i][j]);
	            Lj.push(g[p][q]);
	            Lv.push(-1);
	        }
	        Li.push(g[i][j]);
	        Lj.push(g[i][j]);
	        Lv.push(4);
	    }
	    return [Li,Lj,Lv];
	}

	numeric.cdotMV = function dotMV(A,x) {
	    var ret, Ai = A[0], Aj = A[1], Av = A[2],k,p=Ai.length,N;
	    N=0;
	    for(k=0;k<p;k++) { if(Ai[k]>N) N = Ai[k]; }
	    N++;
	    ret = numeric.rep([N],0);
	    for(k=0;k<p;k++) { ret[Ai[k]]+=Av[k]*x[Aj[k]]; }
	    return ret;
	}

	// 7. Splines

	numeric.Spline = function Spline(x,yl,yr,kl,kr) { this.x = x; this.yl = yl; this.yr = yr; this.kl = kl; this.kr = kr; }
	numeric.Spline.prototype._at = function _at(x1,p) {
	    var x = this.x;
	    var yl = this.yl;
	    var yr = this.yr;
	    var kl = this.kl;
	    var kr = this.kr;
	    var x1,a,b,t;
	    var add = numeric.add, sub = numeric.sub, mul = numeric.mul;
	    a = sub(mul(kl[p],x[p+1]-x[p]),sub(yr[p+1],yl[p]));
	    b = add(mul(kr[p+1],x[p]-x[p+1]),sub(yr[p+1],yl[p]));
	    t = (x1-x[p])/(x[p+1]-x[p]);
	    var s = t*(1-t);
	    return add(add(add(mul(1-t,yl[p]),mul(t,yr[p+1])),mul(a,s*(1-t))),mul(b,s*t));
	}
	numeric.Spline.prototype.at = function at(x0) {
	    if(typeof x0 === "number") {
	        var x = this.x;
	        var n = x.length;
	        var p,q,mid,floor = Math.floor,a,b,t;
	        p = 0;
	        q = n-1;
	        while(q-p>1) {
	            mid = floor((p+q)/2);
	            if(x[mid] <= x0) p = mid;
	            else q = mid;
	        }
	        return this._at(x0,p);
	    }
	    var n = x0.length, i, ret = Array(n);
	    for(i=n-1;i!==-1;--i) ret[i] = this.at(x0[i]);
	    return ret;
	}
	numeric.Spline.prototype.diff = function diff() {
	    var x = this.x;
	    var yl = this.yl;
	    var yr = this.yr;
	    var kl = this.kl;
	    var kr = this.kr;
	    var n = yl.length;
	    var i,dx,dy;
	    var zl = kl, zr = kr, pl = Array(n), pr = Array(n);
	    var add = numeric.add, mul = numeric.mul, div = numeric.div, sub = numeric.sub;
	    for(i=n-1;i!==-1;--i) {
	        dx = x[i+1]-x[i];
	        dy = sub(yr[i+1],yl[i]);
	        pl[i] = div(add(mul(dy, 6),mul(kl[i],-4*dx),mul(kr[i+1],-2*dx)),dx*dx);
	        pr[i+1] = div(add(mul(dy,-6),mul(kl[i], 2*dx),mul(kr[i+1], 4*dx)),dx*dx);
	    }
	    return new numeric.Spline(x,zl,zr,pl,pr);
	}
	numeric.Spline.prototype.roots = function roots() {
	    function sqr(x) { return x*x; }
	    function heval(y0,y1,k0,k1,x) {
	        var A = k0*2-(y1-y0);
	        var B = -k1*2+(y1-y0);
	        var t = (x+1)*0.5;
	        var s = t*(1-t);
	        return (1-t)*y0+t*y1+A*s*(1-t)+B*s*t;
	    }
	    var ret = [];
	    var x = this.x, yl = this.yl, yr = this.yr, kl = this.kl, kr = this.kr;
	    if(typeof yl[0] === "number") {
	        yl = [yl];
	        yr = [yr];
	        kl = [kl];
	        kr = [kr];
	    }
	    var m = yl.length,n=x.length-1,i,j,k,y,s,t;
	    var ai,bi,ci,di, ret = Array(m),ri,k0,k1,y0,y1,A,B,D,dx,cx,stops,z0,z1,zm,t0,t1,tm;
	    var sqrt = Math.sqrt;
	    for(i=0;i!==m;++i) {
	        ai = yl[i];
	        bi = yr[i];
	        ci = kl[i];
	        di = kr[i];
	        ri = [];
	        for(j=0;j!==n;j++) {
	            if(j>0 && bi[j]*ai[j]<0) ri.push(x[j]);
	            dx = (x[j+1]-x[j]);
	            cx = x[j];
	            y0 = ai[j];
	            y1 = bi[j+1];
	            k0 = ci[j]/dx;
	            k1 = di[j+1]/dx;
	            D = sqr(k0-k1+3*(y0-y1)) + 12*k1*y0;
	            A = k1+3*y0+2*k0-3*y1;
	            B = 3*(k1+k0+2*(y0-y1));
	            if(D<=0) {
	                z0 = A/B;
	                if(z0>x[j] && z0<x[j+1]) stops = [x[j],z0,x[j+1]];
	                else stops = [x[j],x[j+1]];
	            } else {
	                z0 = (A-sqrt(D))/B;
	                z1 = (A+sqrt(D))/B;
	                stops = [x[j]];
	                if(z0>x[j] && z0<x[j+1]) stops.push(z0);
	                if(z1>x[j] && z1<x[j+1]) stops.push(z1);
	                stops.push(x[j+1]);
	            }
	            t0 = stops[0];
	            z0 = this._at(t0,j);
	            for(k=0;k<stops.length-1;k++) {
	                t1 = stops[k+1];
	                z1 = this._at(t1,j);
	                if(z0 === 0) {
	                    ri.push(t0); 
	                    t0 = t1;
	                    z0 = z1;
	                    continue;
	                }
	                if(z1 === 0 || z0*z1>0) {
	                    t0 = t1;
	                    z0 = z1;
	                    continue;
	                }
	                var side = 0;
	                while(1) {
	                    tm = (z0*t1-z1*t0)/(z0-z1);
	                    if(tm <= t0 || tm >= t1) { break; }
	                    zm = this._at(tm,j);
	                    if(zm*z1>0) {
	                        t1 = tm;
	                        z1 = zm;
	                        if(side === -1) z0*=0.5;
	                        side = -1;
	                    } else if(zm*z0>0) {
	                        t0 = tm;
	                        z0 = zm;
	                        if(side === 1) z1*=0.5;
	                        side = 1;
	                    } else break;
	                }
	                ri.push(tm);
	                t0 = stops[k+1];
	                z0 = this._at(t0, j);
	            }
	            if(z1 === 0) ri.push(t1);
	        }
	        ret[i] = ri;
	    }
	    if(typeof this.yl[0] === "number") return ret[0];
	    return ret;
	}
	numeric.spline = function spline(x,y,k1,kn) {
	    var n = x.length, b = [], dx = [], dy = [];
	    var i;
	    var sub = numeric.sub,mul = numeric.mul,add = numeric.add;
	    for(i=n-2;i>=0;i--) { dx[i] = x[i+1]-x[i]; dy[i] = sub(y[i+1],y[i]); }
	    if(typeof k1 === "string" || typeof kn === "string") { 
	        k1 = kn = "periodic";
	    }
	    // Build sparse tridiagonal system
	    var T = [[],[],[]];
	    switch(typeof k1) {
	    case "undefined":
	        b[0] = mul(3/(dx[0]*dx[0]),dy[0]);
	        T[0].push(0,0);
	        T[1].push(0,1);
	        T[2].push(2/dx[0],1/dx[0]);
	        break;
	    case "string":
	        b[0] = add(mul(3/(dx[n-2]*dx[n-2]),dy[n-2]),mul(3/(dx[0]*dx[0]),dy[0]));
	        T[0].push(0,0,0);
	        T[1].push(n-2,0,1);
	        T[2].push(1/dx[n-2],2/dx[n-2]+2/dx[0],1/dx[0]);
	        break;
	    default:
	        b[0] = k1;
	        T[0].push(0);
	        T[1].push(0);
	        T[2].push(1);
	        break;
	    }
	    for(i=1;i<n-1;i++) {
	        b[i] = add(mul(3/(dx[i-1]*dx[i-1]),dy[i-1]),mul(3/(dx[i]*dx[i]),dy[i]));
	        T[0].push(i,i,i);
	        T[1].push(i-1,i,i+1);
	        T[2].push(1/dx[i-1],2/dx[i-1]+2/dx[i],1/dx[i]);
	    }
	    switch(typeof kn) {
	    case "undefined":
	        b[n-1] = mul(3/(dx[n-2]*dx[n-2]),dy[n-2]);
	        T[0].push(n-1,n-1);
	        T[1].push(n-2,n-1);
	        T[2].push(1/dx[n-2],2/dx[n-2]);
	        break;
	    case "string":
	        T[1][T[1].length-1] = 0;
	        break;
	    default:
	        b[n-1] = kn;
	        T[0].push(n-1);
	        T[1].push(n-1);
	        T[2].push(1);
	        break;
	    }
	    if(typeof b[0] !== "number") b = numeric.transpose(b);
	    else b = [b];
	    var k = Array(b.length);
	    if(typeof k1 === "string") {
	        for(i=k.length-1;i!==-1;--i) {
	            k[i] = numeric.ccsLUPSolve(numeric.ccsLUP(numeric.ccsScatter(T)),b[i]);
	            k[i][n-1] = k[i][0];
	        }
	    } else {
	        for(i=k.length-1;i!==-1;--i) {
	            k[i] = numeric.cLUsolve(numeric.cLU(T),b[i]);
	        }
	    }
	    if(typeof y[0] === "number") k = k[0];
	    else k = numeric.transpose(k);
	    return new numeric.Spline(x,y,y,k,k);
	}

	// 8. FFT
	numeric.fftpow2 = function fftpow2(x,y) {
	    var n = x.length;
	    if(n === 1) return;
	    var cos = Math.cos, sin = Math.sin, i,j;
	    var xe = Array(n/2), ye = Array(n/2), xo = Array(n/2), yo = Array(n/2);
	    j = n/2;
	    for(i=n-1;i!==-1;--i) {
	        --j;
	        xo[j] = x[i];
	        yo[j] = y[i];
	        --i;
	        xe[j] = x[i];
	        ye[j] = y[i];
	    }
	    fftpow2(xe,ye);
	    fftpow2(xo,yo);
	    j = n/2;
	    var t,k = (-6.2831853071795864769252867665590057683943387987502116419/n),ci,si;
	    for(i=n-1;i!==-1;--i) {
	        --j;
	        if(j === -1) j = n/2-1;
	        t = k*i;
	        ci = cos(t);
	        si = sin(t);
	        x[i] = xe[j] + ci*xo[j] - si*yo[j];
	        y[i] = ye[j] + ci*yo[j] + si*xo[j];
	    }
	}
	numeric._ifftpow2 = function _ifftpow2(x,y) {
	    var n = x.length;
	    if(n === 1) return;
	    var cos = Math.cos, sin = Math.sin, i,j;
	    var xe = Array(n/2), ye = Array(n/2), xo = Array(n/2), yo = Array(n/2);
	    j = n/2;
	    for(i=n-1;i!==-1;--i) {
	        --j;
	        xo[j] = x[i];
	        yo[j] = y[i];
	        --i;
	        xe[j] = x[i];
	        ye[j] = y[i];
	    }
	    _ifftpow2(xe,ye);
	    _ifftpow2(xo,yo);
	    j = n/2;
	    var t,k = (6.2831853071795864769252867665590057683943387987502116419/n),ci,si;
	    for(i=n-1;i!==-1;--i) {
	        --j;
	        if(j === -1) j = n/2-1;
	        t = k*i;
	        ci = cos(t);
	        si = sin(t);
	        x[i] = xe[j] + ci*xo[j] - si*yo[j];
	        y[i] = ye[j] + ci*yo[j] + si*xo[j];
	    }
	}
	numeric.ifftpow2 = function ifftpow2(x,y) {
	    numeric._ifftpow2(x,y);
	    numeric.diveq(x,x.length);
	    numeric.diveq(y,y.length);
	}
	numeric.convpow2 = function convpow2(ax,ay,bx,by) {
	    numeric.fftpow2(ax,ay);
	    numeric.fftpow2(bx,by);
	    var i,n = ax.length,axi,bxi,ayi,byi;
	    for(i=n-1;i!==-1;--i) {
	        axi = ax[i]; ayi = ay[i]; bxi = bx[i]; byi = by[i];
	        ax[i] = axi*bxi-ayi*byi;
	        ay[i] = axi*byi+ayi*bxi;
	    }
	    numeric.ifftpow2(ax,ay);
	}
	numeric.T.prototype.fft = function fft() {
	    var x = this.x, y = this.y;
	    var n = x.length, log = Math.log, log2 = log(2),
	        p = Math.ceil(log(2*n-1)/log2), m = Math.pow(2,p);
	    var cx = numeric.rep([m],0), cy = numeric.rep([m],0), cos = Math.cos, sin = Math.sin;
	    var k, c = (-3.141592653589793238462643383279502884197169399375105820/n),t;
	    var a = numeric.rep([m],0), b = numeric.rep([m],0),nhalf = Math.floor(n/2);
	    for(k=0;k<n;k++) a[k] = x[k];
	    if(typeof y !== "undefined") for(k=0;k<n;k++) b[k] = y[k];
	    cx[0] = 1;
	    for(k=1;k<=m/2;k++) {
	        t = c*k*k;
	        cx[k] = cos(t);
	        cy[k] = sin(t);
	        cx[m-k] = cos(t);
	        cy[m-k] = sin(t)
	    }
	    var X = new numeric.T(a,b), Y = new numeric.T(cx,cy);
	    X = X.mul(Y);
	    numeric.convpow2(X.x,X.y,numeric.clone(Y.x),numeric.neg(Y.y));
	    X = X.mul(Y);
	    X.x.length = n;
	    X.y.length = n;
	    return X;
	}
	numeric.T.prototype.ifft = function ifft() {
	    var x = this.x, y = this.y;
	    var n = x.length, log = Math.log, log2 = log(2),
	        p = Math.ceil(log(2*n-1)/log2), m = Math.pow(2,p);
	    var cx = numeric.rep([m],0), cy = numeric.rep([m],0), cos = Math.cos, sin = Math.sin;
	    var k, c = (3.141592653589793238462643383279502884197169399375105820/n),t;
	    var a = numeric.rep([m],0), b = numeric.rep([m],0),nhalf = Math.floor(n/2);
	    for(k=0;k<n;k++) a[k] = x[k];
	    if(typeof y !== "undefined") for(k=0;k<n;k++) b[k] = y[k];
	    cx[0] = 1;
	    for(k=1;k<=m/2;k++) {
	        t = c*k*k;
	        cx[k] = cos(t);
	        cy[k] = sin(t);
	        cx[m-k] = cos(t);
	        cy[m-k] = sin(t)
	    }
	    var X = new numeric.T(a,b), Y = new numeric.T(cx,cy);
	    X = X.mul(Y);
	    numeric.convpow2(X.x,X.y,numeric.clone(Y.x),numeric.neg(Y.y));
	    X = X.mul(Y);
	    X.x.length = n;
	    X.y.length = n;
	    return X.div(n);
	}

	//9. Unconstrained optimization
	numeric.gradient = function gradient(f,x) {
	    var n = x.length;
	    var f0 = f(x);
	    if(isNaN(f0)) throw new Error('gradient: f(x) is a NaN!');
	    var max = Math.max;
	    var i,x0 = numeric.clone(x),f1,f2, J = Array(n);
	    var div = numeric.div, sub = numeric.sub,errest,roundoff,max = Math.max,eps = 1e-3,abs = Math.abs, min = Math.min;
	    var t0,t1,t2,it=0,d1,d2,N;
	    for(i=0;i<n;i++) {
	        var h = max(1e-6*f0,1e-8);
	        while(1) {
	            ++it;
	            if(it>20) { throw new Error("Numerical gradient fails"); }
	            x0[i] = x[i]+h;
	            f1 = f(x0);
	            x0[i] = x[i]-h;
	            f2 = f(x0);
	            x0[i] = x[i];
	            if(isNaN(f1) || isNaN(f2)) { h/=16; continue; }
	            J[i] = (f1-f2)/(2*h);
	            t0 = x[i]-h;
	            t1 = x[i];
	            t2 = x[i]+h;
	            d1 = (f1-f0)/h;
	            d2 = (f0-f2)/h;
	            N = max(abs(J[i]),abs(f0),abs(f1),abs(f2),abs(t0),abs(t1),abs(t2),1e-8);
	            errest = min(max(abs(d1-J[i]),abs(d2-J[i]),abs(d1-d2))/N,h/N);
	            if(errest>eps) { h/=16; }
	            else break;
	            }
	    }
	    return J;
	}

	numeric.uncmin = function uncmin(f,x0,tol,gradient,maxit,callback,options) {
	    var grad = numeric.gradient;
	    if(typeof options === "undefined") { options = {}; }
	    if(typeof tol === "undefined") { tol = 1e-8; }
	    if(typeof gradient === "undefined") { gradient = function(x) { return grad(f,x); }; }
	    if(typeof maxit === "undefined") maxit = 1000;
	    x0 = numeric.clone(x0);
	    var n = x0.length;
	    var f0 = f(x0),f1,df0;
	    if(isNaN(f0)) throw new Error('uncmin: f(x0) is a NaN!');
	    var max = Math.max, norm2 = numeric.norm2;
	    tol = max(tol,numeric.epsilon);
	    var step,g0,g1,H1 = options.Hinv || numeric.identity(n);
	    var dot = numeric.dot, inv = numeric.inv, sub = numeric.sub, add = numeric.add, ten = numeric.tensor, div = numeric.div, mul = numeric.mul;
	    var all = numeric.all, isfinite = numeric.isFinite, neg = numeric.neg;
	    var it=0,i,s,x1,y,Hy,Hs,ys,i0,t,nstep,t1,t2;
	    var msg = "";
	    g0 = gradient(x0);
	    while(it<maxit) {
	        if(typeof callback === "function") { if(callback(it,x0,f0,g0,H1)) { msg = "Callback returned true"; break; } }
	        if(!all(isfinite(g0))) { msg = "Gradient has Infinity or NaN"; break; }
	        step = neg(dot(H1,g0));
	        if(!all(isfinite(step))) { msg = "Search direction has Infinity or NaN"; break; }
	        nstep = norm2(step);
	        if(nstep < tol) { msg="Newton step smaller than tol"; break; }
	        t = 1;
	        df0 = dot(g0,step);
	        // line search
	        x1 = x0;
	        while(it < maxit) {
	            if(t*nstep < tol) { break; }
	            s = mul(step,t);
	            x1 = add(x0,s);
	            f1 = f(x1);
	            if(f1-f0 >= 0.1*t*df0 || isNaN(f1)) {
	                t *= 0.5;
	                ++it;
	                continue;
	            }
	            break;
	        }
	        if(t*nstep < tol) { msg = "Line search step size smaller than tol"; break; }
	        if(it === maxit) { msg = "maxit reached during line search"; break; }
	        g1 = gradient(x1);
	        y = sub(g1,g0);
	        ys = dot(y,s);
	        Hy = dot(H1,y);
	        H1 = sub(add(H1,
	                mul(
	                        (ys+dot(y,Hy))/(ys*ys),
	                        ten(s,s)    )),
	                div(add(ten(Hy,s),ten(s,Hy)),ys));
	        x0 = x1;
	        f0 = f1;
	        g0 = g1;
	        ++it;
	    }
	    return {solution: x0, f: f0, gradient: g0, invHessian: H1, iterations:it, message: msg};
	}

	// 10. Ode solver (Dormand-Prince)
	numeric.Dopri = function Dopri(x,y,f,ymid,iterations,msg,events) {
	    this.x = x;
	    this.y = y;
	    this.f = f;
	    this.ymid = ymid;
	    this.iterations = iterations;
	    this.events = events;
	    this.message = msg;
	}
	numeric.Dopri.prototype._at = function _at(xi,j) {
	    function sqr(x) { return x*x; }
	    var sol = this;
	    var xs = sol.x;
	    var ys = sol.y;
	    var k1 = sol.f;
	    var ymid = sol.ymid;
	    var n = xs.length;
	    var x0,x1,xh,y0,y1,yh,xi;
	    var floor = Math.floor,h;
	    var c = 0.5;
	    var add = numeric.add, mul = numeric.mul,sub = numeric.sub, p,q,w;
	    x0 = xs[j];
	    x1 = xs[j+1];
	    y0 = ys[j];
	    y1 = ys[j+1];
	    h  = x1-x0;
	    xh = x0+c*h;
	    yh = ymid[j];
	    p = sub(k1[j  ],mul(y0,1/(x0-xh)+2/(x0-x1)));
	    q = sub(k1[j+1],mul(y1,1/(x1-xh)+2/(x1-x0)));
	    w = [sqr(xi - x1) * (xi - xh) / sqr(x0 - x1) / (x0 - xh),
	         sqr(xi - x0) * sqr(xi - x1) / sqr(x0 - xh) / sqr(x1 - xh),
	         sqr(xi - x0) * (xi - xh) / sqr(x1 - x0) / (x1 - xh),
	         (xi - x0) * sqr(xi - x1) * (xi - xh) / sqr(x0-x1) / (x0 - xh),
	         (xi - x1) * sqr(xi - x0) * (xi - xh) / sqr(x0-x1) / (x1 - xh)];
	    return add(add(add(add(mul(y0,w[0]),
	                           mul(yh,w[1])),
	                           mul(y1,w[2])),
	                           mul( p,w[3])),
	                           mul( q,w[4]));
	}
	numeric.Dopri.prototype.at = function at(x) {
	    var i,j,k,floor = Math.floor;
	    if(typeof x !== "number") {
	        var n = x.length, ret = Array(n);
	        for(i=n-1;i!==-1;--i) {
	            ret[i] = this.at(x[i]);
	        }
	        return ret;
	    }
	    var x0 = this.x;
	    i = 0; j = x0.length-1;
	    while(j-i>1) {
	        k = floor(0.5*(i+j));
	        if(x0[k] <= x) i = k;
	        else j = k;
	    }
	    return this._at(x,i);
	}

	numeric.dopri = function dopri(x0,x1,y0,f,tol,maxit,event) {
	    if(typeof tol === "undefined") { tol = 1e-6; }
	    if(typeof maxit === "undefined") { maxit = 1000; }
	    var xs = [x0], ys = [y0], k1 = [f(x0,y0)], k2,k3,k4,k5,k6,k7, ymid = [];
	    var A2 = 1/5;
	    var A3 = [3/40,9/40];
	    var A4 = [44/45,-56/15,32/9];
	    var A5 = [19372/6561,-25360/2187,64448/6561,-212/729];
	    var A6 = [9017/3168,-355/33,46732/5247,49/176,-5103/18656];
	    var b = [35/384,0,500/1113,125/192,-2187/6784,11/84];
	    var bm = [0.5*6025192743/30085553152,
	              0,
	              0.5*51252292925/65400821598,
	              0.5*-2691868925/45128329728,
	              0.5*187940372067/1594534317056,
	              0.5*-1776094331/19743644256,
	              0.5*11237099/235043384];
	    var c = [1/5,3/10,4/5,8/9,1,1];
	    var e = [-71/57600,0,71/16695,-71/1920,17253/339200,-22/525,1/40];
	    var i = 0,er,j;
	    var h = (x1-x0)/10;
	    var it = 0;
	    var add = numeric.add, mul = numeric.mul, y1,erinf;
	    var max = Math.max, min = Math.min, abs = Math.abs, norminf = numeric.norminf,pow = Math.pow;
	    var any = numeric.any, lt = numeric.lt, and = numeric.and, sub = numeric.sub;
	    var e0, e1, ev;
	    var ret = new numeric.Dopri(xs,ys,k1,ymid,-1,"");
	    if(typeof event === "function") e0 = event(x0,y0);
	    while(x0<x1 && it<maxit) {
	        ++it;
	        if(x0+h>x1) h = x1-x0;
	        k2 = f(x0+c[0]*h,                add(y0,mul(   A2*h,k1[i])));
	        k3 = f(x0+c[1]*h,            add(add(y0,mul(A3[0]*h,k1[i])),mul(A3[1]*h,k2)));
	        k4 = f(x0+c[2]*h,        add(add(add(y0,mul(A4[0]*h,k1[i])),mul(A4[1]*h,k2)),mul(A4[2]*h,k3)));
	        k5 = f(x0+c[3]*h,    add(add(add(add(y0,mul(A5[0]*h,k1[i])),mul(A5[1]*h,k2)),mul(A5[2]*h,k3)),mul(A5[3]*h,k4)));
	        k6 = f(x0+c[4]*h,add(add(add(add(add(y0,mul(A6[0]*h,k1[i])),mul(A6[1]*h,k2)),mul(A6[2]*h,k3)),mul(A6[3]*h,k4)),mul(A6[4]*h,k5)));
	        y1 = add(add(add(add(add(y0,mul(k1[i],h*b[0])),mul(k3,h*b[2])),mul(k4,h*b[3])),mul(k5,h*b[4])),mul(k6,h*b[5]));
	        k7 = f(x0+h,y1);
	        er = add(add(add(add(add(mul(k1[i],h*e[0]),mul(k3,h*e[2])),mul(k4,h*e[3])),mul(k5,h*e[4])),mul(k6,h*e[5])),mul(k7,h*e[6]));
	        if(typeof er === "number") erinf = abs(er);
	        else erinf = norminf(er);
	        if(erinf > tol) { // reject
	            h = 0.2*h*pow(tol/erinf,0.25);
	            if(x0+h === x0) {
	                ret.msg = "Step size became too small";
	                break;
	            }
	            continue;
	        }
	        ymid[i] = add(add(add(add(add(add(y0,
	                mul(k1[i],h*bm[0])),
	                mul(k3   ,h*bm[2])),
	                mul(k4   ,h*bm[3])),
	                mul(k5   ,h*bm[4])),
	                mul(k6   ,h*bm[5])),
	                mul(k7   ,h*bm[6]));
	        ++i;
	        xs[i] = x0+h;
	        ys[i] = y1;
	        k1[i] = k7;
	        if(typeof event === "function") {
	            var yi,xl = x0,xr = x0+0.5*h,xi;
	            e1 = event(xr,ymid[i-1]);
	            ev = and(lt(e0,0),lt(0,e1));
	            if(!any(ev)) { xl = xr; xr = x0+h; e0 = e1; e1 = event(xr,y1); ev = and(lt(e0,0),lt(0,e1)); }
	            if(any(ev)) {
	                var xc, yc, en,ei;
	                var side=0, sl = 1.0, sr = 1.0;
	                while(1) {
	                    if(typeof e0 === "number") xi = (sr*e1*xl-sl*e0*xr)/(sr*e1-sl*e0);
	                    else {
	                        xi = xr;
	                        for(j=e0.length-1;j!==-1;--j) {
	                            if(e0[j]<0 && e1[j]>0) xi = min(xi,(sr*e1[j]*xl-sl*e0[j]*xr)/(sr*e1[j]-sl*e0[j]));
	                        }
	                    }
	                    if(xi <= xl || xi >= xr) break;
	                    yi = ret._at(xi, i-1);
	                    ei = event(xi,yi);
	                    en = and(lt(e0,0),lt(0,ei));
	                    if(any(en)) {
	                        xr = xi;
	                        e1 = ei;
	                        ev = en;
	                        sr = 1.0;
	                        if(side === -1) sl *= 0.5;
	                        else sl = 1.0;
	                        side = -1;
	                    } else {
	                        xl = xi;
	                        e0 = ei;
	                        sl = 1.0;
	                        if(side === 1) sr *= 0.5;
	                        else sr = 1.0;
	                        side = 1;
	                    }
	                }
	                y1 = ret._at(0.5*(x0+xi),i-1);
	                ret.f[i] = f(xi,yi);
	                ret.x[i] = xi;
	                ret.y[i] = yi;
	                ret.ymid[i-1] = y1;
	                ret.events = ev;
	                ret.iterations = it;
	                return ret;
	            }
	        }
	        x0 += h;
	        y0 = y1;
	        e0 = e1;
	        h = min(0.8*h*pow(tol/erinf,0.25),4*h);
	    }
	    ret.iterations = it;
	    return ret;
	}

	// 11. Ax = b
	numeric.LU = function(A, fast) {
	  fast = fast || false;

	  var abs = Math.abs;
	  var i, j, k, absAjk, Akk, Ak, Pk, Ai;
	  var max;
	  var n = A.length, n1 = n-1;
	  var P = new Array(n);
	  if(!fast) A = numeric.clone(A);

	  for (k = 0; k < n; ++k) {
	    Pk = k;
	    Ak = A[k];
	    max = abs(Ak[k]);
	    for (j = k + 1; j < n; ++j) {
	      absAjk = abs(A[j][k]);
	      if (max < absAjk) {
	        max = absAjk;
	        Pk = j;
	      }
	    }
	    P[k] = Pk;

	    if (Pk != k) {
	      A[k] = A[Pk];
	      A[Pk] = Ak;
	      Ak = A[k];
	    }

	    Akk = Ak[k];

	    for (i = k + 1; i < n; ++i) {
	      A[i][k] /= Akk;
	    }

	    for (i = k + 1; i < n; ++i) {
	      Ai = A[i];
	      for (j = k + 1; j < n1; ++j) {
	        Ai[j] -= Ai[k] * Ak[j];
	        ++j;
	        Ai[j] -= Ai[k] * Ak[j];
	      }
	      if(j===n1) Ai[j] -= Ai[k] * Ak[j];
	    }
	  }

	  return {
	    LU: A,
	    P:  P
	  };
	}

	numeric.LUsolve = function LUsolve(LUP, b) {
	  var i, j;
	  var LU = LUP.LU;
	  var n   = LU.length;
	  var x = numeric.clone(b);
	  var P   = LUP.P;
	  var Pi, LUi, LUii, tmp;

	  for (i=n-1;i!==-1;--i) x[i] = b[i];
	  for (i = 0; i < n; ++i) {
	    Pi = P[i];
	    if (P[i] !== i) {
	      tmp = x[i];
	      x[i] = x[Pi];
	      x[Pi] = tmp;
	    }

	    LUi = LU[i];
	    for (j = 0; j < i; ++j) {
	      x[i] -= x[j] * LUi[j];
	    }
	  }

	  for (i = n - 1; i >= 0; --i) {
	    LUi = LU[i];
	    for (j = i + 1; j < n; ++j) {
	      x[i] -= x[j] * LUi[j];
	    }

	    x[i] /= LUi[i];
	  }

	  return x;
	}

	numeric.solve = function solve(A,b,fast) { return numeric.LUsolve(numeric.LU(A,fast), b); }

	// 12. Linear programming
	numeric.echelonize = function echelonize(A) {
	    var s = numeric.dim(A), m = s[0], n = s[1];
	    var I = numeric.identity(m);
	    var P = Array(m);
	    var i,j,k,l,Ai,Ii,Z,a;
	    var abs = Math.abs;
	    var diveq = numeric.diveq;
	    A = numeric.clone(A);
	    for(i=0;i<m;++i) {
	        k = 0;
	        Ai = A[i];
	        Ii = I[i];
	        for(j=1;j<n;++j) if(abs(Ai[k])<abs(Ai[j])) k=j;
	        P[i] = k;
	        diveq(Ii,Ai[k]);
	        diveq(Ai,Ai[k]);
	        for(j=0;j<m;++j) if(j!==i) {
	            Z = A[j]; a = Z[k];
	            for(l=n-1;l!==-1;--l) Z[l] -= Ai[l]*a;
	            Z = I[j];
	            for(l=m-1;l!==-1;--l) Z[l] -= Ii[l]*a;
	        }
	    }
	    return {I:I, A:A, P:P};
	}

	numeric.__solveLP = function __solveLP(c,A,b,tol,maxit,x,flag) {
	    var sum = numeric.sum, log = numeric.log, mul = numeric.mul, sub = numeric.sub, dot = numeric.dot, div = numeric.div, add = numeric.add;
	    var m = c.length, n = b.length,y;
	    var unbounded = false, cb,i0=0;
	    var alpha = 1.0;
	    var f0,df0,AT = numeric.transpose(A), svd = numeric.svd,transpose = numeric.transpose,leq = numeric.leq, sqrt = Math.sqrt, abs = Math.abs;
	    var muleq = numeric.muleq;
	    var norm = numeric.norminf, any = numeric.any,min = Math.min;
	    var all = numeric.all, gt = numeric.gt;
	    var p = Array(m), A0 = Array(n),e=numeric.rep([n],1), H;
	    var solve = numeric.solve, z = sub(b,dot(A,x)),count;
	    var dotcc = dot(c,c);
	    var g;
	    for(count=i0;count<maxit;++count) {
	        var i,j,d;
	        for(i=n-1;i!==-1;--i) A0[i] = div(A[i],z[i]);
	        var A1 = transpose(A0);
	        for(i=m-1;i!==-1;--i) p[i] = (/*x[i]+*/sum(A1[i]));
	        alpha = 0.25*abs(dotcc/dot(c,p));
	        var a1 = 100*sqrt(dotcc/dot(p,p));
	        if(!isFinite(alpha) || alpha>a1) alpha = a1;
	        g = add(c,mul(alpha,p));
	        H = dot(A1,A0);
	        for(i=m-1;i!==-1;--i) H[i][i] += 1;
	        d = solve(H,div(g,alpha),true);
	        var t0 = div(z,dot(A,d));
	        var t = 1.0;
	        for(i=n-1;i!==-1;--i) if(t0[i]<0) t = min(t,-0.999*t0[i]);
	        y = sub(x,mul(d,t));
	        z = sub(b,dot(A,y));
	        if(!all(gt(z,0))) return { solution: x, message: "", iterations: count };
	        x = y;
	        if(alpha<tol) return { solution: y, message: "", iterations: count };
	        if(flag) {
	            var s = dot(c,g), Ag = dot(A,g);
	            unbounded = true;
	            for(i=n-1;i!==-1;--i) if(s*Ag[i]<0) { unbounded = false; break; }
	        } else {
	            if(x[m-1]>=0) unbounded = false;
	            else unbounded = true;
	        }
	        if(unbounded) return { solution: y, message: "Unbounded", iterations: count };
	    }
	    return { solution: x, message: "maximum iteration count exceeded", iterations:count };
	}

	numeric._solveLP = function _solveLP(c,A,b,tol,maxit) {
	    var m = c.length, n = b.length,y;
	    var sum = numeric.sum, log = numeric.log, mul = numeric.mul, sub = numeric.sub, dot = numeric.dot, div = numeric.div, add = numeric.add;
	    var c0 = numeric.rep([m],0).concat([1]);
	    var J = numeric.rep([n,1],-1);
	    var A0 = numeric.blockMatrix([[A                   ,   J  ]]);
	    var b0 = b;
	    var y = numeric.rep([m],0).concat(Math.max(0,numeric.sup(numeric.neg(b)))+1);
	    var x0 = numeric.__solveLP(c0,A0,b0,tol,maxit,y,false);
	    var x = numeric.clone(x0.solution);
	    x.length = m;
	    var foo = numeric.inf(sub(b,dot(A,x)));
	    if(foo<0) { return { solution: NaN, message: "Infeasible", iterations: x0.iterations }; }
	    var ret = numeric.__solveLP(c, A, b, tol, maxit-x0.iterations, x, true);
	    ret.iterations += x0.iterations;
	    return ret;
	};

	numeric.solveLP = function solveLP(c,A,b,Aeq,beq,tol,maxit) {
	    if(typeof maxit === "undefined") maxit = 1000;
	    if(typeof tol === "undefined") tol = numeric.epsilon;
	    if(typeof Aeq === "undefined") return numeric._solveLP(c,A,b,tol,maxit);
	    var m = Aeq.length, n = Aeq[0].length, o = A.length;
	    var B = numeric.echelonize(Aeq);
	    var flags = numeric.rep([n],0);
	    var P = B.P;
	    var Q = [];
	    var i;
	    for(i=P.length-1;i!==-1;--i) flags[P[i]] = 1;
	    for(i=n-1;i!==-1;--i) if(flags[i]===0) Q.push(i);
	    var g = numeric.getRange;
	    var I = numeric.linspace(0,m-1), J = numeric.linspace(0,o-1);
	    var Aeq2 = g(Aeq,I,Q), A1 = g(A,J,P), A2 = g(A,J,Q), dot = numeric.dot, sub = numeric.sub;
	    var A3 = dot(A1,B.I);
	    var A4 = sub(A2,dot(A3,Aeq2)), b4 = sub(b,dot(A3,beq));
	    var c1 = Array(P.length), c2 = Array(Q.length);
	    for(i=P.length-1;i!==-1;--i) c1[i] = c[P[i]];
	    for(i=Q.length-1;i!==-1;--i) c2[i] = c[Q[i]];
	    var c4 = sub(c2,dot(c1,dot(B.I,Aeq2)));
	    var S = numeric._solveLP(c4,A4,b4,tol,maxit);
	    var x2 = S.solution;
	    if(x2!==x2) return S;
	    var x1 = dot(B.I,sub(beq,dot(Aeq2,x2)));
	    var x = Array(c.length);
	    for(i=P.length-1;i!==-1;--i) x[P[i]] = x1[i];
	    for(i=Q.length-1;i!==-1;--i) x[Q[i]] = x2[i];
	    return { solution: x, message:S.message, iterations: S.iterations };
	}

	numeric.MPStoLP = function MPStoLP(MPS) {
	    if(MPS instanceof String) { MPS.split('\n'); }
	    var state = 0;
	    var states = ['Initial state','NAME','ROWS','COLUMNS','RHS','BOUNDS','ENDATA'];
	    var n = MPS.length;
	    var i,j,z,N=0,rows = {}, sign = [], rl = 0, vars = {}, nv = 0;
	    var name;
	    var c = [], A = [], b = [];
	    function err(e) { throw new Error('MPStoLP: '+e+'\nLine '+i+': '+MPS[i]+'\nCurrent state: '+states[state]+'\n'); }
	    for(i=0;i<n;++i) {
	        z = MPS[i];
	        var w0 = z.match(/\S*/g);
	        var w = [];
	        for(j=0;j<w0.length;++j) if(w0[j]!=="") w.push(w0[j]);
	        if(w.length === 0) continue;
	        for(j=0;j<states.length;++j) if(z.substr(0,states[j].length) === states[j]) break;
	        if(j<states.length) {
	            state = j;
	            if(j===1) { name = w[1]; }
	            if(j===6) return { name:name, c:c, A:numeric.transpose(A), b:b, rows:rows, vars:vars };
	            continue;
	        }
	        switch(state) {
	        case 0: case 1: err('Unexpected line');
	        case 2: 
	            switch(w[0]) {
	            case 'N': if(N===0) N = w[1]; else err('Two or more N rows'); break;
	            case 'L': rows[w[1]] = rl; sign[rl] = 1; b[rl] = 0; ++rl; break;
	            case 'G': rows[w[1]] = rl; sign[rl] = -1;b[rl] = 0; ++rl; break;
	            case 'E': rows[w[1]] = rl; sign[rl] = 0;b[rl] = 0; ++rl; break;
	            default: err('Parse error '+numeric.prettyPrint(w));
	            }
	            break;
	        case 3:
	            if(!vars.hasOwnProperty(w[0])) { vars[w[0]] = nv; c[nv] = 0; A[nv] = numeric.rep([rl],0); ++nv; }
	            var p = vars[w[0]];
	            for(j=1;j<w.length;j+=2) {
	                if(w[j] === N) { c[p] = parseFloat(w[j+1]); continue; }
	                var q = rows[w[j]];
	                A[p][q] = (sign[q]<0?-1:1)*parseFloat(w[j+1]);
	            }
	            break;
	        case 4:
	            for(j=1;j<w.length;j+=2) b[rows[w[j]]] = (sign[rows[w[j]]]<0?-1:1)*parseFloat(w[j+1]);
	            break;
	        case 5: /*FIXME*/ break;
	        case 6: err('Internal error');
	        }
	    }
	    err('Reached end of file without ENDATA');
	}
	// seedrandom.js version 2.0.
	// Author: David Bau 4/2/2011
	//
	// Defines a method Math.seedrandom() that, when called, substitutes
	// an explicitly seeded RC4-based algorithm for Math.random().  Also
	// supports automatic seeding from local or network sources of entropy.
	//
	// Usage:
	//
	//   <script src=http://davidbau.com/encode/seedrandom-min.js></script>
	//
	//   Math.seedrandom('yipee'); Sets Math.random to a function that is
	//                             initialized using the given explicit seed.
	//
	//   Math.seedrandom();        Sets Math.random to a function that is
	//                             seeded using the current time, dom state,
	//                             and other accumulated local entropy.
	//                             The generated seed string is returned.
	//
	//   Math.seedrandom('yowza', true);
	//                             Seeds using the given explicit seed mixed
	//                             together with accumulated entropy.
	//
	//   <script src="http://bit.ly/srandom-512"></script>
	//                             Seeds using physical random bits downloaded
	//                             from random.org.
	//
	//   <script src="https://jsonlib.appspot.com/urandom?callback=Math.seedrandom">
	//   </script>                 Seeds using urandom bits from call.jsonlib.com,
	//                             which is faster than random.org.
	//
	// Examples:
	//
	//   Math.seedrandom("hello");            // Use "hello" as the seed.
	//   document.write(Math.random());       // Always 0.5463663768140734
	//   document.write(Math.random());       // Always 0.43973793770592234
	//   var rng1 = Math.random;              // Remember the current prng.
	//
	//   var autoseed = Math.seedrandom();    // New prng with an automatic seed.
	//   document.write(Math.random());       // Pretty much unpredictable.
	//
	//   Math.random = rng1;                  // Continue "hello" prng sequence.
	//   document.write(Math.random());       // Always 0.554769432473455
	//
	//   Math.seedrandom(autoseed);           // Restart at the previous seed.
	//   document.write(Math.random());       // Repeat the 'unpredictable' value.
	//
	// Notes:
	//
	// Each time seedrandom('arg') is called, entropy from the passed seed
	// is accumulated in a pool to help generate future seeds for the
	// zero-argument form of Math.seedrandom, so entropy can be injected over
	// time by calling seedrandom with explicit data repeatedly.
	//
	// On speed - This javascript implementation of Math.random() is about
	// 3-10x slower than the built-in Math.random() because it is not native
	// code, but this is typically fast enough anyway.  Seeding is more expensive,
	// especially if you use auto-seeding.  Some details (timings on Chrome 4):
	//
	// Our Math.random()            - avg less than 0.002 milliseconds per call
	// seedrandom('explicit')       - avg less than 0.5 milliseconds per call
	// seedrandom('explicit', true) - avg less than 2 milliseconds per call
	// seedrandom()                 - avg about 38 milliseconds per call
	//
	// LICENSE (BSD):
	//
	// Copyright 2010 David Bau, all rights reserved.
	//
	// Redistribution and use in source and binary forms, with or without
	// modification, are permitted provided that the following conditions are met:
	// 
	//   1. Redistributions of source code must retain the above copyright
	//      notice, this list of conditions and the following disclaimer.
	//
	//   2. Redistributions in binary form must reproduce the above copyright
	//      notice, this list of conditions and the following disclaimer in the
	//      documentation and/or other materials provided with the distribution.
	// 
	//   3. Neither the name of this module nor the names of its contributors may
	//      be used to endorse or promote products derived from this software
	//      without specific prior written permission.
	// 
	// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	//
	/**
	 * All code is in an anonymous closure to keep the global namespace clean.
	 *
	 * @param {number=} overflow 
	 * @param {number=} startdenom
	 */

	// Patched by Seb so that seedrandom.js does not pollute the Math object.
	// My tests suggest that doing Math.trouble = 1 makes Math lookups about 5%
	// slower.
	numeric.seedrandom = { pow:Math.pow, random:Math.random };

	(function (pool, math, width, chunks, significance, overflow, startdenom) {


	//
	// seedrandom()
	// This is the seedrandom function described above.
	//
	math['seedrandom'] = function seedrandom(seed, use_entropy) {
	  var key = [];
	  var arc4;

	  // Flatten the seed string or build one from local entropy if needed.
	  seed = mixkey(flatten(
	    use_entropy ? [seed, pool] :
	    arguments.length ? seed :
	    [new Date().getTime(), pool, window], 3), key);

	  // Use the seed to initialize an ARC4 generator.
	  arc4 = new ARC4(key);

	  // Mix the randomness into accumulated entropy.
	  mixkey(arc4.S, pool);

	  // Override Math.random

	  // This function returns a random double in [0, 1) that contains
	  // randomness in every bit of the mantissa of the IEEE 754 value.

	  math['random'] = function random() {  // Closure to return a random double:
	    var n = arc4.g(chunks);             // Start with a numerator n < 2 ^ 48
	    var d = startdenom;                 //   and denominator d = 2 ^ 48.
	    var x = 0;                          //   and no 'extra last byte'.
	    while (n < significance) {          // Fill up all significant digits by
	      n = (n + x) * width;              //   shifting numerator and
	      d *= width;                       //   denominator and generating a
	      x = arc4.g(1);                    //   new least-significant-byte.
	    }
	    while (n >= overflow) {             // To avoid rounding up, before adding
	      n /= 2;                           //   last byte, shift everything
	      d /= 2;                           //   right using integer math until
	      x >>>= 1;                         //   we have exactly the desired bits.
	    }
	    return (n + x) / d;                 // Form the number within [0, 1).
	  };

	  // Return the seed that was used
	  return seed;
	};

	//
	// ARC4
	//
	// An ARC4 implementation.  The constructor takes a key in the form of
	// an array of at most (width) integers that should be 0 <= x < (width).
	//
	// The g(count) method returns a pseudorandom integer that concatenates
	// the next (count) outputs from ARC4.  Its return value is a number x
	// that is in the range 0 <= x < (width ^ count).
	//
	/** @constructor */
	function ARC4(key) {
	  var t, u, me = this, keylen = key.length;
	  var i = 0, j = me.i = me.j = me.m = 0;
	  me.S = [];
	  me.c = [];

	  // The empty key [] is treated as [0].
	  if (!keylen) { key = [keylen++]; }

	  // Set up S using the standard key scheduling algorithm.
	  while (i < width) { me.S[i] = i++; }
	  for (i = 0; i < width; i++) {
	    t = me.S[i];
	    j = lowbits(j + t + key[i % keylen]);
	    u = me.S[j];
	    me.S[i] = u;
	    me.S[j] = t;
	  }

	  // The "g" method returns the next (count) outputs as one number.
	  me.g = function getnext(count) {
	    var s = me.S;
	    var i = lowbits(me.i + 1); var t = s[i];
	    var j = lowbits(me.j + t); var u = s[j];
	    s[i] = u;
	    s[j] = t;
	    var r = s[lowbits(t + u)];
	    while (--count) {
	      i = lowbits(i + 1); t = s[i];
	      j = lowbits(j + t); u = s[j];
	      s[i] = u;
	      s[j] = t;
	      r = r * width + s[lowbits(t + u)];
	    }
	    me.i = i;
	    me.j = j;
	    return r;
	  };
	  // For robust unpredictability discard an initial batch of values.
	  // See http://www.rsa.com/rsalabs/node.asp?id=2009
	  me.g(width);
	}

	//
	// flatten()
	// Converts an object tree to nested arrays of strings.
	//
	/** @param {Object=} result 
	  * @param {string=} prop
	  * @param {string=} typ */
	function flatten(obj, depth, result, prop, typ) {
	  result = [];
	  typ = typeof(obj);
	  if (depth && typ == 'object') {
	    for (prop in obj) {
	      if (prop.indexOf('S') < 5) {    // Avoid FF3 bug (local/sessionStorage)
	        try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
	      }
	    }
	  }
	  return (result.length ? result : obj + (typ != 'string' ? '\0' : ''));
	}

	//
	// mixkey()
	// Mixes a string seed into a key that is an array of integers, and
	// returns a shortened string seed that is equivalent to the result key.
	//
	/** @param {number=} smear 
	  * @param {number=} j */
	function mixkey(seed, key, smear, j) {
	  seed += '';                         // Ensure the seed is a string
	  smear = 0;
	  for (j = 0; j < seed.length; j++) {
	    key[lowbits(j)] =
	      lowbits((smear ^= key[lowbits(j)] * 19) + seed.charCodeAt(j));
	  }
	  seed = '';
	  for (j in key) { seed += String.fromCharCode(key[j]); }
	  return seed;
	}

	//
	// lowbits()
	// A quick "n mod width" for width a power of 2.
	//
	function lowbits(n) { return n & (width - 1); }

	//
	// The following constants are related to IEEE 754 limits.
	//
	startdenom = math.pow(width, chunks);
	significance = math.pow(2, significance);
	overflow = significance * 2;

	//
	// When seedrandom.js is loaded, we immediately mix a few bits
	// from the built-in RNG into the entropy pool.  Because we do
	// not want to intefere with determinstic PRNG state later,
	// seedrandom will not call math.random on its own again after
	// initialization.
	//
	mixkey(math.random(), pool);

	// End anonymous scope, and pass initial values.
	}(
	  [],   // pool: entropy pool starts empty
	  numeric.seedrandom, // math: package containing random, pow, and seedrandom
	  256,  // width: each RC4 output is 0 <= x < 256
	  6,    // chunks: at least six RC4 outputs for each double
	  52    // significance: there are 52 significant digits in a double
	  ));
	/* This file is a slightly modified version of quadprog.js from Alberto Santini.
	 * It has been slightly modified by Sébastien Loisel to make sure that it handles
	 * 0-based Arrays instead of 1-based Arrays.
	 * License is in resources/LICENSE.quadprog */
	(function(exports) {

	function base0to1(A) {
	    if(typeof A !== "object") { return A; }
	    var ret = [], i,n=A.length;
	    for(i=0;i<n;i++) ret[i+1] = base0to1(A[i]);
	    return ret;
	}
	function base1to0(A) {
	    if(typeof A !== "object") { return A; }
	    var ret = [], i,n=A.length;
	    for(i=1;i<n;i++) ret[i-1] = base1to0(A[i]);
	    return ret;
	}

	function dpori(a, lda, n) {
	    var i, j, k, kp1, t;

	    for (k = 1; k <= n; k = k + 1) {
	        a[k][k] = 1 / a[k][k];
	        t = -a[k][k];
	        //~ dscal(k - 1, t, a[1][k], 1);
	        for (i = 1; i < k; i = i + 1) {
	            a[i][k] = t * a[i][k];
	        }

	        kp1 = k + 1;
	        if (n < kp1) {
	            break;
	        }
	        for (j = kp1; j <= n; j = j + 1) {
	            t = a[k][j];
	            a[k][j] = 0;
	            //~ daxpy(k, t, a[1][k], 1, a[1][j], 1);
	            for (i = 1; i <= k; i = i + 1) {
	                a[i][j] = a[i][j] + (t * a[i][k]);
	            }
	        }
	    }

	}

	function dposl(a, lda, n, b) {
	    var i, k, kb, t;

	    for (k = 1; k <= n; k = k + 1) {
	        //~ t = ddot(k - 1, a[1][k], 1, b[1], 1);
	        t = 0;
	        for (i = 1; i < k; i = i + 1) {
	            t = t + (a[i][k] * b[i]);
	        }

	        b[k] = (b[k] - t) / a[k][k];
	    }

	    for (kb = 1; kb <= n; kb = kb + 1) {
	        k = n + 1 - kb;
	        b[k] = b[k] / a[k][k];
	        t = -b[k];
	        //~ daxpy(k - 1, t, a[1][k], 1, b[1], 1);
	        for (i = 1; i < k; i = i + 1) {
	            b[i] = b[i] + (t * a[i][k]);
	        }
	    }
	}

	function dpofa(a, lda, n, info) {
	    var i, j, jm1, k, t, s;

	    for (j = 1; j <= n; j = j + 1) {
	        info[1] = j;
	        s = 0;
	        jm1 = j - 1;
	        if (jm1 < 1) {
	            s = a[j][j] - s;
	            if (s <= 0) {
	                break;
	            }
	            a[j][j] = Math.sqrt(s);
	        } else {
	            for (k = 1; k <= jm1; k = k + 1) {
	                //~ t = a[k][j] - ddot(k - 1, a[1][k], 1, a[1][j], 1);
	                t = a[k][j];
	                for (i = 1; i < k; i = i + 1) {
	                    t = t - (a[i][j] * a[i][k]);
	                }
	                t = t / a[k][k];
	                a[k][j] = t;
	                s = s + t * t;
	            }
	            s = a[j][j] - s;
	            if (s <= 0) {
	                break;
	            }
	            a[j][j] = Math.sqrt(s);
	        }
	        info[1] = 0;
	    }
	}

	function qpgen2(dmat, dvec, fddmat, n, sol, crval, amat,
	    bvec, fdamat, q, meq, iact, nact, iter, work, ierr) {

	    var i, j, l, l1, info, it1, iwzv, iwrv, iwrm, iwsv, iwuv, nvl, r, iwnbv,
	        temp, sum, t1, tt, gc, gs, nu,
	        t1inf, t2min,
	        vsmall, tmpa, tmpb,
	        go;

	    r = Math.min(n, q);
	    l = 2 * n + (r * (r + 5)) / 2 + 2 * q + 1;

	    vsmall = 1.0e-60;
	    do {
	        vsmall = vsmall + vsmall;
	        tmpa = 1 + 0.1 * vsmall;
	        tmpb = 1 + 0.2 * vsmall;
	    } while (tmpa <= 1 || tmpb <= 1);

	    for (i = 1; i <= n; i = i + 1) {
	        work[i] = dvec[i];
	    }
	    for (i = n + 1; i <= l; i = i + 1) {
	        work[i] = 0;
	    }
	    for (i = 1; i <= q; i = i + 1) {
	        iact[i] = 0;
	    }

	    info = [];

	    if (ierr[1] === 0) {
	        dpofa(dmat, fddmat, n, info);
	        if (info[1] !== 0) {
	            ierr[1] = 2;
	            return;
	        }
	        dposl(dmat, fddmat, n, dvec);
	        dpori(dmat, fddmat, n);
	    } else {
	        for (j = 1; j <= n; j = j + 1) {
	            sol[j] = 0;
	            for (i = 1; i <= j; i = i + 1) {
	                sol[j] = sol[j] + dmat[i][j] * dvec[i];
	            }
	        }
	        for (j = 1; j <= n; j = j + 1) {
	            dvec[j] = 0;
	            for (i = j; i <= n; i = i + 1) {
	                dvec[j] = dvec[j] + dmat[j][i] * sol[i];
	            }
	        }
	    }

	    crval[1] = 0;
	    for (j = 1; j <= n; j = j + 1) {
	        sol[j] = dvec[j];
	        crval[1] = crval[1] + work[j] * sol[j];
	        work[j] = 0;
	        for (i = j + 1; i <= n; i = i + 1) {
	            dmat[i][j] = 0;
	        }
	    }
	    crval[1] = -crval[1] / 2;
	    ierr[1] = 0;

	    iwzv = n;
	    iwrv = iwzv + n;
	    iwuv = iwrv + r;
	    iwrm = iwuv + r + 1;
	    iwsv = iwrm + (r * (r + 1)) / 2;
	    iwnbv = iwsv + q;

	    for (i = 1; i <= q; i = i + 1) {
	        sum = 0;
	        for (j = 1; j <= n; j = j + 1) {
	            sum = sum + amat[j][i] * amat[j][i];
	        }
	        work[iwnbv + i] = Math.sqrt(sum);
	    }
	    nact = 0;
	    iter[1] = 0;
	    iter[2] = 0;

	    function fn_goto_50() {
	        iter[1] = iter[1] + 1;

	        l = iwsv;
	        for (i = 1; i <= q; i = i + 1) {
	            l = l + 1;
	            sum = -bvec[i];
	            for (j = 1; j <= n; j = j + 1) {
	                sum = sum + amat[j][i] * sol[j];
	            }
	            if (Math.abs(sum) < vsmall) {
	                sum = 0;
	            }
	            if (i > meq) {
	                work[l] = sum;
	            } else {
	                work[l] = -Math.abs(sum);
	                if (sum > 0) {
	                    for (j = 1; j <= n; j = j + 1) {
	                        amat[j][i] = -amat[j][i];
	                    }
	                    bvec[i] = -bvec[i];
	                }
	            }
	        }

	        for (i = 1; i <= nact; i = i + 1) {
	            work[iwsv + iact[i]] = 0;
	        }

	        nvl = 0;
	        temp = 0;
	        for (i = 1; i <= q; i = i + 1) {
	            if (work[iwsv + i] < temp * work[iwnbv + i]) {
	                nvl = i;
	                temp = work[iwsv + i] / work[iwnbv + i];
	            }
	        }
	        if (nvl === 0) {
	            return 999;
	        }

	        return 0;
	    }

	    function fn_goto_55() {
	        for (i = 1; i <= n; i = i + 1) {
	            sum = 0;
	            for (j = 1; j <= n; j = j + 1) {
	                sum = sum + dmat[j][i] * amat[j][nvl];
	            }
	            work[i] = sum;
	        }

	        l1 = iwzv;
	        for (i = 1; i <= n; i = i + 1) {
	            work[l1 + i] = 0;
	        }
	        for (j = nact + 1; j <= n; j = j + 1) {
	            for (i = 1; i <= n; i = i + 1) {
	                work[l1 + i] = work[l1 + i] + dmat[i][j] * work[j];
	            }
	        }

	        t1inf = true;
	        for (i = nact; i >= 1; i = i - 1) {
	            sum = work[i];
	            l = iwrm + (i * (i + 3)) / 2;
	            l1 = l - i;
	            for (j = i + 1; j <= nact; j = j + 1) {
	                sum = sum - work[l] * work[iwrv + j];
	                l = l + j;
	            }
	            sum = sum / work[l1];
	            work[iwrv + i] = sum;
	            if (iact[i] < meq) {
	                // continue;
	                break;
	            }
	            if (sum < 0) {
	                // continue;
	                break;
	            }
	            t1inf = false;
	            it1 = i;
	        }

	        if (!t1inf) {
	            t1 = work[iwuv + it1] / work[iwrv + it1];
	            for (i = 1; i <= nact; i = i + 1) {
	                if (iact[i] < meq) {
	                    // continue;
	                    break;
	                }
	                if (work[iwrv + i] < 0) {
	                    // continue;
	                    break;
	                }
	                temp = work[iwuv + i] / work[iwrv + i];
	                if (temp < t1) {
	                    t1 = temp;
	                    it1 = i;
	                }
	            }
	        }

	        sum = 0;
	        for (i = iwzv + 1; i <= iwzv + n; i = i + 1) {
	            sum = sum + work[i] * work[i];
	        }
	        if (Math.abs(sum) <= vsmall) {
	            if (t1inf) {
	                ierr[1] = 1;
	                // GOTO 999
	                return 999;
	            } else {
	                for (i = 1; i <= nact; i = i + 1) {
	                    work[iwuv + i] = work[iwuv + i] - t1 * work[iwrv + i];
	                }
	                work[iwuv + nact + 1] = work[iwuv + nact + 1] + t1;
	                // GOTO 700
	                return 700;
	            }
	        } else {
	            sum = 0;
	            for (i = 1; i <= n; i = i + 1) {
	                sum = sum + work[iwzv + i] * amat[i][nvl];
	            }
	            tt = -work[iwsv + nvl] / sum;
	            t2min = true;
	            if (!t1inf) {
	                if (t1 < tt) {
	                    tt = t1;
	                    t2min = false;
	                }
	            }

	            for (i = 1; i <= n; i = i + 1) {
	                sol[i] = sol[i] + tt * work[iwzv + i];
	                if (Math.abs(sol[i]) < vsmall) {
	                    sol[i] = 0;
	                }
	            }

	            crval[1] = crval[1] + tt * sum * (tt / 2 + work[iwuv + nact + 1]);
	            for (i = 1; i <= nact; i = i + 1) {
	                work[iwuv + i] = work[iwuv + i] - tt * work[iwrv + i];
	            }
	            work[iwuv + nact + 1] = work[iwuv + nact + 1] + tt;

	            if (t2min) {
	                nact = nact + 1;
	                iact[nact] = nvl;

	                l = iwrm + ((nact - 1) * nact) / 2 + 1;
	                for (i = 1; i <= nact - 1; i = i + 1) {
	                    work[l] = work[i];
	                    l = l + 1;
	                }

	                if (nact === n) {
	                    work[l] = work[n];
	                } else {
	                    for (i = n; i >= nact + 1; i = i - 1) {
	                        if (work[i] === 0) {
	                            // continue;
	                            break;
	                        }
	                        gc = Math.max(Math.abs(work[i - 1]), Math.abs(work[i]));
	                        gs = Math.min(Math.abs(work[i - 1]), Math.abs(work[i]));
	                        if (work[i - 1] >= 0) {
	                            temp = Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
	                        } else {
	                            temp = -Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
	                        }
	                        gc = work[i - 1] / temp;
	                        gs = work[i] / temp;

	                        if (gc === 1) {
	                            // continue;
	                            break;
	                        }
	                        if (gc === 0) {
	                            work[i - 1] = gs * temp;
	                            for (j = 1; j <= n; j = j + 1) {
	                                temp = dmat[j][i - 1];
	                                dmat[j][i - 1] = dmat[j][i];
	                                dmat[j][i] = temp;
	                            }
	                        } else {
	                            work[i - 1] = temp;
	                            nu = gs / (1 + gc);
	                            for (j = 1; j <= n; j = j + 1) {
	                                temp = gc * dmat[j][i - 1] + gs * dmat[j][i];
	                                dmat[j][i] = nu * (dmat[j][i - 1] + temp) - dmat[j][i];
	                                dmat[j][i - 1] = temp;

	                            }
	                        }
	                    }
	                    work[l] = work[nact];
	                }
	            } else {
	                sum = -bvec[nvl];
	                for (j = 1; j <= n; j = j + 1) {
	                    sum = sum + sol[j] * amat[j][nvl];
	                }
	                if (nvl > meq) {
	                    work[iwsv + nvl] = sum;
	                } else {
	                    work[iwsv + nvl] = -Math.abs(sum);
	                    if (sum > 0) {
	                        for (j = 1; j <= n; j = j + 1) {
	                            amat[j][nvl] = -amat[j][nvl];
	                        }
	                        bvec[nvl] = -bvec[nvl];
	                    }
	                }
	                // GOTO 700
	                return 700;
	            }
	        }

	        return 0;
	    }

	    function fn_goto_797() {
	        l = iwrm + (it1 * (it1 + 1)) / 2 + 1;
	        l1 = l + it1;
	        if (work[l1] === 0) {
	            // GOTO 798
	            return 798;
	        }
	        gc = Math.max(Math.abs(work[l1 - 1]), Math.abs(work[l1]));
	        gs = Math.min(Math.abs(work[l1 - 1]), Math.abs(work[l1]));
	        if (work[l1 - 1] >= 0) {
	            temp = Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
	        } else {
	            temp = -Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
	        }
	        gc = work[l1 - 1] / temp;
	        gs = work[l1] / temp;

	        if (gc === 1) {
	            // GOTO 798
	            return 798;
	        }
	        if (gc === 0) {
	            for (i = it1 + 1; i <= nact; i = i + 1) {
	                temp = work[l1 - 1];
	                work[l1 - 1] = work[l1];
	                work[l1] = temp;
	                l1 = l1 + i;
	            }
	            for (i = 1; i <= n; i = i + 1) {
	                temp = dmat[i][it1];
	                dmat[i][it1] = dmat[i][it1 + 1];
	                dmat[i][it1 + 1] = temp;
	            }
	        } else {
	            nu = gs / (1 + gc);
	            for (i = it1 + 1; i <= nact; i = i + 1) {
	                temp = gc * work[l1 - 1] + gs * work[l1];
	                work[l1] = nu * (work[l1 - 1] + temp) - work[l1];
	                work[l1 - 1] = temp;
	                l1 = l1 + i;
	            }
	            for (i = 1; i <= n; i = i + 1) {
	                temp = gc * dmat[i][it1] + gs * dmat[i][it1 + 1];
	                dmat[i][it1 + 1] = nu * (dmat[i][it1] + temp) - dmat[i][it1 + 1];
	                dmat[i][it1] = temp;
	            }
	        }

	        return 0;
	    }

	    function fn_goto_798() {
	        l1 = l - it1;
	        for (i = 1; i <= it1; i = i + 1) {
	            work[l1] = work[l];
	            l = l + 1;
	            l1 = l1 + 1;
	        }

	        work[iwuv + it1] = work[iwuv + it1 + 1];
	        iact[it1] = iact[it1 + 1];
	        it1 = it1 + 1;
	        if (it1 < nact) {
	            // GOTO 797
	            return 797;
	        }

	        return 0;
	    }

	    function fn_goto_799() {
	        work[iwuv + nact] = work[iwuv + nact + 1];
	        work[iwuv + nact + 1] = 0;
	        iact[nact] = 0;
	        nact = nact - 1;
	        iter[2] = iter[2] + 1;

	        return 0;
	    }

	    go = 0;
	    while (true) {
	        go = fn_goto_50();
	        if (go === 999) {
	            return;
	        }
	        while (true) {
	            go = fn_goto_55();
	            if (go === 0) {
	                break;
	            }
	            if (go === 999) {
	                return;
	            }
	            if (go === 700) {
	                if (it1 === nact) {
	                    fn_goto_799();
	                } else {
	                    while (true) {
	                        fn_goto_797();
	                        go = fn_goto_798();
	                        if (go !== 797) {
	                            break;
	                        }
	                    }
	                    fn_goto_799();
	                }
	            }
	        }
	    }

	}

	function solveQP(Dmat, dvec, Amat, bvec, meq, factorized) {
	    Dmat = base0to1(Dmat);
	    dvec = base0to1(dvec);
	    Amat = base0to1(Amat);
	    var i, n, q,
	        nact, r,
	        crval = [], iact = [], sol = [], work = [], iter = [],
	        message;

	    meq = meq || 0;
	    factorized = factorized ? base0to1(factorized) : [undefined, 0];
	    bvec = bvec ? base0to1(bvec) : [];

	    // In Fortran the array index starts from 1
	    n = Dmat.length - 1;
	    q = Amat[1].length - 1;

	    if (!bvec) {
	        for (i = 1; i <= q; i = i + 1) {
	            bvec[i] = 0;
	        }
	    }
	    for (i = 1; i <= q; i = i + 1) {
	        iact[i] = 0;
	    }
	    nact = 0;
	    r = Math.min(n, q);
	    for (i = 1; i <= n; i = i + 1) {
	        sol[i] = 0;
	    }
	    crval[1] = 0;
	    for (i = 1; i <= (2 * n + (r * (r + 5)) / 2 + 2 * q + 1); i = i + 1) {
	        work[i] = 0;
	    }
	    for (i = 1; i <= 2; i = i + 1) {
	        iter[i] = 0;
	    }

	    qpgen2(Dmat, dvec, n, n, sol, crval, Amat,
	        bvec, n, q, meq, iact, nact, iter, work, factorized);

	    message = "";
	    if (factorized[1] === 1) {
	        message = "constraints are inconsistent, no solution!";
	    }
	    if (factorized[1] === 2) {
	        message = "matrix D in quadratic function is not positive definite!";
	    }

	    return {
	        solution: base1to0(sol),
	        value: base1to0(crval),
	        unconstrained_solution: base1to0(dvec),
	        iterations: base1to0(iter),
	        iact: base1to0(iact),
	        message: message
	    };
	}
	exports.solveQP = solveQP;
	}(numeric));
	/*
	Shanti Rao sent me this routine by private email. I had to modify it
	slightly to work on Arrays instead of using a Matrix object.
	It is apparently translated from http://stitchpanorama.sourceforge.net/Python/svd.py
	*/

	numeric.svd= function svd(A) {
	    var temp;
	//Compute the thin SVD from G. H. Golub and C. Reinsch, Numer. Math. 14, 403-420 (1970)
		var prec= numeric.epsilon; //Math.pow(2,-52) // assumes double prec
		var tolerance= 1.e-64/prec;
		var itmax= 50;
		var c=0;
		var i=0;
		var j=0;
		var k=0;
		var l=0;
		
		var u= numeric.clone(A);
		var m= u.length;
		
		var n= u[0].length;
		
		if (m < n) throw "Need more rows than columns"
		
		var e = new Array(n);
		var q = new Array(n);
		for (i=0; i<n; i++) e[i] = q[i] = 0.0;
		var v = numeric.rep([n,n],0);
	//	v.zero();
		
	 	function pythag(a,b)
	 	{
			a = Math.abs(a)
			b = Math.abs(b)
			if (a > b)
				return a*Math.sqrt(1.0+(b*b/a/a))
			else if (b == 0.0) 
				return a
			return b*Math.sqrt(1.0+(a*a/b/b))
		}

		//Householder's reduction to bidiagonal form

		var f= 0.0;
		var g= 0.0;
		var h= 0.0;
		var x= 0.0;
		var y= 0.0;
		var z= 0.0;
		var s= 0.0;
		
		for (i=0; i < n; i++)
		{	
			e[i]= g;
			s= 0.0;
			l= i+1;
			for (j=i; j < m; j++) 
				s += (u[j][i]*u[j][i]);
			if (s <= tolerance)
				g= 0.0;
			else
			{	
				f= u[i][i];
				g= Math.sqrt(s);
				if (f >= 0.0) g= -g;
				h= f*g-s
				u[i][i]=f-g;
				for (j=l; j < n; j++)
				{
					s= 0.0
					for (k=i; k < m; k++) 
						s += u[k][i]*u[k][j]
					f= s/h
					for (k=i; k < m; k++) 
						u[k][j]+=f*u[k][i]
				}
			}
			q[i]= g
			s= 0.0
			for (j=l; j < n; j++) 
				s= s + u[i][j]*u[i][j]
			if (s <= tolerance)
				g= 0.0
			else
			{	
				f= u[i][i+1]
				g= Math.sqrt(s)
				if (f >= 0.0) g= -g
				h= f*g - s
				u[i][i+1] = f-g;
				for (j=l; j < n; j++) e[j]= u[i][j]/h
				for (j=l; j < m; j++)
				{	
					s=0.0
					for (k=l; k < n; k++) 
						s += (u[j][k]*u[i][k])
					for (k=l; k < n; k++) 
						u[j][k]+=s*e[k]
				}	
			}
			y= Math.abs(q[i])+Math.abs(e[i])
			if (y>x) 
				x=y
		}
		
		// accumulation of right hand gtransformations
		for (i=n-1; i != -1; i+= -1)
		{	
			if (g != 0.0)
			{
			 	h= g*u[i][i+1]
				for (j=l; j < n; j++) 
					v[j][i]=u[i][j]/h
				for (j=l; j < n; j++)
				{	
					s=0.0
					for (k=l; k < n; k++) 
						s += u[i][k]*v[k][j]
					for (k=l; k < n; k++) 
						v[k][j]+=(s*v[k][i])
				}	
			}
			for (j=l; j < n; j++)
			{
				v[i][j] = 0;
				v[j][i] = 0;
			}
			v[i][i] = 1;
			g= e[i]
			l= i
		}
		
		// accumulation of left hand transformations
		for (i=n-1; i != -1; i+= -1)
		{	
			l= i+1
			g= q[i]
			for (j=l; j < n; j++) 
				u[i][j] = 0;
			if (g != 0.0)
			{
				h= u[i][i]*g
				for (j=l; j < n; j++)
				{
					s=0.0
					for (k=l; k < m; k++) s += u[k][i]*u[k][j];
					f= s/h
					for (k=i; k < m; k++) u[k][j]+=f*u[k][i];
				}
				for (j=i; j < m; j++) u[j][i] = u[j][i]/g;
			}
			else
				for (j=i; j < m; j++) u[j][i] = 0;
			u[i][i] += 1;
		}
		
		// diagonalization of the bidiagonal form
		prec= prec*x
		for (k=n-1; k != -1; k+= -1)
		{
			for (var iteration=0; iteration < itmax; iteration++)
			{	// test f splitting
				var test_convergence = false
				for (l=k; l != -1; l+= -1)
				{	
					if (Math.abs(e[l]) <= prec)
					{	test_convergence= true
						break 
					}
					if (Math.abs(q[l-1]) <= prec)
						break 
				}
				if (!test_convergence)
				{	// cancellation of e[l] if l>0
					c= 0.0
					s= 1.0
					var l1= l-1
					for (i =l; i<k+1; i++)
					{	
						f= s*e[i]
						e[i]= c*e[i]
						if (Math.abs(f) <= prec)
							break
						g= q[i]
						h= pythag(f,g)
						q[i]= h
						c= g/h
						s= -f/h
						for (j=0; j < m; j++)
						{	
							y= u[j][l1]
							z= u[j][i]
							u[j][l1] =  y*c+(z*s)
							u[j][i] = -y*s+(z*c)
						} 
					}	
				}
				// test f convergence
				z= q[k]
				if (l== k)
				{	//convergence
					if (z<0.0)
					{	//q[k] is made non-negative
						q[k]= -z
						for (j=0; j < n; j++)
							v[j][k] = -v[j][k]
					}
					break  //break out of iteration loop and move on to next k value
				}
				if (iteration >= itmax-1)
					throw 'Error: no convergence.'
				// shift from bottom 2x2 minor
				x= q[l]
				y= q[k-1]
				g= e[k-1]
				h= e[k]
				f= ((y-z)*(y+z)+(g-h)*(g+h))/(2.0*h*y)
				g= pythag(f,1.0)
				if (f < 0.0)
					f= ((x-z)*(x+z)+h*(y/(f-g)-h))/x
				else
					f= ((x-z)*(x+z)+h*(y/(f+g)-h))/x
				// next QR transformation
				c= 1.0
				s= 1.0
				for (i=l+1; i< k+1; i++)
				{	
					g= e[i]
					y= q[i]
					h= s*g
					g= c*g
					z= pythag(f,h)
					e[i-1]= z
					c= f/z
					s= h/z
					f= x*c+g*s
					g= -x*s+g*c
					h= y*s
					y= y*c
					for (j=0; j < n; j++)
					{	
						x= v[j][i-1]
						z= v[j][i]
						v[j][i-1] = x*c+z*s
						v[j][i] = -x*s+z*c
					}
					z= pythag(f,h)
					q[i-1]= z
					c= f/z
					s= h/z
					f= c*g+s*y
					x= -s*g+c*y
					for (j=0; j < m; j++)
					{
						y= u[j][i-1]
						z= u[j][i]
						u[j][i-1] = y*c+z*s
						u[j][i] = -y*s+z*c
					}
				}
				e[l]= 0.0
				e[k]= f
				q[k]= x
			} 
		}
			
		//vt= transpose(v)
		//return (u,q,vt)
		for (i=0;i<q.length; i++) 
		  if (q[i] < prec) q[i] = 0
		  
		//sort eigenvalues	
		for (i=0; i< n; i++)
		{	 
		//writeln(q)
		 for (j=i-1; j >= 0; j--)
		 {
		  if (q[j] < q[i])
		  {
		//  writeln(i,'-',j)
		   c = q[j]
		   q[j] = q[i]
		   q[i] = c
		   for(k=0;k<u.length;k++) { temp = u[k][i]; u[k][i] = u[k][j]; u[k][j] = temp; }
		   for(k=0;k<v.length;k++) { temp = v[k][i]; v[k][i] = v[k][j]; v[k][j] = temp; }
	//	   u.swapCols(i,j)
	//	   v.swapCols(i,j)
		   i = j	   
		  }
		 }	
		}
		
		return {U:u,S:q,V:v}
	};


	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * This module exports functions for checking types
	 * and throwing exceptions.
	 */

	/*globals define, module */

	(function (globals) {
	    'use strict';

	    var messages, predicates, functions, assert, not, maybe, either;

	    messages = {
	        like: 'Invalid type',
	        instance: 'Invalid type',
	        emptyObject: 'Invalid object',
	        object: 'Invalid object',
	        assigned: 'Invalid value',
	        undefined: 'Invalid value',
	        null: 'Invalid value',
	        length: 'Invalid length',
	        array: 'Invalid array',
	        date: 'Invalid date',
	        fn: 'Invalid function',
	        webUrl: 'Invalid URL',
	        unemptyString: 'Invalid string',
	        string: 'Invalid string',
	        odd: 'Invalid number',
	        even: 'Invalid number',
	        positive: 'Invalid number',
	        negative: 'Invalid number',
	        integer: 'Invalid number',
	        number: 'Invalid number',
	        boolean: 'Invalid boolean'
	    };

	    predicates = {
	        like: like,
	        instance: instance,
	        emptyObject: emptyObject,
	        object: object,
	        assigned: assigned,
	        undefined: isUndefined,
	        null: isNull,
	        length: length,
	        array: array,
	        date: date,
	        function: isFunction,
	        webUrl: webUrl,
	        unemptyString: unemptyString,
	        string: string,
	        odd: odd,
	        even: even,
	        positive: positive,
	        negative: negative,
	        integer : integer,
	        number: number,
	        boolean: boolean
	    };

	    functions = {
	        apply: apply,
	        map: map,
	        all: all,
	        any: any
	    };

	    functions = mixin(functions, predicates);
	    assert = createModifiedPredicates(assertModifier);
	    not = createModifiedPredicates(notModifier);
	    maybe = createModifiedPredicates(maybeModifier);
	    either = createModifiedPredicates(eitherModifier);
	    assert.not = createModifiedFunctions(assertModifier, not);
	    assert.maybe = createModifiedFunctions(assertModifier, maybe);
	    assert.either = createModifiedFunctions(assertEitherModifier, predicates);

	    exportFunctions(mixin(functions, {
	        assert: assert,
	        not: not,
	        maybe: maybe,
	        either: either
	    }));

	    /**
	     * Public function `like`.
	     *
	     * Tests whether an object 'quacks like a duck'.
	     * Returns `true` if the first argument has all of
	     * the properties of the second, archetypal argument
	     * (the 'duck'). Returns `false` otherwise. If either
	     * argument is not an object, an exception is thrown.
	     *
	     */
	    function like (data, duck) {
	        var name;

	        assert.object(data);
	        assert.object(duck);

	        for (name in duck) {
	            if (duck.hasOwnProperty(name)) {
	                if (data.hasOwnProperty(name) === false || typeof data[name] !== typeof duck[name]) {
	                    return false;
	                }

	                if (object(data[name]) && like(data[name], duck[name]) === false) {
	                    return false;
	                }
	            }
	        }

	        return true;
	    }

	    /**
	     * Public function `instance`.
	     *
	     * Returns `true` if an object is an instance of a prototype,
	     * `false` otherwise.
	     *
	     */
	    function instance (data, prototype) {
	        if (data && isFunction(prototype) && data instanceof prototype) {
	            return true;
	        }

	        return false;
	    }

	    /**
	     * Public function `emptyObject`.
	     *
	     * Returns `true` if something is an empty object,
	     * `false` otherwise.
	     *
	     */
	    function emptyObject (data) {
	        return object(data) && Object.keys(data).length === 0;
	    }

	    /**
	     * Public function `object`.
	     *
	     * Returns `true` if something is a plain-old JS object,
	     * `false` otherwise.
	     *
	     */
	    function object (data) {
	        return assigned(data) && Object.prototype.toString.call(data) === '[object Object]';
	    }

	    /**
	     * Public function `assigned`.
	     *
	     * Returns `true` if something is not null or undefined,
	     * `false` otherwise.
	     *
	     */
	    function assigned (data) {
	        return !isUndefined(data) && !isNull(data);
	    }

	    /**
	     * Public function `undefined`.
	     *
	     * Returns `true` if something is undefined,
	     * `false` otherwise.
	     *
	     */
	    function isUndefined (data) {
	        return data === undefined;
	    }

	    /**
	     * Public function `null`.
	     *
	     * Returns `true` if something is null,
	     * `false` otherwise.
	     *
	     */
	    function isNull (data) {
	        return data === null;
	    }

	    /**
	     * Public function `length`.
	     *
	     * Returns `true` if something is has a length property
	     * that equals `value`, `false` otherwise.
	     *
	     */
	    function length (data, value) {
	        assert.not.undefined(value);

	        return assigned(data) && data.length === value;
	    }

	    /**
	     * Public function `array`.
	     *
	     * Returns `true` something is an array,
	     * `false` otherwise.
	     *
	     */
	    function array (data) {
	        return Array.isArray(data);
	    }

	    /**
	     * Public function `date`.
	     *
	     * Returns `true` something is a valid date,
	     * `false` otherwise.
	     *
	     */
	    function date (data) {
	        return Object.prototype.toString.call(data) === '[object Date]' &&
	            !isNaN(data.getTime());
	    }

	    /**
	     * Public function `function`.
	     *
	     * Returns `true` if something is function,
	     * `false` otherwise.
	     *
	     */
	    function isFunction (data) {
	        return typeof data === 'function';
	    }

	    /**
	     * Public function `webUrl`.
	     *
	     * Returns `true` if something is an HTTP or HTTPS URL,
	     * `false` otherwise.
	     *
	     */
	    function webUrl (data) {
	        return unemptyString(data) && /^(https?:)?\/\/([\w-\.~:@]+)(\/[\w-\.~\/\?#\[\]&\(\)\*\+,;=%]*)?$/.test(data);
	    }

	    /**
	     * Public function `unemptyString`.
	     *
	     * Returns `true` if something is a non-empty string, `false`
	     * otherwise.
	     *
	     */
	    function unemptyString (data) {
	        return string(data) && data !== '';
	    }

	    /**
	     * Public function `string`.
	     *
	     * Returns `true` if something is a string, `false` otherwise.
	     *
	     */
	    function string (data) {
	        return typeof data === 'string';
	    }

	    /**
	     * Public function `odd`.
	     *
	     * Returns `true` if something is an odd number,
	     * `false` otherwise.
	     *
	     */
	    function odd (data) {
	        return integer(data) && !even(data);
	    }

	    /**
	     * Public function `even`.
	     *
	     * Returns `true` if something is an even number,
	     * `false` otherwise.
	     *
	     */
	    function even (data) {
	        return number(data) && data % 2 === 0;
	    }

	    /**
	     * Public function `integer`.
	     *
	     * Returns `true` if something is an integer,
	     * `false` otherwise.
	     *
	     */
	    function integer (data) {
	        return number(data) && data % 1 === 0;
	    }

	    /**
	     * Public function `positive`.
	     *
	     * Returns `true` if something is a positive number,
	     * `false` otherwise.
	     *
	     */
	    function positive (data) {
	        return number(data) && data > 0;
	    }

	    /**
	     * Public function `negative`.
	     *
	     * Returns `true` if something is a negative number,
	     * `false` otherwise.
	     *
	     * @param data          The thing to test.
	     */
	    function negative (data) {
	        return number(data) && data < 0;
	    }

	    /**
	     * Public function `number`.
	     *
	     * Returns `true` if data is a number,
	     * `false` otherwise.
	     *
	     */
	    function number (data) {
	        return typeof data === 'number' && isNaN(data) === false &&
	               data !== Number.POSITIVE_INFINITY &&
	               data !== Number.NEGATIVE_INFINITY;
	    }

	    /**
	     * Public function `boolean`.
	     *
	     * Returns `true` if data is a boolean value,
	     * `false` otherwise.
	     *
	     */
	    function boolean (data) {
	        return data === false || data === true;
	    }

	    /**
	     * Public function `apply`.
	     *
	     * Maps each value from the data to the corresponding predicate and returns
	     * the result array. If the same function is to be applied across all of the
	     * data, a single predicate function may be passed in.
	     *
	     */
	    function apply (data, predicates) {
	        assert.array(data);

	        if (isFunction(predicates)) {
	            return data.map(function (value) {
	                return predicates(value);
	            });
	        }

	        assert.array(predicates);
	        assert.length(data, predicates.length);

	        return data.map(function (value, index) {
	            return predicates[index](value);
	        });
	    }

	    /**
	     * Public function `map`.
	     *
	     * Maps each value from the data to the corresponding predicate and returns
	     * the result object. Supports nested objects.
	     *
	     */
	    function map (data, predicates) {
	        var result = {}, keys;

	        assert.object(data);
	        assert.object(predicates);

	        keys = Object.keys(predicates);
	        assert.length(Object.keys(data), keys.length);

	        keys.forEach(function (key) {
	            var predicate = predicates[key];

	            if (isFunction(predicate)) {
	                result[key] = predicate(data[key]);
	            } else if (object(predicate)) {
	                result[key] = map(data[key], predicate);
	            }
	        });

	        return result;
	    }

	    /**
	     * Public function `all`
	     *
	     * Check that all boolean values are true
	     * in an array (returned from `apply`)
	     * or object (returned from `map`).
	     *
	     */
	    function all (data) {
	        if (array(data)) {
	            return testArray(data, false);
	        }

	        assert.object(data);

	        return testObject(data, false);
	    }

	    function testArray (data, result) {
	        var i;

	        for (i = 0; i < data.length; i += 1) {
	            if (data[i] === result) {
	                return result;
	            }
	        }

	        return !result;
	    }

	    function testObject (data, result) {
	        var key, value;

	        for (key in data) {
	            if (data.hasOwnProperty(key)) {
	                value = data[key];

	                if (object(value) && testObject(value, result) === result) {
	                    return result;
	                }

	                if (value === result) {
	                    return result;
	                }
	            }
	        }

	        return !result;
	    }

	    /**
	     * Public function `any`
	     *
	     * Check that at least one boolean value is true
	     * in an array (returned from `apply`)
	     * or object (returned from `map`).
	     *
	     */
	    function any (data) {
	        if (array(data)) {
	            return testArray(data, true);
	        }

	        assert.object(data);

	        return testObject(data, true);
	    }

	    function mixin (target, source) {
	        Object.keys(source).forEach(function (key) {
	            target[key] = source[key];
	        });

	        return target;
	    }

	    /**
	     * Public modifier `assert`.
	     *
	     * Throws if `predicate` returns `false`.
	     */
	    function assertModifier (predicate, defaultMessage) {
	        return function () {
	            assertPredicate(predicate, arguments, defaultMessage);
	        };
	    }

	    function assertPredicate (predicate, args, defaultMessage) {
	        var message;

	        if (!predicate.apply(null, args)) {
	            message = args[args.length - 1];
	            throw new Error(unemptyString(message) ? message : defaultMessage);
	        }
	    }

	    function assertEitherModifier (predicate, defaultMessage) {
	        return function () {
	            var error;

	            try {
	                assertPredicate(predicate, arguments, defaultMessage);
	            } catch (e) {
	                error = e;
	            }

	            return {
	                or: Object.keys(predicates).reduce(delayedAssert, {})
	            };

	            function delayedAssert (result, key) {
	                result[key] = function () {
	                    if (error && !predicates[key].apply(null, arguments)) {
	                        throw error;
	                    }
	                };

	                return result;
	            }
	        };
	    }

	    /**
	     * Public modifier `not`.
	     *
	     * Negates `predicate`.
	     */
	    function notModifier (predicate) {
	        return function () {
	            return !predicate.apply(null, arguments);
	        };
	    }

	    /**
	     * Public modifier `maybe`.
	     *
	     * Returns `true` if predicate argument is  `null` or `undefined`,
	     * otherwise propagates the return value from `predicate`.
	     */
	    function maybeModifier (predicate) {
	        return function () {
	            if (!assigned(arguments[0])) {
	                return true;
	            }

	            return predicate.apply(null, arguments);
	        };
	    }

	    /**
	     * Public modifier `either`.
	     *
	     * Returns `true` if either predicate is true.
	     */
	    function eitherModifier (predicate) {
	        return function () {
	            var shortcut = predicate.apply(null, arguments);

	            return {
	                or: Object.keys(predicates).reduce(nopOrPredicate, {})
	            };

	            function nopOrPredicate (result, key) {
	                result[key] = shortcut ? nop : predicates[key];
	                return result;
	            }
	        };

	        function nop () {
	            return true;
	        }
	    }

	    function createModifiedPredicates (modifier) {
	        return createModifiedFunctions(modifier, predicates);
	    }

	    function createModifiedFunctions (modifier, functions) {
	        var result = {};

	        Object.keys(functions).forEach(function (key) {
	            result[key] = modifier(functions[key], messages[key]);
	        });

	        return result;
	    }

	    function exportFunctions (functions) {
	        if (true) {
	            !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	                return functions;
	            }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	        } else if (typeof module !== 'undefined' && module !== null && module.exports) {
	            module.exports = functions;
	        } else {
	            globals.check = functions;
	        }
	    }
	}(this));


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(29);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(31);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(30)))

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    draining = true;
	    var currentQueue;
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        var i = -1;
	        while (++i < len) {
	            currentQueue[i]();
	        }
	        len = queue.length;
	    }
	    draining = false;
	}
	process.nextTick = function (fun) {
	    queue.push(fun);
	    if (!draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ }
/******/ ]);