
define(["angular", "js/models", "includes/classes/Pedido"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('PedidoAuditoria', function(Pedido) {


        //declare usermodel class
        function PedidoAuditoria() {
            this.cliente;
            this.farmacia;
            this.productos = [];
        }

         PedidoAuditoria.prototype = Object.create(Pedido.getClass().prototype)

        // Pedidos
        
        PedidoAuditoria.prototype.agregarProducto = function(productos) {
            this.productos.push(productos);
        };
        
        PedidoAuditoria.prototype.getProductos = function() {
            return this.productos;
        }
        
        PedidoAuditoria.prototype.vaciarProductos = function() {
            this.productos = [];
        };

        //we return new instance of usermodel class  because factory is a singleton and we dont need like that
        this.get = function() {
            return new PedidoAuditoria();
        };

        //just return the factory wrapper
        return this;

    });
});