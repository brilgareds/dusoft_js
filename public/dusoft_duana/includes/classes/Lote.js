
define(["angular", "js/models"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('Lote', function() {


        //declare usermodel class
        function Lote(codigo_lote, fecha_vencimiento, cantidad) {
            this.codigo_lote = codigo_lote;
            this.fecha_vencimiento = fecha_vencimiento;
            this.cantidad = cantidad;
            this.cantidadNueva = 0;
            this.cantidadARestar = 0; 
        }
        
        
        Lote.prototype.getCodigo = function(){
            return this.codigo_lote;
        };
        
        Lote.prototype.setLote = function(codigoLote){
            this.codigo_lote = codigoLote;
        };
        
        Lote.prototype.getFechaVencimiento = function(){
            return this.fecha_vencimiento;
        };
        
        Lote.prototype.setFechaVencimiento = function(fechaVencimiento){
            this.fecha_vencimiento = fechaVencimiento;
        };
        
        Lote.prototype.getCantidad = function(){
            return this.cantidad;
        };
        
        Lote.prototype.setCantidad = function(cantidad){
            this.cantidad = cantidad;
        };
        
        Lote.prototype.getNuevaCantidad = function(){
            return this.cantidadNueva;
        };
        
        Lote.prototype.setNuevaCantidad = function(cantidadNueva){
            this.cantidadNueva = parseInt(cantidadNueva);
        };
        
        Lote.prototype.getCantidadARestar = function(){
            return this.cantidadARestar;
        };
        
        Lote.prototype.setCantidadARestar = function(cantidadARestar){
            this.cantidadARestar = parseInt(cantidadARestar);
        };
        
        this.get = function(codigo_lote, fecha_vencimiento, cantidad){
            return new Lote(codigo_lote, fecha_vencimiento, cantidad);
        };
        
        this.getClass = function(){
            return Lote;
        };

        //just return the factory wrapper
        return this;

    });
});
