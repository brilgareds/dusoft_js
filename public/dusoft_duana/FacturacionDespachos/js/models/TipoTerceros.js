
define(["angular", "js/models", "includes/classes/TipoDocumento"], function (angular, models) {

    models.factory('TipoTerceros', ["TipoDocumento", function (TipoDocumento) {


            function TipoTerceros(tipo, descripcion) {                           
                TipoDocumento.getClass().call(this,tipo, descripcion); 
            }
            
            TipoTerceros.prototype = Object.create(TipoDocumento.getClass().prototype);
            
            
            this.get = function (tipo, descripcion) {
                return new TipoTerceros(tipo, descripcion);
            };

            return this;

        }]);

});