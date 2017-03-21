define(["angular", "js/models","includes/classes/GestionTerceros/BaseParametrizacion"], function(angular, models) {

    models.factory('TipoTelefono', ["BaseParametrizacion", function(BaseParametrizacion) {

        function TipoTelefono(id, descripcion) {
            
            BaseParametrizacion.getClass().call(this,id, descripcion);
           
        };

        this.get = function(id, descripcion) {

            return new TipoTelefono(id, descripcion);
        };


        TipoTelefono.prototype = Object.create(BaseParametrizacion.getClass().prototype);

        this.getClass = function(){
            return TipoTelefono;
        };

        return this;

    }]);
});