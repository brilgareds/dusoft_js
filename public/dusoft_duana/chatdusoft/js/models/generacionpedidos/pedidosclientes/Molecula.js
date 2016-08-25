define(["angular", "js/models"], function(angular, models) {

    models.factory('Molecula', [function() {

            function Molecula(id, descripcion) {
                this.id = id;
                this.descripcion = descripcion;
            }

            this.get = function(id, descripcion) {
                return new Molecula(id, descripcion);
            };

            Molecula.prototype.get_id = function() {
                return this.id;
            };
            
            Molecula.prototype.get_nombre = function() {
                return this.descripcion;
            };

            return this;
        }]);
});