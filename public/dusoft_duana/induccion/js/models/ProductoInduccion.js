
define(["angular", "js/models", "includes/classes/Producto"], function (angular, models) {

    models.factory('ProductoInduccion', ["Producto", function (Producto) {


            function ProductoInduccion(nombre, codigo) {
                Producto.getClass().call(this, nombre, codigo);
            };

            ProductoInduccion.prototype = Object.create(Producto.getClass().prototype);

            
            this.get = function (nombre, codigo) {
                return new ProductoInduccion(nombre, codigo);
            };

            return this;

        }]);

});