define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductoI008', ["Producto", function (Producto) {

            function ProductoI008(codigo, nombre, tipoProducto, lote, fecha_vencmiento, cantidad, item_id, cantidad_ingresada) {

                Producto.getClass().call(this, codigo, nombre);

                this.tipoProducto = tipoProducto;
                this.cantidad = cantidad;
                this.cantidad_ingresada = cantidad_ingresada || 0;
                this.total_costo = 0;
                this.item_id = item_id;
                this.fecha_vencimiento = fecha_vencmiento || "";
                this.lote = lote || "";
            }

            ProductoI008.prototype = Object.create(Producto.getClass().prototype);

            this.get = function (codigo, nombre, tipoProducto, lote, fecha_vencmiento, cantidad, item_id) {
                return new ProductoI008(codigo, nombre, tipoProducto, lote, fecha_vencmiento, cantidad, item_id);
            };

            ProductoI008.prototype.setTipoProductoId = function (tipoProducto) {
                this.tipoProducto = tipoProducto;
            };

            ProductoI008.prototype.getTipoProductoId = function () {
                return this.tipoProducto;
            };

            ProductoI008.prototype.setCantidad = function (cantidad) {
                this.cantidad = cantidad;
            };

            ProductoI008.prototype.getCantidad = function () {
                return parseFloat(this.cantidad).toFixed(2);
            };

            ProductoI008.prototype.getCantidadIngresada = function () {
                return this.cantidad_ingresada;
            };

            ProductoI008.prototype.setCantidadIngresada = function (cantidad_ingresada) {
                this.cantidad_ingresada = cantidad_ingresada;
            };

            ProductoI008.prototype.getTotalCosto = function () {
                return this.total_costo;
            };

            ProductoI008.prototype.setTotalCosto = function (total_costo) {
                this.total_costo = total_costo;
            };

            ProductoI008.prototype.setItemId = function (item_id) {
                this.item_id = item_id;
            };

            ProductoI008.prototype.getItemId = function () {
                return this.item_id;
            };

            ProductoI008.prototype.get_fecha_vencimiento = function () {
                return this.fecha_vencimiento;
            };

            ProductoI008.prototype.get_lote = function () {
                return this.lote;
            };

            ProductoI008.prototype.setItemIdCompra = function (itemIdCompra) {
                this.itemIdCompra = itemIdCompra;
            };

            ProductoI008.prototype.getItemIdCompra = function () {
                return this.itemIdCompra;
            };

            return this;
        }]);
});