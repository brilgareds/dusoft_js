define(["angular", "js/models"], function(angular, models) {

    models.factory('BaseParametrizacion', [function() {

        function BaseParametrizacion(id, descripcion) {
            this.id = id || "";
            this.descripcion = descripcion || "";
            this.codigo = "";
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
        
        BaseParametrizacion.prototype.setCodigo = function(codigo){
            this.codigo = codigo;
            return this;
        };
        
        BaseParametrizacion.prototype.getCodigo = function(){
            return this.codigo;
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