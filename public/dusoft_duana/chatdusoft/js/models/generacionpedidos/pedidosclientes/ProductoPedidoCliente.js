define(["angular", "js/models", "includes/classes/Producto"], function(angular, models) {

    models.factory('ProductoPedidoCliente', ["Producto", function(Producto) {

            function ProductoPedidoCliente(codigo, nombre, existencia, iva, tipo_producto, estado) {

                Producto.getClass().call(this, codigo, nombre, existencia);
                
                this.codigo_cum = "";
                this.codigo_invima = "";
                this.fecha_vencimiento_invima = "";
                this.iva = iva || 0;
                this.precio_regulado = 0;
                this.precio_venta = 0;
                this.cantidad_disponible = 0;
                this.cantidad_solicitada = '';
                this.estado = estado || '0';
                this.tipo_producto = tipo_producto || 0;
                this.descripcion_tipo_producto = "";
                this.valor_total_sin_iva = 0;
                this.valor_iva = 0;
                this.valor_total_con_iva = 0;
                this.cantidad_inicial = 0;
                this.precioVentaIva = 0;
                this.cantidadPendiente = 0;
                this.cantidadPendienteDespachar = 0;
            }

            ProductoPedidoCliente.prototype = Object.create(Producto.getClass().prototype);

            this.get = function(codigo, nombre, existencia, iva, tipo_producto, estado) {
                return new ProductoPedidoCliente(codigo, nombre, existencia, iva, tipo_producto, estado);
            };
            
            // cantidad pendiente despachar
            ProductoPedidoCliente.prototype.setCantidadPendienteDespachar = function(cantidadPendienteDespachar) {
                this.cantidadPendienteDespachar = cantidadPendienteDespachar;
                return this;
            };
            
            // cantidad pendiente despachar
            ProductoPedidoCliente.prototype.getCantidadPendienteDespachar = function() {               
                return this.cantidadPendienteDespachar;
            };
            
            
            
            
            
            
            // cantidad pendiente
            ProductoPedidoCliente.prototype.setCantidadPendiente = function(cantidadPendiente) {
                this.cantidadPendiente = cantidadPendiente;
                return this;
            };
            
            // cantidad pendiente
            ProductoPedidoCliente.prototype.getCantidadPendiente = function() {               
                return this.cantidadPendiente;
            };
            
            // precio_venta_iva
            ProductoPedidoCliente.prototype.setPrecioVentaIva = function(precioVentaIva) {
                this.precioVentaIva = precioVentaIva;
                return this;
            };

            ProductoPedidoCliente.prototype.getPrecioVentaIva = function() {
                return this.precioVentaIva;
            };
            
            
            
            // Codigo CUM
            ProductoPedidoCliente.prototype.set_codigo_cum = function(codigo_cum) {
                this.codigo_cum = codigo_cum;
                return this;
            };

            ProductoPedidoCliente.prototype.get_codigo_cum = function() {
                return this.codigo_cum;
            };

            // Codigo Invima
            ProductoPedidoCliente.prototype.set_codigo_invima = function(codigo_invima) {
                this.codigo_invima = codigo_invima;
                return this;
            };

            ProductoPedidoCliente.prototype.get_codigo_invima = function() {
                return this.codigo_invima;
            };

            // Fecha Vencimiento Invima
            ProductoPedidoCliente.prototype.set_fecha_vencimiento_invima = function(fecha_vencimiento_invima) {
                this.fecha_vencimiento_invima = fecha_vencimiento_invima;
                return this;
            };

            ProductoPedidoCliente.prototype.get_fecha_vencimiento_invima = function() {
                return this.fecha_vencimiento_invima;
            };

            // IVA
            ProductoPedidoCliente.prototype.set_iva = function(iva) {
                this.iva = iva;
                return this;
            };

            ProductoPedidoCliente.prototype.get_iva = function() {
                return this.iva;
            };

            // Existencia
            ProductoPedidoCliente.prototype.set_existencia = function(existencia) {
                this.existencia = existencia;
                return this;
            };

            ProductoPedidoCliente.prototype.get_existencia = function() {
                return this.existencia;
            };

            // Precio Regulado
            ProductoPedidoCliente.prototype.set_regulado = function(sw_regulado) {
                this.sw_regulado = sw_regulado;
                return this;
            };
            
            ProductoPedidoCliente.prototype.set_precio_regulado = function(precio_regulado) {
                this.precio_regulado = precio_regulado;
                return this;
            };

            ProductoPedidoCliente.prototype.es_regulado = function() {
                return (this.sw_regulado === '0') ? false : true;
            };

            ProductoPedidoCliente.prototype.get_precio_regulado = function() {
                return this.precio_regulado;
            };

            // Precio Venta
            ProductoPedidoCliente.prototype.set_pactado = function(sw_pactado) {
                this.sw_pactado = sw_pactado;
                return this;
            };
            
            ProductoPedidoCliente.prototype.set_precio_venta = function(precio_venta) {
                this.precio_venta = precio_venta;
                return this;
            };

            ProductoPedidoCliente.prototype.es_pactado = function() {
                return this.sw_pactado;
            };
            
            ProductoPedidoCliente.prototype.get_precio_venta = function() {
                return this.precio_venta;
            };

            // Cantidad Disponible
            ProductoPedidoCliente.prototype.set_cantidad_disponible = function(cantidad_disponible) {
                this.cantidad_disponible = cantidad_disponible;
                return this;
            };

            ProductoPedidoCliente.prototype.get_cantidad_disponible = function() {
                return this.cantidad_disponible;
            };

            // Cantidad Solicitada
            ProductoPedidoCliente.prototype.set_cantidad_solicitada = function(cantidad_solicitada) {
                this.cantidad_solicitada = cantidad_solicitada;
                return this;
            };

            ProductoPedidoCliente.prototype.get_cantidad_solicitada = function() {
                return this.cantidad_solicitada;
            };
            
            
             // Cantidad Inicial
            ProductoPedidoCliente.prototype.set_cantidad_inicial = function(cantidad_inicial) {
                this.cantidad_inicial = cantidad_inicial;
                return this;
            };
            // Obteniendo Cantidad inicial
            ProductoPedidoCliente.prototype.get_cantidad_inicial = function() {
                return this.cantidad_inicial;
            };
            
            

            // Estado
            ProductoPedidoCliente.prototype.set_estado = function(estado) {
                this.estado = estado;
                return this;
            };

            ProductoPedidoCliente.prototype.get_estado = function() {
                return this.estado;
            };

            // Tipo Producto
            ProductoPedidoCliente.prototype.set_tipo_producto = function(tipo_producto) {
                this.tipo_producto = tipo_producto;
                return this;
            };

            ProductoPedidoCliente.prototype.get_tipo_producto = function() {
                return this.tipo_producto;
            };

            // Descripcion Tipo Producto
            ProductoPedidoCliente.prototype.set_descripcion_tipo_producto = function(descripcion) {
                this.descripcion_tipo_producto = descripcion;
                return this;
            };

            ProductoPedidoCliente.prototype.get_descripcion_tipo_producto = function() {
                return this.descripcion_tipo_producto;
            };
            
            ProductoPedidoCliente.prototype.get_abreviacion_tipo_producto = function() {
                
                if(this.tipo_producto === '1')
                    return "N"; // Normales
                if(this.tipo_producto === '2')
                    return "A"; // Alto Costo
                if(this.tipo_producto === '3')
                    return "C"; // Controlados
                if(this.tipo_producto === '4')
                    return "I"; // Insumos
                if(this.tipo_producto === '5')
                    return "Ne";// Neveras                 
            };

            // Valor Total Sin IVA - > Subtotal
            ProductoPedidoCliente.prototype.set_valor_total_sin_iva = function(valor_total_sin_iva) {
                this.valor_total_sin_iva = valor_total_sin_iva;
                return this;
            };

            ProductoPedidoCliente.prototype.get_valor_total_sin_iva = function() {
                return this.valor_total_sin_iva;
            };
            
            
            // Valor IVA 
            ProductoPedidoCliente.prototype.set_valor_iva = function(valor_iva) {
                this.valor_iva = valor_iva;
                return this;
            };

            ProductoPedidoCliente.prototype.get_valor_iva = function() {
                return this.valor_iva;
            };

            // Valor Total Con IVA
            ProductoPedidoCliente.prototype.set_valor_total_con_iva = function(valor_total_con_iva) {
                this.valor_total_con_iva = valor_total_con_iva;
                return this;
            };

            ProductoPedidoCliente.prototype.get_valor_total_con_iva = function() {
                return this.valor_total_con_iva;
            };

            return this;
        }]);
});