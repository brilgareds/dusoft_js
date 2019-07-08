
function PeriodoFacturacion() {

        this._fechaInicio = '';
        this._horaInicio = '';
        this._fechaFin = '';
        this._horaFin = '';

    PeriodoFacturacion.prototype.getFechaInicio = function () {
        return this._fechaInicio;
    };

    PeriodoFacturacion.prototype.setFechaInicio = function (value) {
        this._fechaInicio = value;
    };

    PeriodoFacturacion.prototype.getHoraInicio = function () {
        return this._horaInicio;
    };

    PeriodoFacturacion.prototype.setHoraInicio = function (value) {
        this._horaInicio = value;
    };

    PeriodoFacturacion.prototype.getFechaFin = function () {
        return this._fechaFin;
    };

    PeriodoFacturacion.prototype.setFechaFin = function (value) {
        this._fechaFin = value;
    };

    PeriodoFacturacion.prototype.getHoraFin = function () {
        return this._horaFin;
    };

    PeriodoFacturacion.prototype.setHoraFin = function (value) {
        this._horaFin = value;
    };
};

module.exports = new PeriodoFacturacion;
