define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocumentoIngreso', ["Documento", "$filter", function(Documento, $filter) {


            function DocumentoIngreso(id, prefijo, numero, fecha_registro) {

                Documento.getClass().call(this, id, prefijo, numero, fecha_registro);
            }
            
            DocumentoIngreso.prototype  = Object.create(Documento.getClass().prototype);

            // Proveedor
            DocumentoIngreso.prototype.set_proveedor = function(proveedor) {
                this.proveedor = proveedor;
            };

            DocumentoIngreso.prototype.get_proveedor = function() {
                return this.proveedor;
            };            
            
            // Orden de Compra 
            DocumentoIngreso.prototype.set_orden_compra = function(orden_compra) {
                this.orden_compra = orden_compra;
            };

            DocumentoIngreso.prototype.get_orden_compra = function() {
                return this.orden_compra;
            };
            
            // Observacion
            DocumentoIngreso.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;
            };

            DocumentoIngreso.prototype.get_observacion = function() {
                return this.observacion;
            };
            
            // Fecha Registro
            DocumentoIngreso.prototype.set_fecha_registro = function(fecha_registro) {
                this.fecha_registro = fecha_registro;
            };

            DocumentoIngreso.prototype.get_fecha_registro = function() {
                return this.fecha_registro;
            };

            this.get = function(id, prefijo, numero, fecha_registro) {
                return new DocumentoIngreso(id, prefijo, numero, fecha_registro);
            };

            return this;
            
        }]);
});