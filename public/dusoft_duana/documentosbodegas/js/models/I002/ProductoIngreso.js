define(["angular", "js/models", "includes/classes/Producto"], function(angular, models) {

    models.factory('ProductoIngreso', ["Producto", function(Producto) {

            function ProductoIngreso(codigo, nombre, iva, valor_unitario, lote, fecha_vencmiento) {

                Producto.getClass().call(this, codigo, nombre);

                this.iva = iva;
                this.valor_unitario = valor_unitario || 0;
                this.lote = lote || "";
                this.fecha_vencimiento = fecha_vencmiento || "";
                this.autorizado = true;
                this.valor_unitario_ingresado= valor_unitario || 0;
            }

            ProductoIngreso.prototype = Object.create(Producto.getClass().prototype);

            this.get = function(codigo, nombre, iva, valor_unitario, lote, fecha_vencmiento) {
                return new ProductoIngreso(codigo, nombre, iva, valor_unitario, lote, fecha_vencmiento);
            };

            // IVA
            ProductoIngreso.prototype.get_iva = function() {
                return parseFloat(this.iva).toFixed(2);
            };

            // Valor Unitario
            ProductoIngreso.prototype.get_valor_unitario = function() {
                return this.valor_unitario;
            };

            // Lote
            ProductoIngreso.prototype.get_lote = function() {
                return this.lote;
            };

            // Fecha vencimiento
            ProductoIngreso.prototype.get_fecha_vencimiento = function() {
                return this.fecha_vencimiento;
            };

            // Cantidad Solicitada (Cantidad que se solicito en la orden de compra
            ProductoIngreso.prototype.set_cantidad_solicitada = function(cantidad_solicitada) {
                this.cantidad_solicitada = cantidad_solicitada;
                return this;
            };

            ProductoIngreso.prototype.get_cantidad_solicitada = function() {
                return this.cantidad_solicitada;
            };
            
            ProductoIngreso.prototype.set_item_id = function(item_id) {
                this.item_id = item_id;
                return this.item_id;
            };

            ProductoIngreso.prototype.get_item_id = function() {
                return this.item_id;
            };
            
            ProductoIngreso.prototype.set_item_id_compras = function(item_id_compras) {
                this.item_id_compras = item_id_compras;
                return this;
            };

            ProductoIngreso.prototype.get_item_id_compras = function() {
                return this.item_id_compras;
            };
            
            ProductoIngreso.prototype.set_iva_total = function(iva_total) {
                this.iva_total = iva_total;
                return this;
            };

            ProductoIngreso.prototype.get_total_costo = function() {
                return this.total_costo;
            };
            
            ProductoIngreso.prototype.set_total_costo = function(total_costo) {
                this.total_costo = total_costo;
                return this;
            };

            ProductoIngreso.prototype.get_iva_total = function() {
                return this.iva_total;
            };

            // Cantidad Ingresada (Cantidad que se va a ingresar a la bodega )
            ProductoIngreso.prototype.set_cantidad_ingresada = function(cantidad_ingresada) {
                this.cantidad_ingresada = cantidad_ingresada;
                return this;
            };

            ProductoIngreso.prototype.get_cantidad_ingresada = function() {
                return this.cantidad_ingresada;
            };

            // Cantidad Seleccionada (Cantidad que solicitada que necesita ser autoriazada )
            ProductoIngreso.prototype.set_cantidad_seleccionada = function(cantidad_seleccionada) {
                this.autorizado = false;
                this.cantidad_seleccionada = cantidad_seleccionada;
                return this;
            };

            ProductoIngreso.prototype.get_cantidad_seleccionada = function() {
                return this.cantidad_seleccionada;
            };

            // Justificacion (Cantidad que solicitada que necesita ser autoriazada y justificada)
            ProductoIngreso.prototype.set_justificacion = function(justificacion) {
                this.justificacion = justificacion;
                return this;
            };

            ProductoIngreso.prototype.get_justificacion = function() {
                return this.justificacion;
            };

            // Validar si tiene autorizacion
            ProductoIngreso.prototype.get_autorizacion = function() {
                return this.autorizado;
            };

            // Total 
            ProductoIngreso.prototype.set_total = function(total) {
                this.total = total;
                return this;
            };

            ProductoIngreso.prototype.get_total = function() {
                return this.total;
            };
            
            ProductoIngreso.prototype.set_porcentaje_gravamen = function(porcentaje_gravamen ) {
                this.porcentaje_gravamen  = porcentaje_gravamen ;
                return this;
            };

            ProductoIngreso.prototype.get_porcentaje_gravamen  = function() {
                return this.porcentaje_gravamen ;
            };
            
            ProductoIngreso.prototype.set_total_costo = function(total_costo ) {
                this.total_costo  = total_costo ;
                return this;
            };

            ProductoIngreso.prototype.get_total_costo  = function() {
                return this.total_costo ;
            };
            
            ProductoIngreso.prototype.set_local_prod = function(local_prod ) {
                this.local_prod  = local_prod ;
                return this;
            };

            ProductoIngreso.prototype.get_local_prod  = function() {
                return this.local_prod ;
            };
            
            ProductoIngreso.prototype.set_total_costo_pedido = function(total_costo_pedido ) {
                this.total_costo_pedido  = total_costo_pedido ;
                return this;
            };

            ProductoIngreso.prototype.get_total_costo_pedido  = function() {
                return this.total_costo_pedido ;
            };
            
            ProductoIngreso.prototype.set_contenido_unidad_venta = function(contenido_unidad_venta ) {
                this.contenido_unidad_venta  = contenido_unidad_venta ;
                return this;
            };

            ProductoIngreso.prototype.get_contenido_unidad_venta  = function() {
                return this.contenido_unidad_venta ;
            };
            
            ProductoIngreso.prototype.set_descripcion_uniad = function(descripcion_uniad) {
                this.descripcion_uniad  = descripcion_uniad ;
                return this;
            };

            ProductoIngreso.prototype.get_descripcion_uniad  = function() {
                return this.descripcion_uniad ;
            };
            
            ProductoIngreso.prototype.set_valor_unit = function(valor_unit) {
                this.valor_unit  = valor_unit ;
                return this;
            };

            ProductoIngreso.prototype.get_valor_unit  = function() {
                return this.valor_unit ;
            };
            
            ProductoIngreso.prototype.set_valor_total = function(valor_total) {
                this.valor_total  = valor_total ;
                return this;
            };

            ProductoIngreso.prototype.get_valor_total  = function() {
                return this.valor_total ;
            };
            
            ProductoIngreso.prototype.set_iva_total = function(iva_total) {
                this.iva_total  = iva_total ;
                return this;
            };

            ProductoIngreso.prototype.get_iva_total  = function() {
                return this.iva_total ;
            };
            
            ProductoIngreso.prototype.set_unidad_id = function(unidad_id) {
                this.unidad_id  = unidad_id ;
                return this;
            };

            ProductoIngreso.prototype.get_unidad_id  = function() {
                return this.unidad_id ;
            };
            
            ProductoIngreso.prototype.set_is_tmp = function(is_tmp) {
                this.is_tmp  = is_tmp ;
                return this;
            };

            ProductoIngreso.prototype.get_is_tmp  = function() {
                return this.is_tmp ;
            };
            
            ProductoIngreso.prototype.set_sw_estado = function(sw_estado) {
                this.sw_estado  = sw_estado ;
                return this;
            };

            ProductoIngreso.prototype.get_sw_estado  = function() {
                return this.sw_estado ;
            };
            
            ProductoIngreso.prototype.set_sw_autorizado = function(sw_autorizado) {
                this.sw_autorizado  = sw_autorizado ;
                return this;
            };

            ProductoIngreso.prototype.get_sw_autorizado  = function() {
                return this.sw_autorizado ;
            };
            
            ProductoIngreso.prototype.set_valor_unitario_ingresado = function(valor_unitario_ingresado) {
                this.valor_unitario_ingresado  = valor_unitario_ingresado ;
                return this;
            };

            ProductoIngreso.prototype.get_valor_unitario_ingresado  = function() {
                if(this.valor_unitario_ingresado>this.valor_unitario){
                  return this.valor_unitario_ingresado ;
                }else{
                  return this.valor_unitario ;
                }
            };

            return this;
        }]);
});