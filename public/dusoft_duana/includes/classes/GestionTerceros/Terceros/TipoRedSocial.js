define(["angular", "js/models","includes/classes/GestionTerceros/BaseParametrizacion"], function(angular, models) {

    models.factory('TipoRedSocial', ["BaseParametrizacion", function(BaseParametrizacion) {

        function TipoRedSocial(id, descripcion) {
            
            BaseParametrizacion.getClass().call(this,id, descripcion);
           
        };

        this.get = function(id, descripcion) {

            return new TipoRedSocial(id, descripcion);
        };


        TipoRedSocial.prototype = Object.create(BaseParametrizacion.getClass().prototype);

        this.getClass = function(){
            return TipoRedSocial;
        };

        return this;

    }]);
});