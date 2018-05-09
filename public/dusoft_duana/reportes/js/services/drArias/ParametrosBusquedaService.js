define(["angular", "js/services"], function(angular, services) {


    services.factory('ParametrosBusquedaService',
            ['$rootScope', 'Request', 'API',"AlertService",
                "Usuario", "$modal", "localStorageService", function($rootScope, Request, API,
                AlertService,$modal, Usuario, localStorageService) {

                    var self = this;

                    /*
                     * @Author: Andres Mauricio Gonzalez T.
                     * @fecha 05/02/2016
                     * +Descripcion: lista Dr. Arias
                     */
                    self.buscarReporteDrArias = function(obj, callback) {

                        Request.realizarRequest(
                                API.REPORTES.LISTAR_DR_ARIAS,
                                "POST",
                                {
                                    session: obj.session,
                                    data: obj
                                },
                        function(data) {                           
                            callback(data);
                           // AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                        }
                        );

                    };
                    
                    /*
                     * @Author: Andres Mauricio Gonzalez T.
                     * @fecha 05/02/2016
                     * +Descripcion: lista reportes Dr. Arias generados
                     */
                    self.reportesGenerados = function(obj, callback) {
                        Request.realizarRequest(
                                API.REPORTES.REPORTES_GENERADOS,
                                "POST",
                                {
                                    session: obj.session,
                                    data: obj
                                },
                            function(data) {   
                             
                                callback(data);  
                            }
                        );
                    };
                    
                    /*
                     * @Author: Andres Mauricio Gonzalez T.
                     * @fecha 05/09/2018
                     * +Descripcion: zonas para rotaciones
                     */
                    self.rotacionZonas = function (obj, callback) {

                        Request.realizarRequest(
                                API.REPORTES.ROTACION_ZONAS,
                                "POST",
                                {
                                    session: obj.session,
                                    data: obj
                                },
                                function (data) {
                                    callback(data);
                                }
                        );

                    };

                    return this;
                }]);
});