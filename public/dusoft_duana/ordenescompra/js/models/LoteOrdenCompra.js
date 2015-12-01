
define(["angular", "js/models", "includes/classes/Lote"], function(angular, models) {


    models.factory('LoteOrdenCompra', ["Lote", function(Lote) {


        function LoteOrdenCompra(codigo_lote, fecha_vencimiento) {
            Lote.getClass().call(this,codigo_lote, fecha_vencimiento);
        }

        LoteOrdenCompra.prototype = Object.create(Lote.getClass().prototype);
        
        //we return new instance of usermodel class  because factory is a singleton and we dont need like that
        this.get = function(codigo_lote, fecha_vencimiento) {
            return new LoteOrdenCompra(codigo_lote, fecha_vencimiento);
        };

        //just return the factory wrapper
        return this;

    }]);
});
