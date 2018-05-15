define(["angular", "js/models", "includes/classes/Empresa"], function (angular, models) {

    models.factory('EmpresaDocumento', ["Empresa", "$filter", function (Empresa, $filter) {

            var EmpresaDocumento = Object.create(Empresa.getClass().prototype)

            EmpresaDocumento.documentos = [];

            // Documentos
            EmpresaDocumento.set_documentos = function (documento) {
                this.documentos.push(documento);
            };

            EmpresaDocumento.get_documentos = function () {
                return this.documentos;
            };

            EmpresaDocumento.limpiar_documentos = function () {
                this.documentos = [];
            };

            // Filtrar documentos de salida
            EmpresaDocumento.get_documentos_salida = function () {

                var documentos_salida = [];

                this.get_documentos().forEach(function (documento) {

                    if (documento.get_tipo() === 'E007' || documento.get_tipo() === 'E008' || documento.get_tipo() === 'NC01' ||
                            documento.get_tipo() === 'E009' || documento.get_tipo() === 'E012' || documento.get_tipo() === 'ND01') {
                        documentos_salida.push(documento);
                    }
                });

                return documentos_salida;

            };

            // Filtrar documentos de entrada
            EmpresaDocumento.get_documentos_entrada = function () {

                var documentos_entrada = [];

                this.get_documentos().forEach(function (documento) {

                    if (documento.get_tipo() === 'I001' || documento.get_tipo() === 'I002' || documento.get_tipo() === 'I004' ||
                            documento.get_tipo() === 'I011' || documento.get_tipo() === 'I005' || documento.get_tipo() === 'I006' ||
                            documento.get_tipo() === 'I012' || documento.get_tipo() === 'I007') {
                        documentos_entrada.push(documento);
                    }
                });
                return documentos_entrada;
            };

            // Filtrar documentos de ajuste
            EmpresaDocumento.get_documentos_ajuste = function () {

                var documentos_ajuste = [];

                this.get_documentos().forEach(function (documento) {

                    if (documento.get_tipo() === 'E003' || documento.get_tipo() === 'I003') {
                        documentos_ajuste.push(documento);
                    }
                });

                return documentos_ajuste;
            };

            // Filtrar documentos de traslado
            EmpresaDocumento.get_documentos_traslado = function () {

                var documentos_traslado = [];

                this.get_documentos().forEach(function (documento) {

                    if (documento.get_tipo() === 'T001' || documento.get_tipo() === 'T004' || documento.get_tipo() === 'E017' || documento.get_tipo() === 'I015') {
                        documentos_traslado.push(documento);
                    }
                });

                return documentos_traslado;
            };

            return EmpresaDocumento;
        }]);
});