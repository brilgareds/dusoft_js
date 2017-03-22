define(["angular", "js/models"], function(angular, models) {

    models.factory('Laboratorio', [function() {

            function Laboratorio(id, descripcion) {
                this.id = id;
                this.descripcion = descripcion;
            }

            this.get = function(id, descripcion) {
                return new Laboratorio(id, descripcion);
            };

            Laboratorio.prototype.get_id = function() {
                return this.id;
            };
            
            Laboratorio.prototype.get_nombre = function() {
                return this.descripcion;
            };

            return this;
        }]);
});