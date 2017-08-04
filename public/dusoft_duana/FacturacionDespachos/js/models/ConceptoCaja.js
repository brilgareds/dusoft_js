
define(["angular", "js/models"], function(angular, models) {

    models.factory('ConceptoCaja', ["Concepto", function(Concepto) {


            function ConceptoCaja(conceptoId) {
                Concepto.getClass().call(this, conceptoId);
		this.totales = [];
            }

            ConceptoCaja.prototype = Object.create(Concepto.getClass().prototype);

            ConceptoCaja.prototype.agregarToltales= function (totales) {
                this.totales.push(totales);
            };

            ConceptoCaja.prototype.vaciarToltales = function () {
                this.totales = [];
            };

            ConceptoCaja.prototype.mostrarToltales = function () {
                return this.totales;
            };
	   
	   
            this.get = function(conceptoId) {
                return new ConceptoCaja(conceptoId);
            };

            return this;

        }]);

});