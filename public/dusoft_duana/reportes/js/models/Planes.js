
define(["angular", "js/models"], function(angular, models) {

    models.factory('Planes',["$filter", function($filter) {

        function Planes(planId,planDescripcion) {
            this.planId=planId;
            this.planDescripcion=planDescripcion;
        };

        Planes.prototype.setPlanId = function(planId){
        	this.planId = planId;
        };
        
        Planes.prototype.getPlanId = function(){
        	return this.planId;
        };
        
        Planes.prototype.setPlanDescripcion = function(planDescripcion){
        	this.planDescripcion = planDescripcion;
        };
        
        Planes.prototype.getPlanDescripcion = function(){
        	return this.planDescripcion;
        };

        Planes.prototype.setOrden = function(orden){
            this.orden = orden;
        };

        this.get = function(planId,planDescripcion) {
            return new Planes(planId,planDescripcion);
        };

        return this;

    }]);

    
});