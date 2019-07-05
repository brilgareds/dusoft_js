
class TasaCambio {
    constructor() {
        this._fechaCambio = '';
        this._codigoMonedaFacturado = '';
        this._codigoMonedaCambio = '';
        this._baseCambioFacturado = 0.0;
        this._baseCambio = 0.0;
        this._trm = 0.0;
    }

    get fechaCambio() {
        return this._fechaCambio;
    }

    set fechaCambio(value) {
        this._fechaCambio = value;
    }

    get codigoMonedaFacturado() {
        return this._codigoMonedaFacturado;
    }

    set codigoMonedaFacturado(value) {
        this._codigoMonedaFacturado = value;
    }

    get codigoMonedaCambio() {
        return this._codigoMonedaCambio;
    }

    set codigoMonedaCambio(value) {
        this._codigoMonedaCambio = value;
    }

    get baseCambioFacturado() {
        return this._baseCambioFacturado;
    }

    set baseCambioFacturado(value) {
        this._baseCambioFacturado = value;
    }

    get baseCambio() {
        return this._baseCambio;
    }

    set baseCambio(value) {
        this._baseCambio = value;
    }

    get trm() {
        return this._trm;
    }

    set trm(value) {
        this._trm = value;
    }
}

module.exports = new TasaCambio;
