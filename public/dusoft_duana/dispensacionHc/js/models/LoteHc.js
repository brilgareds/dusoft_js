
define(["angular", "js/models", "includes/classes/Lote"], function (angular, models) {

    models.factory('LoteHc', ["Lote", function (Lote) {


            function LoteHc(codigo_lote, fecha_vencimiento, cantidad) {                           
                Lote.getClass().call(this,codigo_lote, fecha_vencimiento, cantidad); 
                
            }
            
            LoteHc.prototype = Object.create(Lote.getClass().prototype);
            
            
            this.get = function (codigo_lote, fecha_vencimiento, cantidad) {
                return new LoteHc(codigo_lote, fecha_vencimiento, cantidad);
            };

            return this;

        }]);

});