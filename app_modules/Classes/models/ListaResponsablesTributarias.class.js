
function ListaResponsablesTributarias() {
        this._codigo = "";
        this._nombre = "";
        this._descripcion = "";
    }


    ListaResponsablesTributarias.prototype.get_codigo = function() {
        return this._codigo;
    }

    ListaResponsablesTributarias.prototype.set_codigo = function(value) {
        this._codigo = value;
    }

    ListaResponsablesTributarias.prototype.get_nombre = function() {
        return this._nombre;
    }

    ListaResponsablesTributarias.prototype.set_nombre = function(value) {
        this._nombre = value;
    }

    ListaResponsablesTributarias.prototype.get_descripcion = function() {
        return this._descripcion;
    }

    ListaResponsablesTributarias.prototype.set_descripcion = function(value) {
        this._descripcion = value;
    }

module.exports = new ListaResponsablesTributarias;
