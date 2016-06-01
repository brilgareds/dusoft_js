
define(["angular", "js/models", "includes/classes/Tercero"], function(angular, models) {

    models.factory('TerceroAutorizacion', ['Tercero', function(Tercero) {

            function TerceroAutorizacion(nombre, tipoTercero, tercero) {
                Tercero.getClass().call(this, nombre, tipoTercero, tercero);
                this.nombre = nombre;
                this.tipoTercero = tipoTercero;
                this.tercero = tercero;
                this.pedidos = [];
            }

            TerceroAutorizacion.prototype = Object.create(Tercero.getClass().prototype);

            TerceroAutorizacion.prototype.pedidos = [];

            TerceroAutorizacion.prototype.agregarPedido = function(pedidos) {
                this.pedidos.push(pedidos);
            };

            TerceroAutorizacion.prototype.listarPedidos = function() {
                return this.pedidos;
            };

            TerceroAutorizacion.prototype.getTercero = function() {
                return  this.tercero;
            };

            TerceroAutorizacion.prototype.setTercero = function(tercero) {
                this.tercero = tercero;
            };

            TerceroAutorizacion.prototype.getTipoTercero = function() {
                return  this.tipoTercero;
            };

            TerceroAutorizacion.prototype.setTipoTercero = function(tipoTercero) {
                this.tipoTercero = tipoTercero;
            };

            TerceroAutorizacion.prototype.getNombre = function() {
                return  this.nombre;
            };

            TerceroAutorizacion.prototype.setNombre = function(nombre) {
                this.nombre = nombre;
            };

            TerceroAutorizacion.prototype.vaciarPedidos = function() {
                this.pedidos = [];
            };

            TerceroAutorizacion.prototype.obtenerPedidoPorPosiscion = function(posicion) {
                return this.pedidos[posicion];
            };

            this.get = function(nombre, tipoTercero, tercero) {
                return new TerceroAutorizacion(nombre, tipoTercero, tercero);
            };

            return this;

        }]);
});