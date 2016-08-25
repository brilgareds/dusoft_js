
define(["angular", "js/models","includes/classes/Farmacia"], function(angular, models) {

    models.factory('FarmaciaVenta', function(Farmacia) {

        function FarmaciaVenta(farmacia_id, bodega_id, nombre_farmacia, nombre_bodega, centro_utilidad_id, nombre_centro_utilidad) {
             Farmacia.getClass().call(this,farmacia_id, bodega_id, nombre_farmacia, nombre_bodega, centro_utilidad_id, nombre_centro_utilidad);
            
        }
        FarmaciaVenta.prototype = Object.create(Farmacia.getClass().prototype);
        
        this.get = function(farmacia_id, bodega_id, nombre_farmacia, nombre_bodega, centro_utilidad_id, nombre_centro_utilidad) {
            return new FarmaciaVenta(farmacia_id, bodega_id, nombre_farmacia, nombre_bodega, centro_utilidad_id, nombre_centro_utilidad);
        };

        return this;

    });
});