function DireccionAdquiriente() {
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

    DireccionAdquiriente.prototype.get_codigoPais = function() {
        return this.codigoPais;
    };

    DireccionAdquiriente.prototype.set_codigoPais = function(value) {
        this.codigoPais = value;
    };

    DireccionAdquiriente.prototype.get_nombrePais = function() {
        return this.nombrePais;
    };

    DireccionAdquiriente.prototype.set_nombrePais = function(value) {
        this.nombrePais = value;
    };

    DireccionAdquiriente.prototype.get_codigoLenguajePais = function() {
        return this.codigoLenguajePais;
    };

    DireccionAdquiriente.prototype.set_codigoLenguajePais = function(value) {
        this.codigoLenguajePais = value;
    };

    DireccionAdquiriente.prototype.get_codigoDepartamento = function() {
        return this.codigoDepartamento;
    };

    DireccionAdquiriente.prototype.set_codigoDepartamento = function(value) {
        this.codigoDepartamento = value;
    };

    DireccionAdquiriente.prototype.get_nombreDepartamento = function() {
        return this.nombreDepartamento;
    };

    DireccionAdquiriente.prototype.set_nombreDepartamento = function(value) {
        this.nombreDepartamento = value;
    };

    DireccionAdquiriente.prototype.get_codigoCiudad = function() {
        return this.codigoCiudad;
    };

    DireccionAdquiriente.prototype.set_codigoCiudad = function(value) {
        this.codigoCiudad = value;
    };

    DireccionAdquiriente.prototype.get_nombreCiudad = function() {
        return this.nombreCiudad;
    };

    DireccionAdquiriente.prototype.set_nombreCiudad = function(value) {
        this.nombreCiudad = value;
    };

    DireccionAdquiriente.prototype.get_direccionFisica = function() {
        return this.direccionFisica;
    };

    DireccionAdquiriente.prototype.set_direccionFisica = function(value) {
        this.direccionFisica = value;
    };

    DireccionAdquiriente.prototype.get_codigoPostal = function() {
        return this.codigoPostal;
    };

    DireccionAdquiriente.prototype.set_codigoPostal = function(value) {
        this.codigoPostal = value;
    };

  module.exports = new DireccionAdquiriente;
