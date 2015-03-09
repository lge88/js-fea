/*global require*/
// nodalload
var _  = require('./core.utils');
var check = _.check;
var ElementVector = require('./system.vector').ElementVector;

function NodalLoad(options) {
  var ids = options.ids || options.id;
  var dirs = options.dirs || options.dir;
  var magns = options.magns || options.magn;

  if (!check.array(ids)) ids = [ids];
  if (!check.array(dirs)) dirs = [dirs];
  if (!check.array(magns)) magns = [magns];
  this._ids = ids;
  this._dirs = dirs;
  this._magns = magns;
}

NodalLoad.prototype.loads = function(u) {
  var i, j, en;
  var id, dir;
  var val;
  var nids = this._ids.length, ndirs = this._dirs.length;
  var vec = [], eqnums = [];
  for (i = 0; i < nids; ++i) {
    id = this._ids[i];
    for (j = 0; j < ndirs; ++j) {
      dir = this._dirs[j];
      en = u.eqnum(id, dir);
      val = this._magns[j];
      vec.push(val);
      eqnums.push(en);
    }
  }
  return new ElementVector(vec, eqnums);
};

exports.NodalLoad = NodalLoad;
