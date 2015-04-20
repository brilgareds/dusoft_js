
define(["angular", "js/models"], function(angular, models) {

    models.factory('Usuario', function() {
            
           this.UsuarioActual;
           
           this.setUsuarioActual = function(Usuario){
               this.UsuarioActual = Usuario;
           };
           
           this.getUsuarioActual = function(){
               return this.UsuarioActual;
           };
            
           function Usuario(id, usuario, nombre) {
                this.id = id || "";
                this.usuario = usuario || "";
                this.nombre =  nombre || ""; 
                this.token = "";
                this.usuario_id = "";
                this.empresa;
                this.clave = "";
                this.email = "";
                this.estado = true;
                this.fechaCaducidad = null;
                this.descripcion = "";
                this.rutaAvatar = "";
            }

            
            Usuario.prototype.setToken = function(token){
                this.token = token;
            };

            Usuario.prototype.getToken = function(){
                return this.token;
            };

            Usuario.prototype.setUsuarioId = function(usuario_id){
                this.usuario_id = usuario_id;
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

            Usuario.prototype.setEmpresa = function(empresa) {
                this.empresa = empresa;
            };

            Usuario.prototype.getEmpresa= function() {
                return this.empresa;
            };
            
            Usuario.prototype.setClave = function(clave){
                this.clave = clave;
            };
            
            Usuario.prototype.setEmail = function(email){
                this.email = email;
            };
            
            Usuario.prototype.setDescripcion = function(descripcion){
                this.descripcion = descripcion;
            };
            
            Usuario.prototype.setEstado = function(estado){
                this.estado = estado;
            };
            
            Usuario.prototype.setFechaCaducidad = function(fechaCaducidad){
                this.fechaCaducidad = fechaCaducidad;
            };
            
            Usuario.prototype.setRutaAvatar = function(rutaAvatar){
                this.rutaAvatar = rutaAvatar || "";
            };
            
            Usuario.prototype.getClave = function(){
                return this.clave;
            };
            
            Usuario.prototype.getEmail = function(){
                return this.email;
            };
            
            Usuario.prototype.getEstado = function(){
                return this.estado;
            };
            
            Usuario.prototype.getDescripcion = function(){
                return this.descripcion;
            };
            
            Usuario.prototype.getFechaCaducidad = function(){
                return this.fechaCaducidad;
            };
            
            Usuario.prototype.getRutaAvatar = function(){
                return this.rutaAvatar;
            };

            this.get = function(id, usuario, nombre) {
                return new Usuario(id, usuario, nombre);
            };


            return this;

        });
});