
function Resolucion() {

        this.numero = '';
        this.fechaInicio = '';
        this.fechaFin = '';
        this.numeracion = [];
    

    Resolucion.prototype.getNumero = function () {
        return this.numero;
    };

    Resolucion.prototype.setNumero = function (value) {
        this.numero = value;
    };

    Resolucion.prototype.getFechaInicio = function () {
        return this.fechaInicio;
    };

    Resolucion.prototype.setFechaInicio = function (value) {
        this.fechaInicio = value;
    };

    Resolucion.prototype.getFechaFin = function () {
        return this.fechaFin;
    };

    Resolucion.prototype.setFechaFin = function (value) {
        this.fechaFin = value;
    };

    Resolucion.prototype.getNumeracion = function () {
        return this.numeracion;
    };

    Resolucion.prototype.setNumeracion = function (value) {
        this.numeracion = value;
    };
};

module.exports = new Resolucion;

