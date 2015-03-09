/*global require*/
// feutils
var numeric = require('./core.numeric');
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
