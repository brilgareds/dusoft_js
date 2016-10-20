
define(["angular", "js/models"], function(angular, models) {

    models.factory('ConversacionDetalle',  function() {

        function ConversacionDetalle(id, usuario, mensaje, archivo,  fechaCreacion) {
            this.id = id || 0;
            this.usuario = usuario || "";
            this.mensaje = mensaje;
            this.fechaCreacion = fechaCreacion;
            this.archivo = archivo || "";
        };
        
        
        ConversacionDetalle.prototype.setUsuario = function(usuario) {
            this.usuario = usuario;
            return this;
        };
        
        ConversacionDetalle.prototype.getUsuario = function() {
            return this.usuario;
        };
        
        ConversacionDetalle.prototype.setArchivo = function(archivo) {
            this.archivo = archivo;
            return this;
        };
        
        ConversacionDetalle.prototype.getArchivo = function() {
            return this.archivo;
        };
        
        ConversacionDetalle.prototype.setFechaCreacion = function(fechaCreacion) {
            this.fechaCreacion = fechaCreacion;
            return this;
        };
        
        ConversacionDetalle.prototype.getFechaCreacion = function() {
            
            return this.fechaCreacion;
        };
        
        
        ConversacionDetalle.prototype.setEstado = function(estado) {
            this.estado = estado;
            return this;
        };
        
        ConversacionDetalle.prototype.getEstado = function() {
            return this.estado;
        };
        
        ConversacionDetalle.prototype.setMensaje = function(mensaje) {
            this.mensaje = mensaje;
            return this;
        };
        
        ConversacionDetalle.prototype.getMensaje = function() {
            return this.mensaje;
        };
        
        ConversacionDetalle.prototype.setId = function(id) {
            this.id = id;
            return this;
        };
        
        ConversacionDetalle.prototype.getId = function() {
            return this.id;
        };


        this.get = function(id, usuario, mensaje, archivo,  fechaCreacion) {

            return new ConversacionDetalle(id, usuario, mensaje, archivo,  fechaCreacion);
        };

        this.getClass = function(){
            return ConversacionDetalle;
        };

        return this;

    });
});