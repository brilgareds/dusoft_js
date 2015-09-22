
define(["angular", "js/models", "includes/classes/Bodega"], function (angular, models) {

    models.factory('BodegaInduccion', ["Bodega", function (Bodega) {


            function BodegaInduccion(nombre, codigo) {
                Bodega.getClass().call(this, nombre, codigo);
                this.producto = [];
                this.productoSeleccionado;
            }
            ;

            BodegaInduccion.prototype = Object.create(Bodega.getClass().prototype);

            BodegaInduccion.prototype.setProductoSeleccionado = function (productoSeleccionado) {
                this.productoSeleccionado = productoSeleccionado;
            };

            BodegaInduccion.prototype.getProductoSeleccionado = function () {
                return this.productoSeleccionado;
            };

            BodegaInduccion.prototype.agregarProducto = function (producto) {
                this.producto.push(producto);
            };

            BodegaInduccion.prototype.getProducto = function () {
                return this.producto;
            };

            BodegaInduccion.prototype.vaciarProducto = function () {
                this.producto = [];
            }

            this.get = function (nombre, codigo) {
                return new BodegaInduccion(nombre, codigo);
            };

            return this;

        }]);

});