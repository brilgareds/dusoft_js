function Mandatorio() {
    this._tipoIdentificacion = '';
    this._identificacion = 0;
    this._digitoVerificacion = 0;


    Mandatorio.prototype.getTipoIdentificacion = function () {
        return this._tipoIdentificacion;
    }

    Mandatorio.prototype.setTipoIdentificacion = function (_tipoIdentificacion) {
        this._tipoIdentificacion = _tipoIdentificacion;
    }

    Mandatorio.prototype.getIdentificacion = function () {
        return this._identificacion;
    }

    Mandatorio.prototype.setIdentificacion = function (_identificacion) {
        this._identificacion = _identificacion;
    }

    Mandatorio.prototype.getDigitoVerificacion = function () {
        return this._digitoVerificacion;
    }

    Mandatorio.prototype.setDigitoVerificacion = function (_digitoVerificacion) {
        this._digitoVerificacion = _digitoVerificacion;
    }
}
;

module.exports = new Mandatorio;
