function ListaParticipantesConsorcio () {
    this._razonSocial = '';
    this._tipoIdentificacion = 0;
    this._identificacion = '';
    this._digitoVerificacion = '';
    this._porcentajeParticipacion = '';
    this._obligacionTributaria = '';
    this._regimen = '';
    this._listaImpuestos = {};

    ListaParticipantesConsorcio.prototype.get_razonSocial = function () {
        return this._razonSocial;
    };

    ListaParticipantesConsorcio.prototype.set_razonSocial = function (newValue) {
        this._razonSocial = newValue;
    };

    ListaParticipantesConsorcio.prototype.get_tipoIdentificacion = function () {
        return this._tipoIdentificacion;
    };

    ListaParticipantesConsorcio.prototype.set_tipoIdentificacion = function (newValue) {
        this._tipoIdentificacion = newValue;
    };

    ListaParticipantesConsorcio.prototype.get_identificacion = function () {
        return this._identificacion;
    };

    ListaParticipantesConsorcio.prototype.set_identificacion = function (newValue) {
        this._identificacion = newValue;
    };

    ListaParticipantesConsorcio.prototype.get_digitoVerificacion = function () {
        return this._digitoVerificacion;
    };

    ListaParticipantesConsorcio.prototype.set_digitoVerificacion = function (newValue) {
        this._digitoVerificacion = newValue;
    };

    ListaParticipantesConsorcio.prototype.get_porcentajeParticipacion = function () {
        return this._porcentajeParticipacion;
    };

    ListaParticipantesConsorcio.prototype.set_porcentajeParticipacion = function (newValue) {
        this._porcentajeParticipacion = newValue;
    };

    ListaParticipantesConsorcio.prototype.get_obligacionTributaria = function () {
        return this._obligacionTributaria;
    };

    ListaParticipantesConsorcio.prototype.set_obligacionTributaria = function (newValue) {
        this._obligacionTributaria = newValue;
    };

    ListaParticipantesConsorcio.prototype.get_regimen = function () {
        return this._regimen;
    };

    ListaParticipantesConsorcio.prototype.set_regimen = function (newValue) {
        this._regimen = newValue;
    };

    ListaParticipantesConsorcio.prototype.get_listaImpuestos = function () {
        return this._listaImpuestos;
    };

    ListaParticipantesConsorcio.prototype.set_listaImpuestos = function (newValue) {
        this._listaImpuestos = newValue;
    };
};

module.exports = new ListaParticipantesConsorcio;
