
define(["angular", "js/models", "includes/classes/PlanesRangos"], function (angular, models) {

    models.factory('PlanesRangosHc', ["PlanesRangos", function (PlanesRangos) {


            function PlanesRangosHc(tipoAfiliadoId,rango) {                          
                PlanesRangos.getClass().call(this,tipoAfiliadoId,rango); 
                this.planes = [];
            }
            
            PlanesRangosHc.prototype = Object.create(PlanesRangos.getClass().prototype);
            
            
            PlanesRangosHc.prototype.agregarPlanes = function(plan){
                this.planes.push(plan);
             };
             
             PlanesRangosHc.prototype.mostrarPlanes = function(){
                return this.planes;
             };
             
             PlanesRangosHc.prototype.vaciarPlanes = function () {
                this.planes = [];
             };
            
            this.get = function (tipoAfiliadoId,rango) {
                return new PlanesRangosHc(tipoAfiliadoId,rango);
            };

            return this;

        }]);

});