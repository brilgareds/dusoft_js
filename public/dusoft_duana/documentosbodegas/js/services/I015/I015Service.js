define(["angular", "js/services"], function (angular, services) {


    services.factory('I015Service',
            ['$rootScope', 'Request', 'API', "AlertService",
                "$modal", "localStorageService", function ($rootScope, Request, API,
                        AlertService, $modal, localStorageService) {

                    var self = this;

                    /*
                     * @Author: German Galvis.
                     * @fecha 07/05/2018
                     * +Descripcion: lista las bodegas
                     */
                    self.buscarBodega = function (obj, callback) {
                        Request.realizarRequest(
                                API.I015.LISTAR_BODEGAS,
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
                     * @fecha 08/05/2018
                     * +Descripcion: lista las bodegas
                     */
                    self.buscarTraslados = function (obj, callback) {
                        Request.realizarRequest(
                                API.I015.LISTAR_DOCUMENTOS,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                        bodega_origen: obj.data.bodega_origen,
                                        bodega_destino: obj.data.bodega_destino
                                    }
                                },
                                function (data) {

                                    callback(data);
                                }
                        );

                    };
                    /*
                     * @Author: German Galvis.
                     * @fecha 08/05/2018
                     * +Descripcion: lista las bodegas
                     */
                    self.buscarProductosTraslados = function (obj, callback) {
                        Request.realizarRequest(
                                API.I015.LISTAR_PRODUCTOS_TRASLADO,
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
                     * @fecha 08/05/2018
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
                                empresaId: objs.data.empresaId
                            }
                        };
                        Request.realizarRequest(API.I015.CREAR_NEW_DOCUMENTO_TEMPORAL, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @Author: German Galvis.
                     * @fecha 08/05/2018
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
                        Request.realizarRequest(API.I015.ELIMINAR_GET_DOC_TEMPORAL, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @Author: German Galvis.
                     * @fecha 08/05/2018
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
                                docTmpId: parametro.data.docTmpId
                            }
                        };
                        Request.realizarRequest(API.I015.AGREGAR_ITEM, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 09/05/2018
                     * +Descripcion: elimionar producto en temporal
                     */
                    self.eliminarProductoTmp = function (objs, callback) {
                        var obj = {
                            session: objs.session,
                            data: {
                                item_id: objs.item_id,
                                item_id_compras: objs.item_id_compras,
                                docTmpId: objs.docTmpId,
                                cantidad: objs.cantidad,
                                codigo_producto: objs.codigo_producto,
                                fechaVencimiento: objs.fechaVencimiento,
                                lote: objs.lote,
                                numero_doc: objs.numero_doc,
                                prefijo: objs.prefijo
                            }
                        };

                        Request.realizarRequest(API.I015.ELIMINAR_PRODUCTO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };
//
//                    /*
//                     * @Author: German Galvis.
//                     * @fecha 03/04/2018
//                     * +Descripcion: Crea documento Definitivo
//                     */
//                    self.crearDocumento = function (objs, callback) {
//                        var obj = {
//                            session: objs.session,
//                            data: {
//                                tipo_id_tercero: objs.data.ingreso.tipo_id_tercero,
//                                tercero_id: objs.data.ingreso.tercero_id,
//                                nombreTercero: objs.data.ingreso.nombre_tercero,
//                                prefijo_doc_cliente: objs.data.ingreso.prefijo_doc_cliente,
//                                numero_doc_cliente: objs.data.ingreso.numero_doc_cliente,
//                                docTmpId: objs.data.ingreso.doc_tmp_id,
//                                valorTotalFactura: objs.data.ingreso.valor_total_factura,
//                                usuario_id: objs.data.ingreso.usuario_id
//                            }
//                        };
//                        Request.realizarRequest(API.I012.CREAR_DOCUMENTO, "POST", obj, function (data) {
//                            callback(data);
//                        });
//                    };


                    return this;
                }]);
});