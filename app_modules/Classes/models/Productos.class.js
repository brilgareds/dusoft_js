class Productos {
    constructor () {
        this._numeroLinea = 0;
        this._informacion = '';
        this._cantidad = 0;
        this._valorTotal = 0.0;
        this._idProducto = '';
        this._codigoPrecio = '';
        this._codigoReferencia = '';
        this._valorReferencia = 0;
        this._valorUnitario = 0.0;
        this._cantidadReal = 0.0;
        this._codigoUnidad = '';
        this._esMuestraComercial = false;
        this._item = {};
        this._listaCargosDescuentos = [];
        this._listaImpuestos = [];
        this._listaDeducciones = [];
        this._listaCorrecciones = [];
    }

    get numeroLinea() {
        return this._numeroLinea;
    }

    set numeroLinea(value) {
        this._numeroLinea = value;
    }

    get informacion() {
        return this._informacion;
    }

    set informacion(value) {
        this._informacion = value;
    }

    get cantidad() {
        return this._cantidad;
    }

    set cantidad(value) {
        this._cantidad = value;
    }

    get valorTotal() {
        return this._valorTotal;
    }

    set valorTotal(value) {
        this._valorTotal = value;
    }

    get idProducto() {
        return this._idProducto;
    }

    set idProducto(value) {
        this._idProducto = value;
    }

    get codigoPrecio() {
        return this._codigoPrecio;
    }

    set codigoPrecio(value) {
        this._codigoPrecio = value;
    }

    get codigoReferencia() {
        return this._codigoReferencia;
    }

    set codigoReferencia(value) {
        this._codigoReferencia = value;
    }

    get valorReferencia() {
        return this._valorReferencia;
    }

    set valorReferencia(value) {
        this._valorReferencia = value;
    }

    get valorUnitario() {
        return this._valorUnitario;
    }

    set valorUnitario(value) {
        this._valorUnitario = value;
    }

    get cantidadReal() {
        return this._cantidadReal;
    }

    set cantidadReal(value) {
        this._cantidadReal = value;
    }

    get codigoUnidad() {
        return this._codigoUnidad;
    }

    set codigoUnidad(value) {
        this._codigoUnidad = value;
    }

    get esMuestraComercial() {
        return this._esMuestraComercial;
    }

    set esMuestraComercial(value) {
        this._esMuestraComercial = value;
    }

    get item() {
        return this._item;
    }

    set item(value) {
        this._item = value;
    }

    get listaCargosDescuentos() {
        return this._listaCargosDescuentos;
    }

    set listaCargosDescuentos(value) {
        this._listaCargosDescuentos = value;
    }

    get listaImpuestos() {
        return this._listaImpuestos;
    }

    set listaImpuestos(value) {
        this._listaImpuestos = value;
    }

    get listaDeducciones() {
        return this._listaDeducciones;
    }

    set listaDeducciones(value) {
        this._listaDeducciones = value;
    }

    get listaCorrecciones() {
        return this._listaCorrecciones;
    }

    set listaCorrecciones(value) {
        this._listaCorrecciones = value;
    }
}

module.exports = new Productos;
