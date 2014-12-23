
define(["angular", "js/models", "includes/classes/Pedido"], function(angular, models) {

    models.factory('PedidoVenta', ["Pedido", function(Pedido) {
            
        //constants
        this.TIPO_CLIENTE  = 1;
        this.TIPO_FARMACIA = 2; 
       
        
        function PedidoVenta() {
            Pedido.getClass().call(this);
            this.numero_cotizacion = "";
            this.valor_cotizacion = "";
            this.lista_productos = [];
            this.tipo = 1;
            this.observacion;
            this.en_uso;
        };

        PedidoVenta.prototype = Object.create(Pedido.getClass().prototype);

//        PedidoVenta.prototype.setDatos = function(datos) {
//            
//            //Pedido.getClass().call(this, numero_pedido, nombre_vandedor, fecha_registro, descripcion_estado, descripcion_estado_actual_pedido, estado_actual_pedido, estado);
//            this.numero_cotizacion = datos.numero_cotizacion;
//            this.valor_cotizacion = datos.valor_cotizacion;
//        };
        
//        PedidoVenta.prototype.agregarProducto = function(producto) {
//            this.lista_productos.push(producto);
//        };

        PedidoVenta.prototype.agregarProducto = function(producto) {
            this.lista_productos.unshift(producto);
        };

        PedidoVenta.prototype.obtenerProductos = function() {
            return this.lista_productos;
        };
        
        PedidoVenta.prototype.eliminarProducto = function(index) {
            return this.lista_productos.splice(index,1);
        };
        
        PedidoVenta.prototype.vaciarProductos = function() {
            this.lista_productos = [];
        };
        
        PedidoVenta.prototype.setTipo = function(tipo) {
            this.tipo = tipo;
        };
        
        PedidoVenta.prototype.getTipo = function() {
            return this.tipo;
        };
        
        PedidoVenta.prototype.setObservacion = function(observacion) {
            this.observacion = observacion;
        };
        
        PedidoVenta.prototype.getObservacion = function() {
            return this.observacion;
        };
        
        PedidoVenta.prototype.setEnUso = function(en_uso) {
            this.en_uso = en_uso;
        };
        
        PedidoVenta.prototype.getEnUso = function() {
            return this.en_uso;
        };

        this.get = function() {
            return new PedidoVenta();
        };
        
        this.pedidoseleccionado = ""; //Tenerlo en cuenta para no usar rootScope y pasar valor de una vista a otra
        
        return this;
    }]);
});