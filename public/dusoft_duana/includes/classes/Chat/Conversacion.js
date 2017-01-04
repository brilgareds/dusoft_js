
define(["angular", "js/models"], function(angular, models) {

    models.factory('Conversacion',  function() {

        function Conversacion(id, nombre, fechaCreacion) {
            this.id = id || 0;
            this.nombre = nombre || "";
            this.fechaCreacion = fechaCreacion;
            this.usuarios = [];
            this.detalle = [];
            this.notificacion = false;
        };
        
        
        Conversacion.prototype.setNombre = function(nombre) {
            this.nombre = nombre;
            return this;
        };
        
        Conversacion.prototype.getNombre = function() {
            return this.nombre;
        };
        
        Conversacion.prototype.setFechaCreacion = function(fechaCreacion) {
            this.fechaCreacion = fechaCreacion;
            return this;
        };
        
        
        Conversacion.prototype.getFechaCreacion = function() {
            
            return this.fechaCreacion;
        };
        
        Conversacion.prototype.setNumeroIntegrantes = function(numeroIntegrantes) {
            this.numeroIntegrantes = numeroIntegrantes;
            return this;
        };
        
        Conversacion.prototype.getNumeroIntegrantes = function() {
            
            return this.numeroIntegrantes;
        };
        
        Conversacion.prototype.setEstado = function(estado) {
            this.estado = estado;
            return this;
        };
        
        Conversacion.prototype.getEstado = function() {
            return this.estado;
        };
        
        Conversacion.prototype.setDescripcionEstado = function(descripcionEstado) {
            this.descripcionEstado = descripcionEstado;
            return this;
        };
        
        Conversacion.prototype.getDescripcionEstado = function() {
            return this.descripcionEstado;
        };
        
        Conversacion.prototype.setId = function(id) {
            this.id = id;
            return this;
        };
        
        Conversacion.prototype.getId = function() {
            return this.id;
        };
        
        Conversacion.prototype.setNumeroIntegrantes = function(numeroIntegrantes) {
            this.numeroIntegrantes = numeroIntegrantes;
            return this;
        };
        
        Conversacion.prototype.geNumeroIntegrantes = function() {
            return this.numeroIntegrantes;
        };
        
        Conversacion.prototype.agregarUsuario = function(usuario) {
            
            for(var i in this.usuarios){
                if(usuario.getId() === this.usuarios[i].getId()){
                    return;
                }
            }
            
            this.usuarios.push(usuario);
            
        };
        
        Conversacion.prototype.agregarDetalle = function(mensaje, agregarALFinal) {
            
            /*for(var i in this.detalle){
                if(mensaje.getId() === this.detalle[i].getId()){
                    return;
                }
            }*/
            if(agregarALFinal){
                this.detalle.push(mensaje);
            } else {
                this.detalle.unshift(mensaje);
                
            }
            
        };
        
        Conversacion.prototype.vaciarDetalle = function(mensaje) {

            this.detalle = [];
            
        };
        
        Conversacion.prototype.getUsuarios = function() {
            
            return this.usuarios;
            
        };
        
        Conversacion.prototype.vaciarUsuarios = function() {
            this.usuarios = [];
        };
        
        Conversacion.prototype.setNotificacion = function(notificacion) {
            this.notificacion = notificacion;
            return this;
        };
        
        Conversacion.prototype.tieneNotificacion = function() {
            return this.notificacion;
        };
        
        
        this.get = function(id, nombre, fechaCreacion) {

            return new Conversacion(id, nombre, fechaCreacion);
        };

        this.getClass = function(){
            return Conversacion;
        };

        return this;

    });
});