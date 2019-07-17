
function Facturador() {
        this.razonSocial = '';
        this.nombreRegistrado = '';
        this.tipoIdentificacion = 0;
        this.identificacion = 0;
        this.digitoVerificacion = 0;
        this.naturaleza = '';
        this.codigoRegimen = '';
        this.responsabilidadFiscal = '';
        this.codigoImpuesto = '';
        this.nombreImpuesto = '';
        this.telefono = '';
        this.email = '';
        this.contacto = [];
        this.direccion = [];
        this.direccionFiscal = [];
        this.listaResponsabilidadesTributarias = {};
        this.codigoCIUU = '';
        this.sucursal = '';
        this.listaParticipantesConsorcio = {};
    }

    Facturador.prototype.getRazonSocial = function() {
        return this.razonSocial;
    }

    Facturador.prototype.setRazonSocial = function(value) {
        this.razonSocial = value;
    }

    Facturador.prototype.getNombreRegistrado = function() {
        return this.nombreRegistrado;
    }

    Facturador.prototype.setNombreRegistrado = function(value) {
        this.nombreRegistrado = value;
    }

    Facturador.prototype.getTipoIdentificacion = function() {
        return this.tipoIdentificacion;
    }

    Facturador.prototype.setTipoIdentificacion = function(value) {
        this.tipoIdentificacion = value;
    }

    Facturador.prototype.getIdentificacion = function() {
        return this.identificacion;
    }

    Facturador.prototype.setIdentificacion = function(value) {
        this.identificacion = value;
    }

    Facturador.prototype.getDigitoVerificacion = function() {
        return this.digitoVerificacion;
    }

    Facturador.prototype.setDigitoVerificacion = function(value) {
        this.digitoVerificacion = value;
    }

    Facturador.prototype.getNaturaleza = function() {
        return this.naturaleza;
    }

    Facturador.prototype.setNaturaleza = function(value) {
        this.naturaleza = value;
    }

    Facturador.prototype.getCodigoRegimen = function() {
        return this.codigoRegimen;
    }

    Facturador.prototype.setCodigoRegimen = function(value) {
        this.codigoRegimen = value;
    }

    Facturador.prototype.getResponsabilidadFiscal = function() {
        return this.responsabilidadFiscal;
    }

    Facturador.prototype.setResponsabilidadFiscal = function(value) {
        this.responsabilidadFiscal = value;
    }

    Facturador.prototype.getCodigoImpuesto = function() {
        return this.codigoImpuesto;
    }

    Facturador.prototype.setCodigoImpuesto = function(value) {
        this.codigoImpuesto = value;
    }

    Facturador.prototype.getNombreImpuesto = function() {
        return this.nombreImpuesto;
    }

    Facturador.prototype.setNombreImpuesto = function(value) {
        this.nombreImpuesto = value;
    }

    Facturador.prototype.getTelefono = function() {
        return this.telefono;
    }

    Facturador.prototype.setTelefono = function(value) {
        this.telefono = value;
    }

    Facturador.prototype.getEmail = function() {
        return this.email;
    }

    Facturador.prototype.setEmail = function(value) {
        this.email = value;
    }

    Facturador.prototype.getContacto = function() {
        return this.contacto;
    }

    Facturador.prototype.setContacto = function(value) {
        this.contacto = value;
    }

    Facturador.prototype.getDireccion = function() {
        return this.direccion;
    }

    Facturador.prototype.setDireccion = function(value) {
        this.direccion = value;
    }

    Facturador.prototype.getDireccionFiscal = function() {
        return this.direccionFiscal;
    }

    Facturador.prototype.setDireccionFiscal = function(value) {
        this.direccionFiscal = value;
    }

    Facturador.prototype.getListaResponsabilidadesTributarias = function() {
        return this.listaResponsabilidadesTributarias;
    }

    Facturador.prototype.setListaResponsabilidadesTributarias = function(value) {
        this.listaResponsabilidadesTributarias = value;
    }

    Facturador.prototype.getCodigoCIUU = function() {
        return this.codigoCIUU;
    }

    Facturador.prototype.setCodigoCIUU = function(value) {
        this.codigoCIUU = value;
    }

    Facturador.prototype.getSucursal = function() {
        return this.sucursal;
    }

    Facturador.prototype.setSucursal = function(value) {
        this.sucursal = value;
    }

    Facturador.prototype.getListaParticipantesConsorcio = function() {
        return this.listaParticipantesConsorcio;
    }

    Facturador.prototype.setListaParticipantesConsorcio = function(value) {
        this.listaParticipantesConsorcio = value;
    }

module.exports = new Facturador;
