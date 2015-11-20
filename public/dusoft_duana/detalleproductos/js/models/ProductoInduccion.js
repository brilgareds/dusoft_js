
define(["angular", "js/models", "includes/classes/Producto"], function(angular, models) {

    models.factory('ProductoInduccions', ["Producto", function(Producto) {


            function ProductoInduccions(codigo_producto, descripcion, existencia) {
                Producto.getClass().call(this, codigo_producto, descripcion, existencia);

                this.iva = null;
                this.costo = null;
                this.precio_venta = null;

            };

            ProductoInduccions.prototype = Object.create(Producto.getClass().prototype);

            ProductoInduccions.prototype.setIva = function(iva) {
                this.iva = iva;
                return this;
            };

            ProductoInduccions.prototype.getIva = function() {
                return this.iva;
            };


            ProductoInduccions.prototype.setCosto = function(costo) {
                this.costo = costo;
                return this;
            };

            ProductoInduccions.prototype.getCosto = function() {
                return this.costo;
            };

            ProductoInduccions.prototype.setPrecioVenta = function(precio_venta) {
                this.precio_venta = precio_venta;
                return this;
            };

            ProductoInduccions.prototype.getPrecioVenta = function() {
                return this.precio_venta;
            };


            this.get = function(codigo_producto, descripcion, existencia) {
                return new ProductoInduccions(codigo_producto, descripcion, existencia);
            };



            return this;

        }]);
});