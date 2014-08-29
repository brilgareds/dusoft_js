
define(["angular", "js/models", "includes/classes/Producto"], function(angular, models) {

    models.factory('Producto', function() {

        function Producto(codigo, nombre, existencia, precio) {
            Producto.getClass().call(this,codigo,nombre, existencia);
            this.precio = precio;

        }

        Producto.prototype = Object.create(Producto.getClass().prototype);

        this.get = function(codigo, nombre, existencia, precio) {
            return new Producto(codigo, nombre, existencia, precio);
        }

        return this;
    });
});