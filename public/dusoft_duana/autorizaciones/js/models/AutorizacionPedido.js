
define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('AutorizacionPedido', ['Empresa', function(Empresa) {

            function AutorizacionPedido(nombre, codigo) {
                Empresa.getClass().call(this, nombre, codigo);
            }

            AutorizacionPedido.prototype = Object.create(Empresa.getClass().prototype);

            AutorizacionPedido.prototype.pedidos = [];


            AutorizacionPedido.prototype.getCliente = function() {
                return this.cliente;
            };

            AutorizacionPedido.prototype.setCliente = function(cliente) {
                this.cliente = cliente;
                return this;
            };

            AutorizacionPedido.prototype.getCliente = function() {
                return this.cliente;
            };

            AutorizacionPedido.prototype.setCliente = function(cliente) {
                this.cliente = cliente;
                return this;
            };

            //pedido
            AutorizacionPedido.prototype.agregarPedido = function(Pedidos) {
                this.empresa.push(Pedidos);
            };

            AutorizacionPedido.prototype.getPedido = function() {
                return this.Pedidos;
            };

            AutorizacionPedido.prototype.vaciarPedido = function() {
                this.Pedidos = [];
            };
            //
            //producto
            AutorizacionPedido.prototype.agregarProducto = function(producto) {
                this.productos.push(producto);
            };

            AutorizacionPedido.prototype.getProductos = function() {
                return this.productos;
            };

            AutorizacionPedido.prototype.vaciarProductos = function() {
                this.productos = [];
            };
            //
            //empresa cliente
            AutorizacionPedido.prototype.agregarEmpresa = function(empresa) {
                this.empresa.push(empresa);
            };

            AutorizacionPedido.prototype.getEmpresa = function() {
                return this.empresa;
            };

            AutorizacionPedido.prototype.vaciarEmpresa = function() {
                this.empresa = [];
            };
            //
            //usuario
            AutorizacionPedido.prototype.agregarUsuario = function(usuario) {
                this.empresa.push(usuario);
            };

            AutorizacionPedido.prototype.getUsuario = function() {
                return this.usuario;
            };

            AutorizacionPedido.prototype.vaciarUsuario = function() {
                this.usuario = [];
            };
            //




            this.get = function(nombre, codigo) {
                return new AutorizacionPedido(nombre, codigo);
            };


            return this;

        }]);
});