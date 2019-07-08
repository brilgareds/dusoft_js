function NotasReferenciadas() {

    this._id = "";
    this._tipo = "";
    this._fecha = "";
    this._algoritmo = "";
    this._cufe = "";


    NotasReferenciadas.prototype.getId = function () {
        return this._id;
    }

    NotasReferenciadas.prototype.setId = function (_id) {
        this._id = _id;
    }

    NotasReferenciadas.prototype.getTipo = function () {
        return this._tipo;
    }

    NotasReferenciadas.prototype.setTipo = function (_tipo) {
        this._tipo = _tipo;
    }

    NotasReferenciadas.prototype.getFecha = function () {
        return this._fecha;
    }

    NotasReferenciadas.prototype.setFecha = function (_fecha) {
        this._fecha = _fecha;
    }

    NotasReferenciadas.prototype.getAlgoritmo = function () {
        return this._algoritmo;
    }

    NotasReferenciadas.prototype.setAlgoritmo = function (_algoritmo) {
        this._algoritmo = _algoritmo;
    }

    NotasReferenciadas.prototype.getCufe = function () {
        return this._cufe;
    }

    NotasReferenciadas.prototype.setCufe = function (_cufe) {
        this._cufe = _cufe;
    }
}
;

module.exports = new NotasReferenciadas;
