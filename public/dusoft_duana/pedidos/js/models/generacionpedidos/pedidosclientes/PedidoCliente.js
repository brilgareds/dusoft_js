
define(["angular", "js/models", "includes/classes/Pedido"], function(angular, models) {

    models.factory('PedidoCliente', ["Pedido", function(Pedido) {
                    
        function PedidoCliente() {
            Pedido.getClass().call(this); 
            
            this.observacion = "";
        };

        PedidoCliente.prototype = Object.create(Pedido.getClass().prototype);  
        
        
        // Vendedor
        PedidoCliente.prototype.set_vendedor = function(vendedor){
            this.vendedor = vendedor;
            return this;
        };
        
        PedidoCliente.prototype.get_vendedor = function(){
            return this.vendedor ;
        };
        
        // Observacion
        PedidoCliente.prototype.set_observacion = function(observacion){
            this.observacion = observacion;
            return this;
        };
        
        PedidoCliente.prototype.get_observacion = function(){
            return this.observacion ;
        };
        
        this.get = function() {
            return new PedidoCliente();
        };
        
        return this;
    }]);
});