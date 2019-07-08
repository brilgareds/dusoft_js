
function Facturador() {
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
        this._listaParticipantesConsorcio = {};
    }

    Facturador.prototype.get_razonSocial = function() {
        return this._razonSocial;
    }

    Facturador.prototype.set_razonSocial = function(value) {
        this._razonSocial = value;
    }

    Facturador.prototype.get_nombreRegistrado = function() {
        return this._nombreRegistrado;
    }

    Facturador.prototype.set_nombreRegistrado = function(value) {
        this._nombreRegistrado = value;
    }

    Facturador.prototype.get_tipoIdentificacion = function() {
        return this._tipoIdentificacion;
    }

    Facturador.prototype.set_tipoIdentificacion = function(value) {
        this._tipoIdentificacion = value;
    }

    Facturador.prototype.get_identificacion = function() {
        return this._identificacion;
    }

    Facturador.prototype.set_identificacion = function(value) {
        this._identificacion = value;
    }

    Facturador.prototype.get_digitoVerificacion = function() {
        return this._digitoVerificacion;
    }

    Facturador.prototype.set_digitoVerificacion = function(value) {
        this._digitoVerificacion = value;
    }

    Facturador.prototype.get_naturaleza = function() {
        return this._naturaleza;
    }

    Facturador.prototype.set_naturaleza = function(value) {
        this._naturaleza = value;
    }

    Facturador.prototype.get_codigoRegimen = function() {
        return this._codigoRegimen;
    }

    Facturador.prototype.set_codigoRegimen = function(value) {
        this._codigoRegimen = value;
    }

    Facturador.prototype.get_responsabilidadFiscal = function() {
        return this._responsabilidadFiscal;
    }

    Facturador.prototype.set_responsabilidadFiscal = function(value) {
        this._responsabilidadFiscal = value;
    }

    Facturador.prototype.get_codigoImpuesto = function() {
        return this._codigoImpuesto;
    }

    Facturador.prototype.set_codigoImpuesto = function(value) {
        this._codigoImpuesto = value;
    }

    Facturador.prototype.get_nombreImpuesto = function() {
        return this._nombreImpuesto;
    }

    Facturador.prototype.set_nombreImpuesto = function(value) {
        this._nombreImpuesto = value;
    }

    Facturador.prototype.get_telefono = function() {
        return this._telefono;
    }

    Facturador.prototype.set_telefono = function(value) {
        this._telefono = value;
    }

    Facturador.prototype.get_email = function() {
        return this._email;
    }

    Facturador.prototype.set_email = function(value) {
        this._email = value;
    }

    Facturador.prototype.get_contacto = function() {
        return this._contacto;
    }

    Facturador.prototype.set_contacto = function(value) {
        this._contacto = value;
    }

    Facturador.prototype.get_direccion = function() {
        return this._direccion;
    }

    Facturador.prototype.set_direccion = function(value) {
        this._direccion = value;
    }

    Facturador.prototype.get_direccionFiscal = function() {
        return this._direccionFiscal;
    }

    Facturador.prototype.set_direccionFiscal = function(value) {
        this._direccionFiscal = value;
    }

    Facturador.prototype.get_listaResponsabilidadesTributarias = function() {
        return this._listaResponsabilidadesTributarias;
    }

    Facturador.prototype.set_listaResponsabilidadesTributarias = function(value) {
        this._listaResponsabilidadesTributarias = value;
    }

    Facturador.prototype.get_codigoCIUU = function() {
        return this._codigoCIUU;
    }

    Facturador.prototype.set_codigoCIUU = function(value) {
        this._codigoCIUU = value;
    }

    Facturador.prototype.get_sucursal = function() {
        return this._sucursal;
    }

    Facturador.prototype.set_sucursal = function(value) {
        this._sucursal = value;
    }

    Facturador.prototype.get_listaParticipantesConsorcio = function() {
        return this._listaParticipantesConsorcio;
    }

    Facturador.prototype.set_listaParticipantesConsorcio = function(value) {
        this._listaParticipantesConsorcio = value;
    }

module.exports = new Facturador;
