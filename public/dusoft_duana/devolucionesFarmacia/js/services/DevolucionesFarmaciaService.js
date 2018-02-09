define(["angular", "js/services"], function (angular, services) {


    services.factory('DevolucionesFarmaciaService',
            ['$rootScope', 'Request', 'API',
                "Usuario", "$modal", "localStorageService", function ($rootScope, Request, API,
                        $modal, Usuario, localStorageService) {

                    var self = this;

                    /*
                     * @Author: Cristian Ardila
                     * @fecha 05/02/2016
                     * +Descripcion: consulta todas las empresas de acuerdo al texto
                     *               ingresado
                     */
                    self.listarEmpresas = function (obj, callback) {
                        console.log("SERVICE front self.listarEmpresas");
                        /*var obj = {
                            session: session,
                            data: {
                                listar_empresas: {
                                    pagina: 1,
                                    empresaName: termino_busqueda_empresa
                                }
                            }
                        };
                        Request.realizarRequest(API.DEVOLUCIONESFARMACIA.LISTAR_EMPRESAS, "POST", obj, function (data) {

                            callback(data);
                        });*/
                        Request.realizarRequest(
                                API.DEVOLUCIONESFARMACIA.LISTAR_EMPRESAS,
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
                    
                    /* @Author: German Galvis.
                     * @fecha 08/02/2017
                     * +Descripcion: lista las empresas
                     */
                    self.buscarEmpresas = function(obj, callback) {
                        console.log("SERVICE front self.buscarEmpresas");

                        Request.realizarRequest(
                                API.DEVOLUCIONESFARMACIA.LISTAR_EMPRESAS,
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

