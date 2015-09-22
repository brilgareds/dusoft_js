
define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocumentoDespacho', ["Documento", function(Documento) {
            
       
       function DocumentoDespacho(bodegas_doc_id, prefijo, numero, fecha_registro) {
            Documento.getClass().call(this, bodegas_doc_id, prefijo, numero, fecha_registro);
            this.centrosUtilidad = [];
        };

         DocumentoDespacho.prototype =  Object.create(Documento.getClass().prototype);
         
         
        this.get = function(bodegas_doc_id, prefijo, numero, fecha_registro) {
            return new DocumentoDespacho(bodegas_doc_id, prefijo, numero, fecha_registro);
        };

        return this;

    }]);

});