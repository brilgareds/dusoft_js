define(["angular", "js/models"], function(angular, models) {

    models.factory('ArchivoNovedadOrdenCompra', [function() {

            function ArchivoNovedadOrdenCompra(id, descripcion) {
                this.id = id || '';
                this.descripcion = descripcion || '';
                this.nombreProducto = "";
                this.descripcionNovedad = "";
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
            
            ArchivoNovedadOrdenCompra.prototype.getNombreProducto = function() {
                return this.nombreProducto;
            };
            
            ArchivoNovedadOrdenCompra.prototype.setNombreProducto = function(nombreProducto) {
                this.nombreProducto = nombreProducto;
                return this;
            };
            
            ArchivoNovedadOrdenCompra.prototype.getDescripcionNovedad = function() {
                return this.descripcionNovedad;
            };
            
            ArchivoNovedadOrdenCompra.prototype.setDescripcionNovedad = function(descripcionNovedad) {
                this.descripcionNovedad = descripcionNovedad;
                return this;
            };
            
            return this;
        }]);
});