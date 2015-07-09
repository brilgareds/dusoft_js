define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocumentoIngreso', ["Documento" , "$filter", function(Documento, $filter) {

            var DocumentoIngreso = Object.create(Documento.getClass().prototype);

            
            // Orden de Compra
            DocumentoIngreso.set_orden_compra = function(orden_compra) {
                this.orden_compra = orden_compra;
            };

            DocumentoIngreso.get_orden_compra = function() {
                return this.orden_compra;
            };

            return DocumentoIngreso;
        }]);
});