define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocumentoAAC1', ["Documento", "$filter", function(Documento, $filter) {


            function DocumentoAAC1(id, prefijo, numero, fecha_registro) {

                Documento.getClass().call(this, id, prefijo, numero, fecha_registro);
            }
            
            DocumentoAAC1.prototype  = Object.create(Documento.getClass().prototype);

            
            // egreso
            DocumentoAAC1.prototype.setEgreso = function(egreso) {
                this.egreso = egreso;
            };

            DocumentoAAC1.prototype.getEgreso = function() {
                return this.egreso;
            };
            
            // Observacion
            DocumentoAAC1.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;
            };

            DocumentoAAC1.prototype.get_observacion = function() {
                return this.observacion;
            };
            
            // Fecha Registro
            DocumentoAAC1.prototype.set_fecha_registro = function(fecha_registro) {
                this.fecha_registro = fecha_registro;
            };

            DocumentoAAC1.prototype.get_fecha_registro = function() {
                return this.fecha_registro;
            };
            
            DocumentoAAC1.prototype.set_bodega_destino = function(bodega) {
                this.bodega_destino = bodega;
            };

            DocumentoAAC1.prototype.get_bodega_destino = function() {
                return this.bodega_destino;
            };

            // Productos
            DocumentoAAC1.setProductos = function (producto) {
                this.productos.push(producto);
            };

            DocumentoAAC1.getProductos = function () {
                return this.productos;
            };

            DocumentoAAC1.limpiarProductos = function () {
                this.productos = [];
            };
            
            this.get = function(id, prefijo, numero, fecha_registro) {
                return new DocumentoAAC1(id, prefijo, numero, fecha_registro);
            };

            return this;
            
        }]);
});