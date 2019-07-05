class NotasReferenciadas {
    constructor(){
        this._id = "";
        this._tipo = "";
        this._fecha = "";
        this._algoritmo = "";
        this._cufe = "";
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

    get fecha() {
        return this._fecha;
    }

    set fecha(value) {
        this._fecha = value;
    }

    get algoritmo() {
        return this._algoritmo;
    }

    set algoritmo(value) {
        this._algoritmo = value;
    }

    get cufe() {
        return this._cufe;
    }

    set cufe(value) {
        this._cufe = value;
    }
}

  module.exports = new NotasReferenciadas;
