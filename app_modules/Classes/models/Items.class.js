function Items() {
        this.marca = '';
        this.modelo = '';
        this.codigoArticuloVendedor = '';
        this.codigoExtendidoVendedor = '';
        this.codigoEstandar = '';
        this.nombreEstandar = '';
        this.descripcion = '';

        this.datosTecnicos = '';
        this.cantidadPaquetes = 0;
        this.codigoPais = '';
        this.nombrePais = '';
        this.codigoLenguajePais = '';
        this.listaCaracteristicas = [];
        this.mandatorio = [];
    }

    Items.prototype.getMarca = function() {
        return this.marca;
    }

    Items.prototype.setMarca = function(value) {
        this.marca = value;
    }

    Items.prototype.getModelo = function() {
        return this.modelo;
    }

    Items.prototype.setModelo = function(value) {
        this.modelo = value;
    }

    Items.prototype.getCodigoArticuloVendedor = function() {
        return this.codigoArticuloVendedor;
    }

    Items.prototype.setCodigoArticuloVendedor = function(value) {
        this.codigoArticuloVendedor = value;
    }

    Items.prototype.getCodigoExtendidoVendedor = function() {
        return this.codigoExtendidoVendedor;
    }

    Items.prototype.setCodigoExtendidoVendedor = function(value) {
        this.codigoExtendidoVendedor = value;
    }

    Items.prototype.getCodigoEstandar = function() {
        return this.codigoEstandar;
    }

    Items.prototype.setCodigoEstandar = function(value) {
        this.codigoEstandar = value;
    }

    Items.prototype.getNombreEstandar = function() {
        return this.nombreEstandar;
    }

    Items.prototype.setNombreEstandar = function(value) {
        this.nombreEstandar = value;
    }

    Items.prototype.getDescripcion = function() {
        return this.descripcion;
    }

    Items.prototype.setDescripcion = function(value) {
        this.descripcion = value;
    }

    Items.prototype.getDatosTecnicos = function() {
        return this.datosTecnicos;
    }

    Items.prototype.setDatosTecnicos = function(value) {
        this.datosTecnicos = value;
    }

    Items.prototype.getCantidadPaquetes = function() {
        return this.cantidadPaquetes;
    }

    Items.prototype.setCantidadPaquetes = function(value) {
        this.cantidadPaquetes = value;
    }

    Items.prototype.getCodigoPais = function() {
        return this.codigoPais;
    }

    Items.prototype.setCodigoPais = function(value) {
        this.codigoPais = value;
    }

    Items.prototype.getNombrePais = function() {
        return this.nombrePais;
    }

    Items.prototype.setNombrePais = function(value) {
        this.nombrePais = value;
    }

    Items.prototype.getCodigoLenguajePais = function() {
        return this.codigoLenguajePais;
    }

    Items.prototype.setCodigoLenguajePais = function(value) {
        this.codigoLenguajePais = value;
    }

    Items.prototype.getListaCaracteristicas = function() {
        return this.listaCaracteristicas;
    }

    Items.prototype.setListaCaracteristicas = function(value) {
        this.listaCaracteristicas = value;
    }

    Items.prototype.getMandatorio = function() {
        return this.mandatorio;
    }

    Items.prototype.setMandatorio = function(value) {
        this.mandatorio = value;
    }


module.exports = new Items;
