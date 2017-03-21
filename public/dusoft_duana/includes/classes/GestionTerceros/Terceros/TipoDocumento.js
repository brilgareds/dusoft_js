define(["angular", "js/models","includes/classes/GestionTerceros/BaseParametrizacion"], function(angular, models) {

    models.factory('TipoDocumento', ["BaseParametrizacion", function(BaseParametrizacion) {

        function TipoDocumento(id, descripcion) {
            
            BaseParametrizacion.getClass().call(this,id, descripcion);
           
        };

        this.get = function(id, descripcion) {

            return new TipoDocumento(id, descripcion);
        };


        TipoDocumento.prototype = Object.create(BaseParametrizacion.getClass().prototype);

        this.getClass = function(){
            return Genero;
        };

        return this;

    }]);
});