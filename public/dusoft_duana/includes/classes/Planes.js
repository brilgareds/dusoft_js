
define(["angular", "js/models"], function(angular, models) {

    models.factory('Planes', function() {

        function Planes(planId,descripcion) {
            
            this.planId = planId || "";
            this.descripcion = descripcion || "";
           
        };
        
        Planes.prototype.getPlanId = function(){
            return this.planId;
        };

        Planes.prototype.getDescripcion = function(){
            return this.descripcion;
        };
        
        this.get = function(planId,descripcion){
            return new (planId,descripcion);
        };

        this.getClass = function() {
            return Planes;
        };

        return this;

    });
});