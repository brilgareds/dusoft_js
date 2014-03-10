
define(["angular", "js/models"], function(angular, models) {

    models.factory('Empresa', function() {
        this.productos = [];


        this.setClientes = function() {

        }

        this.agregarProducto = function(producto) {
            this.productos.push(producto);
        }

        this.getProductos = function() {
            return this.productos;
        }

        this.vaciarProductos = function() {
            this.productos = [];
        }


        return this;

    });
});