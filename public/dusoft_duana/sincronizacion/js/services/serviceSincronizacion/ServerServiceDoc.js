define(["angular", "js/services"], function(angular, services) {


    services.factory('ServerServiceDoc',
            ['$rootScope', 'Request', 'API',"AlertService",
                "Usuario", "$modal", "localStorageService", function($rootScope, Request, API,
                AlertService,$modal, Usuario, localStorageService) {

                    var self = this;

                    /*
                     * @Author: Andres Mauricio Gonzalez T.
                     * @fecha 04/02/2019
                     * +Descripcion: lista prefijos
                     */
                    self.listarPrefijos = function(obj, callback) {

                        Request.realizarRequest(
                                API.SINCRONIZACION_DOCUMENTOS.LISTAR_PREFIJOS,
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
                    
                    self.insertarTipoCuenta = function(obj, callback) {

                        Request.realizarRequest(
                                API.SINCRONIZACION_DOCUMENTOS.INSERTAR_TIPO_CUENTA,
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
                    
                    
                  
                    return this;
    }]);
});