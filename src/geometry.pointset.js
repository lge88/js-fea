/*global require*/
// geometry.pointset

// FUNCTIONS:
//   PointSet()
//   notZero(x)
//   sign(x)
//   makeForEach(size)
// //
// [PointSet] constructor:
//   PointSet()
// //
// [PointSet] instance methods:
//   PointSet::clone()
//   PointSet::toJSON()
//   PointSet::toList()
//   PointSet::equals(other)
//   PointSet::get(index)
//   PointSet::set(index, point)
//   PointSet::forEach(iterator)
//   PointSet::map(mapping)
//   PointSet::filter(iterator)
//   PointSet::selectIndices(predicate)
//   PointSet::merge(precision)
//   PointSet::fuse(other)
//   PointSet::rotate(dims, angle)
//   PointSet::scale(dims, values)
//   PointSet::translate(dims, values)
//   PointSet::transform(matrix)
//   PointSet::embed(dim)
//   PointSet::extrude(hlist)
//   PointSet::prod(pointset)

var _ = require('./core.utils');
// var _swap = utils._utils._swap;
// var _quickSort = utils._utils._quickSort;
// var _flat = utils._utils._flat;
// var _areEqual = utils._utils._areEqual;
// var _toArray = utils._utils._toArray;
// var vectorAdd = utils.vector.add;
// var vectorSub = utils.vector.sub;
// var vectorMul = utils.vector.mul;
// var vectorAvg = utils.vector.avg;

// Importance to understand the dimension of the pointset (rn) and
// the size of the point set is different concept.
//

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

PointSet.prototype.__defineGetter__('size', function () {
  return this._points.length;
});
PointSet.prototype.getSize = function() { return this.size; };

PointSet.prototype.__defineGetter__('rn', function () {
  return this._rn;
});
PointSet.prototype.getRn = function() { return this.rn; };

PointSet.prototype.clone = function() {
  return new PointSet(this.toList());
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

PointSet.prototype.equals = function (other) {
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

PointSet.prototype.set = function(index, point) {
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

// return a list indices that satisfy the predicate
PointSet.prototype.selectIndices = function(predicate) {
  var points = this.points;
  var length = points.length;
  var out = [];
  var filtered = new Float32Array(length);
  var rn = this.rn;
  var i, j, k;
  var point;
  var pointset;

  for (i = j = k = 0; i < length; i += rn, j += 1) {
    point = points.subarray(i, i + rn);
    if (predicate(point, j)) {
      out.push(j);
      k += rn;
    }
  }

  return out;
};

PointSet.prototype.merge = function (precision) {
  var precision = precision || 1e-4;
  var points = this.points;
  var length = points.length;
  var rn = this.rn;
  var size = this.size;
  var indices = new Uint32Array(size);
  var merged = new Float32Array(length);
  var usedIndices = 0;
  var usedCoords = 0;
  var vertexAdded;
  var equals;
  var i, j, k;

  for (i = 0; i < length; i += rn) {
    vertexAdded = false;
    for (j = 0; j < usedCoords && !vertexAdded; j += rn) {
      equals = true;
      for (k = 0; k < rn; k += 1) {
        points[i+k] = Math.round(points[i+k] / precision) * precision;
        equals &= points[i+k] === merged[j+k];
      }
      vertexAdded |= equals;
    }
    indices[i/rn] = !vertexAdded ? usedIndices : j/rn-1;
    if (!vertexAdded) {
      for (k = 0; k < rn; k += 1) {
        merged[usedCoords+k] = points[i+k];
      }
      usedIndices += 1;
      usedCoords = usedIndices*rn;
    }
  }

  this.points = merged.subarray(0, usedCoords);

  return indices;
};

PointSet.prototype.fuse = function(other) {
  if (!(this.rn === other.rn)) {
    throw new Error('Only supprt this operation for same rn now');
  }

  var thisLength = this.size * this.rn;
  var otherLength = other.size * other.rn;
  var length = thisLength + otherLength;
  var combined = new Float32Array(length);

  var i, thisPoints = this.points, otherPoints = other.points;

  for (i = 0; i < thisLength; ++i) {
    combined[i] = thisPoints[i];
  }

  for (i = 0; i < otherLength; ++i) {
    combined[i + thisLength] = otherPoints[i];
  }

  this.points = combined;
  return this;
};

PointSet.prototype.rotate = function (dims, angle) {
  // var maxDim = Math.max.apply(null, dims.concat(this.rn - 1));
  // this.embed(maxDim + 1);
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
  // var maxDim = Math.max.apply(null, dims.concat(this.rn - 1));
  // this.embed(maxDim + 1);
  // var rn = this.rn;

  // var points = this.points;
  // var length = points.length;
  // var dimsLength = dims.length;
  // var i, j;

  // for (i = 0; i < length; i += rn) {
  //   for (j = 0; j < dimsLength; j += 1) {
  //     points[i+dims[j]] *= values[j];
  //   }
  // }

  // return this;
  throw new Error('PointSet::scale(dims, values) is not implemented');
};

PointSet.prototype.translate = function (dims, values) {
  // var maxDim = Math.max.apply(null, dims.concat(this.rn - 1));
  // this.embed(maxDim + 1);
  // var rn = this.rn;

  // var points = this.points;
  // var length = points.length;
  // var dimsLength = dims.length;
  // var i, j;

  // for (i = 0; i < length; i += rn) {
  //   for (j = 0; j < dimsLength; j += 1) {
  //     points[i+dims[j]] += values[j];
  //   }
  // }
  // return this;
  throw new Error('PointSet::translate(dims, values) is not implemented');
};

PointSet.prototype.transform = function (matrix) {
  throw new Error('PointSet::transform(matrix) is not implemented');
};

PointSet.prototype.prod = function(other) {
  throw new Error('PointSet::prod(other) is not implemented.');
};

exports.PointSet = PointSet;
