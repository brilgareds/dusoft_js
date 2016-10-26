
define(["angular", "js/models"], function(angular, models) {

    models.factory('GrupoChat',  function() {

        function GrupoChat(id, nombre, fechaCreacion, numeroIntegrantes) {
            this.id = id || 0;
            this.nombre = nombre || "";
            this.fechaCreacion = fechaCreacion;
            this.numeroIntegrantes = numeroIntegrantes || 0;
            this.estado = "1";
            this.descripcionEstado = "";
            this.usuarios = [];
        };
        
        
        GrupoChat.prototype.setNombre = function(nombre) {
            this.nombre = nombre;
            return this;
        };
        
        GrupoChat.prototype.getNombre = function() {
            return this.nombre;
        };
        
        GrupoChat.prototype.setFechaCreacion = function(fechaCreacion) {
            this.fechaCreacion = fechaCreacion;
            return this;
        };
        
        GrupoChat.prototype.getFechaCreacion = function() {
            
            return this.fechaCreacion;
        };
        
        GrupoChat.prototype.setNumeroIntegrantes = function(numeroIntegrantes) {
            this.numeroIntegrantes = numeroIntegrantes;
            return this;
        };
        
        GrupoChat.prototype.getNumeroIntegrantes = function() {
            
            return this.numeroIntegrantes;
        };
        
        GrupoChat.prototype.setEstado = function(estado) {
            this.estado = estado;
            return this;
        };
        
        GrupoChat.prototype.getEstado = function() {
            return this.estado;
        };
        
        GrupoChat.prototype.setDescripcionEstado = function(descripcionEstado) {
            this.descripcionEstado = descripcionEstado;
            return this;
        };
        
        GrupoChat.prototype.getDescripcionEstado = function() {
            return this.descripcionEstado;
        };
        
        GrupoChat.prototype.setId = function(id) {
            this.id = id;
            return this;
        };
        
        GrupoChat.prototype.getId = function() {
            return this.id;
        };
        
        GrupoChat.prototype.setNumeroIntegrantes = function(numeroIntegrantes) {
            this.numeroIntegrantes = numeroIntegrantes;
            return this;
        };
        
        GrupoChat.prototype.geNumeroIntegrantes = function() {
            return this.numeroIntegrantes;
        };
        
        GrupoChat.prototype.agregarUsuario = function(usuario) {
            
            for(var i in this.usuarios){
                if(usuario.getId() === usuarios[i].getId()){
                    return;
                }
            }
            
            this.usuarios.push(usuario);
            
        };
        
        GrupoChat.prototype.getUsuarios = function() {
            
            return this.usuarios;
            
        };
        
        GrupoChat.prototype.vaciarUsuarios = function() {
            this.usuarios = [];
        };

        this.get = function(id,nombre, fechaCreacion, numeroIntegrantes) {

            return new GrupoChat(id, nombre, fechaCreacion, numeroIntegrantes);
        };

        this.getClass = function(){
            return GrupoChat;
        };

        return this;

    });
});