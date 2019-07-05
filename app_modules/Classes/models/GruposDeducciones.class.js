
class GruposDeducciones {
    constructor() {
        this._codigo = '';
        this._total = 0;
        this._listaDeducciones = {};

    }

    get codigo() {
        return this._codigo;
    }

    set codigo(value) {
        this._codigo = value;
    }

    get total() {
        return this._total;
    }

    set total(value) {
        this._total = value;
    }

    get listaDeducciones() {
        return this._listaDeducciones;
    }

    set listaDeducciones(value) {
        this._listaDeducciones = value;
    }
}

module.exports = new GruposDeducciones;
