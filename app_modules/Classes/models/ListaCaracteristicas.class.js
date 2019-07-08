function ListaCaracteristicas() {
        this._codigo = '';
        this._valor = '';
    }

    ListaCaracteristicas.prototype.get_codigo = function() {
        return this._codigo;
    }

    ListaCaracteristicas.prototype.set_codigo = function(value) {
        this._codigo = value;
    }

    ListaCaracteristicas.prototype.get_valor = function() {
        return this._valor;
    }

    ListaCaracteristicas.prototype.set_valor = function(value) {
        this._valor = value;
    }

module.exports = new ListaCaracteristicas;
