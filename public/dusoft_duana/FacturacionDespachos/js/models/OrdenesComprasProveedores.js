
define(["angular", "js/models", "includes/classes/OrdenCompra"], function(angular, models) {


    //declare usermodel wrapper 'factory'
    models.factory('OrdenesComprasProveedores', ["OrdenCompra", function(OrdenCompra) {

            OrdenesComprasProveedores.prototype = Object.create(OrdenCompra.getClass().prototype)

            function OrdenesComprasProveedores(numero_orden, estado, observacion, fecha_registro, observacion_contrato) {
                OrdenCompra.getClass().call(this, numero_orden, estado, observacion, fecha_registro);
                
                this.observacion_contrato = observacion_contrato || '';
                this.fechaIngreso = '';
                this.productos = [];
                this.productoSeleccionado = '';
                this.localizacion = '';
                this.bodegaSeleccionada;
                this.nombreBodega = "";
            }
            

            // Empresa
            OrdenesComprasProveedores.prototype.set_empresa = function(empresa) {
                this.empresa = empresa;
            };

            OrdenesComprasProveedores.prototype.get_empresa = function() {
                return this.empresa;
            };

            // Proveedor
            OrdenesComprasProveedores.prototype.set_proveedor = function(proveedor) {
                this.proveedor = proveedor;
            };

            OrdenesComprasProveedores.prototype.get_proveedor = function() {
                return this.proveedor;
            };

            // Unidad de Negocio
            OrdenesComprasProveedores.prototype.set_unidad_negocio = function(unidad_negocio) {
                this.unidad_negocio = unidad_negocio;
            };

            OrdenesComprasProveedores.prototype.get_unidad_negocio = function() {
                return this.unidad_negocio;
            };

            // Usuario
            OrdenesComprasProveedores.prototype.set_usuario = function(usuario) {
                this.usuario = usuario;
            };

            OrdenesComprasProveedores.prototype.get_usuario = function() {
                return this.usuario;
            };
            
            // sw_unificada
            OrdenesComprasProveedores.prototype.set_sw_unificada = function(sw_unificada) {
                this.sw_unificada = sw_unificada;
            };

            OrdenesComprasProveedores.prototype.get_sw_unificada = function() {
                return this.sw_unificada;
            };
            
            // sw_orden_compra_finalizada
            OrdenesComprasProveedores.prototype.set_sw_orden_compra_finalizada= function(sw_orden_compra_finalizada) {
                this.sw_orden_compra_finalizada = sw_orden_compra_finalizada;
            };

            OrdenesComprasProveedores.prototype.get_sw_orden_compra_finalizada = function() {
                return this.sw_orden_compra_finalizada;
            };
            
            // nombre_proveedor//
            OrdenesComprasProveedores.prototype.set_nombre_proveedor= function(nombre_proveedor) {
                this.nombre_proveedor = nombre_proveedor;
            };

            OrdenesComprasProveedores.prototype.get_nombre_proveedor = function() {
                return this.nombre_proveedor;
            };
            // nombre_usuario//
            OrdenesComprasProveedores.prototype.set_nombre_usuario= function(nombre_usuario) {
                this.nombre_usuario = nombre_usuario;
            };

            OrdenesComprasProveedores.prototype.get_nombre_usuario = function() {
                return this.nombre_usuario;
            };
            
            // Observacion del contrato del proveedor
            OrdenesComprasProveedores.prototype.set_observacion_contrato = function(observacion) {
                this.observacion_contrato = observacion;
            };
            
            OrdenesComprasProveedores.prototype.get_observacion_contrato = function() {
                return this.observacion_contrato;
            };
            
            // Observacion
            OrdenesComprasProveedores.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;                
            };
            
            OrdenesComprasProveedores.prototype.get_observacion = function() {
                return this.observacion;
            };
            
            //Estado
            OrdenesComprasProveedores.prototype.set_estado = function(estado) {
                this.estado = estado;
            };
            OrdenesComprasProveedores.prototype.get_estado = function() {
                return this.estado;
            };
            
            // Descripcion estado
            OrdenesComprasProveedores.prototype.set_descripcion_estado = function(descripcion_estado) {
                this.descripcion_estado = descripcion_estado;
            };
            
            OrdenesComprasProveedores.prototype.get_descripcion_estado = function() {
                return this.descripcion_estado;
            };
            
            // prefijo
            OrdenesComprasProveedores.prototype.set_prefijo = function(prefijo) {
                this.prefijo = prefijo;
            };
            
            OrdenesComprasProveedores.prototype.get_prefijo = function() {
                return this.prefijo;
            };
            // numero
            OrdenesComprasProveedores.prototype.set_numero = function(numero) {
                this.numero = numero;
            };
            
            OrdenesComprasProveedores.prototype.get_numero = function() {
                return this.numero;
            };
            
            // recepcion_parcial_id
            OrdenesComprasProveedores.prototype.set_recepcion_parcial = function(recepcion_parcial) {
                this.recepcion_parcial = recepcion_parcial;
            };
            
            OrdenesComprasProveedores.prototype.get_recepcion_parcial = function() {
                return this.recepcion_parcial;
            };
            
            
            // Fechas recibido y verificacion 
            OrdenesComprasProveedores.prototype.set_fechas_recepcion = function(fecha_recibido, fecha_verificacion) {
                this.fecha_recibido = fecha_recibido;
                this.fecha_verificacion = fecha_verificacion;
            };
            
            OrdenesComprasProveedores.prototype.get_fecha_recibida = function() {
                return this.fecha_recibido;
            };
            
            OrdenesComprasProveedores.prototype.get_fecha_verificacion = function() {
                this.fecha_verificacion;
            };
            
            // Instancia
            this.get = function(numero_orden, estado, observacion, fecha_registro, observacion_contrato) {
                return new OrdenesComprasProveedores(numero_orden, estado, observacion, fecha_registro, observacion_contrato);
            };

            return this;
        }]);
});