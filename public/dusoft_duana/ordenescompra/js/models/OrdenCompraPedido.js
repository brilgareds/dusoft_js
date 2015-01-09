
define(["angular", "js/models", "includes/classes/OrdenCompra"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('OrdenCompraPedido', ["OrdenCompra", function(OrdenCompra) {

            OrdenCompraPedido.prototype = Object.create(OrdenCompra.getClass().prototype)

            function OrdenCompraPedido(numero_orden, estado, observacion, fecha_registro, observacion_contrato) {
                OrdenCompra.getClass().call(this, numero_orden, estado, observacion, fecha_registro);
                
                this.observacion_contrato = observacion_contrato || '';
                this.productos = [];
            }
            
            // Numero de Orden
            OrdenCompraPedido.prototype.set_numero_orden = function(numero_orden) {
                this.numero_orden_compra = numero_orden ;
            };
            
            OrdenCompraPedido.prototype.get_numero_orden = function() {
                return this.numero_orden_compra;
            };
            

            // Empresa
            OrdenCompraPedido.prototype.set_empresa = function(empresa) {
                this.empresa = empresa;
            };

            OrdenCompraPedido.prototype.get_empresa = function() {
                return this.empresa;
            };

            // Proveedor
            OrdenCompraPedido.prototype.set_proveedor = function(proveedor) {
                this.proveedor = proveedor;
            };

            OrdenCompraPedido.prototype.get_proveedor = function() {
                return this.proveedor;
            };

            // Unidad de Negocio
            OrdenCompraPedido.prototype.set_unidad_negocio = function(unidad_negocio) {
                this.unidad_negocio = unidad_negocio;
            };

            OrdenCompraPedido.prototype.get_unidad_negocio = function() {
                return this.unidad_negocio;
            };

            // Usuario
            OrdenCompraPedido.prototype.set_usuario = function(usuario) {
                this.usuario = usuario;
            };

            OrdenCompraPedido.prototype.get_usuario = function() {
                return this.usuario;
            };
            
            // Observacion del contrato del proveedor
            OrdenCompraPedido.prototype.set_observacion_contrato = function(observacion) {
                this.observacion_contrato = observacion;
            };
            
            OrdenCompraPedido.prototype.get_observacion_contrato = function() {
                return this.observacion_contrato;
            };
            
            // Observacion
            OrdenCompraPedido.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;                
            };
            
            OrdenCompraPedido.prototype.get_observacion = function() {
                return this.observacion;
            };
            
            //Estado
            OrdenCompraPedido.prototype.set_estado = function(estado) {
                this.estado = estado;
            };
            OrdenCompraPedido.prototype.get_estado = function() {
                return this.estado;
            };
            
            // Descripcion estado
            OrdenCompraPedido.prototype.set_descripcion_estado = function(descripcion_estado) {
                this.descripcion_estado = descripcion_estado;
            };
            
            OrdenCompraPedido.prototype.get_descripcion_estado = function() {
                return this.descripcion_estado;
            };
            
            // Tiene Ingreso Temporal 0 => false (No tiene) , 1 => true (si tiene)
            OrdenCompraPedido.prototype.set_ingreso_temporal = function(tiene_ingreso_temporal) {
                this.tiene_ingreso_temporal = tiene_ingreso_temporal;
            };
            
            OrdenCompraPedido.prototype.get_ingreso_temporal = function() {
                return (this.tiene_ingreso_temporal === 0) ? false : true ;
            };
            
            // Estado de Digitacion Orden Compra
            OrdenCompraPedido.prototype.set_estado_digitacion = function(estado_digitacion) {
                this.estado_digitacion = estado_digitacion;
            };
            
            OrdenCompraPedido.prototype.get_estado_digitacion = function() {
                return this.estado_digitacion ;
            };

            // Productos
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

            // Instancia
            this.get = function(numero_orden, estado, observacion, fecha_registro, observacion_contrato) {
                return new OrdenCompraPedido(numero_orden, estado, observacion, fecha_registro, observacion_contrato);
            };

            return this;
        }]);
});