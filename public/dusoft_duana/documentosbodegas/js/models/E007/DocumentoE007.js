define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocumentoE007', ["Documento", "$filter", function(Documento, $filter) {


            function DocumentoE007(id, prefijo, numero, fecha_registro) {

                Documento.getClass().call(this, id, prefijo, numero, fecha_registro);
            }
            
            DocumentoE007.prototype  = Object.create(Documento.getClass().prototype);

            
            // egreso
            DocumentoE007.prototype.setEgreso = function(egreso) {
                this.egreso = egreso;
            };

            DocumentoE007.prototype.getEgreso = function() {
                return this.egreso;
            };
            
            // Observacion
            DocumentoE007.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;
            };

            DocumentoE007.prototype.get_observacion = function() {
                return this.observacion;
            };
            
            // Fecha Registro
            DocumentoE007.prototype.set_fecha_registro = function(fecha_registro) {
                this.fecha_registro = fecha_registro;
            };

            DocumentoE007.prototype.get_fecha_registro = function() {
                return this.fecha_registro;
            };
            
            DocumentoE007.prototype.set_bodega_destino = function(bodega) {
                this.bodega_destino = bodega;
            };

            DocumentoE007.prototype.get_bodega_destino = function() {
                return this.bodega_destino;
            };

            // Productos
            DocumentoE007.setProductos = function (producto) {
                this.productos.push(producto);
            };

            DocumentoE007.getProductos = function () {
                return this.productos;
            };

            DocumentoE007.limpiarProductos = function () {
                this.productos = [];
            };
            
            this.get = function(id, prefijo, numero, fecha_registro) {
                return new DocumentoE007(id, prefijo, numero, fecha_registro);
            };

            return this;
            
        }]);
});