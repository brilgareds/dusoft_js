
define(["angular", "js/models", "includes/classes/Lote"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('LoteProductoPedido', function(Lote) {


        //declare usermodel class
        function LoteProductoPedido(codigo_lote, fecha_vencimiento) {
            Lote.getClass().call(this,codigo_lote, fecha_vencimiento);
            this.existencia_actual = 0;
            this.disponible = 0;
            this.item_id = 0;
            this.cantidad_ingresada =  0;
        }

        LoteProductoPedido.prototype = Object.create(Lote.getClass().prototype);

        //we return new instance of usermodel class  because factory is a singleton and we dont need like that
        this.get = function(codigo_lote, fecha_vencimiento) {
            return new LoteProductoPedido(codigo_lote, fecha_vencimiento);
        };

        //just return the factory wrapper
        return this;

    });
});
