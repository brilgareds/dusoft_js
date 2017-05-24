define(["angular", "js/models","includes/classes/GestionTerceros/BaseParametrizacion"], function(angular, models) {

    models.factory('TipoNaturaleza', ["BaseParametrizacion", function(BaseParametrizacion) {

        function TipoNaturaleza(id, descripcion) {
            BaseParametrizacion.getClass().call(this,id, descripcion);
            this.codigo = id;
           
        };

        this.get = function(id, descripcion) {

            return new TipoNaturaleza(id, descripcion);
        };


        TipoNaturaleza.prototype = Object.create(BaseParametrizacion.getClass().prototype);

        this.getClass = function(){
            return TipoNaturaleza;
        };

        return this;

    }]);
});