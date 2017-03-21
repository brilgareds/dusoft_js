define(["angular", "js/models","includes/classes/GestionTerceros/BaseParametrizacion"], function(angular, models) {

    models.factory('TipoCorreo', ["BaseParametrizacion", function(BaseParametrizacion) {

        function TipoCorreo(id, descripcion) {
            
            BaseParametrizacion.getClass().call(this,id, descripcion);
           
        };

        this.get = function(id, descripcion) {

            return new TipoCorreo(id, descripcion);
        };


        TipoCorreo.prototype = Object.create(BaseParametrizacion.getClass().prototype);

        this.getClass = function(){
            return TipoCorreo;
        };

        return this;

    }]);
});