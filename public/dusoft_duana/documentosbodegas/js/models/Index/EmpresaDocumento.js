define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaDocumento', ["Empresa" , "$filter", function(Empresa, $filter) {

            var EmpresaDocumento = Object.create(Empresa.getClass().prototype)

            EmpresaDocumento.documentos = [];

            // Documentos
            EmpresaDocumento.set_documentos = function(documento) {
                this.documentos.push(documento);
            };

            EmpresaDocumento.get_documentos = function() {
                return this.documentos;
            };

            EmpresaDocumento.limpiar_documentos = function() {
                this.documentos = [];
            };

            return EmpresaDocumento;
        }]);
});