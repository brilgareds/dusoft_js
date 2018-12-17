define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocumentoABC1', ["Documento", "$filter", function(Documento, $filter) {


            function DocumentoABC1(id, prefijo, numero, fecha_registro) {

                Documento.getClass().call(this, id, prefijo, numero, fecha_registro);
            }
            
            DocumentoABC1.prototype  = Object.create(Documento.getClass().prototype);

            
            // egreso
            DocumentoABC1.prototype.setEgreso = function(egreso) {
                this.egreso = egreso;
            };

            DocumentoABC1.prototype.getEgreso = function() {
                return this.egreso;
            };
            
            // Observacion
            DocumentoABC1.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;
            };

            DocumentoABC1.prototype.get_observacion = function() {
                return this.observacion;
            };
            
            // Fecha Registro
            DocumentoABC1.prototype.set_fecha_registro = function(fecha_registro) {
                this.fecha_registro = fecha_registro;
            };

            DocumentoABC1.prototype.get_fecha_registro = function() {
                return this.fecha_registro;
            };
            
            DocumentoABC1.prototype.set_bodega_destino = function(bodega) {
                this.bodega_destino = bodega;
            };

            DocumentoABC1.prototype.get_bodega_destino = function() {
                return this.bodega_destino;
            };

            // Productos
            DocumentoABC1.setProductos = function (producto) {
                this.productos.push(producto);
            };

            DocumentoABC1.getProductos = function () {
                return this.productos;
            };

            DocumentoABC1.limpiarProductos = function () {
                this.productos = [];
            };
            
            this.get = function(id, prefijo, numero, fecha_registro) {
                return new DocumentoABC1(id, prefijo, numero, fecha_registro);
            };

            return this;
            
        }]);
});