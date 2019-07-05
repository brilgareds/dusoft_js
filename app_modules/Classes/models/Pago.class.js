class Pago {
    constructor(){
        this._id = 0;
        this._codigoMedioPago = "";
        this._fechaVencimiento = "";
        this._listaIdentificadoesPago = [];
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get codigoMedioPago() {
        return this._codigoMedioPago;
    }

    set codigoMedioPago(value) {
        this._codigoMedioPago = value;
    }

    get fechaVencimiento() {
        return this._fechaVencimiento;
    }

    set fechaVencimiento(value) {
        this._fechaVencimiento = value;
    }

    get listaIdentificadoesPago() {
        return this._listaIdentificadoesPago;
    }

    set listaIdentificadoesPago(value) {
        this._listaIdentificadoesPago = value;
    }
}

  module.exports = new Pago;
