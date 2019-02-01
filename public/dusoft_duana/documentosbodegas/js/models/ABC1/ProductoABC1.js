define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductoABC1', ["Producto", function (Producto) {

            function ProductoABC1(codigo, nombre, existencia, disponible, tipoProducto, item_id, cantidad) {

                Producto.getClass().call(this, codigo, nombre, existencia);

                this.tipoProducto = tipoProducto;
                this.cantidad = cantidad;
                this.disponible = disponible;
                this.lote = "";
                this.fecha_vencimiento = "";
                this.item_id = item_id;
                this.autorizado = true;
            }

            ProductoABC1.prototype = Object.create(Producto.getClass().prototype);

            this.get = function (codigo, nombre, existencia, disponible, tipoProducto, item_id, cantidad) {
                return new ProductoABC1(codigo, nombre, existencia, disponible, tipoProducto, item_id, cantidad);
            };

            ProductoABC1.prototype.setTipoProductoId = function (tipoProducto) {
                this.tipoProducto = tipoProducto;
            };

            ProductoABC1.prototype.getTipoProductoId = function () {
                return this.tipoProducto;
            };
            ProductoABC1.prototype.setDisponible = function (disponible) {
                this.disponible = disponible;
            };

            ProductoABC1.prototype.getDisponible = function () {
                return this.disponible;
            };

            ProductoABC1.prototype.setCantidad = function (cantidad) {
                this.cantidad = cantidad;
            };

            ProductoABC1.prototype.getCantidad = function () {
                return parseFloat(this.cantidad).toFixed();
            };

            ProductoABC1.prototype.setItemId = function (item_id) {
                this.item_id = item_id;
            };

            ProductoABC1.prototype.getItemId = function () {
                return this.item_id;
            };

            ProductoABC1.prototype.setFechaVencimiento = function (fecha_vencimiento) {
                this.fecha_vencimiento = fecha_vencimiento;
            };

            ProductoABC1.prototype.get_fecha_vencimiento = function () {
                return this.fecha_vencimiento;
            };

            ProductoABC1.prototype.setLote = function (lote) {
                this.lote = lote;
            };

            ProductoABC1.prototype.get_lote = function () {
                return this.lote;
            };



            return this;
        }]);
});