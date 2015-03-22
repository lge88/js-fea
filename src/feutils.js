/*global require*/
// feutils
var numeric = require('./core.numeric');
var size = numeric.size;
var eye = numeric.eye;
var div = numeric.div;
var dot = numeric.dot;
var nthColumn = numeric.nthColumn;
var norm2 = numeric.norm2;
var norm = numeric.norm;

/**
 * @module feutils
 */

/**
 * Returns true if the given coordinate is within the given box.
 * @param {Array} xyz
 * @param {Array} bounds - [xmin, xmax, ymin, ymax, zmin, zmax]
 * @returns {Boolean}
 */
exports.isXyzInsideBox = function isXyzInsideBox(xyz, bounds) {
  var i, dim = xyz.length, res = true;
  var val, left, right;
  for (i = 0; i < dim; ++i) {
    val = xyz[i];
    left = bounds[2*i];
    right = bounds[2*i+1];
    if (val < left || val > right) return false;
  }
  return res;
};

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
      var n = dot(skewmat(e1), nthColumn(tangents, 2));
      console.log("n = ", n);
      n = div(n, norm(nthColumn(tangents, 2)));
      var e2 = dot(skewmat(n), e1);
      console.log("e2 = ", e2);
      e2 = div(e2, norm(e2));
      var rm = e1.map(function(row, i) {
        row.push(e2[i][0]);
        return row;
      });
      // var rm = [e1, e2];
      console.log("e1 = ", e1);
      console.log("e2 = ", e2);
      console.log("rm = ", rm);
      return rm;
      // throw new Error('genISORm: ntan = ' + ntan + ' is not implemented.');
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
      [theta[2], 0, -theta[0] ],
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
