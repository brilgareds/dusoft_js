
function ListaCargosDescuentos () {
    this._id = 0.0;
    this._esCargo = false;
    this._codigo = '';
    this._razon = '';
    this._base = 0.0;
    this._porcentaje = 0.0;
    this._valor = 0.0;
};

ListaCargosDescuentos.prototype.get_id = function () {
    return this._id;
};

ListaCargosDescuentos.prototype.get_id = function (newValue) {
    this._id = newValue;
};

ListaCargosDescuentos.prototype.get_esCargo = function () {
    return this._esCargo;
};

ListaCargosDescuentos.prototype.get_esCargo = function (newValue) {
    this._esCargo = newValue;
};

ListaCargosDescuentos.prototype.get_codigo = function () {
    return this._codigo;
};

ListaCargosDescuentos.prototype.get_codigo = function (newValue) {
    this._codigo = newValue;
};

ListaCargosDescuentos.prototype.get_razon = function () {
    return this._razon;
};

ListaCargosDescuentos.prototype.get_razon = function (newValue) {
    this._razon = newValue;
};

ListaCargosDescuentos.prototype.get_base = function () {
    return this._base;
};

ListaCargosDescuentos.prototype.get_base = function (newValue) {
    this._base = newValue;
};

ListaCargosDescuentos.prototype.get_porcentaje = function () {
    return this._porcentaje;
};

ListaCargosDescuentos.prototype.get_porcentaje = function (newValue) {
    this._porcentaje = newValue;
};

ListaCargosDescuentos.prototype.get_valor = function () {
    return this._valor;
};

ListaCargosDescuentos.prototype.get_valor = function (newValue) {
    this._valor = newValue;
};

module.exports = new ListaCargosDescuentos;
