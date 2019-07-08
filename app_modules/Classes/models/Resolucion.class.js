
function Resolucion() {

        this._numero = '';
        this._horaInicio = '';
        this._fechaFin = '';
        this._numeracion = [];
    

    Resolucion.prototype.getNumero = function () {
        return this._numero;
    };

    Resolucion.prototype.setNumero = function (value) {
        this._numero = value;
    };

    Resolucion.prototype.getHoraInicio = function () {
        return this._horaInicio;
    };

    Resolucion.prototype.setHoraInicio = function (value) {
        this._horaInicio = value;
    };

    Resolucion.prototype.getFechaFin = function () {
        return this._fechaFin;
    };

    Resolucion.prototype.setFechaFin = function (value) {
        this._fechaFin = value;
    };

    Resolucion.prototype.getNumeracion = function () {
        return this._numeracion;
    };

    Resolucion.prototype.setNumeracion = function (value) {
        this._numeracion = value;
    };
};

module.exports = new Resolucion;

