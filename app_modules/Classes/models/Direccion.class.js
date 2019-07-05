class Direccion {
    constructor(){
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

    get codigoPais() {
        return this._codigoPais;
    }

    set codigoPais(value) {
        this._codigoPais = value;
    }

    get nombrePais() {
        return this._nombrePais;
    }

    set nombrePais(value) {
        this._nombrePais = value;
    }

    get codigoLenguajePais() {
        return this._codigoLenguajePais;
    }

    set codigoLenguajePais(value) {
        this._codigoLenguajePais = value;
    }

    get codigoDepartamento() {
        return this._codigoDepartamento;
    }

    set codigoDepartamento(value) {
        this._codigoDepartamento = value;
    }

    get nombreDepartamento() {
        return this._nombreDepartamento;
    }

    set nombreDepartamento(value) {
        this._nombreDepartamento = value;
    }

    get codigoCiudad() {
        return this._codigoCiudad;
    }

    set codigoCiudad(value) {
        this._codigoCiudad = value;
    }

    get nombreCiudad() {
        return this._nombreCiudad;
    }

    set nombreCiudad(value) {
        this._nombreCiudad = value;
    }

    get direccionFisica() {
        return this._direccionFisica;
    }

    set direccionFisica(value) {
        this._direccionFisica = value;
    }

    get codigoPostal() {
        return this._codigoPostal;
    }

    set codigoPostal(value) {
        this._codigoPostal = value;
    }
}

  module.exports = new Direccion;
