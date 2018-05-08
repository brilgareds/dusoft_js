
define(["angular", "js/models"], function(angular, models) {

    models.factory('PlanesRangos', function() {

        function PlanesRangos(tipoAfiliadoId,rango) {
            
            this.tipoAfiliadoId = tipoAfiliadoId || "";
            this.rango = rango || "";
            this.planes = [];
           
        };
        
        PlanesRangos.prototype.getTipoAfiliadoId = function(){
            return this.tipoAfiliadoId;
        };

        PlanesRangos.prototype.getRango = function(){
            return this.rango;
        };
        
        this.get = function(tipoAfiliadoId,rango){
            return new PlanesRangos(tipoAfiliadoId,rango);
        };

        this.getClass = function() {
            return PlanesRangos;
        };

        return this;

    });
});