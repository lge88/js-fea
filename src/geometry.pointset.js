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

var _ = require('./core.utils');
var numeric = require('./core.numeric');
var norm2 = numeric.norm2;
var sub = numeric.sub;

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

/**
 *
 * @param {Int} index - zero-based index
 * @returns {Array} Coordinates
 */
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
      return norm2(sub(p, point)) < precision;
    });
  }
  return false;
};

// Oh yeah, brute-force
PointSet.prototype.merged = function(aPrecision) {
  var precision = aPrecision || PointSet.DEFAULT_PRECISION;
  var lst = [];
  this.forEach(function(p0) {
    var tooClose = _.any(lst, function(p1) { return norm2(p0, p1) < precision; });
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
