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
                                doc_tmp_id: parametro.data.doc_tmp_id,
                                numero: parametro.data.numero,
                                prefijo: parametro.data.prefijo
                            }
                        };
                        Request.realizarRequest(API.I011.ELIMINAR_GET_DOC_TEMPORAL, "POST", obj, function (data) {
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
                                lote: objs.lote,
                                movimiento_id: objs.movimiento_id,
                                docTmpId: objs.docTmpId
                            }
                        };

                        Request.realizarRequest(API.I011.ELIMINAR_PRODUCTO_DEVOLUCION, "POST", obj, function (data) {
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
                                numero_doc: objs.data.ingreso.numero_doc,
                                prefijo_doc: objs.data.ingreso.prefijo_doc,
                                empresa_envia: objs.data.ingreso.empresa_envia,
                                docTmpId: objs.data.ingreso.doc_tmp_id,
                                datoSeleccion: objs.data.ingreso.datoSeleccion,
                                usuario_id: objs.data.ingreso.usuario_id
                            }
                        };
                        Request.realizarRequest(API.I011.CREAR_DOCUMENTO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };


                    return this;
                }]);
});