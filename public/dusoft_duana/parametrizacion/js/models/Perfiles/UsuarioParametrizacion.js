
define(["angular", "js/models", "includes/classes/Usuario"], function(angular, models) {

    models.factory('UsuarioParametrizacion', ['Usuario', function(Usuario) {

            function UsuarioParametrizacion(id, usuario, nombre) {
                Usuario.getClass().call(this, id, usuario, nombre);
                this.clave = "";
                this.email = "";
            }

            UsuarioParametrizacion.prototype = Object.create(Usuario.getClass().prototype);
            
            UsuarioParametrizacion.prototype.setClave = function(clave){
                this.clave = clave;
            };
            
            UsuarioParametrizacion.prototype.setEmail = function(email){
                this.email = email;
            };
            
            UsuarioParametrizacion.prototype.getClave = function(){
                return this.clave;
            };
            
            UsuarioParametrizacion.prototype.getEmail = function(){
                return this.email;
            };

            this.get = function(id, usuario, nombre) {
                return new UsuarioParametrizacion(id, usuario, nombre);
            };


            return this;

        }]);
});