class ListaCaracteristicas {
    constructor () {
        this._codigo = '';
        this._valor = '';
    }

    get codigo() {
        return this._codigo;
    }

    set codigo(value) {
        this._codigo = value;
    }

    get valor() {
        return this._valor;
    }

    set valor(value) {
        this._valor = value;
    }
}

module.exports = new ListaCaracteristicas;
