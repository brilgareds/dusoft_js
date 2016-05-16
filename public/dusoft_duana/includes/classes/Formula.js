
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