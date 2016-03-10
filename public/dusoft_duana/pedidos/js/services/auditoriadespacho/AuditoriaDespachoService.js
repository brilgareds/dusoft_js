define(["angular", "js/services"], function(angular, services) {


    services.factory('AuditoriaDespachoService',
            ['$rootScope', 'Request', 'API',
                "Usuario", "$modal", "localStorageService", function($rootScope, Request, API,
                        $modal, Usuario, localStorageService) {

        var self = this;

        /*
         * @Author: Cristian Ardila
         * @fecha 05/02/2016
         * +Descripcion: lista todos los despachos auditados
         */
        self.listarDespachosAuditados = function(obj, callback) {

            var obj = {
                session: obj.session,
                data: {
                    despachos_auditados: {
                        session: obj.session,
                        prefijo: obj.prefijo,
                        numero: obj.numero, //$scope.datos_view.numero,
                        empresa_id: obj.empresa_id,
                        fechaInicial: '',
                        fechaFinal: '',
                        paginaactual: 1,
                        registroUnico: true
                    }

                }
            };

            Request.realizarRequest(API.DESPACHOS_AUDITADOS.LISTAR_DESPACHOS_AUDITADOS, "POST", obj, function(data) {

                callback(data);
            });
        };


        /*
         * @Author: Cristian Ardila
         * @fecha 05/02/2016
         * +Descripcion: consulta todas las empresas de acuerdo al texto
         *               ingresado
         */
        self.listarEmpresas = function(session, termino_busqueda_empresa, callback) {
            var obj = {
                session: session,
                data: {
                    listar_empresas: {
                        pagina: 1,
                        empresaName: termino_busqueda_empresa
                    }
                }
            };
            Request.realizarRequest(API.VALIDACIONDESPACHOS.LISTAR_EMPRESAS, "POST", obj, function(data) {

                callback(data);
            });
        };
        
        self.sincronizarDocumento = function(obj, callback){
             var obj = {
                session: obj.session,
                data: {
                    documento_despacho: obj.documento
                }
            };

            Request.realizarRequest(API.DOCUMENTOS_DESPACHO.SINCRONIZAR_DOCUMENTO, "POST", obj, function(data) {
               callback(data);
            });
        };

        return this;
    }]);
});



