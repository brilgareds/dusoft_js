define(["angular", "js/models", "includes/classes/Producto"], function(angular, models) {

    models.factory('ProductoAutorizacion', ["Producto", function(Producto) {

            function ProductoAutorizacion(codigo, nombre, cantidad) {
                Producto.getClass().call(this, codigo, nombre, null);
                this.cantidad = cantidad || "";
                this.estado = "";
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
            
            ProductoAutorizacion.prototype.setEstado = function(estado) {
                this.estado = estado;
            };

            ProductoAutorizacion.prototype.getEstado = function() {
                return this.estado;
            };

            // autorizacion array
            ProductoAutorizacion.prototype.getAutorizacion = function() {
                return this.autorizacion;
            };

            ProductoAutorizacion.prototype.setAutorizacion = function(autorizacion) {
                this.autorizacion.push(autorizacion);
            };

            ProductoAutorizacion.prototype.obtenerProductoPorPosiscion = function(posicion) {
                return this.autorizacion[posicion];
            };

            return this;
        }]);
});