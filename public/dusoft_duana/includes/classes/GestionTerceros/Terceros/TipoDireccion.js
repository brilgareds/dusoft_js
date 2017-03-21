define(["angular", "js/models","includes/classes/GestionTerceros/BaseParametrizacion"], function(angular, models) {

    models.factory('TipoDireccion', ["BaseParametrizacion", function(BaseParametrizacion) {

        function TipoDireccion(id, descripcion) {
            
            BaseParametrizacion.getClass().call(this,id, descripcion);
           
        };

        this.get = function(id, descripcion) {

            return new TipoDireccion(id, descripcion);
        };


        TipoDireccion.prototype = Object.create(BaseParametrizacion.getClass().prototype);

        this.getClass = function(){
            return TipoDireccion;
        };

        return this;

    }]);
});