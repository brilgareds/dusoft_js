
define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('AutorizacionPedido', ['Empresa', function(Empresa) {

            function AutorizacionPedido(nombre, codigo) {
                Empresa.getClass().call(this, nombre, codigo);
            }

            AutorizacionPedido.prototype = Object.create(Empresa.getClass().prototype);

            AutorizacionPedido.prototype.pedidos = [];


            AutorizacionPedido.prototype.setClientes = function() {

            };

            AutorizacionPedido.prototype.agregarPedido = function(pedidos) {
                this.pedidos.push(pedidos);
            };

            AutorizacionPedido.prototype.getPedidos = function() {
                return this.pedidos;
            };

            AutorizacionPedido.prototype.vaciarPedidos = function() {
                this.pedidos = [];
            };

            this.get = function(nombre, codigo) {
                return new AutorizacionPedido(nombre, codigo);
            };


            return this;

        }]);
});