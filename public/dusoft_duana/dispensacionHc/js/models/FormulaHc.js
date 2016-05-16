
define(["angular", "js/models", "includes/classes/Formula"], function (angular, models) {

    models.factory('FormulaHc', ["Formula", function (Formula) {


            function FormulaHc(evolucionId,numeroFormula,tipoFormula, transcripcionMedica,descripcionTipoFormula,
                        fechaRegistro,fechaFinalizacion,fechaFormulacion) {
                            
                Formula.getClass().call(this,evolucionId,numeroFormula, tipoFormula, transcripcionMedica,descripcionTipoFormula,
                        fechaRegistro,fechaFinalizacion,fechaFormulacion);
                
                
            }
            
            FormulaHc.prototype = Object.create(Formula.getClass().prototype);
            
            
            
            
            this.get = function (evolucionId,numeroFormula,tipoFormula, transcripcionMedica,descripcionTipoFormula,
                        fechaRegistro,fechaFinalizacion,fechaFormulacion) {
                return new FormulaHc(evolucionId,numeroFormula,tipoFormula, transcripcionMedica,descripcionTipoFormula,
                        fechaRegistro,fechaFinalizacion,fechaFormulacion);
            };

            return this;

        }]);

});