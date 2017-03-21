define(["angular", "js/models"], function(angular, models) {

    models.factory('BaseParametrizacion', [function() {

        function BaseParametrizacion(id, descripcion) {
            this.id = id || "";
            this.descripcion = descripcion || "";
        };
        
        BaseParametrizacion.prototype.setId = function(id){
            this.id = id;
            return this;
        };
        
        BaseParametrizacion.prototype.getId = function(){
            return this.id;
        };
        
        BaseParametrizacion.prototype.setDescripcion = function(descripcion){
            this.descripcion = descripcion;
            return this;
        };
        
        BaseParametrizacion.prototype.getDescripcion = function(){
            return this.descripcion;
        };

        this.get = function(id, descripcion) {
            return new BaseParametrizacion(id, descripcion);
        };

        this.getClass = function(){
            return BaseParametrizacion;
        };

        return this;

    }]);
});