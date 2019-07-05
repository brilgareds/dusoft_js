class listaCorrecciones {
    constructor () {
        this._id = 0;
        this._codigo = '';
        this._descripcion = '';
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get codigo() {
        return this._codigo;
    }

    set codigo(value) {
        this._codigo = value;
    }

    get descripcion() {
        return this._descripcion;
    }

    set descripcion(value) {
        this._descripcion = value;
    }
}
module.exports = new listaCorrecciones;
