
function ListaImpuestos() {
        this._codigo = '';
        this._nombre = '';
        this._baseGravable = 0.0;
        this._porcentaje = 0.0;
        this._valor = 0.0;
        this._codigoUnidad = '';
        this._unidad = 0.0;

    }

    ListaImpuestos.prototype.get_codigo = function() {
        return this._codigo;
    }

    ListaImpuestos.prototype.set_codigo = function(value) {
        this._codigo = value;
    }

    ListaImpuestos.prototype.get_nombre = function() {
        return this._nombre;
    }

    ListaImpuestos.prototype.set_nombre = function(value) {
        this._nombre = value;
    }

    ListaImpuestos.prototype.get_baseGravable = function() {
        return this._baseGravable;
    }

    ListaImpuestos.prototype.set_baseGravable = function(value) {
        this._baseGravable = value;
    }

    ListaImpuestos.prototype.get_porcentaje = function() {
        return this._porcentaje;
    }

    ListaImpuestos.prototype.set_porcentaje = function(value) {
        this._porcentaje = value;
    }

    ListaImpuestos.prototype.get_valor = function() {
        return this._valor;
    }

    ListaImpuestos.prototype.set_valor = function(value) {
        this._valor = value;
    }

    ListaImpuestos.prototype.get_codigoUnidad = function() {
        return this._codigoUnidad;
    }

    ListaImpuestos.prototype.set_codigoUnidad = function(value) {
        this._codigoUnidad = value;
    }

    ListaImpuestos.prototype.get_unidad = function() {
        return this._unidad;
    }

    ListaImpuestos.prototype.set_unidad = function(value) {
        this._unidad = value;
    }

module.exports = new ListaImpuestos;
