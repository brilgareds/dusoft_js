function Pago() {
    this._id = 0;
    this._codigoMedioPago = "";
    this._fechaVencimiento = "";
    this._listaIdentificadoesPago = [];
}

Pago.prototype.set_id = function (newValue) {
    this._id = newValue;
};

Pago.prototype.get_id = function () {
    return this._id;
};

Pago.prototype.get_codigoMedioPagofunction = function () {
    return this._codigoMedioPago;
};

Pago.prototype.set_codigoMedioPago = function (newValue) {
    this._codigoMedioPago = newValue;
};

Pago.prototype.get_fechaVencimientofunction = function () {
    return this._fechaVencimiento;
};

Pago.prototype.set_fechaVencimiento = function (newValue) {
    this._fechaVencimiento = newValue;
};

Pago.prototype.get_listaIdentificadoesPagofunction = function () {
    return this._listaIdentificadoesPago;
};

Pago.prototype.set_listaIdentificadoesPago = function (newValue) {
    this._listaIdentificadoesPago = newValue;
};

module.exports = Pago;
