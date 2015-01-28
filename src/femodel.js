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
//   FeElement::setId(id)
//   FeElement::getLabel()
//   FeElement::setLabel(t)
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
//   FeModel::findByLabel(item)
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
//   FeModel::getXDiff()
//   FeModel::getYDiff()
//   FeModel::getZDiff()
//   FeModel::getDimension()
//   FeModel::toJSON()
//   FeModel::setFromJSON(json)
//   FeModel::copy(other)
//   FeModel::clone()

var Bipartite = require('./core.bipartite.js').Bipartite;
var Bimap = require('./core.bimap.js').Bimap;
var SetStore = require('./core.setstore.js').SetStore;

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
