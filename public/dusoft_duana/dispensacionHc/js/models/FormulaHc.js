
define(["angular", "js/models", "includes/classes/Formula"], function (angular, models) {

    models.factory('FormulaHc', ["Formula", function (Formula) {


            function FormulaHc(evolucionId,numeroFormula,tipoFormula, transcripcionMedica,descripcionTipoFormula,
                        fechaRegistro,fechaFinalizacion,fechaFormulacion) {
                            
                Formula.getClass().call(this,evolucionId,numeroFormula, tipoFormula, transcripcionMedica,descripcionTipoFormula,
                        fechaRegistro,fechaFinalizacion,fechaFormulacion);
                
                this.productos = [];
            }
            
            FormulaHc.prototype = Object.create(Formula.getClass().prototype);
            
            
             FormulaHc.prototype.agregarProductos = function(producto){
                this.productos.push(producto);
             };
             
             FormulaHc.prototype.mostrarProductos = function(){
                return this.productos;
             };
             
             FormulaHc.prototype.vaciarProductos = function () {
                this.productos = [];
             };
             
            
            
            this.get = function (evolucionId,numeroFormula,tipoFormula, transcripcionMedica,descripcionTipoFormula,
                        fechaRegistro,fechaFinalizacion,fechaFormulacion) {
                return new FormulaHc(evolucionId,numeroFormula,tipoFormula, transcripcionMedica,descripcionTipoFormula,
                        fechaRegistro,fechaFinalizacion,fechaFormulacion);
            };

            return this;

        }]);

});