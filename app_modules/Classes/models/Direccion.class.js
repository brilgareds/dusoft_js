function Direccion() {
        this._codigoPais = "";
        this._nombrePais = "";
        this._codigoLenguajePais = "";
        this._codigoDepartamento = "";
        this._nombreDepartamento = "";
        this._codigoCiudad = "";
        this._nombreCiudad = "";
        this._direccionFisica = "";
        this._codigoPostal = "";
    }

    Direccion.prototype.get_codigoPais = function() {
        return this._codigoPais;
    }

    Direccion.prototype.set_codigoPais = function(value) {
        this._codigoPais = value;
    }

    Direccion.prototype.get_nombrePais = function() {
        return this._nombrePais;
    }

    Direccion.prototype.set_nombrePais = function(value) {
        this._nombrePais = value;
    }

    Direccion.prototype.get_codigoLenguajePais = function() {
        return this._codigoLenguajePais;
    }

    Direccion.prototype.set_codigoLenguajePais = function(value) {
        this._codigoLenguajePais = value;
    }

    Direccion.prototype.get_codigoDepartamento = function() {
        return this._codigoDepartamento;
    }

    Direccion.prototype.set_codigoDepartamento = function(value) {
        this._codigoDepartamento = value;
    }

    Direccion.prototype.get_nombreDepartamento = function() {
        return this._nombreDepartamento;
    }

    Direccion.prototype.set_nombreDepartamento = function(value) {
        this._nombreDepartamento = value;
    }

    Direccion.prototype.get_codigoCiudad = function() {
        return this._codigoCiudad;
    }

    Direccion.prototype.set_codigoCiudad = function(value) {
        this._codigoCiudad = value;
    }

    Direccion.prototype.get_nombreCiudad = function() {
        return this._nombreCiudad;
    }

    Direccion.prototype.set_nombreCiudad = function(value) {
        this._nombreCiudad = value;
    }

    Direccion.prototype.get_direccionFisica = function() {
        return this._direccionFisica;
    }

    Direccion.prototype.set_direccionFisica = function(value) {
        this._direccionFisica = value;
    }

    Direccion.prototype.get_codigoPostal = function() {
        return this._codigoPostal;
    }

    Direccion.prototype.set_codigoPostal = function(value) {
        this._codigoPostal = value;
    }

  module.exports = new Direccion;
