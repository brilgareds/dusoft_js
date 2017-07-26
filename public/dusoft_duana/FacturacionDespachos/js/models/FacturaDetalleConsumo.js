
define(["angular", "js/models"], function (angular, models) {

    models.factory('FacturaDetalleConsumo', ["FacturaDetalle", function (FacturaDetalle) {


            function FacturaDetalleConsumo(){
                FacturaDetalle.getClass().call(this);
                this.detalle = [];
            }
            
            FacturaDetalleConsumo.prototype.agregarDetalle = function (detalle) {
                this.detalle.push(detalle);
            };

            FacturaDetalleConsumo.prototype.vaciarDetalle = function () {
                this.detalle = [];
            };
            
            this.get = function () {
                return new FacturaDetalleConsumo();
            };

            return this;

        }]);

});