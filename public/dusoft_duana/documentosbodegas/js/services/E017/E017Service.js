define(["angular", "js/services"], function (angular, services) {


    services.factory('E017Service',
            ['$rootScope', 'Request', 'API', "AlertService",
                "Usuario", "$modal", "localStorageService", function ($rootScope, Request, API,
                        AlertService, $modal, Usuario, localStorageService) {

                    var self = this;

                    /*
                     * @Author: German Galvis.
                     * @fecha 03/05/2018
                     * +Descripcion: lista las bodegas
                     */
                    self.buscarBodega = function (obj, callback) {
                        Request.realizarRequest(
                                API.E017.LISTAR_BODEGAS,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                        bodega: obj.data.bodega
                                    }
                                },
                                function (data) {

                                    callback(data);
                                }
                        );

                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 07/05/2018
                     * +Descripcion: lista la bodega seleccionada
                     */
                    self.buscarBodegaId = function (obj, callback) {
                        Request.realizarRequest(
                                API.E017.LISTAR_BODEGAS_SELECCIONADA,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                        empresa_id: obj.data.empresa_id,
                                        centro_utilidad: obj.data.centro,
                                        bodega: obj.data.bodega
                                    }
                                },
                                function (data) {

                                    callback(data);
                                }
                        );

                    };

                    /**
                     * @Author: German Galvis.
                     * @fecha 03/05/2018
                     * +Descripcion Metodo encargado de invocar el servicio que
                     *              crea los DocTemporal
                     */
                    self.getDocTemporal = function (parametro, callback) {

                        var obj = {
                            session: parametro.session,
                            data: {
                                bodega_doc_id: parametro.data.bodega_doc_id,
                                observacion: parametro.data.observacion,
                                bodega_seleccionada: parametro.data.bodega_destino
                            }
                        };
                        Request.realizarRequest(API.E017.CREAR_NEW_DOCUMENTO_TEMPORAL, "POST", obj, function (data) {
                            callback(data);
                        });
                    };


                    /**
                     * @Author: German Galvis.
                     * @fecha 03/05/2018
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
                        Request.realizarRequest(API.E017.ELIMINAR_GET_DOC_TEMPORAL, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @Author: German Galvis.
                     * @fecha 03/05/2018
                     * +Descripcion Metodo encargado de invocar el servicio que
                     *              lista los productos de la farmacia seleccionada
                     */
                    self.listarProductos = function (parametro, callback) {

                        var obj = {
                            session: parametro.session,
                            data: {
                                empresa_id: parametro.data.empresa_id,
                                centro_utilidad: parametro.data.centro_utilidad,
                                bodega: parametro.data.bodega,
                                descripcion: parametro.data.descripcion,
                                tipoFiltro: parametro.data.tipoFiltro,
                                paginaActual: parametro.data.paginaActual
                            }
                        };
                        Request.realizarRequest(API.E017.LISTAR_PRODUCTOS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @Author: German Galvis.
                     * @fecha 04/05/2018
                     * +Descripcion Metodo encargado de invocar el servicio que
                     *              agrega items al DocTemporal
                     */
                    self.agregarProductoTmp = function (parametro, callback) {

                        var obj = {
                            session: parametro.session,
                            data: {
                                empresa_id: parametro.data.empresa_id,
                                centro_utilidad: parametro.data.centro_utilidad,
                                bodega: parametro.data.bodega,
                                codigoProducto: parametro.data.codigoProducto,
                                cantidad: parametro.data.cantidad,
                                lote: parametro.data.lote,
                                fechaVencimiento: parametro.data.fechaVencimiento,
                                docTmpId: parametro.data.docTmpId
                            }
                        };
                        Request.realizarRequest(API.E017.AGREGAR_ITEM, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 05/05/2018
                     * +Descripcion: elimionar producto en temporal
                     */
                    self.eliminarProductoTraslado = function (objs, callback) {
                        var obj = {
                            session: objs.session,
                            data: {
                                item_id: objs.item_id,
                                docTmpId: objs.docTmpId
                            }
                        };

                        Request.realizarRequest(API.E017.ELIMINAR_PRODUCTO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 07/05/2018
                     * +Descripcion: Crea documento Definitivo
                     */
                    self.crearDocumento = function (objs, callback) {
                        var obj = {
                            session: objs.session,
                            data: {
                                docTmpId: objs.data.doc_tmp_id,
                                empresa_envia: objs.data.empresa_envia,
                                usuario_id: objs.data.usuario_id,
                                bodega_destino: objs.data.bodega_destino
                            }
                        };

                        Request.realizarRequest(API.E017.CREAR_DOCUMENTO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };


                    return this;
                }]);
});