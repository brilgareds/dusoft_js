class ListaAnticipos {
    constructor(){
        this._id = "";
        this._valor = 0;
        this._fechaRecibo = "";
        this._fechaPago = "";
        this._horaPago = "";
        this._instrucciones = "";
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get valor() {
        return this._valor;
    }

    set valor(value) {
        this._valor = value;
    }

    get fechaRecibo() {
        return this._fechaRecibo;
    }

    set fechaRecibo(value) {
        this._fechaRecibo = value;
    }

    get fechaPago() {
        return this._fechaPago;
    }

    set fechaPago(value) {
        this._fechaPago = value;
    }

    get horaPago() {
        return this._horaPago;
    }

    set horaPago(value) {
        this._horaPago = value;
    }

    get instrucciones() {
        return this._instrucciones;
    }

    set instrucciones(value) {
        this._instrucciones = value;
    }
}

  module.exports = new ListaAnticipos;
