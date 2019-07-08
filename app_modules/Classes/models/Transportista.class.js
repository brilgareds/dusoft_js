function Transportista() {

    this._razonSocial = "";
    this._nombreRegistrado = "";
    this._tipoIdentificacion = 0;
    this._identificacion = 0;
    this._digitoVerificacion = 0;
    this._naturaleza = "";
    this._codigoRegimen = "";
    this._responsabilidadFiscal = "";
    this._codigoImpuesto = "";
    this._nombreImpuesto = "";
    this._telefono = "";
    this._email = "";
    this._contacto = {};
    this._direccion = {};
    this._direccionFiscal = {};
    this._listaResponsabilidadesTributarias = [];
    this._numeroMatricula = 0;

    Transportista.prototype.getRazonSocial = function () {
        return this._razonSocial;
    };

    Transportista.prototype.setRazonSocial = function (value) {
        this._razonSocial = value;
    };

    Transportista.prototype.getNombreRegistrado = function () {
        return this._nombreRegistrado;
    };

    Transportista.prototype.setNombreRegistrado = function (value) {
        this._nombreRegistrado = value;
    };

    Transportista.prototype.getTipoIdentificacion = function () {
        return this._tipoIdentificacion;
    };

    Transportista.prototype.setTipoIdentificacion = function (value) {
        this._tipoIdentificacion = value;
    };

    Transportista.prototype.getIdentificacion = function () {
        return this._identificacion;
    };

    Transportista.prototype.setIdentificacion = function (value) {
        this._identificacion = value;
    };

    Transportista.prototype.getDigitoVerificacion = function () {
        return this._digitoVerificacion;
    };

    Transportista.prototype.setDigitoVerificacion = function (value) {
        this._digitoVerificacion = value;
    };

    Transportista.prototype.getNaturaleza = function () {
        return this._naturaleza;
    };

    Transportista.prototype.setNaturaleza = function (value) {
        this._naturaleza = value;
    };

    Transportista.prototype.getCodigoRegimen = function () {
        return this._codigoRegimen;
    };

    Transportista.prototype.setCodigoRegimen = function (value) {
        this._codigoRegimen = value;
    };

    Transportista.prototype.getResponsabilidadFiscal = function () {
        return this._responsabilidadFiscal;
    };

    Transportista.prototype.setResponsabilidadFiscal = function (value) {
        this._responsabilidadFiscal = value;
    };

    Transportista.prototype.getCodigoImpuesto = function () {
        return this._codigoImpuesto;
    };

    Transportista.prototype.setCodigoImpuesto = function (value) {
        this._codigoImpuesto = value;
    };

    Transportista.prototype.getNombreImpuesto = function () {
        return this._nombreImpuesto;
    };

    Transportista.prototype.setNombreImpuesto = function (value) {
        this._nombreImpuesto = value;
    };

    Transportista.prototype.getTelefono = function () {
        return this._telefono;
    };

    Transportista.prototype.setTelefono = function (value) {
        this._telefono = value;
    };

    Transportista.prototype.getEmail = function () {
        return this._email;
    };

    Transportista.prototype.setEmail = function (value) {
        this._email = value;
    };

    Transportista.prototype.getContacto = function () {
        return this._contacto;
    };

    Transportista.prototype.setContacto = function (value) {
        this._contacto = value;
    };

    Transportista.prototype.getDireccion = function () {
        return this._direccion;
    };

    Transportista.prototype.setDireccion = function (value) {
        this._direccion = value;
    };

    Transportista.prototype.getDireccionFiscal = function () {
        return this._direccionFiscal;
    };

    Transportista.prototype.setDireccionFiscal = function (value) {
        this._direccionFiscal = value;
    };

    Transportista.prototype.getListaResponsabilidadesTributarias = function () {
        return this._listaResponsabilidadesTributarias;
    };

    Transportista.prototype.setListaResponsabilidadesTributarias = function (value) {
        this._listaResponsabilidadesTributarias = value;
    };

    Transportista.prototype.getNumeroMatricula = function () {
        return this._numeroMatricula;
    };

    Transportista.prototype.setNumeroMatricula = function (value) {
        this._numeroMatricula = value;
    };
}
;


module.exports = new Transportista;
