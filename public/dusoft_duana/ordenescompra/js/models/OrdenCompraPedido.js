
define(["angular", "js/models", "includes/classes/OrdenCompra"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('OrdenCompraPedido', ["OrdenCompra", function(OrdenCompra) {

            OrdenCompraPedido.prototype = Object.create(OrdenCompra.getClass().prototype)

            function OrdenCompraPedido(numero_orden, estado, observacion, fecha_registro) {
                OrdenCompra.getClass().call(this, numero_orden, estado, observacion, fecha_registro);
            }

            OrdenCompraPedido.prototype.setEmpresa = function(empresa) {
                this.empresa = empresa;
            };
            
            OrdenCompraPedido.prototype.getEmpresa = function() {
                return this.empresa;
            };
            
            OrdenCompraPedido.prototype.setProveedor = function(proveedor) {
                this.proveedor = proveedor;
            };
            
            OrdenCompraPedido.prototype.getProveedor = function() {
                return this.proveedor;
            };
            
            OrdenCompraPedido.prototype.setUnidadNegocio = function(unidad_negocio) {
                this.unidad_negocio = unidad_negocio;
            };
            
            OrdenCompraPedido.prototype.getUnidadNegocio = function() {
                return this.unidad_negocio;
            };
            
            
            OrdenCompraPedido.prototype.setUsuario = function(usuario) {
                this.usuario = usuario;
            };
            
            OrdenCompraPedido.prototype.getUsuario = function() {
                return this.usuario;
            };


            this.get = function(numero_orden, estado, observacion, fecha_registro) {
                return new OrdenCompraPedido(numero_orden, estado, observacion, fecha_registro);
            };

            return this;
        }]);
});