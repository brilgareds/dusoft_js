define(["angular", "js/models"], function(angular, models) {

    models.factory('DocumentoDetalle', function() {

        function DocumentoDetalle(producto, cantidadDespachada, lote, fechaVencimiento) {
            this.id = 0;
            this.producto = producto;
            this.cantidadDespachada = cantidadDespachada || 0;
            this.lote = lote || 0;
            this.fechaVencimiento = fechaVencimiento || 0;
            this.cantidadNueva = 0;
            this.valorUnitario = 0;
            this.porcIva = 0;
            this.cantidadTmpDespachada = 0;
            this.cantidadPendientePorFacturar = 0;
            this.estadoEntrega = 0;
            this.descripcionProducto = '';
            this.porcIvaTotal = 0;
        };
        
        DocumentoDetalle.prototype.setPorcIvaTotal = function(porcIvaTotal) {
            this.porcIvaTotal = porcIvaTotal;
            return this;
        };
        
        DocumentoDetalle.prototype.getPorcIvaTotal = function() {
            return this.porcIvaTotal;
        };
        
        
        DocumentoDetalle.prototype.setId = function(id) {
            this.id = id;
            return this;
        };
        
        DocumentoDetalle.prototype.getId = function() {
            return this.id;
        };
        
        DocumentoDetalle.prototype.setDescripcionProducto = function(descripcionProducto) {
            this.descripcionProducto = descripcionProducto;
            return this;
        };
        
        DocumentoDetalle.prototype.getDescripcionProducto = function() {
            return this.descripcionProducto;
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
        
        
        DocumentoDetalle.prototype.setCantidadPendientePorFacturar = function(cantidadPendientePorFacturar) {
            this.cantidadPendientePorFacturar = cantidadPendientePorFacturar; //"EGRESO POR PRESTAMO A OTRAS ENTIDADES"
            return this;
        };       
        
        DocumentoDetalle.prototype.getCantidadPendientePorFacturar = function() {           
            return this.cantidadPendientePorFacturar;
        };
        
        
        DocumentoDetalle.prototype.setEstadoEntrega = function(estadoEntrega) {
            this.estadoEntrega = estadoEntrega;  
            return this;
        };       
        
        DocumentoDetalle.prototype.getEstadoEntrega = function() {           
            return this.estadoEntrega;
        };

        this.getClass = function() {
            return DocumentoDetalle;
        };

        return this;

    });
});