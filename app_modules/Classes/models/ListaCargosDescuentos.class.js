
class ListaCargosDescuentos {
    constructor() {
        this._id = 0.0;
        this._esCargo = false;
        this._codigo = '';
        this._razon = '';
        this._base = 0.0;
        this._porcentaje = 0.0;
        this._valor = 0.0;

    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get esCargo() {
        return this._esCargo;
    }

    set esCargo(value) {
        this._esCargo = value;
    }

    get codigo() {
        return this._codigo;
    }

    set codigo(value) {
        this._codigo = value;
    }

    get razon() {
        return this._razon;
    }

    set razon(value) {
        this._razon = value;
    }

    get base() {
        return this._base;
    }

    set base(value) {
        this._base = value;
    }

    get porcentaje() {
        return this._porcentaje;
    }

    set porcentaje(value) {
        this._porcentaje = value;
    }

    get valor() {
        return this._valor;
    }

    set valor(value) {
        this._valor = value;
    }
}

module.exports = new ListaCargosDescuentos;
