
define(["angular", "js/models", "includes/classes/TipoDocumento"], function (angular, models) {

    models.factory('TipoDocumentos', ["TipoDocumento", function (TipoDocumento) {


            function TipoDocumentos(tipo, descripcion) {                           
                TipoDocumento.getClass().call(this,tipo, descripcion); 
            }
            
            TipoDocumentos.prototype = Object.create(TipoDocumento.getClass().prototype);
            
            
            this.get = function (tipo, descripcion) {
                return new TipoDocumentos(tipo, descripcion);
            };

            return this;

        }]);

});