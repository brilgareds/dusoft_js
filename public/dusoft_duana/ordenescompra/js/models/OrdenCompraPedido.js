
define(["angular", "js/models", "includes/classes/OrdenCompra"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('OrdenCompraPedido', ["OrdenCompra", function(OrdenCompra) {

            OrdenCompraPedido.prototype = Object.create(OrdenCompra.getClass().prototype)

            function OrdenCompraPedido(numero_orden, estado, observacion, fecha_registro) {
                OrdenCompra.getClass().call(this, numero_orden, estado, observacion, fecha_registro);
                
                this.productos = [];
            }
            
            
            OrdenCompraPedido.prototype.set_numero_orden = function(numero_orden) {
                this.numero_orden_compra = numero_orden ;
            };
            
            OrdenCompraPedido.prototype.get_numero_orden = function() {
                return this.numero_orden_compra;
            };
            

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
            
            OrdenCompraPedido.prototype.get_observacion = function() {
                return this.observacion;
            };

            OrdenCompraPedido.prototype.set_productos = function(producto) {
                this.productos.push(producto);
            };

            OrdenCompraPedido.prototype.get_producto = function(codigo_producto) {
                var producto = $filter('filter')(this.get_productos(), {codigo_producto: codigo_producto}, true);

                return (producto.length > 0) ? producto[0] : {};
            };

            OrdenCompraPedido.prototype.get_productos = function() {
                return this.productos;
            };
            
            OrdenCompraPedido.prototype.limpiar_productos = function() {
                this.productos = [];
            };


            this.get = function(numero_orden, estado, observacion, fecha_registro) {
                return new OrdenCompraPedido(numero_orden, estado, observacion, fecha_registro);
            };

            return this;
        }]);
});