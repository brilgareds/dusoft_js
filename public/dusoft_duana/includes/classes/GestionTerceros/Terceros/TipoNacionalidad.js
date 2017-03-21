define(["angular", "js/models","includes/classes/GestionTerceros/BaseParametrizacion"], function(angular, models) {

    models.factory('TipoNacionalidad', ["BaseParametrizacion", function(BaseParametrizacion) {

        function TipoNacionalidad(id, descripcion) {
            
            BaseParametrizacion.getClass().call(this,id, descripcion);
           
        };

        this.get = function(id, descripcion) {

            return new TipoNacionalidad(id, descripcion);
        };


        TipoNacionalidad.prototype = Object.create(BaseParametrizacion.getClass().prototype);

        this.getClass = function(){
            return TipoNacionalidad;
        };

        return this;

    }]);
});