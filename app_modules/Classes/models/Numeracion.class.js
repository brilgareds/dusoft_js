class Numeracion {
    constructor(){
        this._desde = 0;
        this._hasta = 0;
        this._fechaInicio = "";
        this._fechaFin = "";
    }

    get desde() {
        return this._desde;
    }

    set desde(value) {
        this._desde = value;
    }

    get hasta() {
        return this._hasta;
    }

    set hasta(value) {
        this._hasta = value;
    }

    get fechaInicio() {
        return this._fechaInicio;
    }

    set fechaInicio(value) {
        this._fechaInicio = value;
    }

    get fechaFin() {
        return this._fechaFin;
    }

    set fechaFin(value) {
        this._fechaFin = value;
    }
}
  module.exports = new Numeracion;
