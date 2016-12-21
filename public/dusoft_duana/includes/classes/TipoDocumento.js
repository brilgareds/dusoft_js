
define(["angular", "js/models"], function(angular, models) {

    models.factory('TipoDocumento', function() {

        function TipoDocumento(tipo,descripcion) {
            
            this.tipo = tipo || "";
            this.descripcion = descripcion || "";
           
        };
        
        TipoDocumento.prototype.getTipo = function(){
            return this.tipo;
        };

        TipoDocumento.prototype.getDescripcion = function(){
            return this.descripcion;
        };
        
        this.get = function(tipo,descripcion){
            return new (tipo,descripcion);
        };

        this.getClass = function() {
            return TipoDocumento;
        };

        return this;

    });
});