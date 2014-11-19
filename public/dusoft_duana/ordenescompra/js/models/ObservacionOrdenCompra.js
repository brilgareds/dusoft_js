define(["angular", "js/models"], function(angular, models) {

    models.factory('ObservacionOrdenCompra', [function() {

            function ObservacionOrdenCompra(id, codigo, descripcion) {
                this.id = id || '';
                this.codigo = codigo || '';
                this.descripcion = descripcion || '';
            }

            this.get = function(id, codigo, descripcion) {
                return new ObservacionOrdenCompra(id, codigo, descripcion);
            };
            
            ObservacionOrdenCompra.prototype.get_id = function() {
                return this.id;
            };
            
            ObservacionOrdenCompra.prototype.get_codigo = function() {
                return this.codigo;
            };
            
            ObservacionOrdenCompra.prototype.get_descripcion = function() {
                var descripcion_completa = (this.codigo) ? this.codigo + ' - ' + this.descripcion : '';
                return descripcion_completa;
            };

            return this;
        }]);
});