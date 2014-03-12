
define(["angular", "js/models"], function(angular, models) {

    models.factory('Farmacia', function() {

        function Farmacia(farmacia_id, bodega_id, nombre_farmacia, nombre_bodega) {
            
            this.farmacia_id = farmacia_id;
            this.bodega_id = bodega_id;
            this.nombre_farmacia = nombre_farmacia;
            this.nombre_bodega = nombre_bodega;
        }

        this.get = function(farmacia_id, bodega_id, nombre_farmacia, nombre_bodega) {
            return new Farmacia(farmacia_id, bodega_id, nombre_farmacia, nombre_bodega);
        };

        this.getClass = function(){
            return Farmacia;
        };

        return this;

    });
});