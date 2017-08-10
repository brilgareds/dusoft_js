define(["angular", "js/models"], function(angular, models) {

    models.factory('DocumentoDetalle', function() {

        function DocumentoDetalle(producto, cantidadDespachada, lote, fechaVencimiento) {

            this.producto = producto;
            this.cantidadDespachada = cantidadDespachada || 0;
            this.lote = lote || 0;
            this.fechaVencimiento = fechaVencimiento || 0;
            this.cantidadNueva = 0;
            this.valorUnitario = 0;
            this.porcIva = 0;
            this.cantidadTmpDespachada = 0;
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
        
        DocumentoDetalle.prototype.setCantidadNueva = function(cantidadNueva) {
            this.cantidadNueva = cantidadNueva;
            return this;
        };

        DocumentoDetalle.prototype.getCantidadNueva = function() {
            return this.cantidadNueva;
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
        
        DocumentoDetalle.prototype.setValorUnitario = function(valorUnitario) {
            this.valorUnitario = valorUnitario; //"EGRESO POR PRESTAMO A OTRAS ENTIDADES"
            return this;
        };       
        
        DocumentoDetalle.prototype.getValorUnitario = function() {           
            return this.valorUnitario;
        };
        
        DocumentoDetalle.prototype.setPorcIva = function(porcIva) {
            this.porcIva = porcIva; //"EGRESO POR PRESTAMO A OTRAS ENTIDADES"
            return this;
        };       
        
        DocumentoDetalle.prototype.getPorcIva = function() {           
            return this.porcIva;
        };
        
        
        
        DocumentoDetalle.prototype.setCantidadTmpDespachada = function(cantidadTmpDespachada) {
            this.cantidadTmpDespachada = cantidadTmpDespachada; //"EGRESO POR PRESTAMO A OTRAS ENTIDADES"
            return this;
        };       
        
        DocumentoDetalle.prototype.getCantidadTmpDespachada = function() {           
            return this.cantidadTmpDespachada;
        };

        this.getClass = function() {
            return DocumentoDetalle;
        };

        return this;

    });
});