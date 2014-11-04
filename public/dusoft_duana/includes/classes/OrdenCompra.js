define(["angular", "js/models"], function(angular, models) {

    models.factory('OrdenCompra', function() {

        /*function OrdenCompra(numero_orden_compra) {
            this.proveedor;
            this.numero_orden_compra = numero_orden_compra;
        };*/
        
        function OrdenCompra(numero_orden_compra, estado, observacion, fecha_registro) {
            
            this.numero_orden_compra = numero_orden_compra;
            this.estado = estado || "";
            this.observacion = observacion || "";
            this.fecha_registro = fecha_registro || "";
            
        };

        this.get = function(numero_orden_compra, estado, observacion, fecha_registro) {
            return new OrdenCompra(numero_orden_compra, estado, observacion, fecha_registro);
        };

        /*OrdenCompra.prototype.setProveedor = function(proveedor) {
            this.proveedor = proveedor;
        };

        OrdenCompra.prototype.setDatos = function(datos){
            this.proveedor = datos.proveedor || null;
            this.cantidad_solicitada = datos.cantidad_solicitada || null;
            this.cantidad_pendiente = datos.cantidad_pendiente || null;
            this.usuario = datos.usuario || null;

        };*/
        
        this.getClass = function(){
            return OrdenCompra;
        };

        return this;

    });
});