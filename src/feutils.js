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
