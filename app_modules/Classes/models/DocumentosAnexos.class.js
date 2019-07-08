function DocumentosAnexos() {
        this._id = "";
        this._tipo = "";
        this._fechaEmision = "";
    }

    DocumentosAnexos.prototype.get_id = function() {
        return this._id;
    }

    DocumentosAnexos.prototype.set_id = function(value) {
        this._id = value;
    }

    DocumentosAnexos.prototype.get_tipo = function() {
        return this._tipo;
    }

    DocumentosAnexos.prototype.set_tipo = function(value) {
        this._tipo = value;
    }

    DocumentosAnexos.prototype.get_fechaEmision = function() {
        return this._fechaEmision;
    }

    DocumentosAnexos.prototype.set_fechaEmision = function(value) {
        this._fechaEmision = value;
    }


  module.exports = new DocumentosAnexos;
