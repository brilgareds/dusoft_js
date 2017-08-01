define(["angular", "js/models", "includes/classes/DocumentoDetalle"], function(angular, models) {

    models.factory('DocumentoDetalleConsumo',["DocumentoDetalle", function(DocumentoDetalle) {

        function DocumentoDetalleConsumo(producto, cantidadDespachada, lote, fechaVencimiento) {
            DocumentoDetalle.getClass().call(this, producto, cantidadDespachada, lote, fechaVencimiento);
        };
        
        DocumentoDetalleConsumo.prototype = Object.create(DocumentoDetalle.getClass().prototype);
        
        this.get = function(producto, cantidadDespachada, lote, fechaVencimiento){
            return new DocumentoDetalleConsumo(producto, cantidadDespachada, lote, fechaVencimiento)
        };

        return this;

    }]);
});