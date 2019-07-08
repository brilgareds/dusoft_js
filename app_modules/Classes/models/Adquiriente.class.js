
function Adquiriente() {
        this._razonSocial = '';
        this._nombreRegistrado = '';
        this._tipoIdentificacion = 0;
        this._identificacion = 0;
        this._digitoVerificacion = 0;
        this._naturaleza = '';
        this._codigoRegimen = '';
        this._responsabilidadFiscal = '';
        this._codigoImpuesto = '';
        this._nombreImpuesto = '';
        this._telefono = '';
        this._email = '';
        this._contacto = [];
        this._direccion = [];
        this._direccionFiscal = [];
        this._listaResponsabilidadesTributarias = {};
        this._codigoCIUU = '';
        this._sucursal = '';
        this._centroCosto = [];
    }

    Adquiriente.prototype.get_razonSocial = function() {
        return this._razonSocial;
    }

    Adquiriente.prototype.set_razonSocial = function(value) {
        this._razonSocial = value;
    }

    Adquiriente.prototype.get_nombreRegistrado= function() {
        return this._nombreRegistrado;
    }

    Adquiriente.prototype.set_nombreRegistrado= function(value) {
        this._nombreRegistrado = value;
    }

    Adquiriente.prototype.get_tipoIdentificacion= function() {
        return this._tipoIdentificacion;
    }

    Adquiriente.prototype.set_tipoIdentificacion= function(value) {
        this._tipoIdentificacion = value;
    }

    Adquiriente.prototype.get_identificacion= function() {
        return this._identificacion;
    }

    Adquiriente.prototype.set_identificacion= function(value) {
        this._identificacion = value;
    }

    Adquiriente.prototype.get_digitoVerificacion= function() {
        return this._digitoVerificacion;
    }

    Adquiriente.prototype.set_digitoVerificacion= function(value) {
        this._digitoVerificacion = value;
    }

    Adquiriente.prototype.get_naturaleza= function() {
        return this._naturaleza;
    }

    Adquiriente.prototype.set_naturaleza= function(value) {
        this._naturaleza = value;
    }

    Adquiriente.prototype.get_codigoRegimen= function() {
        return this._codigoRegimen;
    }

    Adquiriente.prototype.set_codigoRegimen= function(value) {
        this._codigoRegimen = value;
    }

    Adquiriente.prototype.get_responsabilidadFiscal= function() {
        return this._responsabilidadFiscal;
    }

    Adquiriente.prototype.set_responsabilidadFiscal= function(value) {
        this._responsabilidadFiscal = value;
    }

    Adquiriente.prototype.get_codigoImpuesto= function() {
        return this._codigoImpuesto;
    }

    Adquiriente.prototype.set_codigoImpuesto= function(value) {
        this._codigoImpuesto = value;
    }

    Adquiriente.prototype.get_nombreImpuesto= function() {
        return this._nombreImpuesto;
    }

    Adquiriente.prototype.set_nombreImpuesto= function(value) {
        this._nombreImpuesto = value;
    }

    Adquiriente.prototype.get_telefono= function() {
        return this._telefono;
    }

    Adquiriente.prototype.set_telefono= function(value) {
        this._telefono = value;
    }

    Adquiriente.prototype.get_email= function() {
        return this._email;
    }

    Adquiriente.prototype.set_email= function(value) {
        this._email = value;
    }

    Adquiriente.prototype.get_contacto= function() {
        return this._contacto;
    }

    Adquiriente.prototype.set_contacto= function(value) {
        this._contacto = value;
    }

    Adquiriente.prototype.get_direccion= function() {
        return this._direccion;
    }

    Adquiriente.prototype.set_direccion= function(value) {
        this._direccion = value;
    }

    Adquiriente.prototype.get_direccionFiscal= function() {
        return this._direccionFiscal;
    }

    Adquiriente.prototype.set_direccionFiscal= function(value) {
        this._direccionFiscal = value;
    }

    Adquiriente.prototype.get_listaResponsabilidadesTributarias= function() {
        return this._listaResponsabilidadesTributarias;
    }

    Adquiriente.prototype.set_listaResponsabilidadesTributarias= function(value) {
        this._listaResponsabilidadesTributarias = value;
    }

    Adquiriente.prototype.get_codigoCIUU= function() {
        return this._codigoCIUU;
    }

    Adquiriente.prototype.set_codigoCIUU= function(value) {
        this._codigoCIUU = value;
    }

    Adquiriente.prototype.get_sucursal= function() {
        return this._sucursal;
    }

    Adquiriente.prototype.set_sucursal= function(value) {
        this._sucursal = value;
    }

    Adquiriente.prototype.get_centroCosto = function() {
        return this._centroCosto;
    }

    Adquiriente.prototype.set_centroCosto = function(value) {
        this._centroCosto = value;
    }

module.exports = new Adquiriente;
