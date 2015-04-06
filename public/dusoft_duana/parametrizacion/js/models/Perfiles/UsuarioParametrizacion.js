
define(["angular", "js/models", "includes/classes/Usuario"], function(angular, models) {

    models.factory('UsuarioParametrizacion', ['Usuario', function(Usuario) {

            function UsuarioParametrizacion(id, usuario, nombre) {
                Usuario.getClass().call(this, id, usuario, nombre);
                this.clave = "";
                this.email = "";
                this.estado = true;
                this.fechaCaducidad = null;
                this.descripcion = "";
                this.rutaAvatar = "";
            }

            UsuarioParametrizacion.prototype = Object.create(Usuario.getClass().prototype);
            
            UsuarioParametrizacion.prototype.setClave = function(clave){
                this.clave = clave;
            };
            
            UsuarioParametrizacion.prototype.setEmail = function(email){
                this.email = email;
            };
            
            UsuarioParametrizacion.prototype.setDescripcion = function(descripcion){
                this.descripcion = descripcion;
            };
            
            UsuarioParametrizacion.prototype.setEstado = function(estado){
                this.estado = estado;
            };
            
            UsuarioParametrizacion.prototype.setFechaCaducidad = function(fechaCaducidad){
                this.fechaCaducidad = fechaCaducidad;
            };
            
            UsuarioParametrizacion.prototype.setRutaAvatar = function(rutaAvatar){
                this.rutaAvatar = rutaAvatar || "";
            };
            
            UsuarioParametrizacion.prototype.getClave = function(){
                return this.clave;
            };
            
            UsuarioParametrizacion.prototype.getEmail = function(){
                return this.email;
            };
            
            UsuarioParametrizacion.prototype.getEstado = function(){
                return this.estado;
            };
            
            UsuarioParametrizacion.prototype.getDescripcion = function(){
                return this.descripcion;
            };
            
            UsuarioParametrizacion.prototype.getFechaCaducidad = function(){
                return this.fechaCaducidad;
            };
            
            UsuarioParametrizacion.prototype.getRutaAvatar = function(){
                return this.rutaAvatar;
            };

            this.get = function(id, usuario, nombre) {
                return new UsuarioParametrizacion(id, usuario, nombre);
            };


            return this;

        }]);
});