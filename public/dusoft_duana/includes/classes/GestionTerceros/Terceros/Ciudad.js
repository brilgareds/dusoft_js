define(["angular", "js/models","includes/classes/GestionTerceros/BaseParametrizacion"], function(angular, models) {

    models.factory('Ciudad', ["BaseParametrizacion", function(BaseParametrizacion) {

        function Ciudad(id, descripcion) {
            
            BaseParametrizacion.getClass().call(this,id, descripcion);
           
        };
        
        Ciudad.prototype = Object.create(BaseParametrizacion.getClass().prototype);
        
        this.get = function(id, descripcion) {

            return new Ciudad(id, descripcion);
        };

        this.getClass = function(){
            return Ciudad;
        };

        return this;

    }]);
});