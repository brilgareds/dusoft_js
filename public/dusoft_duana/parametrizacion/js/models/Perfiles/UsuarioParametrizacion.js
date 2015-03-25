
define(["angular", "js/models", "includes/classes/Usuario"], function(angular, models) {

    models.factory('UsuarioParametrizacion', ['Usuario', function(Usuario) {

            function UsuarioParametrizacion(id, usuario, nombre) {
                Usuario.getClass().call(this, id, usuario, nombre);

            }

            UsuarioParametrizacion.prototype = Object.create(Usuario.getClass().prototype);

            this.get = function(id, usuario, nombre) {
                return new UsuarioParametrizacion(id, usuario, nombre);
            };


            return this;

        }]);
});