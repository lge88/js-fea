/*global require*/
// materialproperty

function MaterialProperty(rho) {
  this._rho = typeof rho === 'number' ? rho : 1.0;
}

MaterialProperty.prototype.rho = function() { return this._rho; };

function LinElIsoProp(props) {
  if (typeof props === 'object') {

  }
  MaterialProperty.call(this, rho);
}
LinElIsoProp.prototype = Object.create(MaterialProperty.prototype);
LinElIsoProp.prototype.constructor = LinElIsoProp;
