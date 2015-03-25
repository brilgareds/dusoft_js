
define(["angular","js/models"], function(angular, models) {

    models.factory('Usuario', function() {

        this.token = "";
        this.usuario_id = "";
        
        this.setToken = function(token){
            this.token = token;
        };

        this.setUsuarioId = function(usuario_id){
            this.usuario_id = usuario_id;
        };
        
        
        function Usuario(id, usuario, nombre) {
            this.id = id || "";
            this.usuario = usuario || "";
            this.nombre =  nombre || ""; 
        };
        
        Usuario.prototype.setId = function(id) {
            this.id = id;
        };

        Usuario.prototype.getId= function() {
            return this.id;
        };

        Usuario.prototype.setNombre = function(nombre) {
            this.nombre = nombre;
        };

        Usuario.prototype.getNombre = function() {
            return this.nombre;
        };
        
        Usuario.prototype.setNombreUsuario = function(usuario) {
            this.usuario = usuario;
        };

        Usuario.prototype.getNombreUsuario = function() {
            return this.usuario;
        };

        this.get = function(id, usuario, nombre) {
            return new Usuario(id, usuario, nombre);
        };

        this.getClass = function(){
            return Usuario;
        };


        return this;

    });
});