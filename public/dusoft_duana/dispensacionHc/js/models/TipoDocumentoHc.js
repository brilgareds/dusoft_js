
define(["angular", "js/models", "includes/classes/TipoDocumento"], function (angular, models) {

    models.factory('TipoDocumentoHc', ["TipoDocumento", function (TipoDocumento) {


            function TipoDocumentoHc(tipo, descripcion) {                           
                TipoDocumento.getClass().call(this,tipo, descripcion); 
            }
            
            TipoDocumentoHc.prototype = Object.create(TipoDocumento.getClass().prototype);
            
            
            this.get = function (tipo, descripcion) {
                return new TipoDocumentoHc(tipo, descripcion);
            };

            return this;

        }]);

});