function Productos() {

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
    
    Productos.prototype.getNumeroLinea = function () {
        return this._numeroLinea;
    };

    Productos.prototype.setNumeroLinea = function (value) {
        this._numeroLinea = value;
    };

    Productos.prototype.getInformacion = function () {
        return this._informacion;
    };

    Productos.prototype.setInformacion = function (value) {
        this._informacion = value;
    };

    Productos.prototype.getCantidad = function () {
        return this._cantidad;
    };

    Productos.prototype.setCantidad = function (value) {
        this._cantidad = value;
    };

    Productos.prototype.getValorTotal = function () {
        return this._valorTotal;
    };

    Productos.prototype.setValorTotal = function (value) {
        this._valorTotal = value;
    };

    Productos.prototype.getIdProducto = function () {
        return this._idProducto;
    };

    Productos.prototype.setIdProducto = function (value) {
        this._idProducto = value;
    };

    Productos.prototype.getCodigoPrecio = function () {
        return this._codigoPrecio;
    };

    Productos.prototype.setCodigoPrecio = function (value) {
        this._codigoPrecio = value;
    };

    Productos.prototype.getCodigoReferencia = function () {
        return this._codigoReferencia;
    };

    Productos.prototype.setCodigoReferencia = function (value) {
        this._codigoReferencia = value;
    };

    Productos.prototype.getValorReferencia = function () {
        return this._valorReferencia;
    };

    Productos.prototype.setValorReferencia = function (value) {
        this._valorReferencia = value;
    };

    Productos.prototype.getValorUnitario = function () {
        return this._valorUnitario;
    };

    Productos.prototype.setValorUnitario = function (value) {
        this._valorUnitario = value;
    };

    Productos.prototype.getCantidadReal = function () {
        return this._cantidadReal;
    };

    Productos.prototype.setCantidadReal = function (value) {
        this._cantidadReal = value;
    };

    Productos.prototype.getCodigoUnidad = function () {
        return this._codigoUnidad;
    };

    Productos.prototype.setCodigoUnidad = function (value) {
        this._codigoUnidad = value;
    };

    Productos.prototype.getEsMuestraComercial = function () {
        return this._esMuestraComercial;
    };

    Productos.prototype.setEsMuestraComercial = function (value) {
        this._esMuestraComercial = value;
    };

    Productos.prototype.getItem = function () {
        return this._item;
    };

    Productos.prototype.setItem = function (value) {
        this._item = value;
    };

    Productos.prototype.getListaCargosDescuentos = function () {
        return this._listaCargosDescuentos;
    };

    Productos.prototype.setListaCargosDescuentos = function (value) {
        this._listaCargosDescuentos = value;
    };

    Productos.prototype.getListaImpuestos = function () {
        return this._listaImpuestos;
    };

    Productos.prototype.setListaImpuestos = function (value) {
        this._listaImpuestos = value;
    };

    Productos.prototype.getListaDeducciones = function () {
        return this._listaDeducciones;
    };

    Productos.prototype.setListaDeducciones = function (value) {
        this._listaDeducciones = value;
    };

    Productos.prototype.getListaCorrecciones = function () {
        return this._listaCorrecciones;
    };

    Productos.prototype.setListaCorrecciones = function (value) {
        this._listaCorrecciones = value;
    };
};

module.exports = new Productos;
