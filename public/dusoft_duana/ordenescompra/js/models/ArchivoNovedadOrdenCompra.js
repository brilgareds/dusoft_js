define(["angular", "js/models"], function(angular, models) {

    models.factory('ArchivoNovedadOrdenCompra', [function() {

            function ArchivoNovedadOrdenCompra(id, descripcion) {
                this.id = id || '';
                this.descripcion = descripcion || '';
            }

            this.get = function(id, descripcion ) {
                return new ArchivoNovedadOrdenCompra(id, descripcion );
            };
            
            // Id
            ArchivoNovedadOrdenCompra.prototype.get_id = function() {
                return this.id;
            };
            
            // Descripcion
            ArchivoNovedadOrdenCompra.prototype.get_descripcion = function() {
                return this.descripcion;
            };
            
            return this;
        }]);
});