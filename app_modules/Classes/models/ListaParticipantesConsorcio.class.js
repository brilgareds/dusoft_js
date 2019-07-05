class ListaParticipantesConsorcio {
    constructor () {
        this._razonSocial = '';
        this._tipoIdentificacion = 0;
        this._identificacion = '';
        this._digitoVerificacion = '';
        this._porcentajeParticipacion = '';
        this._obligacionTributaria = '';
        this._regimen = '';
        this._listaImpuestos = {};
    }

    get razonSocial() {
        return this._razonSocial;
    }

    set razonSocial(value) {
        this._razonSocial = value;
    }

    get tipoIdentificacion() {
        return this._tipoIdentificacion;
    }

    set tipoIdentificacion(value) {
        this._tipoIdentificacion = value;
    }

    get identificacion() {
        return this._identificacion;
    }

    set identificacion(value) {
        this._identificacion = value;
    }

    get digitoVerificacion() {
        return this._digitoVerificacion;
    }

    set digitoVerificacion(value) {
        this._digitoVerificacion = value;
    }

    get porcentajeParticipacion() {
        return this._porcentajeParticipacion;
    }

    set porcentajeParticipacion(value) {
        this._porcentajeParticipacion = value;
    }

    get obligacionTributaria() {
        return this._obligacionTributaria;
    }

    set obligacionTributaria(value) {
        this._obligacionTributaria = value;
    }

    get regimen() {
        return this._regimen;
    }

    set regimen(value) {
        this._regimen = value;
    }

    get listaImpuestos() {
        return this._listaImpuestos;
    }

    set listaImpuestos(value) {
        this._listaImpuestos = value;
    }
}

module.exports = new ListaParticipantesConsorcio;
