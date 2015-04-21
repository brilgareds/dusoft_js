define(["angular", "js/models"], function(angular, models) {

    models.factory('UsuarioPlanillaDespacho', [function() {

            function UsuarioPlanillaDespacho(id, nombre) {
                this.id = id;
                this.nombre = nombre;
            }

            this.get = function(id, nombre) {
                return new UsuarioPlanillaDespacho(id, nombre);
            };
            
            UsuarioPlanillaDespacho.prototype.get_id = function() {
                return this.id;
            };
            
            UsuarioPlanillaDespacho.prototype.get_nombre = function() {
                return this.nombre;
            };

            return this;
        }]);
});