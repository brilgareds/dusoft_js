
class ListaDeducciones {
    constructor() {
        this._codigo = '';
        this._nombre = '';
        this._baseGravable = 0.0;
        this._porcentaje = 0.0;
        this._valor = 0.0;
        this._codigoUnidad = '';
        this._unidad = 0.0;
    }

    get codigo() {
        return this._codigo;
    }

    set codigo(value) {
        this._codigo = value;
    }

    get nombre() {
        return this._nombre;
    }

    set nombre(value) {
        this._nombre = value;
    }

    get baseGravable() {
        return this._baseGravable;
    }

    set baseGravable(value) {
        this._baseGravable = value;
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

    get codigoUnidad() {
        return this._codigoUnidad;
    }

    set codigoUnidad(value) {
        this._codigoUnidad = value;
    }

    get unidad() {
        return this._unidad;
    }

    set unidad(value) {
        this._unidad = value;
    }
}

module.exports = new ListaDeducciones;
