define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductoIngresoDevolucion', ["Producto", function (Producto) {

            function ProductoIngresoDevolucion(codigo, nombre, existencia, tipoProducto, lote, fecha_vencmiento, cantidad, item_id, cantidad_ingresada, novedad) {

                Producto.getClass().call(this, codigo, nombre, existencia);

                this.tipoProducto = tipoProducto;
                this.cantidad = cantidad;
                this.cantidad_ingresada = cantidad_ingresada || 0;
                this.novedad = novedad;
                this.item_id = item_id;
                this.fecha_vencimiento = fecha_vencmiento || "";
                this.lote = lote || "";
                this.autorizado = true;
            }

            ProductoIngresoDevolucion.prototype = Object.create(Producto.getClass().prototype);

            this.get = function (codigo, nombre, existencia, tipoProducto, lote, fecha_vencmiento, cantidad, item_id, cantidad_ingresada, novedad) {
                return new ProductoIngresoDevolucion(codigo, nombre, existencia, tipoProducto, lote, fecha_vencmiento, cantidad, item_id, cantidad_ingresada, novedad);
            };

            ProductoIngresoDevolucion.prototype.setTipoProductoId = function (tipoProducto) {
                this.tipoProducto = tipoProducto;
            };

            ProductoIngresoDevolucion.prototype.getTipoProductoId = function () {
                return this.tipoProducto;
            };
            
            ProductoIngresoDevolucion.prototype.getCantidadIngresada = function () {
                return this.cantidad_ingresada;
            };
            
            ProductoIngresoDevolucion.prototype.setCantidadIngresada = function (cantidad_ingresada) {
                this.cantidad_ingresada = cantidad_ingresada;
            };
            
            ProductoIngresoDevolucion.prototype.setCantidad = function (cantidad) {
                this.cantidad = cantidad;
            };

            ProductoIngresoDevolucion.prototype.getCantidad = function () {
                return parseFloat(this.cantidad).toFixed(2);
            };
            
            ProductoIngresoDevolucion.prototype.setItemId = function (item_id) {
                this.item_id = item_id;
            };

            ProductoIngresoDevolucion.prototype.getItemId = function () {
               return this.item_id;
            };
            
            ProductoIngresoDevolucion.prototype.setNovedad = function (novedad) {
                this.novedad = novedad;
            };

            ProductoIngresoDevolucion.prototype.getNovedad = function () {
               return this.novedad;
            };

            ProductoIngresoDevolucion.prototype.get_fecha_vencimiento = function () {
                return this.fecha_vencimiento;
            };
            
            ProductoIngresoDevolucion.prototype.get_lote = function() {
                return this.lote;
            };

            return this;
        }]);
});