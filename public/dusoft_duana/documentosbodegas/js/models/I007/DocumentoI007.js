define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocumentoI007', ["Documento", "$filter", function(Documento, $filter) {


            function DocumentoI007(id, prefijo, numero, fecha_registro) {

                Documento.getClass().call(this, id, prefijo, numero, fecha_registro);
            }
            
            DocumentoI007.prototype  = Object.create(Documento.getClass().prototype);

            
            // egreso
            DocumentoI007.prototype.setPrestamo = function(prestamo) {
                this.prestamo = prestamo;
            };

            DocumentoI007.prototype.getPrestamo = function() {
                return this.prestamo;
            };
            
            // Observacion
            DocumentoI007.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;
            };

            DocumentoI007.prototype.get_observacion = function() {
                return this.observacion;
            };
            
            // Fecha Registro
            DocumentoI007.prototype.set_fecha_registro = function(fecha_registro) {
                this.fecha_registro = fecha_registro;
            };

            DocumentoI007.prototype.get_fecha_registro = function() {
                return this.fecha_registro;
            };
            
            DocumentoI007.prototype.set_bodega_destino = function(bodega) {
                this.bodega_destino = bodega;
            };

            DocumentoI007.prototype.get_bodega_destino = function() {
                return this.bodega_destino;
            };

            // Productos
            DocumentoI007.setProductos = function (producto) {
                this.productos.push(producto);
            };

            DocumentoI007.getProductos = function () {
                return this.productos;
            };

            DocumentoI007.limpiarProductos = function () {
                this.productos = [];
            };
            
            this.get = function(id, prefijo, numero, fecha_registro) {
                return new DocumentoI007(id, prefijo, numero, fecha_registro);
            };

            return this;
            
        }]);
});