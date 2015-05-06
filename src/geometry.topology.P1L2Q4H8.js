/*global require*/
var _ = require('./core.utils');
var array1d = _.array1d;
var cloneDeep = _.cloneDeep;
var normalizedCell = _.normalizedCell;
var byLexical = _.byLexical;

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

function hypercubeBoundary(conn, dim) {
  var getCellBoundary;
  if (dim === 1)
    getCellBoundary = hypercubeCellBoundary1;
  else if (dim === 2)
    getCellBoundary = hypercubeCellBoundary2;
  else if (dim === 3)
    getCellBoundary = hypercubeCellBoundary3;
  else
    return [];

  function hashCell(cell) {
    var cellCopy = cell.slice().sort(function(a, b) { return a-b; });
    return cellCopy.join(',');
  };

  var res = [];

  conn.forEach(function(cell) {
    getCellBoundary(cell).forEach(function(bdryCell) {
      res.push(bdryCell);
    });
  });

  var nonBoundaryIndexMask = {}, seen = {};
  res.forEach(function(cell, i) {
    var key = hashCell(cell);
    if (typeof seen[key] === 'undefined') {
      seen[key] = i;
    } else {
      nonBoundaryIndexMask[i] = true;
      nonBoundaryIndexMask[seen[key]] = true;
    }
  });

  res = res.filter(function(cell, i) {
    return !nonBoundaryIndexMask[i];
  });

  return res;
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
    throw new Error('hypercubeSkeleton(conn, dim): dim (' +
                    dim + ') is not valid.');

  function hashCell(cell) {
    return normalizedCell(cell).join(',');
  }

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

function hypercube0(conn) {
  if (typeof conn[0] === 'number')
    return [ conn.map(function(idx) { return [idx]; }) ];
  return [ cloneDeep(conn) ];
}

function hypercube1(conn) {
  var complexes = array1d(2, function() { return null; });
  complexes[1] = cloneDeep(conn);
  complexes[0] = hypercubeSkeleton(complexes[1], 1);
  return complexes;
}

function hypercube2(conn) {
  var complexes = array1d(3, function() { return null; });
  complexes[2] = cloneDeep(conn);
  complexes[1] = hypercubeSkeleton(complexes[2], 2);
  complexes[0] = hypercubeSkeleton(complexes[1], 1);
  return complexes;
}

function hypercube3(conn) {
  var complexes = array1d(4, function() { return null; });
  complexes[3] = cloneDeep(conn);
  complexes[2] = hypercubeSkeleton(complexes[3], 3);
  complexes[1] = hypercubeSkeleton(complexes[2], 2);
  complexes[0] = hypercubeSkeleton(complexes[1], 1);
  return complexes;
}

exports.name = 'P1L2Q4H8';

exports.cellSizes = [1, 2, 4, 8];

exports.cellTypes = ['P1', 'L2', 'Q4', 'H8'];

exports.extrudeMap = [
  // 0 -> 1,
  [ [ 0, 1 ] ],
  // 1 -> 2,
  [ [ 0, 1, 3, 2 ] ],
  // 2 -> 3,
  [
    [ 0, 1, 2, 3, 4, 5, 6, 7 ],
  ]
];

function countPoints(cells) {
  var count = 0, seen = {};
  cells.forEach(function(cell) {
    cell.forEach(function(idx) {
      if (!seen[idx]) { ++count; seen[idx] = true; }
    });
  });
  return count;
}

exports.extrude = function(cells, dim, flags) {
  if (dim < 0 || dim >= 3)
    throw new Error('extrude(): can not handle ' +
                    'dim = ' + dim);

  var numCells = cells.length;
  var cellMap = exports.extrudeMap[dim];
  var cellSize = exports.cellSizes[dim];
  var numPoints = countPoints(cells);
  var newCells = [];

  flags.forEach(function(flag, layer) {
    var base = layer * numPoints;
    if (flag) {
      cells.forEach(function(cell) {
        var i, len = cell.length;
        var newGlobalConn = [];
        // bottom
        for (i = 0; i < len; ++i) newGlobalConn.push(base + cell[i]);
        // top
        for (i = 0; i < len; ++i) newGlobalConn.push(base + numPoints + cell[i]);

        // remap
        cellMap.forEach(function(localConn) {
          var newCell = localConn.map(function(localIndex) {
            return newGlobalConn[localIndex];
          });
          newCells.push( newCell );
        });
      });
    }
  });
  return newCells;
};

exports.create = function(conn, dim) {
  if (dim === 0) {
    return hypercube0(conn);
  } else if (dim === 1) {
    return hypercube1(conn);
  } else if (dim === 2) {
    return hypercube2(conn);
  } else if (dim === 3) {
    return hypercube3(conn);
  }

  throw new Error('hypercube(conn, dim): dim must be one of 0,1,2,3.');
};

exports.boundaryConn = hypercubeBoundary;
