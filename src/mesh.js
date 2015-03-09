/*global require*/
// mesh
var FeNodeSet = require('./fens').FeNodeSet;
var Q4 = require('./gcellset').Q4;

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
