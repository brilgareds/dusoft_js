define(["angular", "js/models","includes/classes/GestionTerceros/BaseParametrizacion"], function(angular, models) {

    models.factory('EstadoCivil', ["BaseParametrizacion", function(BaseParametrizacion) {

        function EstadoCivil(id, descripcion) {
            
            BaseParametrizacion.getClass().call(this,id, descripcion);
           
        };

        this.get = function(id, descripcion) {

            return new EstadoCivil(id, descripcion);
        };


        EstadoCivil.prototype = Object.create(BaseParametrizacion.getClass().prototype);

        this.getClass = function(){
            return EstadoCivil;
        };

        return this;

    }]);
});