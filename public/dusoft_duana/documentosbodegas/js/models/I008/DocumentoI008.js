define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocumentoI008', ["Documento", "$filter", function(Documento, $filter) {


            function DocumentoI008(id, prefijo, numero, fecha_registro) {

                Documento.getClass().call(this, id, prefijo, numero, fecha_registro);
            }
            
            DocumentoI008.prototype  = Object.create(Documento.getClass().prototype);

            
            // Observacion
            DocumentoI008.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;
            };

            DocumentoI008.prototype.get_observacion = function() {
                return this.observacion;
            };
            
            // Fecha Registro
            DocumentoI008.prototype.set_fecha_registro = function(fecha_registro) {
                this.fecha_registro = fecha_registro;
            };

            DocumentoI008.prototype.get_fecha_registro = function() {
                return this.fecha_registro;
            };
            
            DocumentoI008.prototype.set_bodega_origen = function(bodega) {
                this.bodega_origen = bodega;
            };

            DocumentoI008.prototype.get_bodega_origen = function() {
                return this.bodega_origen;
            };
            
            DocumentoI008.prototype.set_documento_traslado = function(documento) {
                this.documento_traslado = documento;
            };

            DocumentoI008.prototype.get_documento_traslado = function() {
                return this.documento_traslado;
            };

            // Productos
            DocumentoI008.setProductos = function (producto) {
                this.productos.push(producto);
            };

            DocumentoI008.getProductos = function () {
                return this.productos;
            };

            DocumentoI008.limpiarProductos = function () {
                this.productos = [];
            };
            
            this.get = function(id, prefijo, numero, fecha_registro) {
                return new DocumentoI008(id, prefijo, numero, fecha_registro);
            };

            return this;
            
        }]);
});