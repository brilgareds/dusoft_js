
define(["angular", "js/models"], function(angular, models) {

    models.factory('PendienteFarmacias', function() {

        function PendienteFarmacias(fecha_registro) {
            this.farmacia;
            this.fecha_registro;
        }

        PendienteFarmacias.prototype.setFarmacia = function(farmacia){
        	this.farmacia = farmacia;
        }

        this.get = function() {
            return new PendienteFarmacias();
        }

        return this;

    });
});