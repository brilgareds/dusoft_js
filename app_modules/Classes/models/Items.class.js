function Items() {
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

    Items.prototype.get_marca = function() {
        return this._marca;
    }

    Items.prototype.set_marca = function(value) {
        this._marca = value;
    }

    Items.prototype.get_modelo = function() {
        return this._modelo;
    }

    Items.prototype.set_modelo = function(value) {
        this._modelo = value;
    }

    Items.prototype.get_codigoArticuloVendedor = function() {
        return this._codigoArticuloVendedor;
    }

    Items.prototype.set_codigoArticuloVendedor = function(value) {
        this._codigoArticuloVendedor = value;
    }

    Items.prototype.get_codigoExtendidoVendedor = function() {
        return this._codigoExtendidoVendedor;
    }

    Items.prototype.set_codigoExtendidoVendedor = function(value) {
        this._codigoExtendidoVendedor = value;
    }

    Items.prototype.get_codigoEstandar = function() {
        return this._codigoEstandar;
    }

    Items.prototype.set_codigoEstandar = function(value) {
        this._codigoEstandar = value;
    }

    Items.prototype.get_nombreEstandar = function() {
        return this._nombreEstandar;
    }

    Items.prototype.set_nombreEstandar = function(value) {
        this._nombreEstandar = value;
    }

    Items.prototype.get_descripcion = function() {
        return this._descripcion;
    }

    Items.prototype.set_descripcion = function(value) {
        this._descripcion = value;
    }

    Items.prototype.get_datosTecnicos = function() {
        return this._datosTecnicos;
    }

    Items.prototype.set_datosTecnicos = function(value) {
        this._datosTecnicos = value;
    }

    Items.prototype.get_cantidadPaquetes = function() {
        return this._cantidadPaquetes;
    }

    Items.prototype.set_cantidadPaquetes = function(value) {
        this._cantidadPaquetes = value;
    }

    Items.prototype.get_codigoPais = function() {
        return this._codigoPais;
    }

    Items.prototype.set_codigoPais = function(value) {
        this._codigoPais = value;
    }

    Items.prototype.get_nombrePais = function() {
        return this._nombrePais;
    }

    Items.prototype.set_nombrePais = function(value) {
        this._nombrePais = value;
    }

    Items.prototype.get_codigoLenguajePais = function() {
        return this._codigoLenguajePais;
    }

    Items.prototype.set_codigoLenguajePais = function(value) {
        this._codigoLenguajePais = value;
    }

    Items.prototype.get_listaCaracteristicas = function() {
        return this._listaCaracteristicas;
    }

    Items.prototype.set_listaCaracteristicas = function(value) {
        this._listaCaracteristicas = value;
    }

    Items.prototype.get_mandatorio = function() {
        return this._mandatorio;
    }

    Items.prototype.set_mandatorio = function(value) {
        this._mandatorio = value;
    }


module.exports = new Items;
