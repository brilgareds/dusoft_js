define(["angular", "js/models"], function(angular, models) {

    models.factory('NovedadOrdenCompra', [function() {

            function NovedadOrdenCompra(id, descripcion, observacion) {
                this.id = id || '';
                this.descripcion = descripcion || '';
                this.observacion = observacion || '';
                this.cantidad_archivos = '';
            }

            this.get = function(id, descripcion, observacion) {
                return new NovedadOrdenCompra(id, descripcion, observacion);
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
            
            return this;
        }]);
});