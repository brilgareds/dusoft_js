
define(["angular", "js/models"], function(angular, models) {

    models.factory('PlanesRangos', function() {

        function PlanesRangos(tipoAfiliadoId,rango) {
            
            this.tipoAfiliadoId = tipoAfiliadoId || "";
            this.rango = rango || "";
           
        };
        
        PlanesRangos.prototype.getTipoAfiliadoId = function(){
            return this.afiliadoTipoId;
        };

        PlanesRangos.prototype.getRango = function(){
            return this.planAtencion;
        };
        
        this.get = function(tipoAfiliadoId,rango){
            return new (tipoAfiliadoId,rango);
        };

        this.getClass = function() {
            return PlanesRangos;
        };

        return this;

    });
});