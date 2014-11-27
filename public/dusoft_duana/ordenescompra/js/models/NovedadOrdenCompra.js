define(["angular", "js/models"], function(angular, models) {

    models.factory('NovedadOrdenCompra', [function() {

            function NovedadOrdenCompra(id, descripcion, observacion, cantidad_archivos) {
                this.id = id || '';
                this.descripcion = descripcion || '';
                this.observacion = observacion || '';
                this.cantidad_archivos = cantidad_archivos || '';
                this.archivos = [];
            }

            this.get = function(id, descripcion, observacion, cantidad_archivos) {
                return new NovedadOrdenCompra(id, descripcion, observacion, cantidad_archivos);
            };
            
            // Id
            NovedadOrdenCompra.prototype.get_id = function() {
                return this.id;
            };
            
            // Descripcion
            NovedadOrdenCompra.prototype.get_descripcion = function() {
                return this.descripcion;
            };
            
            // Observacion 
            NovedadOrdenCompra.prototype.set_observacion = function(observacion) {
                this.observacion = observacion;
            };
            
            NovedadOrdenCompra.prototype.get_observacion = function() {
                return this.observacion;
            };
            
            // cantidad_archivos 
            NovedadOrdenCompra.prototype.set_cantidad_archivos = function(cantidad_archivos) {
                this.cantidad_archivos = cantidad_archivos;
            };
            
            NovedadOrdenCompra.prototype.get_cantidad_archivos = function() {
                return this.cantidad_archivos;
            };
            
            // Archivos
            NovedadOrdenCompra.prototype.set_archivos = function(archivo) {
                this.archivos.push(archivo);
            };
            
            NovedadOrdenCompra.prototype.get_archivos = function() {
                return this.archivos;
            };
            
            NovedadOrdenCompra.prototype.limpiar_archivos = function() {
                this.archivos = [];
            };
            
            return this;
        }]);
});