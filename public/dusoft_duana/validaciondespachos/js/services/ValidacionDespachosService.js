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
                        registroUnico: obj.registroUnico,
                        idPlantilla: (obj.idPlantilla === undefined ? 0 : obj.idPlantilla)
                         
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
         * @Author: Andres Mauricio Gonzalez
         * @fecha 26/12/2016
         * +Descripcion: Consulta las imagenes de una aprobacion
         */
        self.documentosPlanillas = function (obj, callback) {
            var param = {
                session: obj.session,
                data: {
                    planillas_despachos: {
                            planilla_id: obj.planilla_id,
                            termino_busqueda: obj.termino_busqueda
                        }
                }
            };
            Request.realizarRequest(API.PLANILLAS.DOCUMENTOS_PLANILLA, "POST", param, function (data) {
        
                callback(data);
            });
        };
        
        /*
         * @Author: Andres Mauricio Gonzalez
         * @fecha 26/12/2016
         * +Descripcion: Consulta las imagenes de una aprobacion
         */
        self.documentosPlanillasDetalle = function (obj, callback) {
            var param = {
                session: obj.session,
                data: {
                    planillas_despachos: {
                            planilla_id: obj.planilla_id,
                            termino_busqueda: obj.termino_busqueda,
                            tercero : obj.tercero,
                            modificar : obj.modificar,
                            registro_salida_bodega_id : obj.registro_salida_bodega_id
                        }
                }
            };
            Request.realizarRequest(API.PLANILLAS.DOCUMENTOS_PLANILLA_DETALLE, "POST", param, function (data) {
        
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
        
        /*
         * @Author: Andres Mauricio Gonzalez
         * @fecha 04/04/2019
         * +Descripcion: registra las guias que ingresan a bodega
         */
        self.registroSalidaBodega = function (obj, callback) {
            var obj = {
                session: obj.session,
                data: {
                    obj
                }
            };
            
            Request.realizarRequest(API.VALIDACIONDESPACHOS.REGISTRO_SALIDA_BODEGA, "POST", obj, function (data) {

                callback(data);
            });
        };
        /*
         * @Author: Andres Mauricio Gonzalez
         * @fecha 04/04/2019
         * +Descripcion: registra las guias que ingresan a bodega
         */
        self.registroEntradaBodega = function (obj, callback) {
            var obj = {
                session: obj.session,
                data: {
                    obj
                }
            };
            Request.realizarRequest(API.VALIDACIONDESPACHOS.REGISTRO_ENTRADA_BODEGA, "POST", obj, function (data) {

                callback(data);
            });
        };
        /*
         * @Author: Andres Mauricio Gonzalez
         * @fecha 04/04/2019
         * +Descripcion: registra las guias que ingresan a bodega
         */
        self.modificaRegistroEntradaBodega = function (obj, callback) {
            var obj = {
                session: obj.session,
                data: {
                    obj
                }
            };
            Request.realizarRequest(API.VALIDACIONDESPACHOS.MODIFICAR_REGISTRO_ENTRADA_BODEGA, "POST", obj, function (data) {

                callback(data);
            });
        };
        /*
         * @Author: Andres Mauricio Gonzalez
         * @fecha 04/04/2019
         * +Descripcion: registra las guias que ingresan a bodega
         */
        self.modificaRegistroSalidaBodega = function (obj, callback) {
            var obj = {
                session: obj.session,
                data: {
                    obj
                }
            };
            Request.realizarRequest(API.VALIDACIONDESPACHOS.MODIFICAR_REGISTRO_SALIDA_BODEGA, "POST", obj, function (data) {

                callback(data);
            });
        };
        /*
         * @Author: Andres Mauricio Gonzalez
         * @fecha 04/04/2019
         * +Descripcion: listar las guias que ingresan a bodega
         */
        self.listarRegistroEntrada = function (obj, callback) {
            var obj = {
                session: obj.session,
                data: {
                    obj
                }
            };
            Request.realizarRequest(API.VALIDACIONDESPACHOS.LISTAR_REGISTRO_ENTRADA, "POST", obj, function (data) {

                callback(data);
            });
        };
        /*
         * @Author: Andres Mauricio Gonzalez
         * @fecha 04/04/2019
         * +Descripcion: listar las guias que ingresan a bodega
         */
        self.listarRegistroSalida = function (obj, callback) {
            var obj = {
                session: obj.session,
                data: {
                    obj
                }
            };
            Request.realizarRequest(API.VALIDACIONDESPACHOS.LISTAR_REGISTRO_SALIDA, "POST", obj, function (data) {

                callback(data);
            });
        };
        
        /**
        * @author Andres Mauricio Gonzalez
        * @fecha  31/05/2017 DD/MM/YYYYY
        * +Descripcion
        */
       self.listarPrefijos = function (parametros, callback) {

           Request.realizarRequest(API.SINCRONIZACION_DOCUMENTOS.LISTAR_PREFIJOS, "POST", parametros, function (data) {
               callback(data);

           });
       };
        /**
        * @author Andres Mauricio Gonzalez
        * @fecha  31/05/2017 DD/MM/YYYYY
        * +Descripcion
        */
       self.listarOperarios = function (parametros, callback) {

           Request.realizarRequest(API.TERCEROS.LISTAR_OPERARIOS, "POST", parametros, function (data) {
               callback(data);

           });
       };
        /**
        * @author Andres Mauricio Gonzalez
        * @fecha  31/05/2017 DD/MM/YYYYY
        * +Descripcion
        */
       self.listarCiudadesPais = function (parametros, callback) {

           Request.realizarRequest(API.CIUDADES.LISTAR_CIUDADES_PAIS, "POST", parametros, function (data) {
               callback(data);

           });
       };

        return this;
    }]);
});



