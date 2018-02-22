define(["angular", "js/services"], function (angular, services) {


    services.factory('I011Service',
            ['$rootScope', 'Request', 'API', "AlertService",
                "Usuario", "$modal", "localStorageService", function ($rootScope, Request, API,
                        AlertService, $modal, Usuario, localStorageService) {

                    var self = this;

                    /*
                     * @Author: German Galvis.
                     * @fecha 17/02/2018
                     * +Descripcion: lista las bodegas
                     */
                    self.buscarBodega = function (obj, callback) {
                        Request.realizarRequest(
                                API.I011.LISTAR_BODEGAS,
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
                     * @fecha 19/02/2018
                     * +Descripcion: lista las bodegas
                     */
                    self.buscarNovedades = function (obj, callback) {
                        Request.realizarRequest(
                                API.I011.LISTAR_NOVEDADES,
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
                     * @fecha 19/02/2018
                     * +Descripcion: lista las devoluciones
                     */
                    self.buscarDevoluciones = function (obj, callback) {
                        Request.realizarRequest(
                                API.I011.LISTAR_DEVOLUCIONES,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                        bodega: obj.bodega
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
                                usuario_id: objs.data.devolucion.usuario_id
                            }
                        };

                        Request.realizarRequest(API.E009.CREAR_DOCUMENTO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };


                    return this;
                }]);
});