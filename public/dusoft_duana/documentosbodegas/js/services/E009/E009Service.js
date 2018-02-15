define(["angular", "js/services"], function(angular, services) {


    services.factory('E009Service',
            ['$rootScope', 'Request', 'API', "AlertService",
                "Usuario", "$modal", "localStorageService", function($rootScope, Request, API,
                        AlertService, $modal, Usuario, localStorageService) {

                    var self = this;

                                       /*
                     * @Author: German Galvis.
                     * @fecha 08/02/2018
                     * +Descripcion: lista las bodegas
                     */
                    self.buscarBodega = function(obj, callback) {
                        Request.realizarRequest(
                                API.E009.LISTAR_BODEGAS,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                        
                                    }
                                },
                        function(data) {
                           
                            callback(data);
                        }
                        );

                    };

                    /**
                     * @Author: German Galvis.
                     * @fecha 14/02/2018
                     * +Descripcion Metodo encargado de invocar el servicio que
                     *              borra los DocTemporal
                     */
                    self.eliminarGetDocTemporal = function(parametro, callback) {

                        var obj = {
                            session: parametro.session,
                            data: {
                                doc_tmp_id: parametro.data.doc_tmp_id
                            }
                        };
                        Request.realizarRequest(API.E009.ELIMINAR_GET_DOC_TEMPORAL, "POST", obj, function(data) {
                            callback(data);
                        });
                    };
                    return this;
                }]);
});