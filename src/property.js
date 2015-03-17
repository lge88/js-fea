/*global require*/
// materialproperty

var _ = require('./core.utils');
var assert = _.assert;
var check = _.check;
var matrixOfDimension = assert.ensureMatrixOfDimension;
var mat6x6 = matrixOfDimension(6, 6);
var numeric = require('./core.numeric');
var diag = numeric.diag;
var transpose = numeric.transpose;
var add = numeric.add;
var dot = numeric.dot;
var mul = numeric.mul;

function MaterialProperty(props) {
  this._rho = (props && typeof props.rho === 'number') ? props.rho : 1.0;
}

MaterialProperty.prototype.rho = function() { return this._rho; };
exports.MaterialProperty = MaterialProperty;

var _input_contract_LinElIsoProp_ = _.defineContract(function(props) {
  assert.object(props, 'props is not a JS object');
  assert.undefined(props.G, 'props.G should not be set, it is compute from E and nu.');
  assert.positive(props.E, 'props.E is not a positive number.');
  if (check.assigned(props.nu)) {
    assert.number(props.nu, 'props.nu is not a number.');
    if (props.nu < 0) throw new Error('props.nu < 0.');
  }
}, 'input is not a valid linear elasitc iso property.');

function LinElIso(props) {
  _input_contract_LinElIsoProp_(props);

  MaterialProperty.call(this, props);
  this._E = props.E;
  this._nu = props.nu;
  if (!check.assigned(this._nu)) this._nu = 0.0;
}
exports.LinElIso = LinElIso;

LinElIso.prototype = Object.create(MaterialProperty.prototype);
LinElIso.prototype.constructor = LinElIso;

LinElIso.prototype.E = function() { return this._E; };
LinElIso.prototype.nu = function() { return this._nu; };
LinElIso.prototype.G = function() {
  if (!this._G)
    this._G = 0.5 * this._E/(1+this._nu);
  return this._G;
};

var _output_contract_D_ = mat6x6;
LinElIso.prototype.D = function() {
  // compute D;
  if (!this._D) {
    var E = this.E(), nu = this.nu(), G = this.G();
    var lambda = E*nu / ( (1+nu) * (1-2*nu) );
    var mu = E / (2 * (1 + nu));
    var mI = diag([1, 1, 1, 0.5, 0.5, 0.5]);
    var m1 = transpose([[1, 1, 1, 0, 0, 0]]);
    this._D = add(mul(lambda, dot(m1, transpose(m1))), mul(2*mu,  mI));
  }

  _output_contract_D_(this._D);
  return this._D;
};
