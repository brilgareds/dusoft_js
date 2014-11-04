define(["angular", "js/models"], function(angular, models) {

    models.factory('OrdenCompra', function() {
 
        function OrdenCompra(numero_orden_compra, estado, observacion, fecha_registro) {
            
            this.numero_orden_compra = numero_orden_compra;
            this.estado = estado || "";
            this.observacion = observacion || "";
            this.fecha_registro = fecha_registro || "";
            
        };

        this.get = function(numero_orden_compra, estado, observacion, fecha_registro) {
            return new OrdenCompra(numero_orden_compra, estado, observacion, fecha_registro);
        };

        
        this.getClass = function(){
            return OrdenCompra;
        };

        return this;

    });
});