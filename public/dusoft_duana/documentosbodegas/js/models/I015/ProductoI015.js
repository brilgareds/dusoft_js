define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductoI015', ["Producto", function (Producto) {

            function ProductoI015(codigo, nombre, tipoProducto, lote, fecha_vencmiento, cantidad, item_id, cantidad_ingresada) {

                Producto.getClass().call(this, codigo, nombre);

                this.tipoProducto = tipoProducto;
                this.cantidad = cantidad;
                this.cantidad_ingresada = cantidad_ingresada || 0;
                this.item_id = item_id;
                this.fecha_vencimiento = fecha_vencmiento || "";
                this.lote = lote || "";
            }

            ProductoI015.prototype = Object.create(Producto.getClass().prototype);

            this.get = function (codigo, nombre, tipoProducto, lote, fecha_vencmiento, cantidad, item_id) {
                return new ProductoI015(codigo, nombre, tipoProducto, lote, fecha_vencmiento, cantidad, item_id);
            };

            ProductoI015.prototype.setTipoProductoId = function (tipoProducto) {
                this.tipoProducto = tipoProducto;
            };

            ProductoI015.prototype.getTipoProductoId = function () {
                return this.tipoProducto;
            };

            ProductoI015.prototype.setCantidad = function (cantidad) {
                this.cantidad = cantidad;
            };

            ProductoI015.prototype.getCantidad = function () {
                return parseFloat(this.cantidad).toFixed(2);
            };

            ProductoI015.prototype.getCantidadIngresada = function () {
                return this.cantidad_ingresada;
            };

            ProductoI015.prototype.setCantidadIngresada = function (cantidad_ingresada) {
                this.cantidad_ingresada = cantidad_ingresada;
            };

            ProductoI015.prototype.setItemId = function (item_id) {
                this.item_id = item_id;
            };

            ProductoI015.prototype.getItemId = function () {
                return this.item_id;
            };

            ProductoI015.prototype.get_fecha_vencimiento = function () {
                return this.fecha_vencimiento;
            };

            ProductoI015.prototype.get_lote = function () {
                return this.lote;
            };

            ProductoI015.prototype.setItemIdCompra = function (itemIdCompra) {
                this.itemIdCompra = itemIdCompra;
            };

            ProductoI015.prototype.getItemIdCompra = function () {
                return this.itemIdCompra;
            };

            return this;
        }]);
});