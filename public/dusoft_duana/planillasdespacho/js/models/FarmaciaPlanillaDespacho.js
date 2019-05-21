define(["angular", "js/models", "includes/classes/CentroUtilidad"], function(angular, models) {

    models.factory('FarmaciaPlanillaDespacho', ["CentroUtilidad", "$filter", function(CentroUtilidad, $filter) {

            function FarmaciaPlanillaDespacho(empresa_id, codigo, nombre) {
                CentroUtilidad.getClass().call(this, nombre, codigo);               
                
                this.empresa_id = empresa_id;
                this.centro_utilidad;
                this.documentos = [];
            }

            this.get = function(empresa_id, codigo, nombre) {
                return new FarmaciaPlanillaDespacho(empresa_id, codigo, nombre);
            };

            FarmaciaPlanillaDespacho.prototype = Object.create(CentroUtilidad.getClass().prototype);

            FarmaciaPlanillaDespacho.prototype.get_empresa_id = function() {
                return this.empresa_id;
            };
            FarmaciaPlanillaDespacho.prototype.set_centro_utilidad = function(centro_utilidad) {
                this.centro_utilidad = centro_utilidad;
            };
            FarmaciaPlanillaDespacho.prototype.get_centro_utilidad = function() {
                return this.centro_utilidad;
            };
            
            FarmaciaPlanillaDespacho.prototype.set_documentos = function(documento) {
                this.documentos.push(documento);
            };

            FarmaciaPlanillaDespacho.prototype.get_documentos = function() {
                return this.documentos;
            };
            
            FarmaciaPlanillaDespacho.prototype.limpiar_documentos = function() {
                return this.documentos = [];
            };
                        
            return this;
        }]);
});