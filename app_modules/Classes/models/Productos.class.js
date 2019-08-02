function Productos() {

        this.numeroLinea = 0;
        this.informacion = '';
        this.cantidad = 0;
        this.valorTotal = 0.0;
        this.idProducto = '';
        this.codigoPrecio = '';
        this.valorUnitario = 0.0;
        this.cantidadReal = 0.0;
        this.codigoUnidad = '';
        this.esMuestraComercial = false;
        this.item = {};
        this.listaCargosDescuentos = [];
        this.listaImpuestos = [];
        this.listaDeducciones = [];
        this.listaCorrecciones = [];
    
    Productos.prototype.getNumeroLinea = function () {
        return this.numeroLinea;
    };

    Productos.prototype.setNumeroLinea = function (value) {
        this.numeroLinea = value;
    };

    Productos.prototype.getInformacion = function () {
        return this.informacion;
    };

    Productos.prototype.setInformacion = function (value) {
        this.informacion = value;
    };

    Productos.prototype.getCantidad = function () {
        return this.cantidad;
    };

    Productos.prototype.setCantidad = function (value) {
        this.cantidad = value;
    };

    Productos.prototype.getValorTotal = function () {
        return this.valorTotal;
    };

    Productos.prototype.setValorTotal = function (value) {
        this.valorTotal = value;
    };

    Productos.prototype.getIdProducto = function () {
        return this.idProducto;
    };

    Productos.prototype.setIdProducto = function (value) {
        this.idProducto = value;
    };

    Productos.prototype.getCodigoPrecio = function () {
        return this.codigoPrecio;
    };

    Productos.prototype.setCodigoPrecio = function (value) {
        this.codigoPrecio = value;
    };

    Productos.prototype.getValorUnitario = function () {
        return this.valorUnitario;
    };

    Productos.prototype.setValorUnitario = function (value) {
        this.valorUnitario = value;
    };

    Productos.prototype.getCantidadReal = function () {
        return this.cantidadReal;
    };

    Productos.prototype.setCantidadReal = function (value) {
        this.cantidadReal = value;
    };

    Productos.prototype.getCodigoUnidad = function () {
        return this.codigoUnidad;
    };

    Productos.prototype.setCodigoUnidad = function (value) {
        this.codigoUnidad = value;
    };

    Productos.prototype.getEsMuestraComercial = function () {
        return this.esMuestraComercial;
    };

    Productos.prototype.setEsMuestraComercial = function (value) {
        this.esMuestraComercial = value;
    };

    Productos.prototype.getItem = function () {
        return this.item;
    };

    Productos.prototype.setItem = function (value) {
        this.item = value;
    };

    Productos.prototype.getListaCargosDescuentos = function () {
        return this.listaCargosDescuentos;
    };

    Productos.prototype.setListaCargosDescuentos = function (value) {
        this.listaCargosDescuentos = value;
    };

    Productos.prototype.getListaImpuestos = function () {
        return this.listaImpuestos;
    };

    Productos.prototype.setListaImpuestos = function (value) {
        this.listaImpuestos = value;
    };

    Productos.prototype.getListaDeducciones = function () {
        return this.listaDeducciones;
    };

    Productos.prototype.setListaDeducciones = function (value) {
        this.listaDeducciones = value;
    };

    Productos.prototype.getListaCorrecciones = function () {
        return this.listaCorrecciones;
    };

    Productos.prototype.setListaCorrecciones = function (value) {
        this.listaCorrecciones = value;
    };
};

module.exports = new Productos;
