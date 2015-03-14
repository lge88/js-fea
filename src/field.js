/*global require*/
// field

var _ = require('./core.utils');
var check = _.check;
var assert = _.assert;
var isVectorOfDimension = _.isVectorOfDimension;
var array2d = _.array2d;
var array1d = _.array1d;
var defineContract = _.defineContract;
var matrixOfDimension = _.contracts.matrixOfDimension;
var PointSet = require('./geometry.pointset').PointSet;
var FeNodeSet = require('./fens').FeNodeSet;

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

// Probably should not preserve bcs?
Field.prototype.map = function(fn) {
  var newPointset = this._values.map(fn);
  var newField = new Field({
    pointset: newPointset
  });
  var id = function(x) { return x; };
  newField._neqns = this._neqns;
  newField._eqnums = this._eqnums ? this._eqnums.map(id) : this._eqnums;
  newField._prescribed = this._prescribed ? this._prescribed.map(id) : this._prescribed;
  newField._prescribedValues = this._prescribedValues ? this._prescribedValues.map(function(x, i) {
    var xCopy = x.slice();
    if (newField._prescribed[i])
      return fn(xCopy, i);
    else
      return xCopy;
  }) : this.prescribedValues;
  return newField;
};

Field.prototype.scale = function(s) {
  return this.map(function(vec) {
    return vec.map(function(x) {
      return x*s;
    });
  });
};

Field.prototype.clone = function() {
  return this.map(function(x) { return x.slice(); });
};

/**
 * Returns a new field of the sum
 * @param {Number|Field|Array} other - A number, a field of
 same nfens and dim or an array of length this.dim().
 * @returns {Field} - Sum of this and other.
 */

Field.prototype.add = function(other) {
  var newPointset;
  if (typeof other === 'number') {
    newPointset = this._values.map(function(xyz) {
      return xyz.map(function(x) { return x + other; });
    });
  } else if (other instanceof Field &&
             this.nfens() === other.nfens() &&
             this.dim() === other.dim()) {
    newPointset = this._values.map(function(xyz, i) {
      return xyz.map(function(x, j) {
        return x + other.at(i)[j];
      });
    });
  } else if (Array.isArray(other) && other.length === this.dim()) {
    newPointset = this._values.map(function(xyz) {
      return xyz.map(function(x, j) {
        return x + other[j];
      });
    });
  } else {
    throw new Error('Field::add(other): invalid `other`. `other` should be number,' +
                    ' a field of same dimension or' +
                    ' an array of length this.dim().');
  }

  return new Field({ pointset: newPointset });
};

// Get value vector by Id
// Return: vec:this.dim()
Field.prototype.getById = function(id) {
  var idx = id - 1;
  return this._values.get(idx);
};

/**
 * Get value at index.
 * @param {Number} idx - index
 * @return {Vector:this.dim()}
 */
Field.prototype.at = function(idx) {
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
