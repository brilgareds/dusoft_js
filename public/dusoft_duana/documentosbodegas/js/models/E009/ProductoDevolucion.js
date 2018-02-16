define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductoDevolucion', ["Producto", function (Producto) {

            function ProductoDevolucion(codigo, nombre, existencia, tipoProducto, subClase, lote, fecha_vencmiento, cantidad, item_id) {

                Producto.getClass().call(this, codigo, nombre, existencia);

                this.tipoProducto = tipoProducto;
                this.cantidad = cantidad;
                this.item_id = item_id;
                this.fecha_vencimiento = fecha_vencmiento || "";
                this.lote = lote || "";
                this.subClase = subClase;
                this.autorizado = true;
            }

            ProductoDevolucion.prototype = Object.create(Producto.getClass().prototype);

            this.get = function (codigo, nombre, existencia, tipoProducto, subClase, lote, fecha_vencmiento, cantidad, item_id) {
                return new ProductoDevolucion(codigo, nombre, existencia, tipoProducto, subClase, lote, fecha_vencmiento, cantidad, item_id);
            };

            ProductoDevolucion.prototype.setTipoProductoId = function (tipoProducto) {
                this.tipoProducto = tipoProducto;
            };

            ProductoDevolucion.prototype.getTipoProductoId = function () {
                return this.tipoProducto;
            };
            
            ProductoDevolucion.prototype.getSubClase = function () {
                return this.subClase;
            };
            
            ProductoDevolucion.prototype.setSubClase = function (subClase) {
                this.subClase = subClase;
            };
            
            ProductoDevolucion.prototype.setCantidad = function (cantidad) {
                this.cantidad = cantidad;
            };

            ProductoDevolucion.prototype.getCantidad = function () {
                return parseFloat(this.cantidad).toFixed(2);
            };
            
            ProductoDevolucion.prototype.setItemId = function (item_id) {
                this.item_id = item_id;
            };

            ProductoDevolucion.prototype.getItemId = function () {
               return this.item_id;
            };

            ProductoDevolucion.prototype.get_fecha_vencimiento = function () {
                return this.fecha_vencimiento;
            };
            
            ProductoDevolucion.prototype.get_lote = function() {
                return this.lote;
            };

            return this;
        }]);
});