
define(["angular", "js/models", "includes/classes/Pedido"], function(angular, models) {

    models.factory('PedidoAutorizacion', ["Pedido", function(Pedido) {

            function PedidoAutorizacion() {
                this.productos = [];
            }

            PedidoAutorizacion.prototype = Object.create(Pedido.getClass().prototype);

            PedidoAutorizacion.prototype.getFechasolicitud = function() {
                return this.fechaSolicitud;
            };

            PedidoAutorizacion.prototype.setFechaSolicitud = function(fechaSolicitud) {
                this.fechaSolicitud = fechaSolicitud;
            };

            PedidoAutorizacion.prototype.getTipoPedido = function() {
                return this.tipoPedido;
            };

            PedidoAutorizacion.prototype.setTipoPedido = function(tipoPedido) {
                this.tipoPedido = tipoPedido;
            };

            PedidoAutorizacion.prototype.getPorAprobar = function() {
                return this.porAprobar;
            };

            PedidoAutorizacion.prototype.setPorAprobar = function(porAprobar) {
                this.porAprobar = porAprobar;
            };

            PedidoAutorizacion.prototype.setBoolPorAprobar = function(porAprobar) {
                this.porAprobar = porAprobar;
                if (this.porAprobar > 0) {
                    this.porAprobarBool = true;
                } else {
                    this.porAprobarBool = false;
                }
            };

            PedidoAutorizacion.prototype.getBoolPorAprobar = function() {
                return this.porAprobarBool;
            };

            PedidoAutorizacion.prototype.getTercero = function() {
                return this.tercero;
            };

            PedidoAutorizacion.prototype.setTercero = function(tercero) {
                this.tercero = tercero;
            };

            PedidoAutorizacion.prototype.getProductos = function() {
                return this.productos;
            };

            PedidoAutorizacion.prototype.setProductos = function(productos) {
                this.productos.push(productos);
            };

            this.get = function(pedidoId) {
                return new PedidoAutorizacion(pedidoId);
            };

            return this;

        }]);
});
