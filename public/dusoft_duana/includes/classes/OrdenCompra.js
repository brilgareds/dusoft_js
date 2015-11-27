define(["angular", "js/models"], function(angular, models) {

    models.factory('OrdenCompra', function() {
 
        function OrdenCompra(numero_orden_compra, estado, observacion, fecha_registro) {
            
            this.numero_orden_compra = numero_orden_compra;
            this.estado = estado || "";
            this.observacion = observacion || "";
            this.fecha_registro = fecha_registro || "";
            
        };

        this.get = function(numero_orden_compra, estado, observacion, fecha_registro) {
            return new OrdenCompra(numero_orden_compra, estado, observacion, fecha_registro);
        };
        
        OrdenCompra.prototype.set_numero_orden = function(numero_orden) {       
            this.numero_orden_compra = numero_orden ;  
            return this;
        };

        OrdenCompra.prototype.get_numero_orden = function() {
            return this.numero_orden_compra;
        };
        
        
        OrdenCompra.prototype.setEstado = function(estado) {       
            this.estado = estado ;  
            return this;
        };

        OrdenCompra.prototype.getEstado = function() {
            return this.estado;
        };
        
        OrdenCompra.prototype.setObservacion = function(observacion) {       
            this.observacion = observacion ;  
            return this;
        };

        OrdenCompra.prototype.getObservacion = function() {
            return this.observacion;
        };
        
        OrdenCompra.prototype.setFechaRegistro = function(fecha_registro) {       
            this.fecha_registro = fecha_registro ;  
            return this;
        };

        OrdenCompra.prototype.getFechaRegistro = function() {
            return this.fecha_registro;
        };
        
        
        this.getClass = function(){
            return OrdenCompra;
        };

        return this;

    });
});