
define(["angular", "js/models", "includes/classes/Producto"], function(angular, models) {

    models.factory('ProductoInduccion', ["Producto", function(Producto) {


            function ProductoInduccion(codigo_producto, descripcion, existencia) {
                Producto.getClass().call(this, codigo_producto, descripcion, existencia);

                this.iva = null;
                this.costo = null;
                this.precio_venta = null;

            };

            ProductoInduccion.prototype = Object.create(Producto.getClass().prototype);

            ProductoInduccion.prototype.setIva = function(iva) {
                this.iva = iva;
                return this;
            };

            ProductoInduccion.prototype.getIva = function() {
                return this.iva;
            };


            ProductoInduccion.prototype.setCosto = function(costo) {
                this.costo = costo;
                return this;
            };

            ProductoInduccion.prototype.getCosto = function() {
                return this.costo;
            };

            ProductoInduccion.prototype.setPrecioVenta = function(precio_venta) {
                this.precio_venta = precio_venta;
                return this;
            };

            ProductoInduccion.prototype.getPrecioVenta = function() {
                return this.precio_venta;
            };


            this.get = function(codigo_producto, descripcion, existencia) {
                return new ProductoInduccion(codigo_producto, descripcion, existencia);
            };



            return this;

        }]);
});