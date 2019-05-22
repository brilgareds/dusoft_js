define(["angular", "js/services"], function (angular, services) {


    services.factory('I008Service',
            ['$rootScope', 'Request', 'API', "AlertService",
                "$modal", "localStorageService", function ($rootScope, Request, API,
                        AlertService, $modal, localStorageService) {

                    var self = this;

                    /*
                     * @Author: German Galvis.
                     * @fecha 12/01/2019
                     * +Descripcion: lista los documentos de la farmacia
                     */
                    self.buscarTraslados = function (obj, callback) {
                        Request.realizarRequest(
                                API.I008.LISTAR_DOCUMENTOS,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                        empresaId: obj.data.empresaId,
                                        centroUtilidad: obj.data.centroUtilidad,
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
                     * @fecha 14/01/2019
                     * +Descripcion: lista los productos del documento seleccionado
                     */
                    self.buscarProductosTraslados = function (obj, callback) {
                        Request.realizarRequest(
                                API.I008.LISTAR_PRODUCTOS_TRASLADO,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                        numero: obj.data.numero_doc,
                                        prefijo: obj.data.prefijo
                                    }
                                },
                                function (data) {

                                    callback(data);
                                }
                        );

                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 14/01/2019
                     * +Descripcion: Crea documento tmp
                     */
                    self.crearTmp = function (objs, callback) {
                        var obj = {
                            session: objs.session,
                            data: {
                                prefijo_documento_seleccionado: objs.data.prefijo_documento_seleccionado,
                                numero_documento_seleccionado: objs.data.numero_documento_seleccionado,
                                bodega_doc_id: objs.data.bodega_doc_id,
                                observacion: objs.data.observacion,
                                empresaId: objs.data.empresaId,
                                empresaEnvia: objs.data.empresaEnvia
                            }
                        };
                        Request.realizarRequest(API.I008.CREAR_NEW_DOCUMENTO_TEMPORAL, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @Author: German Galvis.
                     * @fecha 14/01/2019
                     * +Descripcion Metodo encargado de invocar el servicio que
                     *              borra los DocTemporal
                     */
                    self.eliminarGetDocTemporal = function (parametro, callback) {

                        var obj = {
                            session: parametro.session,
                            data: {
                                listado: parametro.data.listado,
                                empresa_id: parametro.data.empresa_id,
                                doc_tmp_id: parametro.data.doc_tmp_id
                            }
                        };
                        Request.realizarRequest(API.I008.ELIMINAR_GET_DOC_TEMPORAL, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @Author: German Galvis.
                     * @fecha 14/01/2019
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
                                cantidad_enviada: parametro.data.cantidad_enviada,
                                lote: parametro.data.lote,
                                fechaVencimiento: parametro.data.fechaVencimiento,
                                item_id: parametro.data.item_id,
                                total_costo: parametro.data.total_costo,
                                docTmpId: parametro.data.docTmpId
                            }
                        };
                        Request.realizarRequest(API.I008.AGREGAR_ITEM, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 14/01/2019
                     * +Descripcion: elimionar producto en temporal
                     */
                    self.eliminarProductoTmp = function (objs, callback) {
                        var obj = {
                            session: objs.session,
                            data: {
                                item_id: objs.item_id,
                                item_id_compras: objs.item_id_compras,
                                docTmpId: objs.docTmpId,
                                cantidad: objs.cantidad
                            }
                        };

                        Request.realizarRequest(API.I008.ELIMINAR_PRODUCTO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 10/05/2018
                     * +Descripcion: lista el documento seleccionado
                     */
                    self.buscarDocumentoId = function (obj, callback) {
                        Request.realizarRequest(
                                API.I008.LISTAR_DOCUMENTO_SELECCIONADO,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                        tmp_id: obj.data.tmp_id,
                                        empresa_id: obj.data.empresa_id
                                    }
                                },
                                function (data) {

                                    callback(data);
                                }
                        );

                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 14/01/2019
                     * +Descripcion: Crea documento Definitivo
                     */
                    self.crearDocumento = function (objs, callback) {
                        var obj = {
                            session: objs.session,
                            data: {
                                prefijo_despacho: objs.data.prefijo_despacho,
                                numero_despacho: objs.data.numero_despacho,
                                empresa_origen: objs.data.empresa_origen,
                                empresa_id: objs.data.empresa_id,
                                doc_tmp_id: objs.data.doc_tmp_id,
                                sw_estado: objs.data.sw_estado,
                                usuario_id: objs.data.usuario_id
                            }
                        };
                        Request.realizarRequest(API.I008.CREAR_DOCUMENTO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    return this;
                }]);
});