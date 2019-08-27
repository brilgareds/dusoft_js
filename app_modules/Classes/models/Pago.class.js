function Pago () {
    this.id = 0;
    this.codigoMedioPago = "";
    this.fechaVencimiento = "";
    this.listaIdentificadoresPago = [];

    Pago.prototype.getId = function () {
        return this.id;
    };

    Pago.prototype.setId = function (id) {
        this.id = id;
    };

    Pago.prototype.getCodigoMedioPago = function () {
        return this.codigoMedioPago;
    };

    Pago.prototype.setCodigoMedioPago = function (codigoMedioPago) {
        this.codigoMedioPago = codigoMedioPago;
    };

    Pago.prototype.getFechaVencimiento = function () {
        return this.fechaVencimiento;
    };

    Pago.prototype.setFechaVencimiento = function (fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    };

    Pago.prototype.getListaIdentificadoesPago = function () {
        return this.listaIdentificadoresPago;
    };

    Pago.prototype.setListaIdentificadoesPago = function (listaIdentificadoesPago) {
        this.listaIdentificadoresPago = listaIdentificadoesPago;
    };
}

module.exports = new Pago;
