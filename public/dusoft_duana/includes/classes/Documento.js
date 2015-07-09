define(["angular", "js/models"], function(angular, models) {

    models.factory('Documento', function() {
 
        function Documento(id, prefijo, numero, fecha_registro) {
            
            this.id = id;
            this.prefijo = prefijo || "";
            this.numero = numero || "";
            this.fecha_registro = fecha_registro || "";            
        };

        this.get = function(id, prefijo, numero, fecha_registro) {
            return new Documento(id, prefijo, numero, fecha_registro);
        };

        
        this.getClass = function(){
            return Documento;
        };

        return this;

    });
});