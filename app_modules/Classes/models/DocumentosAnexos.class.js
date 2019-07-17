function DocumentosAnexos() {
        this.id = "";
        this.tipo = "";
        this.fechaEmision = "";
    }

    DocumentosAnexos.prototype.getId = function() {
        return this.id;
    }

    DocumentosAnexos.prototype.setId = function(value) {
        this.id = value;
    }

    DocumentosAnexos.prototype.getTipo = function() {
        return this.tipo;
    }

    DocumentosAnexos.prototype.setTipo = function(value) {
        this.tipo = value;
    }

    DocumentosAnexos.prototype.getFechaEmision = function() {
        return this.fechaEmision;
    }

    DocumentosAnexos.prototype.setFechaEmision = function(value) {
        this.fechaEmision = value;
    }


  module.exports = new DocumentosAnexos;
