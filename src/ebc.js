/*global require*/
// ebc
var _ = require('./core.utils');
var check = _.check;
var isArray = _.isArray;
var isIterator = _.isIterator;
var iteratorFromList = _.iteratorFromList;

function EBC(options) {
  if (check.function(options.id))
    this._idIterFn = options.id;
  else if (options.id === 'all')
    this._idIterFn = function(u) {
      var i = 0, nfens = u.nfens();
      return {
        hasNext: function() { return i < nfens; },
        next: function() { return ++i; }
      };
    };
  else if (check.array(options.id))
    this._idIterFn = function() { return iteratorFromList(options.id); };
  else if (check.number(options.id))
    this._idIterFn = function() { return iteratorFromList([options.id]); };
  else
    throw new Error('EBC(): options.id is not valid.');

  if (check.array(options.value))
    this._valFn = function(id, dir, idx, u) { return options.value[idx]; };
  else if (check.number(options.value))
    this._valFn = function(id, dir, idx, u) { return options.value; };
  else if (check.function(options.value))
    this._valFn = options.value;
  else
    throw new Error('EBC(): options.value is not valid.');

  if (check.number(options.dir))
    this._dirs = [options.dir];
  else if (check.array(options.dir))
    this._dirs = options.dir;
  else
    throw new Error('EBC(): options.dir is not valid.');

}

exports.EBC = EBC;

EBC.prototype.applyToField_ = function(u) {
  var idIter = this._idIterFn(u), valFn = this._valFn;
  var dirs = this._dirs, id, idx = 0;

  while (idIter.hasNext()) {
    id = idIter.next();
    dirs.forEach(function(dir) {
      var val = valFn(id, dir, idx, u);
      u.setPrescribedValue_(id, dir, val);
    });
    ++idx;
  }
};

exports.EBC;
