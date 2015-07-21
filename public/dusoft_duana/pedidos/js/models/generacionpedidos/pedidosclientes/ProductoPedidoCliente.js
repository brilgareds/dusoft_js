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
                this.cantidad_solicitada = 0;
                this.estado = true || estado;
                this.tipo_producto = 0 || tipo_producto;
                this.valor_total_sin_iva = 0;
                this.valor_total_con_iva = 0;                
            }

            ProductoPedidoCliente.prototype = Object.create(Producto.getClass().prototype);

            this.get = function(codigo, nombre, existencia, iva, tipo_producto, estado) {
                return new ProductoPedidoCliente(codigo, nombre, existencia, iva, tipo_producto, estado);
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
            
            // Precio Regulado
            ProductoPedidoCliente.prototype.set_precio_regulado = function(precio_regulado) {
                this.precio_regulado = precio_regulado;
                return this;
            };
            
            ProductoPedidoCliente.prototype.get_precio_regulado = function() {
                return this.precio_regulado;
            };
            
            // Precio Venta
            ProductoPedidoCliente.prototype.set_precio_venta = function(precio_venta) {
                this.precio_venta = precio_venta;
                return this;
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
                       
            // Valor Total Sin IVA
            ProductoPedidoCliente.prototype.set_valor_total_sin_iva = function(valor_total_sin_iva) {
                this.valor_total_sin_iva = valor_total_sin_iva;
                return this;
            };
            
            ProductoPedidoCliente.prototype.get_valor_total_sin_iva = function() {
                return this.valor_total_sin_iva;
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