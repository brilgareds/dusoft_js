class DocumentosAnexos {
    constructor(){
        this._id = "";
        this._tipo = "";
        this._fechaEmision = "";
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get tipo() {
        return this._tipo;
    }

    set tipo(value) {
        this._tipo = value;
    }

    get fechaEmision() {
        return this._fechaEmision;
    }

    set fechaEmision(value) {
        this._fechaEmision = value;
    }
}

  module.exports = new DocumentosAnexos;
