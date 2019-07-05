class Mandatorio {
    constructor () {
        this._tipoIdentificacion = '';
        this._identificacion = 0;
        this._digitoVerificacion = 0;
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
}

module.exports = new Mandatorio;
