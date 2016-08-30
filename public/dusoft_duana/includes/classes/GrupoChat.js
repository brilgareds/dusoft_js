
define(["angular", "js/models"], function(angular, models) {

    models.factory('GrupoChat',  function() {

        function GrupoChat(id, nombre, fechaCreacion, numeroIntegrantes) {
            this.id = id;
            this.nombre = nombre;
            this.fechaCreacion = fechaCreacion;
            this.numeroIntegrantes = numeroIntegrantes || 0;
            this.estado = "";
            this.descripcionEstado = "";
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
        

        this.get = function(nombre, fechaCreacion, numeroIntegrantes) {

            return new GrupoChat(nombre, fechaCreacion, numeroIntegrantes);
        };

        this.getClass = function(){
            return GrupoChat;
        };

        return this;

    });
});