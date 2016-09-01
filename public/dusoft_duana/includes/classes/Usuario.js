
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
                this.id = id || -1;
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
                this.rol;
                this.modulos = [];
                this.moduloActual;
                this.objetoModulos = {};
                this.empresasFarmacias = [];
                this.empresasUsuario = [];
                this.seleccionado = false;
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
            
            Usuario.prototype.setSeleccionado = function(seleccionado){
                this.seleccionado = seleccionado;
                return this;
            };
            
            Usuario.prototype.getSeleccionado = function(){
               return  this.seleccionado ;
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
            
            Usuario.prototype.setModulos = function(modulos){
                this.modulos = modulos;
            };

            Usuario.prototype.getModulos = function(){
                return this.modulos;
            };
            
            Usuario.prototype.setObjetoModulos = function(obj){
                this.objetoModulos = obj;
            };

            Usuario.prototype.getObjetoModulos = function(){
                return this.objetoModulos;
            };
            
            Usuario.prototype.setModuloActual = function(modulo){
                this.moduloActual = modulo;
            };

            Usuario.prototype.getModuloActual = function(){
                return this.moduloActual;
            };
            
            Usuario.prototype.setRol = function(rol){
                this.rol = rol;
            };

            Usuario.prototype.getRol = function(){
                return this.rol;
            };
            
            Usuario.prototype.setEmpresasFarmacias = function(empresasFarmacias){
                this.empresasFarmacias = empresasFarmacias;
            };

            Usuario.prototype.getEmpresasFarmacias = function(){
                return this.empresasFarmacias;
            };
            
            Usuario.prototype.agregarEmpresaFarmacia = function(empresaFarmacia){
                for(var i in this.empresasFarmacias){
                    var _empresaFarmacia = this.empresasFarmacias[i];
                    
                    if(_empresaFarmacia.getCodigo() === empresaFarmacia.getCodigo()){
                        return false;
                    }
                }  
                
                this.empresasFarmacias.push(empresaFarmacia);
                
            };
            
            Usuario.prototype.setEmpresasUsuario = function(empresasUsuario){
                this.empresasUsuario = empresasUsuario;
                return this;
            };

            Usuario.prototype.getEmpresasUsuario = function(){
                return this.empresasUsuario;
            };
            
            Usuario.prototype.agregarEmpresaUsuario = function(empresa){
                for(var i in this.empresasUsuario){
                    var _empresa = this.empresasUsuario[i];
                    
                    if(_empresa.getCodigo() === empresa.getCodigo()){
                        return false;
                    }
                }  
                
                this.empresasUsuario.push(empresa);
                
            };
            
            this.get = function(id, usuario, nombre) {
                return new Usuario(id, usuario, nombre);
            };


            return this;

        });
});