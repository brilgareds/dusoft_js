
define(["angular", "js/models"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('Lote', function() {


        //declare usermodel class
        function Lote(codigo_lote, fecha_vencimiento) {
            this.codigo_lote = codigo_lote;
            this.fecha_vencimiento = fecha_vencimiento;
        }
        
        this.getClass = function(){
            return Lote;
        }

        //just return the factory wrapper
        return this;

    });
});
