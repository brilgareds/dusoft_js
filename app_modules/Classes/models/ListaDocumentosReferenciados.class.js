function ListaDocumentosReferenciados() {
        this._id = '';
        this._tipo = '';
        this._fecha = '';
        this._algoritmo = '';
        this._cufre = '';
    }

    ListaDocumentosReferenciados.prototype.get_id = function() {
        return this._id;
    }

    ListaDocumentosReferenciados.prototype.set_id = function(value) {
        this._id = value;
    }

    ListaDocumentosReferenciados.prototype.get_tipo = function() {
        return this._tipo;
    }

    ListaDocumentosReferenciados.prototype.set_tipo = function(value) {
        this._tipo = value;
    }

    ListaDocumentosReferenciados.prototype.get_fecha = function() {
        return this._fecha;
    }

    ListaDocumentosReferenciados.prototype.set_fecha = function(value) {
        this._fecha = value;
    }

    ListaDocumentosReferenciados.prototype.get_algoritmo = function() {
        return this._algoritmo;
    }

    ListaDocumentosReferenciados.prototype.set_algoritmo = function(value) {
        this._algoritmo = value;
    }

    ListaDocumentosReferenciados.prototype.get_cufre = function() {
        return this._cufre;
    }

    ListaDocumentosReferenciados.prototype.set_cufre = function(value) {
        this._cufre = value;
    }

module.exports = new ListaDocumentosReferenciados;
