
define(["angular", "js/models", "includes/classes/Factura"], function (angular, models) {

    models.factory('FacturaConsumo', ["Factura", function (Factura) {


            function FacturaConsumo(){
                Factura.getClass().call(this);
                this.detalle = [];
                this.documentos = [];
            }
            

            
            this.get = function () {
                return new FacturaConsumo();
            };

            return this;

        }]);

});