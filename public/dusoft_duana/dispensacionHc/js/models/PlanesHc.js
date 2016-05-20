
define(["angular", "js/models", "includes/classes/Planes"], function (angular, models) {

    models.factory('PlanesHc', ["Planes", function (Planes) {


            function PlanesHc(planId, descripcion) {                           
                Planes.getClass().call(this,planId, descripcion); 
            }
            
            PlanesHc.prototype = Object.create(Planes.getClass().prototype);
            
            
            this.get = function (planId, descripcion) {
                return new PlanesHc(planId, descripcion);
            };

            return this;

        }]);

});