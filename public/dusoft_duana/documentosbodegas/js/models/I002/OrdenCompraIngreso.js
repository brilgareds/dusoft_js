
define(["angular", "js/models", "includes/classes/OrdenCompra"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('OrdenCompraIngreso', ["OrdenCompra", function(OrdenCompra) {

            OrdenCompraIngreso.prototype = Object.create(OrdenCompra.getClass().prototype)

            function OrdenCompraIngreso(numero_orden, estado, observacion, fecha_registro, observacion_contrato) {
                OrdenCompra.getClass().call(this, numero_orden, estado, observacion, fecha_registro);
                
                this.observacion_contrato = observacion_contrato || '';
                this.fecha_ingreso = '';
                this.productos = [];
            }
            
            // Numero de Orden
            OrdenCompraIngreso.prototype.set_numero_orden = function(numero_orden) {       
                this.numero_orden_compra = numero_orden ;    
            };
            
            OrdenCompraIngreso.prototype.get_numero_orden = function() {
                return this.numero_orden_compra;
            };
            

            // Empresa
            OrdenCompraIngreso.prototype.set_empresa = function(empresa) {
                this.empresa = empresa;
            };

            OrdenCompraIngreso.prototype.get_empresa = function() {
                return this.empresa;
            };

            // Proveedor
            OrdenCompraIngreso.prototype.set_proveedor = function(proveedor) {
                this.proveedor = proveedor;
            };

            OrdenCompraIngreso.prototype.get_proveedor = function() {
                return this.proveedor;
            };

            // Unidad de Negocio
            OrdenCompraIngreso.prototype.set_unidad_negocio = function(unidad_negocio) {
                this.unidad_negocio = unidad_negocio;
            };

            OrdenCompraIngreso.prototype.get_unidad_negocio = function() {
                return this.unidad_negocio;
            };

            // Usuario
            OrdenCompraIngreso.prototype.set_usuario = function(usuario) {
                this.usuario = usuario;
            };

            OrdenCompraIngreso.prototype.get_usuario = function() {
                return this.usuario;
            };
            
            // Observacion del contrato del proveedor
            OrdenCompraIngreso.prototype.set_observacion_contrato = function(observacion) {
                this.observacion_contrato = observacion;
            };
            
            OrdenCompraIngreso.prototype.get_observacion_contrato = function() {
                return this.observacion_contrato;
            };
            
            // Observacion
            OrdenCompraIngreso.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;                
            };
            
            OrdenCompraIngreso.prototype.get_observacion = function() {
                return this.observacion;
            };
            
            //Estado
            OrdenCompraIngreso.prototype.set_estado = function(estado) {
                this.estado = estado;
            };
            OrdenCompraIngreso.prototype.get_estado = function() {
                return this.estado;
            };
            
            // Descripcion estado
            OrdenCompraIngreso.prototype.set_descripcion_estado = function(descripcion_estado) {
                this.descripcion_estado = descripcion_estado;
            };
            
            OrdenCompraIngreso.prototype.get_descripcion_estado = function() {
                return this.descripcion_estado;
            };
            
            // Tiene Ingreso Temporal 0 => false (No tiene) , 1 => true (si tiene)
            OrdenCompraIngreso.prototype.set_ingreso_temporal = function(tiene_ingreso_temporal) {
                this.tiene_ingreso_temporal = tiene_ingreso_temporal;
            };
            
            OrdenCompraIngreso.prototype.get_ingreso_temporal = function() {
                return (this.tiene_ingreso_temporal === 0) ? false : true ;
            };
            
            // Estado de Digitacion Orden Compra
            OrdenCompraIngreso.prototype.set_estado_digitacion = function(sw_estado_digitacion, descripcion_estado_digitacion) {
                this.sw_estado_digitacion = sw_estado_digitacion;
                this.estado_digitacion = descripcion_estado_digitacion;
            };
            
            OrdenCompraIngreso.prototype.get_sw_estado_digitacion = function() {
                return this.sw_estado_digitacion ;
            };
            
            OrdenCompraIngreso.prototype.get_estado_digitacion = function() {
                return this.estado_digitacion ;
            };

            // Productos
            OrdenCompraIngreso.prototype.set_productos = function(producto) {
                this.productos.push(producto);
            };
            
            OrdenCompraIngreso.prototype.get_producto = function(codigo_producto) {
                var producto = $filter('filter')(this.get_productos(), {codigo_producto: codigo_producto}, true);

                return (producto.length > 0) ? producto[0] : {};
            };

            OrdenCompraIngreso.prototype.get_productos = function() {
                return this.productos;
            };
            
            OrdenCompraIngreso.prototype.limpiar_productos = function() {
                this.productos = [];
            };
            
            // Fechas recibido y verificacion 
            OrdenCompraIngreso.prototype.set_fechas_recepcion = function(fecha_recibido, fecha_verificacion) {
                this.fecha_recibido = fecha_recibido;
                this.fecha_verificacion = fecha_verificacion;
            };
            
            OrdenCompraIngreso.prototype.get_fecha_recibida = function() {
                return this.fecha_recibido;
            };
            
            OrdenCompraIngreso.prototype.get_fecha_verificacion = function() {
                this.fecha_verificacion;
            };

            // Instancia
            this.get = function(numero_orden, estado, observacion, fecha_registro, observacion_contrato) {
                return new OrdenCompraIngreso(numero_orden, estado, observacion, fecha_registro, observacion_contrato);
            };

            return this;
        }]);
});