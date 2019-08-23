function Direccion() {
        this.codigoPais = "";
        this.nombrePais = "";
        this.codigoLenguajePais = "";
        this.codigoDepartamento = "";
        this.nombreDepartamento = "";
        this.codigoCiudad = "";
        this.nombreCiudad = "";
        this.direccionFisica = "";
        this.codigoPostal = "";
    }

    Direccion.prototype.get_codigoPais = function() {
        return this.codigoPais;
    };

    Direccion.prototype.set_codigoPais = function(value) {
        this.codigoPais = value;
    };

    Direccion.prototype.get_nombrePais = function() {
        return this.nombrePais;
    };

    Direccion.prototype.set_nombrePais = function(value) {
        this.nombrePais = value;
    };

    Direccion.prototype.get_codigoLenguajePais = function() {
        return this.codigoLenguajePais;
    };

    Direccion.prototype.set_codigoLenguajePais = function(value) {
        this.codigoLenguajePais = value;
    };

    Direccion.prototype.get_codigoDepartamento = function() {
        return this.codigoDepartamento;
    };

    Direccion.prototype.set_codigoDepartamento = function(value) {
        this.codigoDepartamento = value;
    };

    Direccion.prototype.get_nombreDepartamento = function() {
        return this.nombreDepartamento;
    };

    Direccion.prototype.set_nombreDepartamento = function(value) {
        this.nombreDepartamento = value;
    };

    Direccion.prototype.get_codigoCiudad = function() {
        return this.codigoCiudad;
    };

    Direccion.prototype.set_codigoCiudad = function(value) {
        this.codigoCiudad = value;
    };

    Direccion.prototype.get_nombreCiudad = function() {
        return this.nombreCiudad;
    };

    Direccion.prototype.set_nombreCiudad = function(value) {
        this.nombreCiudad = value;
    };

    Direccion.prototype.get_direccionFisica = function() {
        return this.direccionFisica;
    };

    Direccion.prototype.set_direccionFisica = function(value) {
        this.direccionFisica = value;
    };

    Direccion.prototype.get_codigoPostal = function() {
        return this.codigoPostal;
    };

    Direccion.prototype.set_codigoPostal = function(value) {
        this.codigoPostal = value;
    };

  module.exports = new Direccion;
