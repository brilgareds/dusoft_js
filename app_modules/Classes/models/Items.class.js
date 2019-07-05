class Items {
    constructor () {
        this._marca = '';
        this._modelo = '';
        this._codigoArticuloVendedor = '';
        this._codigoExtendidoVendedor = '';
        this._codigoEstandar = '';
        this._nombreEstandar = '';
        this._descripcion = '';

        this._datosTecnicos = '';
        this._cantidadPaquetes = 0;
        this._codigoPais = '';
        this._nombrePais = '';
        this._codigoLenguajePais = '';
        this._listaCaracteristicas = [];
        this._mandatorio = [];
    }

    get marca() {
        return this._marca;
    }

    set marca(value) {
        this._marca = value;
    }

    get modelo() {
        return this._modelo;
    }

    set modelo(value) {
        this._modelo = value;
    }

    get codigoArticuloVendedor() {
        return this._codigoArticuloVendedor;
    }

    set codigoArticuloVendedor(value) {
        this._codigoArticuloVendedor = value;
    }

    get codigoExtendidoVendedor() {
        return this._codigoExtendidoVendedor;
    }

    set codigoExtendidoVendedor(value) {
        this._codigoExtendidoVendedor = value;
    }

    get codigoEstandar() {
        return this._codigoEstandar;
    }

    set codigoEstandar(value) {
        this._codigoEstandar = value;
    }

    get nombreEstandar() {
        return this._nombreEstandar;
    }

    set nombreEstandar(value) {
        this._nombreEstandar = value;
    }

    get descripcion() {
        return this._descripcion;
    }

    set descripcion(value) {
        this._descripcion = value;
    }

    get datosTecnicos() {
        return this._datosTecnicos;
    }

    set datosTecnicos(value) {
        this._datosTecnicos = value;
    }

    get cantidadPaquetes() {
        return this._cantidadPaquetes;
    }

    set cantidadPaquetes(value) {
        this._cantidadPaquetes = value;
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

    get listaCaracteristicas() {
        return this._listaCaracteristicas;
    }

    set listaCaracteristicas(value) {
        this._listaCaracteristicas = value;
    }

    get mandatorio() {
        return this._mandatorio;
    }

    set mandatorio(value) {
        this._mandatorio = value;
    }
}

module.exports = new Items;
