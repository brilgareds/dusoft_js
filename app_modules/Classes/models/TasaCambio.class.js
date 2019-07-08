
function TasaCambio() {

        this._fechaCambio = '';
        this._codigoMonedaFacturado = '';
        this._codigoMonedaCambio = '';
        this._baseCambioFacturado = 0.0;
        this._baseCambio = 0.0;
        this._trm = 0.0;
    

    TasaCambio.prototype.getFechaCambio = function () {
        return this._fechaCambio;
    };

    TasaCambio.prototype.setFechaCambio = function (value) {
        this._fechaCambio = value;
    };

    TasaCambio.prototype.getCodigoMonedaFacturado = function () {
        return this._codigoMonedaFacturado;
    };

    TasaCambio.prototype.setCodigoMonedaFacturado = function (value) {
        this._codigoMonedaFacturado = value;
    };

    TasaCambio.prototype.getCodigoMonedaCambio = function () {
        return this._codigoMonedaCambio;
    };

    TasaCambio.prototype.setCodigoMonedaCambio = function (value) {
        this._codigoMonedaCambio = value;
    };

    TasaCambio.prototype.getBaseCambioFacturado = function () {
        return this._baseCambioFacturado;
    };

    TasaCambio.prototype.setBaseCambioFacturado = function (value) {
        this._baseCambioFacturado = value;
    };

    TasaCambio.prototype.getBaseCambio = function () {
        return this._baseCambio;
    };

    TasaCambio.prototype.setBaseCambio = function (value) {
        this._baseCambio = value;
    };

    TasaCambio.prototype.getTrm = function () {
        return this._trm;
    };

    TasaCambio.prototype.setTrm = function (value) {
        this._trm = value;
    };
};

module.exports = new TasaCambio;
