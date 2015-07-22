
define(["angular", "js/models", "includes/classes/Bodega"], function(angular, models) {

    models.factory('BodegasInduccion', ["Bodega", function(Bodega) {
            
       
       function BodegasInduccion(nombre, codigo) {
            Bodega.getClass().call(this, nombre, codigo);
        };

         BodegasInduccion.prototype =  Object.create(Bodega.getClass().prototype);
        
   
        this.get = function(nombre, codigo) {
            return new BodegasInduccion(nombre, codigo);
        };

        return this;

    }]);
});