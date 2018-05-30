define(["angular", "js/models", "includes/classes/DocumentoDetalle"], function(angular, models) {

    models.factory('DocumentoDetalleConsumo',["DocumentoDetalle", function(DocumentoDetalle) {

        function DocumentoDetalleConsumo(producto, cantidadDespachada, lote, fechaVencimiento, prefijo ,facturaFiscal) {
            DocumentoDetalle.getClass().call(this, producto, cantidadDespachada, lote, fechaVencimiento);
            this.prefijo = prefijo;
            this.facturaFiscal = facturaFiscal;
        };
        
        DocumentoDetalleConsumo.prototype.setPrefijo = function(prefijo){
            this.prefijo = prefijo;
        };
            
        DocumentoDetalleConsumo.prototype.getPrefijo = function(){
            return this.prefijo;
        };
        
        DocumentoDetalleConsumo.prototype.setFacturaFiscal = function(facturaFiscal){
            this.facturaFiscal = facturaFiscal;
        };
            
        DocumentoDetalleConsumo.prototype.getFacturaFiscal = function(){
            return this.facturaFiscal;
        };
        
        DocumentoDetalleConsumo.prototype = Object.create(DocumentoDetalle.getClass().prototype);
        
        this.get = function(producto, cantidadDespachada, lote, fechaVencimiento, prefijo ,facturaFiscal){
            return new DocumentoDetalleConsumo(producto, cantidadDespachada, lote, fechaVencimiento, prefijo ,facturaFiscal)
        };
        
        return this;

    }]);
});