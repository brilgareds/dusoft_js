define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocumentoBodega', ["Documento" , "$filter", function(Documento, $filter) {

            function DocumentoBodega(id, prefijo, numero, fecha_registro) {
                console.log('== =here == ');
                Documento.getClass().call(this, id, prefijo, numero, fecha_registro);
            }
            
            DocumentoBodega.prototype = Object.create(Documento.getClass().prototype);
            
            this.get = function(id, prefijo, numero, fecha_registro) {                
                return new DocumentoBodega(id, prefijo, numero, fecha_registro);
            };
            
            return this;
        }]);
});