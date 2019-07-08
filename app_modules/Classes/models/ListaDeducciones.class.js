
function ListaDeducciones() {
        this._codigo = '';
        this._nombre = '';
        this._baseGravable = 0.0;
        this._porcentaje = 0.0;
        this._valor = 0.0;
        this._codigoUnidad = '';
        this._unidad = 0.0;
    }

    ListaDeducciones.prototype.get_codigo = function() {
        return this._codigo;
    }

    ListaDeducciones.prototype.set_codigo = function(value) {
        this._codigo = value;
    }

    ListaDeducciones.prototype.get_nombre = function() {
        return this._nombre;
    }

    ListaDeducciones.prototype.set_nombre = function(value) {
        this._nombre = value;
    }

    ListaDeducciones.prototype.get_baseGravable = function() {
        return this._baseGravable;
    }

    ListaDeducciones.prototype.set_baseGravable = function(value) {
        this._baseGravable = value;
    }

    ListaDeducciones.prototype.get_porcentaje = function() {
        return this._porcentaje;
    }

    ListaDeducciones.prototype.set_porcentaje = function(value) {
        this._porcentaje = value;
    }

    ListaDeducciones.prototype.get_valor = function() {
        return this._valor;
    }

    ListaDeducciones.prototype.set_valor = function(value) {
        this._valor = value;
    }

    ListaDeducciones.prototype.get_codigoUnidad = function() {
        return this._codigoUnidad;
    }

    ListaDeducciones.prototype.set_codigoUnidad = function(value) {
        this._codigoUnidad = value;
    }

    ListaDeducciones.prototype.get_unidad = function() {
        return this._unidad;
    }

    ListaDeducciones.prototype.set_unidad = function(value) {
        this._unidad = value;
    }

module.exports = new ListaDeducciones;
