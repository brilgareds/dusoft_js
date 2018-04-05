define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('FacturaDevolucion', ["Documento", "$filter", function(Documento, $filter) {


            function FacturaDevolucion(id, prefijo, numero, fecha_registro) {

                Documento.getClass().call(this, id, prefijo, numero, fecha_registro);
            }
            
            FacturaDevolucion.prototype  = Object.create(Documento.getClass().prototype);

            
            // Observacion
            FacturaDevolucion.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;
            };

            FacturaDevolucion.prototype.get_observacion = function() {
                return this.observacion;
            };
            
            FacturaDevolucion.prototype.set_bodega = function(bodega) {
                this.bodega = bodega;
            };

            FacturaDevolucion.prototype.get_bodega = function() {
                return this.bodega;
            };
            
            FacturaDevolucion.prototype.setFacturaDevolucion = function(factura) {
                this.facturaDevolucion = factura;
            };

            FacturaDevolucion.prototype.getFacturaDevolucion = function() {
                return this.facturaDevolucion;
            };

            // Productos
            FacturaDevolucion.setProductos = function (producto) {
                this.productos.push(producto);
            };

            FacturaDevolucion.getProductos = function () {
                return this.productos;
            };

            FacturaDevolucion.limpiarProductos = function () {
                this.productos = [];
            };
            
            this.get = function(id, prefijo, numero, fecha_registro) {
                return new FacturaDevolucion(id, prefijo, numero, fecha_registro);
            };

            return this;
            
        }]);
});