/*global require*/
// feblock
var _ = require('./core.utils');
var assert = _.assert;
var check = _.check;
var array2d = _.array2d;
var array1d = _.array1d;
var defineContract = _.defineContract;
var isMatrixOfDimension = _.isMatrixOfDimension;
var numeric = require('./core.numeric');
var size = numeric.size;
var transpose = numeric.transpose;
var dot = numeric.dot;
var add = numeric.add;
var mul = numeric.mul;
var inv = numeric.inv;
var ixUpdate = numeric.ixUpdate;
var colon = numeric.colon;
var Material = require('./material').Material;
var GCellSet = require('./gcellset').GCellSet;
var IntegrationRule = require('./integrationrule').IntegrationRule;


function ElementMatrix(mat, eqnums) {
  // TODO: input check
  this.matrix = mat;
  this.eqnums = eqnums;
}
exports.ElementMatrix = ElementMatrix;

function Feblock() {}

var _input_contract_deforss_option = defineContract(function(o) {
  assert.object(o);
  if (!check.instance(o.material, Material))
    throw new Error('options.material is not a instance of Material');

  if (!check.instance(o.gcells, GCellSet))
    throw new Error('options.gcells is not a instance of GCellSet');

  if (!check.instance(o.integrationRule, IntegrationRule))
    throw new Error('options.integrationRule is not a instance of GCellSet');

}, 'Input is not valid DeforSS option.');

function DeforSS(options) {
  _input_contract_deforss_option(options);
  this._mater = options.material;
  this._gcells = options.gcells;
  this._ir = options.integrationRule;
  if (check.assigned(options.rm)) {
    this._rm = options.rm;
  }

  var dim = this._gcells.dim();
  switch (dim) {
  case 1:
    this.hBlmat = this._blmat1;
    break;
  case 2:
    if (this._gcells.axisSymm())
      throw new Error('DeforSS::hBlmat() for axixSymm, dim = ' + dim + ' is not implemented.');
    else
      this.hBlmat = this._blmat2;
    break;
  default:
    throw new Error('DeforSS::hBlmat() for dim ' + dim + ' is not implemented.');
  }
}
DeforSS.prototype = Object.create(Feblock.prototype);
DeforSS.prototype.constructor = DeforSS;

DeforSS.prototype._blmat1 = function(N, Ndersp, c, Rm) {
  var nfn = size(Ndersp, 1);
  var dim = size(c, 2);
  var B = array2d(1, nfn*dim, 0);
  var i, indices;

  var s, dimi_1, from, to, span;

  if (Rm) {
    s = Rm.map(function(row) {
      return row[0];
    });

    for (i = 1; i <= nfn; ++i) {
      from = dim*(i-1);
      to = dim*i-1;
      span = to - from;
      indices = array1d(span+1, function(x) {
        return from + x;
      });
      indices.forEach(function(idx, j) {
        B[0][idx] = Ndersp[i-1][0]*s[j];
      });
    }
  } else {
    throw new Error('_blmat1: not implmented when !Rm');
  }
  return B;

};


DeforSS.prototype._blmat2 = function(N, Ndersp, c, Rm) {
  var nfn = size(Ndersp, 1);
  var dim = size(c, 2);
  var B = array2d(3, nfn*dim, 0);
  var i, cols, vals;

  if (Rm) {
    for (i = 1; i <= nfn; ++i) {
      cols = colon(dim*(i-1)+1, dim*i);
      vals = [
        [ Ndersp[i-1][0], 0 ],
        [ 0, Ndersp[i-1][1] ],
        [ Ndersp[i-1][1], Ndersp[i-1,0] ]
      ];
      B = ixUpdate(B, ':', cols, vals);
    }
  } else
    throw new Error('_blmat1: not implmented when !Rm');
  return B;
};

// In:
//   geom: Geometry Field
//   geom: Displacemeent Field
// out: [ ElementMatrix ]
// out: { matrices: [ 2D JS Array of dimension cellSize x cellSize ] }
//  eqnums: [ 1D JS Array of dimension cellSize ] }
DeforSS.prototype.stiffness = function(geom, u) {
  // _input_contract_stiffness_(geom, u);
  var gcells = this._gcells;
  var cellSize = gcells.cellSize();
  var ir = this._ir;

  var pc = ir.paramCoords();
  var w = ir.weights();
  var npts = ir.npts();

  var Ns = [], Nders = [];
  var j;
  for (j = 0; j < npts; ++j) {
    Ns[j] = gcells.bfun(pc[j]);
    Nders[j] = gcells.bfundpar(pc[j]);
  }

  var rmh = null;
  if (typeof this._rm === 'function')
    rmh = this._rm;
  var rm = this._rm;
  var mat = this._mater;

  var conns = gcells.conn();
  // labels??
  var numCells = gcells.count();
  var Ke = new Array(numCells);
  var eqnums = new Array(numCells);

  var dim = geom.dim();
  // console.log("dim = ", dim);
  var i;
  for (i = 0; i < numCells; ++i) {
    eqnums[i] = u.gatherEqnumsVector(conns[i]);
    Ke[i] = array2d(dim*cellSize, dim*cellSize, 0);
  }

  var allIds = array1d(geom.nfens(), function(i) { return i + 1; });
  var xs = geom.gatherValuesMatrix(allIds);

  var conn, x, c, J, Ndersp, Jac, B, D, delta;
  for (i = 0; i < numCells; ++i) {
    conn = conns[i];
    x = conn.map(function(id) { return xs[id-1]; });

    for (j = 0; j < npts; ++j) {
      c = dot(transpose(Ns[j]), x);
      J = dot(transpose(x), Nders[j]);
      console.log("c = ", c);
      console.log("J = ", J);
      if (rmh)
        rm = rmh(c, J);

      if (rm) {
        // TODO: figure out rm
        Ndersp = dot(Nders[j], inv(dot(transpose(rm), J)));
      } else {
        Ndersp = dot(Nders[j], inv(J));
      }
      // console.log("Ndersp = ", Ndersp);

      Jac = gcells.jacobianVolumn(conn, Ns[j], J, x);
      if (Jac < 0) throw new Error('Non-positive Jacobian');

      // TODO: _hBlmat
      B = this.hBlmat(Ns[j], Ndersp, c, rm);
      // console.log("B = ", B);
      D = mat.tangentModuli({ xyz: c });
      // console.log("D = ", D);

      // var jw = Jac*w[j];
      // var mid = mul(D, Jac*w[j]);
      // console.log("mid = ", mid);
      // console.log("B = ", B);
      // console.log("B' = ", transpose(B));
      // console.log("dot(transpose(B), mid) = ", dot(transpose(B), mid));

      delta = dot(dot(transpose(B), mul(D, Jac*w[j])), B);
      // console.log("delta = ", delta);
      // console.log("delta = ", delta);

      // delta = dot(dot(transpose(B), mul(D, Jac*w[j])), B);
      // console.log("Ke[j] = ", Ke[j]);
      Ke[i] = add(Ke[i], delta);
      // console.log("Ke[j] = ", Ke[j]);
    }
  }

  var elementMatrix = Ke.map(function(mat, i) {
    return new ElementMatrix(mat, eqnums[i]);
  });

  return elementMatrix;

  // var res = {
  //   matrices: Ke,
  //   eqnums: eqnums
  // };
  // return res;
};



exports.DeforSS = DeforSS;
