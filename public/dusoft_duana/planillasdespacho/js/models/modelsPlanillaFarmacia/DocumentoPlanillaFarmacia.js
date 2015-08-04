
define(["angular", "js/models", "includes/classes/Documento"], function(angular, models) {

    models.factory('DocumentoPlanillaFarmacia', ["Documento", function(Documento) {
            
       
       function DocumentoPlanillaFarmacia(bodegas_doc_id, prefijo, numero, fecha_registro)  {
            Documento.getClass().call(this, bodegas_doc_id, prefijo, numero, fecha_registro);
           
        };

        DocumentoPlanillaFarmacia.prototype =  Object.create(Documento.getClass().prototype);

        
        this.get = function(bodegas_doc_id, prefijo, numero, fecha_registro)  {
            return new DocumentoPlanillaFarmacia(bodegas_doc_id, prefijo, numero, fecha_registro) ;
        };
        
        return this;

    }]);

});