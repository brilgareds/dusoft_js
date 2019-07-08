function Numeracion() {

    this._desde = 0;
    this._hasta = 0;
    this._fechaInicio = "";
    this._fechaFin = "";


    Numeracion.prototype.getDesde = function () {
        return this._desde;
    }

    Numeracion.prototype.setDesde = function (_desde) {
        this._desde = _desde;
    }

    Numeracion.prototype.getHasta = function () {
        return this._hasta;
    }

    Numeracion.prototype.setHasta = function (_hasta) {
        this._hasta = _hasta;
    }

    Numeracion.prototype.getFechaInicio = function () {
        return this._fechaInicio;
    }

    Numeracion.prototype.setFechaInicio = function (_fechaInicio) {
        this._fechaInicio = _fechaInicio;
    }

    Numeracion.prototype.getFechaFin = function () {
        return this._fechaFin;
    }

    Numeracion.prototype.setFechaFin = function (_fechaFin) {
        this._fechaFin = _fechaFin;
    }
}
;
module.exports = new Numeracion;
