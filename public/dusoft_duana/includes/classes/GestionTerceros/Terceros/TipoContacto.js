define(["angular", "js/models","includes/classes/GestionTerceros/BaseParametrizacion"], function(angular, models) {

    models.factory('TipoContacto', ["BaseParametrizacion", function(BaseParametrizacion) {

        function TipoContacto(id, descripcion) {
            
            BaseParametrizacion.getClass().call(this,id, descripcion);
           
        };

        this.get = function(id, descripcion) {

            return new TipoContacto(id, descripcion);
        };


        TipoContacto.prototype = Object.create(BaseParametrizacion.getClass().prototype);

        this.getClass = function(){
            return TipoContacto;
        };

        return this;

    }]);
});