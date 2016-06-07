define(["angular", "js/services"], function(angular, services) {


    services.factory('ParametrosBusquedaService',
            ['$rootScope', 'Request', 'API',
                "Usuario", "$modal", "localStorageService", function($rootScope, Request, API,
                        $modal, Usuario, localStorageService) {

                    var self = this;

                    /*
                     * @Author: Andres Mauricio Gonzalez T.
                     * @fecha 05/02/2016
                     * +Descripcion: lista Dr. Arias
                     */
                    self.buscarProductosBloqueados = function(obj, callback) {

                        Request.realizarRequest(
                                API.REPORTES.LISTAR_DR_ARIAS,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                        autorizaciones: {
                                            termino_busqueda: obj.termino_busqueda,
                                            pagina_actual: obj.pagina_actual,
                                            empresa_id: obj.empresa_id
                                        }
                                    }
                                },
                        function(data) {                           
                            callback(data);
                        }
                        );

                    };

                    return this;
                }]);
});