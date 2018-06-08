define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductoE007', ["Producto", function (Producto) {

            function ProductoE007(codigo, nombre, existencia, disponible, tipoProducto, item_id, cantidad) {

                Producto.getClass().call(this, codigo, nombre, existencia);

                this.tipoProducto = tipoProducto;
                this.cantidad = cantidad;
                this.disponible = disponible;
                this.lote = "";
                this.fecha_vencimiento = "";
                this.item_id = item_id;
                this.autorizado = true;
            }

            ProductoE007.prototype = Object.create(Producto.getClass().prototype);

            this.get = function (codigo, nombre, existencia, disponible, tipoProducto, item_id, cantidad) {
                return new ProductoE007(codigo, nombre, existencia, disponible, tipoProducto, item_id, cantidad);
            };

            ProductoE007.prototype.setTipoProductoId = function (tipoProducto) {
                this.tipoProducto = tipoProducto;
            };

            ProductoE007.prototype.getTipoProductoId = function () {
                return this.tipoProducto;
            };
            ProductoE007.prototype.setDisponible = function (disponible) {
                this.disponible = disponible;
            };

            ProductoE007.prototype.getDisponible = function () {
                return this.disponible;
            };

            ProductoE007.prototype.setCantidad = function (cantidad) {
                this.cantidad = cantidad;
            };

            ProductoE007.prototype.getCantidad = function () {
                return parseFloat(this.cantidad).toFixed();
            };

            ProductoE007.prototype.setItemId = function (item_id) {
                this.item_id = item_id;
            };

            ProductoE007.prototype.getItemId = function () {
                return this.item_id;
            };

            ProductoE007.prototype.setFechaVencimiento = function (fecha_vencimiento) {
                this.fecha_vencimiento = fecha_vencimiento;
            };

            ProductoE007.prototype.get_fecha_vencimiento = function () {
                return this.fecha_vencimiento;
            };

            ProductoE007.prototype.setLote = function (lote) {
                this.lote = lote;
            };

            ProductoE007.prototype.get_lote = function () {
                return this.lote;
            };



            return this;
        }]);
});