define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocDevolucion', ["Documento", "$filter", function(Documento, $filter) {


            function DocDevolucion(id, prefijo, numero, fecha_registro) {

                Documento.getClass().call(this, id, prefijo, numero, fecha_registro);
            }
            
            DocDevolucion.prototype  = Object.create(Documento.getClass().prototype);

            
            // Observacion
            DocDevolucion.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;
            };

            DocDevolucion.prototype.get_observacion = function() {
                return this.observacion;
            };
            
            // Fecha Registro
            DocDevolucion.prototype.set_fecha_registro = function(fecha_registro) {
                this.fecha_registro = fecha_registro;
            };

            DocDevolucion.prototype.get_fecha_registro = function() {
                return this.fecha_registro;
            };
            
            DocDevolucion.prototype.set_bodega_destino = function(bodega) {
                this.bodega_destino = bodega;
            };

            DocDevolucion.prototype.get_bodega_destino = function() {
                return this.bodega_destino;
            };

            // Productos
            DocDevolucion.setProductos = function (producto) {
                this.productos.push(producto);
            };

            DocDevolucion.getProductos = function () {
                return this.productos;
            };

            DocDevolucion.limpiarProductos = function () {
                this.productos = [];
            };
            
            this.get = function(id, prefijo, numero, fecha_registro) {
                return new DocDevolucion(id, prefijo, numero, fecha_registro);
            };

            return this;
            
        }]);
});