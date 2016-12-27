define(["angular", "js/services"], function (angular, services) {


    services.factory('ValidacionDespachosService',
            ['$rootScope', 'Request', 'API',
                "Usuario", "$modal", "localStorageService",
                function ($rootScope, Request, API,
                        $modal, Usuario, localStorageService) {

        var self = this;

        /*
         * @Author: Cristian Ardila
         * @fecha 05/02/2016
         * +Descripcion: lista todos los despachos aprobados por parte del 
         *               personal de seguridad
         */
        self.listarDespachosAprobados = function (obj, callback) {

            var params = {
                session: obj.session,
                data: {
                    validacionDespachos: {
                        prefijo: obj.prefijo,
                        numero: obj.numero,
                        empresa_id: obj.empresa_id,
                        fechaInicial: obj.fechaInicial,
                        fechaFinal: obj.fechaFinal,
                        paginaActual: obj.paginaactual,
                        registroUnico: obj.registroUnico

                    }
                }
            };

            Request.realizarRequest(API.VALIDACIONDESPACHOS.LISTAR_DESPACHOS_APROBADOS, "POST", params, function (data) {

                callback(data);
            });
        };
        
        /*
         * @Author: Eduar Garcia
         * @fecha 26/12/2016
         * +Descripcion: Consulta las imagenes de una aprobacion
         */
        self.listarImagenes = function (session, idAprobacion, callback) {
            var obj = {
                session: session,
                data: {
                    validacionDespachos: {
                        id_aprobacion: idAprobacion
                    }
                }
            };
            Request.realizarRequest(API.VALIDACIONDESPACHOS.LISTAR_IMAGENES, "POST", obj, function (data) {

                callback(data);
            });
        };
        
        /*
         * @Author: Eduar Garcia
         * @fecha 26/12/2016
         * +Descripcion: Elimina una imagen
         */
        self.eliminarImagen = function (session, imagen, callback) {
            var obj = {
                session: session,
                data: {
                    validacionDespachos: {
                        id: imagen.getId(),
                        path : imagen.getPath()
                    }
                }
            };
            Request.realizarRequest(API.VALIDACIONDESPACHOS.ELIMINAR_IMAGEN, "POST", obj, function (data) {

                callback(data);
            });
        };
        

        /*
         * @Author: Cristian Ardila
         * @fecha 05/02/2016
         * +Descripcion: consulta todas las empresas de acuerdo al texto
         *               ingresado
         */
        self.listarEmpresas = function (session, termino_busqueda_empresa, callback) {
            var obj = {
                session: session,
                data: {
                    listar_empresas: {
                        pagina: 1,
                        empresaName: termino_busqueda_empresa
                    }
                }
            };
            Request.realizarRequest(API.VALIDACIONDESPACHOS.LISTAR_EMPRESAS, "POST", obj, function (data) {

                callback(data);
            });
        };

        return this;
    }]);
});



