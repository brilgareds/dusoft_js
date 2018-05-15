define(["angular", "js/models", "includes/classes/PlanesRangos"], function (angular, models) {

    models.factory('PlanesRangosEsm', ["PlanesRangos", function (PlanesRangos) {

        function PlanesRangosEsm(tipoAfiliadoId,rango) {                          
            PlanesRangos.getClass().call(this,tipoAfiliadoId,rango); 
        }
        
        PlanesRangosEsm.prototype = Object.create(PlanesRangos.getClass().prototype);
        
        PlanesRangosEsm.prototype.agregarPlanes = function(plan){
            this.planes.push(plan);
         };
         
         PlanesRangosEsm.prototype.mostrarPlanes = function(){
            return this.planes;
         };
         
         PlanesRangosEsm.prototype.vaciarPlanes = function () {
            this.planes = [];
         };
        
        this.get = function (tipoAfiliadoId,rango) {
            return new PlanesRangosEsm(tipoAfiliadoId,rango);
        };

        return this;

    }]);

});