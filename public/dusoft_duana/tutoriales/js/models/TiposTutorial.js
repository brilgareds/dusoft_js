
define(["angular", "js/models"], function (angular, models) {

    models.factory('TiposTutorial', [function () {

        function TiposTutorial(id,descripcion) {
            this.id = id || "";
            this.descripcion = descripcion || "";
        };
        
        TiposTutorial.prototype.setId = function(id){
            this.id = id;
            return this;
        };
        
        TiposTutorial.prototype.getId = function(){
            return this.id;
        };
        
        TiposTutorial.prototype.setDescripcion = function(descripcion){
            this.descripcion = descripcion;
            return this;
        };
        
        TiposTutorial.prototype.getDescripcion = function(){
            return this.descripcion;
        };


        this.get = function (id,descripcion) {
            return new TiposTutorial(id,descripcion);
        };

        return this;

    }]);

});