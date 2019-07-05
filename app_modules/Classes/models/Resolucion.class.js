
class Resolucion {
    constructor() {
        this._numero = '';
        this._horaInicio = '';
        this._fechaFin = '';
        this._numeracion = [];
    }

    get numero() {
        return this._numero;
    }

    set numero(value) {
        this._numero = value;
    }

    get horaInicio() {
        return this._horaInicio;
    }

    set horaInicio(value) {
        this._horaInicio = value;
    }

    get fechaFin() {
        return this._fechaFin;
    }

    set fechaFin(value) {
        this._fechaFin = value;
    }

    get numeracion() {
        return this._numeracion;
    }

    set numeracion(value) {
        this._numeracion = value;
    }
}

module.exports = new Resolucion;

