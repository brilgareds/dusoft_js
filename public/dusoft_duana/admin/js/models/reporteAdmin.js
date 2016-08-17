
define(["angular", "js/models"], function(angular, models) {

    models.factory('reporteAdmin', function() {

        function reporteAdmin(autorizacionId) {
            this.autorizacionId = autorizacionId;
        }

        reporteAdmin.prototype.getAutorizacionId = function() {
            return this.autorizacionId;
        };

        reporteAdmin.prototype.setAutorizacionId = function(autorizacionId) {
            this.autorizacionId = autorizacionId;
        };

        reporteAdmin.prototype.getFechaVerificacion = function() {
            return this.fechaVerificacion;
        };

        reporteAdmin.prototype.setFechaVerificacion = function(fechaVerificacion) {
            this.fechaVerificacion = fechaVerificacion;
        };

        reporteAdmin.prototype.getResponsable = function() {
            return this.responsable;
        };

        reporteAdmin.prototype.setResponsable = function(responsable) {
            this.responsable = responsable;
        };

        reporteAdmin.prototype.getEstado = function() {
            return this.estado;
        };

        reporteAdmin.prototype.setEstado = function(estado) {
            this.estado = estado;
        };

        reporteAdmin.prototype.getNombreVerifica = function() {
            return this.nombreVerifica;
        };

        reporteAdmin.prototype.setNombreVerifica = function(nombreVerifica) {
            this.nombreVerifica = nombreVerifica;
        };

        reporteAdmin.prototype.getNombreEstado = function() {
            return this.estado_verificado;
        };

        reporteAdmin.prototype.setNombreEstado = function(estado_verificado) {
            this.estado_verificado = estado_verificado;
        };

        this.get = function(autorizacionId) {
            return new reporteAdmin(autorizacionId);
        };

        return this;

    });
});
