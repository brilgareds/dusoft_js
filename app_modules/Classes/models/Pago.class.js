function Pago() {
    this._id = 0;
    this._codigoMedioPago = "";
    this._fechaVencimiento = "";
    this._listaIdentificadoesPago = [];


    Pago.prototype.getId = function () {
        return this._id;
    };

    Pago.prototype.setId = function (_id) {
        this._id = _id;
    };


    Pago.prototype.getCodigoMedioPago = function () {
        return this._codigoMedioPago;
    }

    Pago.prototype.setCodigoMedioPago = function (_codigoMedioPago) {
        this._codigoMedioPago = _codigoMedioPago;
    }

    Pago.prototype.getFechaVencimiento = function () {
        return this._fechaVencimiento;
    }

    Pago.prototype.setFechaVencimiento = function (_fechaVencimiento) {
        this._fechaVencimiento = _fechaVencimiento;
    }

    Pago.prototype.getListaIdentificadoesPago = function () {
        return this._listaIdentificadoesPago;
    }

    Pago.prototype.setListaIdentificadoesPago = function (_listaIdentificadoesPago) {
        this._listaIdentificadoesPago = _listaIdentificadoesPago;
    }
}
;

module.exports = new Pago;
