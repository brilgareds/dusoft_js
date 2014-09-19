
define(["angular", "js/models", "includes/classes/Producto"], function(angular, models) {

    models.factory('ProductoPedido', ["Producto", function(Producto) {

        function ProductoPedido(codigo, nombre, existencia, precio, cantidad_solicitada, cantidad_ingresada, observacion_cambio) {
            Producto.getClass().call(this,codigo,nombre, existencia);
            this.precio = precio;
            this.cantidad_solicitada = cantidad_solicitada;
            this.cantidad_separada = cantidad_ingresada;
            this.observacion = observacion_cambio;
            this.disponible = 0;
            
            //propiedades pendientes
            this.existencia_lotes = "";
            
            //Objeto Lote
            this.lote = {};
        }

        ProductoPedido.prototype = Object.create(Producto.getClass().prototype);
        
        ProductoPedido.prototype.setLote = function(lote) {
            this.lote = lote;
        }
        
        ProductoPedido.prototype.getLote = function() {
            return this.lote;
        }

        this.get = function(codigo, nombre, existencia, precio, cantidad_solicitada, cantidad_ingresada, observacion_cambio) {
            return new ProductoPedido(codigo, nombre, existencia, precio, cantidad_solicitada, cantidad_ingresada, observacion_cambio);
        }

        return this;
    }]);
});