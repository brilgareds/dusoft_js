
define(["angular", "js/models", "includes/classes/Pedido"], function(angular, models) {

    models.factory('PedidoFarmacia', ["Pedido", function(Pedido) {
            
        function PedidoFarmacia() {
            Pedido.getClass().call(this);
            this.productos = [];
            this.farmaciaDestino;
            this.farmaciaOrigen;
            
        };

        PedidoFarmacia.prototype = Object.create(Pedido.getClass().prototype);

        PedidoFarmacia.setFarmaciaDestino = function(farmaciaDestino) {
            this.farmaciaDestino = farmaciaDestino;
        };
        
        PedidoFarmacia.getFarmaciaDestino = function() {
            return this.farmaciaDestino;
        };
        
        PedidoFarmacia.setFarmaciaOrigen = function(farmaciaOrigen) {
            this.farmaciaOrigen = farmaciaOrigen;
        };
        
        PedidoFarmacia.getFarmaciaOrigen = function() {
            return this.farmaciaOrigen;
        };

        PedidoFarmacia.prototype.agregarProducto = function(producto) {
            this.productos.unshift(producto);
        };

        PedidoFarmacia.prototype.obtenerProductos = function() {
            return this.productos;
        };
        
        PedidoFarmacia.prototype.eliminarProducto = function(index) {
            return this.productos.splice(index,1);
        };
        
        PedidoFarmacia.prototype.vaciarProductos = function() {
            this.productos = [];
        };
        
        
        this.get = function() {
            return new PedidoFarmacia();
        };
                
        return this;
    }]);
});