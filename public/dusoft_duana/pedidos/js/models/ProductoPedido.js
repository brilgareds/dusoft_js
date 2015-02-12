
define(["angular", "js/models", "includes/classes/Producto"], function(angular, models) {

    models.factory('ProductoPedido', ["Producto", function(Producto) {

        function ProductoPedido(codigo, nombre, existencia, precio, cantidad_solicitada, cantidad_ingresada, observacion_cambio, disponible, molecula, existencia_farmacia, tipo_producto_id, total_existencias_farmacia, existencia_disponible, cantidad_pendiente) {
            Producto.getClass().call(this,codigo,nombre, existencia);
            this.precio = precio || 0;
            this.cantidad_solicitada = cantidad_solicitada || 0;
            this.cantidad_separada = cantidad_ingresada || 0;
            this.observacion = observacion_cambio || "";
            this.disponible = disponible || 0;
            this.molecula = molecula || "";
            this.existencia_farmacia = existencia_farmacia || "";
            this.tipo_producto_id = tipo_producto_id || "";
            this.total_existencias_farmacia = total_existencias_farmacia || "";
            this.existencia_disponible = existencia_disponible || "";
            this.cantidad_pendiente = cantidad_pendiente || "";
            
            //Campos exclusivos pedido clientes
            this.codigo_cum = "";
            this.codigo_invima = "";
            this.iva = "";
            this.precio_regulado = "";
            
            //propiedades pendientes
            this.existencia_lotes = "";
            this.porcentaje_gravament = "0";
            this.cantidad_despachada = 0;
            this.cantidad_solicitada_real = 0;
            
            //Objeto Lote
            this.lote = {};
            this.lotesSeleccionados = [];
        }

        ProductoPedido.prototype = Object.create(Producto.getClass().prototype);
        
        ProductoPedido.prototype.setLote = function(lote) {
            this.lote = lote;
        };
        
        ProductoPedido.prototype.getLote = function() {
            return this.lote;
        };
        
        ProductoPedido.prototype.setCodigoCum = function(codigo_cum) {
            this.codigo_cum = codigo_cum;
        };
        
        ProductoPedido.prototype.getCodigoCum = function() {
            return this.codigo_cum;
        };
        
        ProductoPedido.prototype.setCodigoInvima = function(codigo_invima) {
            this.codigo_invima = codigo_invima;
        };
        
        ProductoPedido.prototype.getCodigoInvima = function() {
            return this.codigo_invima;
        };
        
        ProductoPedido.prototype.setIva = function(iva) {
            this.iva = iva;
        };
        
        ProductoPedido.prototype.getIva = function() {
            return this.iva;
        };
        
        ProductoPedido.prototype.setPrecioRegulado = function(precio_regulado) {
            this.precio_regulado = precio_regulado;
        };
        
        ProductoPedido.prototype.getPrecioRegulado = function() {
            return this.precio_regulado;
        };
        
        ProductoPedido.prototype.agregarLote = function(lote) {
            this.lotesSeleccionados.push(lote);
        };
        
        ProductoPedido.prototype.obtenerCantidadSeleccionada = function() {
            var cantidad = 0;
            for(var i in this.lotesSeleccionados){
                var lote = this.lotesSeleccionados[i];
                if(lote.seleccionado){
                      cantidad += parseInt(this.lotesSeleccionados[i].cantidad_ingresada);
                }
            }
            
            return cantidad;
        };
        
        ProductoPedido.prototype.obtenerCantidadSeleccionadaPorLote = function(codigo_lote) {
            var cantidad = 0;
            for(var i in this.lotesSeleccionados){
                var lote = this.lotesSeleccionados[i];
                if(lote.seleccionado && lote.codigo_lote === codigo_lote){
                      cantidad += parseInt(this.lotesSeleccionados[i].cantidad_ingresada);
                }
            }
            
            return cantidad;
        };
        
        ProductoPedido.prototype.obtenerCantidadPendientePorLote = function(codigo_lote) {
            var cantidad = 0;
            for(var i in this.lotesSeleccionados){
                var lote = this.lotesSeleccionados[i];
                if(lote.seleccionado && lote.codigo_lote === codigo_lote){
                      cantidad += parseInt(this.lotesSeleccionados[i].cantidad_pendiente);
                }
            }
            
            return cantidad;
        };

        this.get = function(codigo, nombre, existencia, precio,
                                cantidad_solicitada, cantidad_ingresada, observacion_cambio, disponible,
                                molecula, existencia_farmacia, tipo_producto_id,
                                total_existencias_farmacia, existencia_disponible, cantidad_pendiente
                           ) {
            
            return new ProductoPedido(codigo, nombre, existencia, precio,
                                        cantidad_solicitada, cantidad_ingresada, observacion_cambio, disponible,
                                        molecula, existencia_farmacia, tipo_producto_id, total_existencias_farmacia,
                                        existencia_disponible, cantidad_pendiente
                                     );
        };

        return this;
    }]);
});