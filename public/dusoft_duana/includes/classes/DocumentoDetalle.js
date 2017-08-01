define(["angular", "js/models"], function(angular, models) {

    models.factory('DocumentoDetalle', function() {

        function DocumentoDetalle(producto, cantidadDespachada, lote, fechaVencimiento) {

            this.producto = producto;
            this.cantidadDespachada = cantidadDespachada || 0;
            this.lote = lote || 0;
            this.fechaVencimiento = fechaVencimiento || 0;
            
        };
        
        DocumentoDetalle.prototype.setProducto = function(producto) {
            this.producto = producto;
            return this;
        };
        
        DocumentoDetalle.prototype.getProducto = function() {
            return this.producto;
        };

        DocumentoDetalle.prototype.setCantidadDespachada = function(cantidadDespachada) {
            this.cantidadDespachada = cantidadDespachada;
            return this;
        };

        DocumentoDetalle.prototype.getCantidadDespachada = function() {
            return this.cantidadDespachada;
        };

        DocumentoDetalle.prototype.setLote = function(lote) {
            this.lote = lote;
            return this;
        };
        

        DocumentoDetalle.prototype.getLote = function() {
            return this.lote;
        };

        DocumentoDetalle.prototype.setFechaVencimiento = function(fechaVencimiento) {
            this.fechaVencimiento = fechaVencimiento; //"EGRESO POR PRESTAMO A OTRAS ENTIDADES"
            return this;
        };
        
        
        DocumentoDetalle.prototype.getFechaVencimiento = function() {
           
            return this.fechaVencimiento;
        };
        

        this.getClass = function() {
            return DocumentoDetalle;
        };

        return this;

    });
});