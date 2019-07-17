function Numeracion() {

    this.prefijo = "";
    this.desde = 0;
    this.hasta = 0;
    this.fechaInicio = "";
    this.fechaFin = "";


    Numeracion.prototype.getPrefijo = function () {
        return this.prefijo;
    };

    Numeracion.prototype.setPrefijo = function (prefijo) {
        this.prefijo = prefijo;
    };

    Numeracion.prototype.getDesde = function () {
        return this.desde;
    };

    Numeracion.prototype.setDesde = function (desde) {
        this.desde = desde;
    };

    Numeracion.prototype.getHasta = function () {
        return this.hasta;
    };

    Numeracion.prototype.setHasta = function (hasta) {
        this.hasta = hasta;
    };

    Numeracion.prototype.getFechaInicio = function () {
        return this.fechaInicio;
    };

    Numeracion.prototype.setFechaInicio = function (fechaInicio) {
        this.fechaInicio = fechaInicio;
    };

    Numeracion.prototype.getFechaFin = function () {
        return this.fechaFin;
    };

    Numeracion.prototype.setFechaFin = function (fechaFin) {
        this.fechaFin = fechaFin;
    };
}
;
module.exports = new Numeracion;
