
define(["angular", "js/models", "includes/classes/Pedido"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('PedidoAuditoria', ["Pedido", function(Pedido) {


        //declare usermodel class
        function PedidoAuditoria() {
            this.cliente;
            this.farmacia;
            this.productos = [];
            this.tipo = 1;
            this.TIPO_CLIENTE  = 1;
            this.TIPO_FARMACIA = 2;
            
            this.tiempoSeparacion = 0;
            this.farmaciaId;
        }

         PedidoAuditoria.prototype = Object.create(Pedido.getClass().prototype);

        // Pedidos
        
        PedidoAuditoria.prototype.agregarProducto = function(producto, validar_existencia) {
            
            if(validar_existencia){ 
                for(var i in this.productos){
                    var _producto = this.productos[i];
                    
                    if(_producto.codigo_producto === producto.codigo_producto){
                        return false;
                    }
                }                
            }
            
            this.productos.push(producto);
        };

        PedidoAuditoria.prototype.setTipo = function(tipo) {
            this.tipo = tipo;
        };
        
        PedidoAuditoria.prototype.getProductos = function() {
            return this.productos;
        };
        
        
        PedidoAuditoria.prototype.setProductos = function(productos) {
            this.productos = productos;
        };
        
        PedidoAuditoria.prototype.vaciarProductos = function() {
            this.productos = [];
        };
        
        PedidoAuditoria.prototype.setTiempoSeparacion = function(tiempoSeparacion) {
            this.tiempoSeparacion = tiempoSeparacion;
            return this;
        };
        
        PedidoAuditoria.prototype.getTiempoSeparacion = function() {
            return this.tiempoSeparacion;
        };
        
        
        PedidoAuditoria.prototype.setFarmaciaId = function(farmaciaId) {
            this.farmaciaId = farmaciaId;
            return this;
        };
        
        PedidoAuditoria.prototype.getFarmaciaId = function() {
            return this.farmaciaId;
        };
        
        
        PedidoAuditoria.prototype.setProductos = function(productos) {
            this.productos = productos;
            return this;
        };
        
        PedidoAuditoria.prototype.getProductos = function() {
            return this.productos;
        };
        
        PedidoAuditoria.prototype.setCliente = function(cliente) {
            this.cliente = cliente;
            return this;
        };
        
        PedidoAuditoria.prototype.getCliente = function() {
            return this.cliente;
        };
        
        //we return new instance of usermodel class  because factory is a singleton and we dont need like that
        this.get = function() {
            return new PedidoAuditoria();
        };

        //just return the factory wrapper
        return this;

    }]);
});