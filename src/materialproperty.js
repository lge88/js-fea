/*global require*/
// materialproperty

var _ = require('./core.utils');
var matrixOfDimension = _.contracts.matrixOfDimension;
var mat6x6 = matrixOfDimension(6, 6);
var diag = _.numeric.diag;
var transpose = _.numeric.transpose;
var add = _.numeric.add;
var mul = _.numeric.mul;

function MaterialProperty(props) {
  this._rho = (props && typeof props.rho === 'number') ? props.rho : 1.0;
}

MaterialProperty.prototype.rho = function() { return this._rho; };

var _input_contract_LinElIsoProp_ = _.defineContract(function(props) {
  _.assert.object(props, 'props is not a JS object');
  _.assert.undefined(props.G, 'props.G should not be set, it is compute from E and nu.');
  _.assert.positive(props.E, 'props.E is not a positive number.');
  _.assert.number(props.nu, 'props.nu is not a number.');
  if (props.nu < 0) throw new Error('props.nu < 0.');
}, 'input is not a valid linear elasitc iso property.');

function LinElIsoProp(props) {
  _input_contract_LinElIsoProp_(props);

  MaterialProperty.call(this, props);
  this._E = props.E;
  this._nu = props.nu;
}

LinElIsoProp.prototype = Object.create(MaterialProperty.prototype);
LinElIsoProp.prototype.constructor = LinElIsoProp;

LinElIsoProp.prototype.E = function() { return this._E; };
LinElIsoProp.prototype.nu = function() { return this._nu; };
LinElIsoProp.prototype.G = function() {
  if (!this._G)
    this._G = 0.5 * this._E/(1+this._nu);
  return this._G;
};

var _output_contract_D_ = mat6x6;
LinElIsoProp.prototype.D = function() {
  // compute D;
  if (!this._D) {
    var E = this.E(), nu = this.nu(), G = this.G();
    var lambda = E*nu / ( (1+nu) * (1-2*nu) );
    var mu = E / (2 * (1 + nu));
    var mI = diag([1, 1, 1, 0.5, 0.5, 0.5]);
    var m1 = transpose([1, 1, 1, 0, 0, 0]);

    this._D = add(mul(lambda, mul(m1, transpose(m1))), mul(2*mu,  mI));
  }

  _output_contract_D_(this._D);
  return this._D;
};
