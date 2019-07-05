class CondicionesEntrega {
    constructor(){
        this._id = "";
        this._incoterm = "";
        this._metodoPago = "";
        this._riesgoPerdida = "";
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get incoterm() {
        return this._incoterm;
    }

    set incoterm(value) {
        this._incoterm = value;
    }

    get metodoPago() {
        return this._metodoPago;
    }

    set metodoPago(value) {
        this._metodoPago = value;
    }

    get riesgoPerdida() {
        return this._riesgoPerdida;
    }

    set riesgoPerdida(value) {
        this._riesgoPerdida = value;
    }
}

  module.exports = new CondicionesEntrega;
