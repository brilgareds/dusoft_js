
define(["angular", "js/models", "includes/classes/Pedido"], function(angular, models) {

    models.factory('PedidoCliente', ["Pedido", function(Pedido) {
                    
        function PedidoCliente(empresa_id, centro_utilidad_id, bodega_id) {
            Pedido.getClass().call(this); 
            
            this.empresa_id = empresa_id || '';
            this.centro_utilidad_id = centro_utilidad_id || '';
            this.bodega_id = bodega_id || '';
            this.numero_cotizacion = 0;
            this.observacion = "";
            this.productos = [];
        };

        PedidoCliente.prototype = Object.create(Pedido.getClass().prototype);  
        
        
        // Empresa
        PedidoCliente.prototype.set_empresa_id = function(empresa_id){
            this.empresa_id = empresa_id;
            return this;
        };
        
        PedidoCliente.prototype.get_empresa_id = function(){
            return this.empresa_id ;
        };
        
        // Centro Utilidad
        PedidoCliente.prototype.set_centro_utilidad_id = function(centro_utilidad_id){
            this.centro_utilidad_id = centro_utilidad_id;
            return this;
        };
        
        PedidoCliente.prototype.get_centro_utilidad_id = function(){
            return this.centro_utilidad_id ;
        };
        
        // Bodega
        PedidoCliente.prototype.set_bodega_id = function(bodega_id){
            this.bodega_id = bodega_id;
            return this;
        };
        
        PedidoCliente.prototype.get_bodega_id = function(){
            return this.bodega_id ;
        };
        
        // Numero Cotizacion
        PedidoCliente.prototype.set_numero_cotizacion = function(numero_cotizacion){
            this.numero_cotizacion = numero_cotizacion;
            return this;
        };
        
        PedidoCliente.prototype.get_numero_cotizacion = function(){
            return this.numero_cotizacion ;
        };
        
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
        
        // Productos
        PedidoCliente.prototype.set_productos = function(producto){
            this.productos.push(producto);
            return this;
        };
        
        PedidoCliente.prototype.get_productos = function(){
            return this.productos ;
        };
        
        this.get = function(empresa_id, centro_utilidad_id, bodega_id) {
            return new PedidoCliente(empresa_id, centro_utilidad_id, bodega_id);
        };
        
        return this;
    }]);
});