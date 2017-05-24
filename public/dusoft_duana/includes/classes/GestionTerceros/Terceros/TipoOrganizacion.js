define(["angular", "js/models","includes/classes/GestionTerceros/BaseParametrizacion"], function(angular, models) {

    models.factory('TipoOrganizacion', ["BaseParametrizacion", function(BaseParametrizacion) {

        function TipoOrganizacion(id, descripcion) {
            
            BaseParametrizacion.getClass().call(this,id, descripcion);
           
        };

        this.get = function(id, descripcion) {

            return new TipoOrganizacion(id, descripcion);
        };


        TipoOrganizacion.prototype = Object.create(BaseParametrizacion.getClass().prototype);

        this.getClass = function(){
            return TipoOrganizacion;
        };

        return this;

    }]);
});