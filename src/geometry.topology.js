/*global require*/
// geometry.topology
// FUNCTIONS:
//   Topology(complexes)
//   hypercubeTopology(conn, dim)
//   simplexTopology(conn, dim)
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
// [hypercubeTopology] class methods:
//   hypercubeTopology.getCellType(dim)
//   hypercubeTopology.getCellSize(dim)

var _ = require('./core.utils');
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
  _(_complexes).each(function(x, i) {
    _(_complexes[i]).each(function(y, j) {
      var offset = _.minIndex(y);
      _complexes[i][j] = _.rotateLeft(y, offset);
    });
    _complexes[i].sort(_.byLexical);
  });
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

// Topology.prototype.remap = function(mapping) {

// };

// Topology.prototype.unique = function() {

// };

Topology.prototype.fuse = function(other) {

};

// Topology.prototype.invert = function() {

// };

Topology.prototype.skeleton = function(ord) {

};

Topology.prototype.boundary = function() {

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
function hypercubeTopology(conn, dim) {
  var complexes = [];
  return new Topology(complexes);
};

hypercubeTopology.DIM_CELLSIZE_BIMAP = new Bimap([
  [0, 1],
  [1, 2],
  [2, 4],
  [3, 8]
]);

hypercubeTopology.DIM_CELLTYPE_BIMAP = new Bimap([
  [0, 'P'],
  [1, 'L2'],
  [2, 'Q4'],
  [3, 'H8']
]);

hypercubeTopology.getCellType = function(dim) {
  var t = hypercubeTopology.DIM_CELLTYPE_BIMAP.leftFind(dim);
  if (!t) {
    throw new Error('HypercubeTopology::getCellType(dim) can not get cell type for dim ' + dim);
  }
  return t;
};

hypercubeTopology.getCellSize = function(dim) {
  var s = hypercubeTopology.DIM_CELLSIZE_BIMAP.leftFind(dim);
  if (!s) {
    throw new Error('HypercubeTopology::getCellType(dim) can not get cell type for dim ' + dim);
  }
  return s;
};


// dim = 0 -> point, dim = 1 -> line
// dim = 2 -> triangle, dim = 3 -> tetrahedron
function simplexTopology(conn, dim) {
  var complexes = [];
  return new Topology(complexes);
};

simplexTopology.prototype = Object.create(Topology.prototype);
simplexTopology.prototype.constructor = simplexTopology;

exports.Topology = Topology;
exports.hypercubeTopology = hypercubeTopology;
exports.simplexTopology = simplexTopology;
