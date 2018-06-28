define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductoI007', ["Producto", function (Producto) {

            function ProductoI007(codigo, nombre, tipoProducto, cantidad, porc_iva, valorU, item_id) {

                Producto.getClass().call(this, codigo, nombre);

                this.tipoProducto = tipoProducto;
                this.cantidad = cantidad;
                this.lote = "";
                this.fecha_vencimiento = "";
                this.item_id = item_id;
                this.porc_iva = porc_iva || 0;
                this.valorU = valorU;
            }

            ProductoI007.prototype = Object.create(Producto.getClass().prototype);

            this.get = function (codigo, nombre, tipoProducto, cantidad, porc_iva, valorU, item_id) {
                return new ProductoI007(codigo, nombre, tipoProducto, cantidad, porc_iva, valorU, item_id);
            };

            ProductoI007.prototype.setTipoProductoId = function (tipoProducto) {
                this.tipoProducto = tipoProducto;
            };

            ProductoI007.prototype.getTipoProductoId = function () {
                return this.tipoProducto;
            };

            ProductoI007.prototype.setCantidad = function (cantidad) {
                this.cantidad = cantidad;
            };

            ProductoI007.prototype.getCantidad = function () {
                return parseFloat(this.cantidad).toFixed();
            };

            ProductoI007.prototype.setItemId = function (item_id) {
                this.item_id = item_id;
            };

            ProductoI007.prototype.getItemId = function () {
                return this.item_id;
            };

            ProductoI007.prototype.setFechaVencimiento = function (fecha_vencimiento) {
                this.fecha_vencimiento = fecha_vencimiento;
            };

            ProductoI007.prototype.get_fecha_vencimiento = function () {
                return this.fecha_vencimiento;
            };

            ProductoI007.prototype.setLote = function (lote) {
                this.lote = lote;
            };

            ProductoI007.prototype.get_lote = function () {
                return this.lote;
            };

            ProductoI007.prototype.set_porc_iva = function (porc_iva) {
                this.porc_iva = porc_iva;
            };

            ProductoI007.prototype.get_porc_iva = function () {
                return this.porc_iva;
            };

            ProductoI007.prototype.setValorU = function (valorU) {
                this.valorU = valorU;
            };

            ProductoI007.prototype.getValorU = function () {
                return this.valorU;
            };


            return this;
        }]);
});