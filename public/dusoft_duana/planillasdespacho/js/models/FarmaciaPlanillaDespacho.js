define(["angular", "js/models", "includes/classes/CentroUtilidad"], function(angular, models) {

    models.factory('FarmaciaPlanillaDespacho', ["CentroUtilidad", "$filter", function(CentroUtilidad, $filter) {

            function FarmaciaPlanillaDespacho(nombre, codigo) {
                CentroUtilidad.getClass().call(this, nombre, codigo);               
                
            }

            this.get = function(nombre, codigo) {
                return new FarmaciaPlanillaDespacho(nombre, codigo);
            };

            FarmaciaPlanillaDespacho.prototype = Object.create(CentroUtilidad.getClass().prototype);

            FarmaciaPlanillaDespacho.documentos = [];

            FarmaciaPlanillaDespacho.prototype.set_documentos = function(documento) {
                this.documentos.push(documento);
            };

            FarmaciaPlanillaDespacho.prototype.get_documentos = function() {
                return this.documentos;
            };
                        
            return this;
        }]);
});