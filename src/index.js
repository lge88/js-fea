var _ = require('./core.utils');

_.assign(exports, require('./core.bimap.js'));
_.assign(exports, require('./core.bipartite.js'));
_.assign(exports, require('./core.setstore.js'));
_.assign(exports, require('./femodel.js'));

exports._ = _;
exports.numeric = require('./core.numeric.js');
