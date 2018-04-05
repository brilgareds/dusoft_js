define(["angular", "js/services"], function (angular, services) {


    services.factory('E009Service',
            ['$rootScope', 'Request', 'API', "AlertService",
                "Usuario", "$modal", "localStorageService", function ($rootScope, Request, API,
                        AlertService, $modal, Usuario, localStorageService) {

                    var self = this;

                    /*
                     * @Author: German Galvis.
                     * @fecha 08/02/2018
                     * +Descripcion: lista las bodegas
                     */
                    self.buscarBodega = function (obj, callback) {
                        Request.realizarRequest(
                                API.E009.LISTAR_BODEGAS,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                    }
                                },
                                function (data) {

                                    callback(data);
                                }
                        );

                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 06/03/2018
                     * +Descripcion: trae registro de la bodega seleccionada
                     */
                    self.buscarBodegaId = function (obj, callback) {
                        Request.realizarRequest(
                                API.E009.LISTAR_BODEGA_ID,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                        id: obj.data.id
                                    }
                                },
                                function (data) {

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
                    self.eliminarGetDocTemporal = function (parametro, callback) {

                        var obj = {
                            session: parametro.session,
                            data: {
                                doc_tmp_id: parametro.data.doc_tmp_id
                            }
                        };
                        Request.realizarRequest(API.E009.ELIMINAR_GET_DOC_TEMPORAL, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 14/02/2018
                     * +Descripcion: elimionar producto en temporal
                     */
                    self.eliminarProductoDevolucion = function (objs, callback) {
                        var obj = {
                            session: objs.session,
                            data: {
                                item_id: objs.item_id,
                                docTmpId: objs.docTmpId
                            }
                        };

                        Request.realizarRequest(API.E009.ELIMINAR_PRODUCTO_DEVOLUCION, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 14/02/2018
                     * +Descripcion: Crea documento Definitivo
                     */
                    self.crearDocumento = function (objs, callback) {
                        var obj = {
                            session: objs.session,
                            data: {
                                docTmpId: objs.data.devolucion.doc_tmp_id,
                                bodega_seleccionada: objs.data.devolucion.bodega_seleccionada,
                                usuario_id: objs.data.devolucion.usuario_id,
                                empresaId: objs.data.devolucion.empresaId,
                                centroUtilidad: objs.data.devolucion.centroUtilidad,
                                bodega: objs.data.devolucion.bodega,
                                listado: objs.data.devolucion.listado
                            }
                        };

                        Request.realizarRequest(API.E009.CREAR_DOCUMENTO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };


                    return this;
                }]);
});