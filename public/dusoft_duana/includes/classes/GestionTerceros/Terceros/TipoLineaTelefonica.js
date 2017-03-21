define(["angular", "js/models","includes/classes/GestionTerceros/BaseParametrizacion"], function(angular, models) {

    models.factory('TipoLineaTelefonica', ["BaseParametrizacion", function(BaseParametrizacion) {

        function TipoLineaTelefonica(id, descripcion) {
            
            BaseParametrizacion.getClass().call(this,id, descripcion);
           
        };

        this.get = function(id, descripcion) {

            return new TipoLineaTelefonica(id, descripcion);
        };


        TipoLineaTelefonica.prototype = Object.create(BaseParametrizacion.getClass().prototype);

        this.getClass = function(){
            return TipoLineaTelefonica;
        };

        return this;

    }]);
});