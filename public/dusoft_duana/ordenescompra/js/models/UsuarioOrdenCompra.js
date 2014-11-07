define(["angular", "js/models"], function(angular, models) {

    models.factory('UsuarioOrdenCompra', [function() {

            function UsuarioOrdenCompra(id, nombre) {
                this.id = id;
                this.nombre = nombre || "";
            }

            this.get = function(id, nombre) {
                return new UsuarioOrdenCompra(id, nombre);
            };

            return this;
        }]);
});