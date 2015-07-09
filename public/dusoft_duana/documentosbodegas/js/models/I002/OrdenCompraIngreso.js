
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
            
            // Observacion
            OrdenCompraIngreso.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;                
            };
            
            OrdenCompraIngreso.prototype.get_observacion = function() {
                return this.observacion;
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

            // Productos de la orden de compra
            OrdenCompraIngreso.prototype.set_productos = function(producto) {
                this.productos.push(producto);
            };
           
            OrdenCompraIngreso.prototype.get_productos = function() {
                return this.productos;
            };
            
            OrdenCompraIngreso.prototype.limpiar_productos = function() {
                this.productos = [];
            };
            
            
            // Productos Ingresados
            OrdenCompraIngreso.prototype.set_productos_ingresados = function(producto) {
                this.productos_ingresados.push(producto);
            };
           
            OrdenCompraIngreso.prototype.get_productos_ingresados = function() {
                return this.productos_ingresados;
            };
            
            OrdenCompraIngreso.prototype.limpiar_productos_ingresados = function() {
                this.productos_ingresados = [];
            };
            
            
            // Subtotal
            OrdenCompraIngreso.prototype.set_subtotal = function(subtotal) {
                this.subtotal = subtotal;
            };
           
            OrdenCompraIngreso.prototype.get_subtotal = function() {
                return this.subtotal;
            };
            
            // total_iva
            OrdenCompraIngreso.prototype.set_total_iva = function(total_iva) {
                this.total_iva = total_iva;
            };
           
            OrdenCompraIngreso.prototype.get_total_iva = function() {
                return this.total_iva;
            };
            
            
            // Retefuente
            OrdenCompraIngreso.prototype.set_retefuente = function(retefuente) {
                this.retefuente = retefuente;
            };
           
            OrdenCompraIngreso.prototype.get_retefuente = function() {
                return this.retefuente;
            };
            
            
            // Reteica
            OrdenCompraIngreso.prototype.set_reteica = function(reteica) {
                this.reteica = reteica;
            };
           
            OrdenCompraIngreso.prototype.get_reteica = function() {
                return this.reteica;
            };
            
            // Reteiva
            OrdenCompraIngreso.prototype.set_reteiva = function(reteiva) {
                this.reteiva = reteiva;
            };
           
            OrdenCompraIngreso.prototype.get_reteiva = function() {
                return this.reteiva;
            };
            
            // Cree
            OrdenCompraIngreso.prototype.set_cree = function(cree) {
                this.cree = cree;
            };
           
            OrdenCompraIngreso.prototype.get_cree = function() {
                return this.cree;
            };
            
            // Valor Total
            OrdenCompraIngreso.prototype.set_valor_total = function(valor_total) {
                this.valor_total = valor_total;
            };
           
            OrdenCompraIngreso.prototype.get_valor_total = function() {
                return this.valor_total;
            };
            
            // Fecha Registro
            OrdenCompraIngreso.prototype.get_fecha_registro = function() {
                this.fecha_registro;
            };          
            

            // Instancia
            this.get = function(numero_orden, estado, observacion, fecha_registro, observacion_contrato) {
                return new OrdenCompraIngreso(numero_orden, estado, observacion, fecha_registro, observacion_contrato);
            };

            return this;
        }]);
});