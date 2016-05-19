define(["angular", "js/models", "includes/classes/Producto"], function(angular, models) {

    models.factory('ProductoAutorizacion', ["Producto", function(Producto) {

            function ProductoAutorizacion(codigo, nombre, cantidad) {
                Producto.getClass().call(this, codigo, nombre, null);
                this.cantida = cantidad || "";
                this.autorizacion = [];
            }

            ProductoAutorizacion.prototype = Object.create(Producto.getClass().prototype);

            this.get = function(codigo, nombre, existencia) {
                return new ProductoAutorizacion(codigo, nombre, existencia);
            };

            ProductoAutorizacion.prototype.setCantidad = function(cantidad) {
                this.cantidad = cantidad;
            };

            ProductoAutorizacion.prototype.getCantidad = function() {
                return this.cantidad;
            };

            // autorizacion array
            ProductoAutorizacion.prototype.getAutorizacion = function() {
                return this.autorizacion;
            };

            ProductoAutorizacion.prototype.setAutorizacion = function(autorizacion) {
                this.autorizacion.push(autorizacion);
            };

            return this;
        }]);
});