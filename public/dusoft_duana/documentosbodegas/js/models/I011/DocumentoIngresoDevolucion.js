define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocumentoIngresoDevolucion', ["Documento", "$filter", function(Documento, $filter) {


            function DocumentoIngresoDevolucion(id, prefijo, numero, fecha_registro) {

                Documento.getClass().call(this, id, prefijo, numero, fecha_registro);
            }
            
            DocumentoIngresoDevolucion.prototype  = Object.create(Documento.getClass().prototype);

            
            // Observacion
            DocumentoIngresoDevolucion.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;
            };

            DocumentoIngresoDevolucion.prototype.get_observacion = function() {
                return this.observacion;
            };
            
            DocumentoIngresoDevolucion.prototype.set_bodega = function(bodega) {
                this.bodega = bodega;
            };

            DocumentoIngresoDevolucion.prototype.get_bodega = function() {
                return this.bodega;
            };
            
            DocumentoIngresoDevolucion.prototype.setDocumentoDevolucion = function(documento) {
                this.documentoDevolucion = documento;
            };

            DocumentoIngresoDevolucion.prototype.getDocumentoDevolucion = function() {
                return this.documentoDevolucion;
            };

            // Productos
            DocumentoIngresoDevolucion.setProductos = function (producto) {
                this.productos.push(producto);
            };

            DocumentoIngresoDevolucion.getProductos = function () {
                return this.productos;
            };

            DocumentoIngresoDevolucion.limpiarProductos = function () {
                this.productos = [];
            };
            
            this.get = function(id, prefijo, numero, fecha_registro) {
                return new DocumentoIngresoDevolucion(id, prefijo, numero, fecha_registro);
            };

            return this;
            
        }]);
});