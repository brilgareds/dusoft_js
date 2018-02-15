define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocumentoDevolucion', ["Documento", "$filter", function(Documento, $filter) {


            function DocumentoDevolucion(id, prefijo, numero, fecha_registro) {

                Documento.getClass().call(this, id, prefijo, numero, fecha_registro);
            }
            
            DocumentoDevolucion.prototype  = Object.create(Documento.getClass().prototype);

            
            // Observacion
            DocumentoDevolucion.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;
            };

            DocumentoDevolucion.prototype.get_observacion = function() {
                return this.observacion;
            };
            
            // Fecha Registro
            DocumentoDevolucion.prototype.set_fecha_registro = function(fecha_registro) {
                this.fecha_registro = fecha_registro;
            };

            DocumentoDevolucion.prototype.get_fecha_registro = function() {
                return this.fecha_registro;
            };

            this.get = function(id, prefijo, numero, fecha_registro) {
                return new DocumentoDevolucion(id, prefijo, numero, fecha_registro);
            };

            return this;
            
        }]);
});