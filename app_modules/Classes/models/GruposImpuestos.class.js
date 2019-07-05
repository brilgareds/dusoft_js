
class GruposImpuestos {
    constructor() {
        this._codigo = '';
        this._total = 0;
        this._listaImpuestos = {};

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

    get listaImpuestos() {
        return this._listaImpuestos;
    }

    set listaImpuestos(value) {
        this._listaImpuestos = value;
    }
}

module.exports = new GruposImpuestos;
