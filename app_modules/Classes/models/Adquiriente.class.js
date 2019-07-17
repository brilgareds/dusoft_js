
function Adquiriente() {
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
        this.centroCosto = [];
    }

    Adquiriente.prototype.getRazonSocial = function() {
        return this.razonSocial;
    }

    Adquiriente.prototype.setRazonSocial = function(value) {
        this.razonSocial = value;
    }

    Adquiriente.prototype.getNombreRegistrado= function() {
        return this.nombreRegistrado;
    }

    Adquiriente.prototype.setNombreRegistrado= function(value) {
        this.nombreRegistrado = value;
    }

    Adquiriente.prototype.getTipoIdentificacion= function() {
        return this.tipoIdentificacion;
    }

    Adquiriente.prototype.setTipoIdentificacion= function(value) {
        this.tipoIdentificacion = value;
    }

    Adquiriente.prototype.getIdentificacion= function() {
        return this.identificacion;
    }

    Adquiriente.prototype.setIdentificacion= function(value) {
        this.identificacion = value;
    }

    Adquiriente.prototype.getDigitoVerificacion= function() {
        return this.digitoVerificacion;
    }

    Adquiriente.prototype.setDigitoVerificacion= function(value) {
        this.digitoVerificacion = value;
    }

    Adquiriente.prototype.getNaturaleza= function() {
        return this.naturaleza;
    }

    Adquiriente.prototype.setNaturaleza= function(value) {
        this.naturaleza = value;
    }

    Adquiriente.prototype.getCodigoRegimen= function() {
        return this.codigoRegimen;
    }

    Adquiriente.prototype.setCodigoRegimen= function(value) {
        this.codigoRegimen = value;
    }

    Adquiriente.prototype.getResponsabilidadFiscal= function() {
        return this.responsabilidadFiscal;
    }

    Adquiriente.prototype.setResponsabilidadFiscal= function(value) {
        this.responsabilidadFiscal = value;
    }

    Adquiriente.prototype.getCodigoImpuesto= function() {
        return this.codigoImpuesto;
    }

    Adquiriente.prototype.setCodigoImpuesto= function(value) {
        this.codigoImpuesto = value;
    }

    Adquiriente.prototype.getNombreImpuesto= function() {
        return this.nombreImpuesto;
    }

    Adquiriente.prototype.setNombreImpuesto= function(value) {
        this.nombreImpuesto = value;
    }

    Adquiriente.prototype.getTelefono= function() {
        return this.telefono;
    }

    Adquiriente.prototype.setTelefono= function(value) {
        this.telefono = value;
    }

    Adquiriente.prototype.getEmail= function() {
        return this.email;
    }

    Adquiriente.prototype.setEmail= function(value) {
        this.email = value;
    }

    Adquiriente.prototype.getContacto= function() {
        return this.contacto;
    }

    Adquiriente.prototype.setContacto= function(value) {
        this.contacto = value;
    }

    Adquiriente.prototype.getDireccion= function() {
        return this.direccion;
    }

    Adquiriente.prototype.setDireccion= function(value) {
        this.direccion = value;
    }

    Adquiriente.prototype.getDireccionFiscal= function() {
        return this.direccionFiscal;
    }

    Adquiriente.prototype.setDireccionFiscal= function(value) {
        this.direccionFiscal = value;
    }

    Adquiriente.prototype.getListaResponsabilidadesTributarias= function() {
        return this.listaResponsabilidadesTributarias;
    }

    Adquiriente.prototype.setListaResponsabilidadesTributarias= function(value) {
        this.listaResponsabilidadesTributarias = value;
    }

    Adquiriente.prototype.getCodigoCIUU= function() {
        return this.codigoCIUU;
    }

    Adquiriente.prototype.setCodigoCIUU= function(value) {
        this.codigoCIUU = value;
    }

    Adquiriente.prototype.getSucursal= function() {
        return this.sucursal;
    }

    Adquiriente.prototype.setSucursal= function(value) {
        this.sucursal = value;
    }

    Adquiriente.prototype.getCentroCosto = function() {
        return this.centroCosto;
    }

    Adquiriente.prototype.setCentroCosto = function(value) {
        this.centroCosto = value;
    }

module.exports = new Adquiriente;
