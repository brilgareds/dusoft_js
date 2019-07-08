
function GruposDeducciones() {
        this._codigo = '';
        this._total = 0;
        this._listaDeducciones = {};

    }

    GruposDeducciones.prototype.get_codigo = function() {
        return this._codigo;
    }

    GruposDeducciones.prototype.set_codigo = function(value) {
        this._codigo = value;
    }

    GruposDeducciones.prototype.get_total = function() {
        return this._total;
    }

    GruposDeducciones.prototype.set_total = function(value) {
        this._total = value;
    }

    GruposDeducciones.prototype.get_listaDeducciones = function() {
        return this._listaDeducciones;
    }

    GruposDeducciones.prototype.set_listaDeducciones = function(value) {
        this._listaDeducciones = value;
    }

module.exports = new GruposDeducciones;
