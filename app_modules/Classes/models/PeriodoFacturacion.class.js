
class PeriodoFacturacion {
    constructor() {
        this._fechaInicio = '';
        this._horaInicio = '';
        this._fechaFin = '';
        this._horaFin = '';

    }

    get fechaInicio() {
        return this._fechaInicio;
    }

    set fechaInicio(value) {
        this._fechaInicio = value;
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

    get horaFin() {
        return this._horaFin;
    }

    set horaFin(value) {
        this._horaFin = value;
    }
}

module.exports = new PeriodoFacturacion;
