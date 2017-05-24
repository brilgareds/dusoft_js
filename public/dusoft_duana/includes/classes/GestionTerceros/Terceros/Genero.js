define(["angular", "js/models","includes/classes/GestionTerceros/BaseParametrizacion"], function(angular, models) {

    models.factory('Genero', ["BaseParametrizacion", function(BaseParametrizacion) {

        function Genero(id, descripcion) {
            
            BaseParametrizacion.getClass().call(this,id, descripcion);
           
        };

        this.get = function(id, descripcion) {

            return new Genero(id, descripcion);
        };


        Genero.prototype = Object.create(BaseParametrizacion.getClass().prototype);

        this.getClass = function(){
            return Genero;
        };

        return this;

    }]);
});