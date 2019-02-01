define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductoAAC1', ["Producto", function (Producto) {

            function ProductoAAC1(codigo, nombre, existencia, disponible, tipoProducto, item_id, cantidad) {

                Producto.getClass().call(this, codigo, nombre, existencia);

                this.tipoProducto = tipoProducto;
                this.cantidad = cantidad;
                this.disponible = disponible;
                this.lote = "";
                this.fecha_vencimiento = "";
                this.item_id = item_id;
                this.autorizado = true;
            }

            ProductoAAC1.prototype = Object.create(Producto.getClass().prototype);

            this.get = function (codigo, nombre, existencia, disponible, tipoProducto, item_id, cantidad) {
                return new ProductoAAC1(codigo, nombre, existencia, disponible, tipoProducto, item_id, cantidad);
            };

            ProductoAAC1.prototype.setTipoProductoId = function (tipoProducto) {
                this.tipoProducto = tipoProducto;
            };

            ProductoAAC1.prototype.getTipoProductoId = function () {
                return this.tipoProducto;
            };
            ProductoAAC1.prototype.setDisponible = function (disponible) {
                this.disponible = disponible;
            };

            ProductoAAC1.prototype.getDisponible = function () {
                return this.disponible;
            };

            ProductoAAC1.prototype.setCantidad = function (cantidad) {
                this.cantidad = cantidad;
            };

            ProductoAAC1.prototype.getCantidad = function () {
                return parseFloat(this.cantidad).toFixed();
            };

            ProductoAAC1.prototype.setItemId = function (item_id) {
                this.item_id = item_id;
            };

            ProductoAAC1.prototype.getItemId = function () {
                return this.item_id;
            };

            ProductoAAC1.prototype.setFechaVencimiento = function (fecha_vencimiento) {
                this.fecha_vencimiento = fecha_vencimiento;
            };

            ProductoAAC1.prototype.get_fecha_vencimiento = function () {
                return this.fecha_vencimiento;
            };

            ProductoAAC1.prototype.setLote = function (lote) {
                this.lote = lote;
            };

            ProductoAAC1.prototype.get_lote = function () {
                return this.lote;
            };



            return this;
        }]);
});