
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
            
            //propiedades pendientes
            this.existencia_lotes = "";
            this.porcentaje_gravament = "0";
            
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

        this.get = function(codigo, nombre, existencia, precio, cantidad_solicitada, cantidad_ingresada, observacion_cambio, disponible, molecula, existencia_farmacia, tipo_producto_id, total_existencias_farmacia, existencia_disponible, cantidad_pendiente) {
            return new ProductoPedido(codigo, nombre, existencia, precio, cantidad_solicitada, cantidad_ingresada, observacion_cambio, disponible, molecula, existencia_farmacia, tipo_producto_id, total_existencias_farmacia, existencia_disponible, cantidad_pendiente);
        };

        return this;
    }]);
});