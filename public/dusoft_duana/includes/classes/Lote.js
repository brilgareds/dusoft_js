
define(["angular", "js/models"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('Lote', function() {


        //declare usermodel class
        function Lote(codigo_lote, fecha_vencimiento) {
            this.codigo_lote = codigo_lote;
            this.fecha_vencimiento = fecha_vencimiento;
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
        
        this.getClass = function(){
            return Lote;
        };

        //just return the factory wrapper
        return this;

    });
});
