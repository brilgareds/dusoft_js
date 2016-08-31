
define(["angular", "js/models"], function(angular, models) {

    models.factory('Formula', function() {

        function Formula(evolucionId,numeroFormula,tipoFormula, transcripcionMedica,descripcionTipoFormula,
                        fechaRegistro,fechaFinalizacion,fechaFormulacion
                        ) {
            this.evolucionId = evolucionId || "";
            this.numeroFormula = numeroFormula || "";
            this.tipoFormula = tipoFormula || "";
            this.transcripcionMedica = transcripcionMedica || "";
            this.descripcionTipoFormula = descripcionTipoFormula || "";
            this.fechaRegistro = fechaRegistro || "";
            this.fechaFinalizacion = fechaFinalizacion || "";
            this.fechaFormulacion = fechaFormulacion || "";
            this.estado;
            this.estadoEntrega;
            this.descripcionEstadoEntrega;
        };
        
        
        //Operaciones Get de parámetros iniciales de creación de Formula
        Formula.prototype.getEvolucionId = function(){
            return this.evolucionId;
        };
        
        Formula.prototype.getNumeroFormula = function(){
            return this.numeroFormula;
        };
        
        
        Formula.prototype.getTipoFormula = function(){
            return this.tipoFormula;
        };
        
        Formula.prototype.getTranscripcionMedica = function(){
            return this.transcripcionMedica;
        };
        
        Formula.prototype.getDescripcionTipoFormula = function(){
            return this.descripcionTipoFormula;
        };
        
        Formula.prototype.getFechaRegistro = function(){
            return this.fechaRegistro;
        };
        
        Formula.prototype.getFechaFinalizacion = function(){
            return this.fechaFinalizacion;
        };
        
        Formula.prototype.getFechaFormulacion = function(){
            return this.fechaFormulacion;
        };
        
        
        Formula.prototype.setEstado = function(estado){
             this.estado = estado;
        };
       
        Formula.prototype.getEstado = function(){
            return this.estado;
        };
        
        
        Formula.prototype.setEstadoEntrega = function(estadoEntrega){
             this.estadoEntrega = estadoEntrega;
        };
       
        Formula.prototype.getEstadoEntrega = function(){
            return this.estadoEntrega;
        };
        
        
        Formula.prototype.setDescripcionEstadoEntrega = function(descripcionEstadoEntrega){
             this.descripcionEstadoEntrega = descripcionEstadoEntrega;
        };
       
        Formula.prototype.getDescripcionEstadoEntrega = function(){
            return this.descripcionEstadoEntrega;
        };
        
        this.get = function(evolucionId,numeroFormula,tipoFormula, transcripcionMedica,descripcionTipoFormula,
                        fechaRegistro,fechaFinalizacion,fechaFormulacion) {
            return new Formula(evolucionId,numeroFormula,tipoFormula, transcripcionMedica,descripcionTipoFormula,
                        fechaRegistro,fechaFinalizacion,fechaFormulacion);
        };

        this.getClass = function() {
            return Formula;
        };

        return this;

    });
});