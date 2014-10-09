
define(["angular", "js/models", "includes/classes/Pedido"], function(angular, models) {

    models.factory('PedidoVenta', ["Pedido", function(Pedido) {

        function PedidoVenta() {
            Pedido.getClass().call(this);
            this.numero_cotizacion = "";
            this.valor_cotizacion = "";
            this.lista_productos = [];
            this.tipo = 1;
        };

        PedidoVenta.prototype = Object.create(Pedido.getClass().prototype);

//        PedidoVenta.prototype.setDatos = function(datos) {
//            
//            //Pedido.getClass().call(this, numero_pedido, nombre_vandedor, fecha_registro, descripcion_estado, descripcion_estado_actual_pedido, estado_actual_pedido, estado);
//            this.numero_cotizacion = datos.numero_cotizacion;
//            this.valor_cotizacion = datos.valor_cotizacion;
//        };
        
        PedidoVenta.prototype.agregarProducto = function(producto) {
            this.lista_productos.push(producto);
        };
        
        PedidoVenta.prototype.obtenerProductos = function(producto) {
            return this.lista_productos;
        };
        
        PedidoVenta.prototype.vaciarProductos = function() {
            this.lista_productos = [];
        };
        
        PedidoVenta.prototype.setTipo = function(tipo) {
            this.tipo = tipo;
        };
        
        PedidoVenta.prototype.getTipo = function(tipo) {
            return this.tipo;
        };

        this.get = function() {
            return new PedidoVenta();
        };

        return this;
    }]);
});