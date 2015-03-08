var _ = require('./core.utils');

_.assign(exports, require('./core.bimap'));
_.assign(exports, require('./core.bipartite'));
_.assign(exports, require('./core.setstore'));
_.assign(exports, require('./femodel'));

exports._ = _;
exports.numeric = require('./core.numeric');

exports.geometry = {
  pointset: require('./geometry.pointset'),
  topology: require('./geometry.topology')
};

exports.feutils = require('./feutils');
exports.fens = require('./fens');
exports.gcellset = require('./gcellset');
exports.field = require('./field');
exports.property = require('./property');
exports.material = require('./material');
exports.feblock = require('./feblock');
exports.system = require('./system');
exports.nodalload = require('./nodalload');
exports.integrationrule = require('./integrationrule');
