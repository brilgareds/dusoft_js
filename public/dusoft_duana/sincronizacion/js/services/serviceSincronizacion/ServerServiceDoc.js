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
                    self.listarTipoCuentaCategoria = function(obj, callback) {

                        Request.realizarRequest(
                                API.SINCRONIZACION_DOCUMENTOS.LISTAR_TIPO_CUENTA_CATEGORIA,
                                "POST",
                                {
                                    session: obj.session,
                                    data:{}
                                },
                        function(data) {                           
                            callback(data);
                           // AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                        }
                        );

                    };
                    
                    self.listarDocumentosCuentas = function (obj, callback) {

                        Request.realizarRequest(
                                API.SINCRONIZACION_DOCUMENTOS.LISTAR_DOCUMENTOS_CUENTAS,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {}
                                },
                                function (data) {
                                    callback(data);
                                    // AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                                }
                        );
                    };
                    
                    self.listarTiposFacturas = function (obj, callback) {
                        Request.realizarRequest(
                                API.SINCRONIZACION_DOCUMENTOS.LISTAR_TIPOS_FACTURAS,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {}
                                },
                                function (data) {                                    
                                    callback(data);
                                    // AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                                }
                        );
                    };
                    
                    self.listarTiposCuentas = function (obj, callback) {

                        Request.realizarRequest(
                                API.SINCRONIZACION_DOCUMENTOS.LISTAR_TIPOS_CUENTAS,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {}
                                },
                                function (data) {
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
                                    data: obj.data
                                },
                        function(data) {                           
                            callback(data);
                           // AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                        }
                        );

                    };
                    
                    self.guardarCuentas = function(obj, callback) {
                        Request.realizarRequest(
                            API.SINCRONIZACION_DOCUMENTOS.GUARDAR_CUENTAS,
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