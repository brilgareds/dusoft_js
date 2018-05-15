define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocumentoI015', ["Documento", "$filter", function(Documento, $filter) {


            function DocumentoI015(id, prefijo, numero, fecha_registro) {

                Documento.getClass().call(this, id, prefijo, numero, fecha_registro);
            }
            
            DocumentoI015.prototype  = Object.create(Documento.getClass().prototype);

            
            // Observacion
            DocumentoI015.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;
            };

            DocumentoI015.prototype.get_observacion = function() {
                return this.observacion;
            };
            
            // Fecha Registro
            DocumentoI015.prototype.set_fecha_registro = function(fecha_registro) {
                this.fecha_registro = fecha_registro;
            };

            DocumentoI015.prototype.get_fecha_registro = function() {
                return this.fecha_registro;
            };
            
            DocumentoI015.prototype.set_bodega_origen = function(bodega) {
                this.bodega_origen = bodega;
            };

            DocumentoI015.prototype.get_bodega_origen = function() {
                return this.bodega_origen;
            };
            
            DocumentoI015.prototype.set_documento_traslado = function(documento) {
                this.documento_traslado = documento;
            };

            DocumentoI015.prototype.get_documento_traslado = function() {
                return this.documento_traslado;
            };

            // Productos
            DocumentoI015.setProductos = function (producto) {
                this.productos.push(producto);
            };

            DocumentoI015.getProductos = function () {
                return this.productos;
            };

            DocumentoI015.limpiarProductos = function () {
                this.productos = [];
            };
            
            this.get = function(id, prefijo, numero, fecha_registro) {
                return new DocumentoI015(id, prefijo, numero, fecha_registro);
            };

            return this;
            
        }]);
});