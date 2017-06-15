
define(["angular", "js/models"], function(angular, models) {

    models.factory('ConceptoCaja', ["Concepto", function(Concepto) {


            function ConceptoCaja(conceptoId) {
                Concepto.getClass().call(this, conceptoId);
            }

            ConceptoCaja.prototype = Object.create(Concepto.getClass().prototype);


            this.get = function(conceptoId) {
                return new ConceptoCaja(conceptoId);
            };

            return this;

        }]);

});