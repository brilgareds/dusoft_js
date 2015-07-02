
define(["angular", "js/models"], function(angular, models) {

    models.factory('Farmacia', function() {

        function Farmacia(farmacia_id, bodega_id, nombre_farmacia, nombre_bodega, centro_utilidad_id, nombre_centro_utilidad) {
            this.farmacia_id = farmacia_id || 0;
            this.bodega_id = bodega_id || 0;
            this.nombre_farmacia = nombre_farmacia || "";
            this.nombre_bodega = nombre_bodega || "";
            this.centro_utilidad_id = centro_utilidad_id || "";
            this.nombre_centro_utilidad = nombre_centro_utilidad || "";
        }
        
        
        Farmacia.prototype.get_farmacia_id = function() {
            return this.farmacia_id;
        };

        Farmacia.prototype.get_nombre_farmacia = function() {
            return this.nombre_farmacia;
        };
        
        Farmacia.prototype.getCentroUtilidadId = function() {
            return this.centro_utilidad_id;
        };

        Farmacia.prototype.setCentroUtilidadId = function(centro_utilidad_id) {
            this.centro_utilidad_id = centro_utilidad_id;
        };
        
        Farmacia.prototype.getBodegaId = function() {
            return this.bodega_id;
        };

        Farmacia.prototype.setBodegaId = function(bodega_id) {
            this.bodega_id = bodega_id;
        };
        
        this.get = function(farmacia_id, bodega_id, nombre_farmacia, nombre_bodega, centro_utilidad_id, nombre_centro_utilidad) {
            return new Farmacia(farmacia_id, bodega_id, nombre_farmacia, nombre_bodega, centro_utilidad_id, nombre_centro_utilidad);
        };

        this.getClass = function(){
            return Farmacia;
        };
        
        

        return this;

    });
});