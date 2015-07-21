
define(["angular", "js/models", "includes/classes/Pedido"], function(angular, models) {

    models.factory('PedidoCliente', ["Pedido", function(Pedido) {
                    
        function PedidoCliente() {
            Pedido.getClass().call(this);            
        };

        PedidoCliente.prototype = Object.create(Pedido.getClass().prototype);        
        
        return this;
    }]);
});