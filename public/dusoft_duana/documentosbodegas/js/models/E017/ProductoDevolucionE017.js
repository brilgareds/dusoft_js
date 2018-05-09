define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductoDevolucionE017', ["Producto", function (Producto) {

            function ProductoDevolucionE017(codigo, nombre, existencia, tipoProducto, subClase, lote, fecha_vencmiento, cantidad, item_id) {

                Producto.getClass().call(this, codigo, nombre, existencia);

                this.tipoProducto = tipoProducto;
                this.cantidad = cantidad;
                this.item_id = item_id;
                this.fecha_vencimiento = fecha_vencmiento || "";
                this.lote = lote || "";
                this.subClase = subClase;
                this.autorizado = true;
            }

            ProductoDevolucionE017.prototype = Object.create(Producto.getClass().prototype);

            this.get = function (codigo, nombre, existencia, tipoProducto, subClase, lote, fecha_vencmiento, cantidad, item_id) {
                return new ProductoDevolucionE017(codigo, nombre, existencia, tipoProducto, subClase, lote, fecha_vencmiento, cantidad, item_id);
            };

            ProductoDevolucionE017.prototype.setTipoProductoId = function (tipoProducto) {
                this.tipoProducto = tipoProducto;
            };

            ProductoDevolucionE017.prototype.getTipoProductoId = function () {
                return this.tipoProducto;
            };
            ProductoDevolucionE017.prototype.setNombreTipo = function (nombreTipo) {
                this.nombreTipo = nombreTipo;
            };

            ProductoDevolucionE017.prototype.getNombreTipo = function () {
                return this.nombreTipo;
            };
            
            ProductoDevolucionE017.prototype.getSubClase = function () {
                return this.subClase;
            };
            
            ProductoDevolucionE017.prototype.setSubClase = function (subClase) {
                this.subClase = subClase;
            };
            
            ProductoDevolucionE017.prototype.setCantidad = function (cantidad) {
                this.cantidad = cantidad;
            };

            ProductoDevolucionE017.prototype.getCantidad = function () {
                return parseFloat(this.cantidad).toFixed(2);
            };
            
            ProductoDevolucionE017.prototype.setItemId = function (item_id) {
                this.item_id = item_id;
            };

            ProductoDevolucionE017.prototype.getItemId = function () {
               return this.item_id;
            };

            ProductoDevolucionE017.prototype.get_fecha_vencimiento = function () {
                return this.fecha_vencimiento;
            };
            
            ProductoDevolucionE017.prototype.get_lote = function() {
                return this.lote;
            };

            return this;
        }]);
});