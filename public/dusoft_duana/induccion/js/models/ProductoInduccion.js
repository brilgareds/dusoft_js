
define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductoInduccion', ["Producto", function (Producto) {

            function ProductoInduccion(codigo_producto, descripcion, existencia) {
                Producto.getClass().call(this, codigo_producto, descripcion, existencia);
                this.producto = [];
                this.productoSeleccionado;
            }
            ;

            ProductoInduccion.prototype = Object.create(Producto.getClass().prototype);
            
            this.get = function (nombre, codigo) {
                return new ProductoInduccion(nombre, codigo);
            };

            return this;
        }]);

});