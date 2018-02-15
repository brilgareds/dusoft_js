define(["angular", "js/models"], function (angular, models) {

    models.factory('Devolucion', [function () {

            function Devolucion(bodega, observacion) {
                this.bodega = bodega;
                this.observacion = observacion;
                this.productos = [];
            }

            this.get = function (bodega, observacion) {
                return new Devolucion(bodega, observacion);
            };

            Devolucion.prototype.setBodega = function (bodega) {
                this.bodega = bodega;
            };

            Devolucion.prototype.getBodega = function () {
                return this.bodega;
            };

            Devolucion.prototype.setObservacion = function (observacion) {
                this.observacion = observacion;
            };

            Devolucion.prototype.getObservacion = function () {
                return this.observacion;
            };

            // Productos
            Devolucion.setProductos = function (producto) {
                this.productos.push(producto);
            };

            Devolucion.getProductos = function () {
                return this.productos;
            };

            Devolucion.limpiarProductos = function () {
                this.productos = [];
            };

            return this;
        }]);
});