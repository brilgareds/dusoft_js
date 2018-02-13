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


                    return this;
                }]);
});