define(["angular", "js/models","includes/classes/GestionTerceros/BaseParametrizacion"], function(angular, models) {

    models.factory('NomenclaturaDireccion', ["BaseParametrizacion", function(BaseParametrizacion) {

        function NomenclaturaDireccion(id, descripcion) {
            
            BaseParametrizacion.getClass().call(this,id, descripcion);
           
        };

        this.get = function(id, descripcion) {

            return new NomenclaturaDireccion(id, descripcion);
        };


        NomenclaturaDireccion.prototype = Object.create(BaseParametrizacion.getClass().prototype);

        this.getClass = function(){
            return NomenclaturaDireccion;
        };

        return this;

    }]);
});