define(["angular", "js/services"], function (angular, services) {


    services.factory('facturacionClientesService',
            ['$rootScope', 'Request', 'API',
                "Usuario", "TipoTerceros","localStorageService",

                function ($rootScope, Request, API,
                        Usuario,TipoTerceros, localStorageService) {

                    var self = this;



                    /**
                     * @author Cristian Ardila
                     * @fecha  21/05/2016 DD/MM/YYYYY
                     * +Descripcion Consulta todas las formulas
                     */
                    self.listarTiposTerceros = function (obj, callback) {
                        console.log("self.listarClientes ***********************")
                        Request.realizarRequest(API.FACTURACIONCLIENTES.LISTAR_TIPOS_TERCEROS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @author Cristian Ardila
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que ontiene los tipos de documentos
                     * @fecha 08/06/2016 DD/MM/YYYYY
                     */
                    self.renderListarTipoTerceros = function (tipoDocumento) {
                       
                        var tipoDocumentos = [];
                        for (var i in tipoDocumento) {

                            var _tipoDocumento = TipoTerceros.get(tipoDocumento[i].id, tipoDocumento[i].descripcion);
                            tipoDocumentos.push(_tipoDocumento);
                        }
                        return tipoDocumentos;
                    };


                    return this;
                }]);

});



