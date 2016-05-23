
define(["angular", "js/models"], function(angular, models) {

    models.factory('Autorizacion', function() {

        function Autorizacion(autorizacionId) {
            this.autorizacionId = autorizacionId;
        }

        Autorizacion.prototype.getAutorizacionId = function() {
            return this.autorizacionId;
        };

        Autorizacion.prototype.setAutorizacionId = function(autorizacionId) {
            this.autorizacionId = autorizacionId;
        };

        Autorizacion.prototype.getFechaVerificacion = function() {
            return this.fechaVerificacion;
        };

        Autorizacion.prototype.setFechaVerificacion = function(fechaVerificacion) {
            this.fechaVerificacion = fechaVerificacion;
        };

        Autorizacion.prototype.getResponsable = function() {
            return this.responsable;
        };

        Autorizacion.prototype.setResponsable = function(responsable) {
            this.responsable = responsable;
        };

        Autorizacion.prototype.getEstado = function() {
            return this.estado;
        };

        Autorizacion.prototype.setEstado = function(estado) {
            this.estado = estado;
        };

        Autorizacion.prototype.getNombreVerifica = function() {
            return this.nombreVerifica;
        };

        Autorizacion.prototype.setNombreVerifica = function(nombreVerifica) {
            this.nombreVerifica = nombreVerifica;
        };

        Autorizacion.prototype.getNombreEstado = function() {
            return this.estado_verificado;
        };

        Autorizacion.prototype.setNombreEstado = function(estado_verificado) {
            this.estado_verificado = estado_verificado;
        };

        this.get = function(autorizacionId) {
            return new Autorizacion(autorizacionId);
        };

        return this;

    });
});
