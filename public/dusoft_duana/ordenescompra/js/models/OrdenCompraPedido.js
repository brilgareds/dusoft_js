
define(["angular", "js/models", "includes/classes/OrdenCompra"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('OrdenCompraPedido', ["OrdenCompra", function(OrdenCompra) {

            OrdenCompraPedido.prototype = Object.create(OrdenCompra.getClass().prototype)

            function OrdenCompraPedido(numero_orden, estado, observacion, fecha_registro) {
                OrdenCompra.getClass().call(this, numero_orden, estado, observacion, fecha_registro);
            }

            OrdenCompraPedido.prototype.set_empresa = function(empresa) {
                this.empresa = empresa;
            };
            
            OrdenCompraPedido.prototype.get_empresa = function() {
                return this.empresa;
            };
            
            OrdenCompraPedido.prototype.set_proveedor = function(proveedor) {
                this.proveedor = proveedor;
            };
            
            OrdenCompraPedido.prototype.get_proveedor = function() {
                return this.proveedor;
            };
            
            OrdenCompraPedido.prototype.set_unidad_negocio = function(unidad_negocio) {
                this.unidad_negocio = unidad_negocio;
            };
            
            OrdenCompraPedido.prototype.get_unidad_negocio = function() {
                return this.unidad_negocio;
            };
                        
            OrdenCompraPedido.prototype.set_usuario = function(usuario) {
                this.usuario = usuario;
            };
            
            OrdenCompraPedido.prototype.get_usuario = function() {
                return this.usuario;
            };


            this.get = function(numero_orden, estado, observacion, fecha_registro) {
                return new OrdenCompraPedido(numero_orden, estado, observacion, fecha_registro);
            };

            return this;
        }]);
});