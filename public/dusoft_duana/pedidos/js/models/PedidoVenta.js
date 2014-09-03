
define(["angular", "js/models", "includes/classes/Pedido"], function(angular, models) {

    models.factory('PedidoVenta', function(Pedido) {

        function PedidoVenta() {
            Pedido.getClass().call(this);
//            this.precio = precio;
//            this.cantidad_solicitada = cantidad_solicitada;
//            this.cantidad_separada = cantidad_ingresada;
//            this.observacion = observacion_cambio;
            
            //propiedades pendientes
//            this.existencia_lotes = "";
            
            //Objeto Lote
//            this.lote = {};
        }

        PedidoVenta.prototype = Object.create(Pedido.getClass().prototype);
        
//        ProductoPedido.prototype.setLote = function(lote) {
//            this.lote = lote;
//        }
//        
//        ProductoPedido.prototype.getLote = function() {
//            return this.lote;
//        }

        PedidoVenta.prototype.setDatos = function(datos) {
            Pedido.getClass().call(this,datos);
            this.numero_cotizacion = datos.numero_cotizacion;
            this.valor_cotizacion = datos.valor_cotizacion;
        }

        this.get = function() {
            return new PedidoVenta();
        }

        return this;
    });
});