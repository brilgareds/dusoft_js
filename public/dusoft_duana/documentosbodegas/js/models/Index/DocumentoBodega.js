define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocumentoBodega', ["Documento" , "$filter", function(Documento, $filter) {

            function DocumentoBodega(id, prefijo, numero, fecha_registro) {
                Documento.getClass().call(this, id, prefijo, numero, fecha_registro);
            }
            
            DocumentoBodega.prototype = Object.create(Documento.getClass().prototype);
            
            this.get = function(id, prefijo, numero, fecha_registro) {                
                return new DocumentoBodega(id, prefijo, numero, fecha_registro);
            };
            
            DocumentoBodega.prototype.getArchivo = function() {
               return this.archivo;
            };

            DocumentoBodega.prototype.setArchivo = function(archivo) {
                this.archivo = archivo;
            };
            
            DocumentoBodega.prototype.getPrefijoNumero = function() {
               return this.prefijoNumero;
            };

            DocumentoBodega.prototype.setPrefijoNumero = function(prefijoNumero) {
                this.prefijoNumero = prefijoNumero;
            };
            
            return this;
        }]);
});