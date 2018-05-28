define(["angular", "js/services"], function (angular, services) {


    services.factory('E007Service',
            ['$rootScope', 'Request', 'API', "AlertService",
                "$modal", "Usuario", "TipoTerceros", "localStorageService", function ($rootScope, Request, API,
                        AlertService, $modal, Usuario, TipoTerceros, localStorageService) {

                    var self = this;


                    /*
                     * @Author: German Galvis.
                     * @fecha 17/05/2018
                     * +Descripcion: lista las facturas
                     */
                    self.buscarEgresos = function (obj, callback) {
                        Request.realizarRequest(
                                API.E007.LISTAR_EGRESO,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {}
                                },
                                function (data) {

                                    callback(data);
                                }
                        );

                    };

                    /**
                     * @author German Andres Galvis
                     * @fecha  18/05/2018 DD/MM/YYYYY
                     * +Descripcion Consulta todos los tipos de documentos
                     */
                    self.listarTiposTerceros = function (obj, callback) {
                        Request.realizarRequest(
                                API.E007.LISTAR_TIPOS_TERCEROS,
                                "POST", obj,
                                function (data) {

                                    callback(data);
                                });
                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 18/05/2018
                     * +Descripcion: lista los clientes
                     */
                    self.listarClientes = function (obj, callback) {
                        Request.realizarRequest(
                                API.E007.LISTAR_CLIENTES,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                        filtro: obj.listar_clientes.filtro,
                                        terminoBusqueda: obj.listar_clientes.terminoBusqueda,
                                        empresaId: obj.listar_clientes.empresaId,
                                        paginaActual: obj.listar_clientes.paginaActual
                                    }
                                },
                                function (data) {

                                    callback(data);
                                }
                        );

                    };

                    /**
                     * @Author: German Galvis.
                     * @fecha 19/05/2018
                     * +Descripcion Metodo encargado de invocar el servicio que
                     *              crea los DocTemporal
                     */
                    self.crearGetDocTemporal = function (parametro, callback) {

                        var obj = {
                            session: parametro.session,
                            data: {
                                bodega_doc_id: parametro.data.bodega_doc_id,
                                observacion: parametro.data.observacion,
                                concepto_egreso_id: parametro.data.concepto_egreso_id,
                                empresaId: parametro.data.empresaId,
                                tipo_id_tercero: parametro.data.tipo_id_tercero,
                                tercero_id: parametro.data.tercero_id
                            }
                        };
                        Request.realizarRequest(API.E007.CREAR_NEW_DOCUMENTO_TEMPORAL, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @Author: German Galvis.
                     * @fecha 21/05/2018
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
                        Request.realizarRequest(API.E007.ELIMINAR_GET_DOC_TEMPORAL, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @Author: German Galvis.
                     * @fecha 21/05/2018
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
                        Request.realizarRequest(API.E007.LISTAR_PRODUCTOS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @Author: German Galvis.
                     * @fecha 23/05/2018
                     * +Descripcion Metodo encargado de invocar el servicio que
                     *              agrega items al DocTemporal
                     */
                    self.agregarProductoTmp = function (parametro, callback) {

                        var obj = {
                            session: parametro.session,
                            data: {
                                cantidad: parametro.data.cantidad,
                                codigoProducto: parametro.data.codigoProducto,
                                docTmpId: parametro.data.docTmpId,
                                empresa_id: parametro.data.empresa_id,
                                centro_utilidad: parametro.data.centro_utilidad,
                                lote: parametro.data.lote,
                                fechaVencimiento: parametro.data.fechaVencimiento,
                                disponible: parametro.data.disponible,
                                bodega: parametro.data.bodega
                            }
                        };
                        Request.realizarRequest(API.E007.AGREGAR_ITEM, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 28/03/2018
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

                        Request.realizarRequest(API.E007.ELIMINAR_PRODUCTO_TRASLADO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 24/05/2018
                     * +Descripcion: trae registro del cliente seleccionado
                     */
                    self.buscarClienteId = function (obj, callback) {
                        Request.realizarRequest(
                                API.E007.LISTAR_CLIENTE_ID,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                        id: obj.data.id,
                                        tipoId: obj.data.tipoId
                                    }
                                },
                                function (data) {

                                    callback(data);
                                }
                        );

                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 24/05/2018
                     * +Descripcion: trae registro del egreso seleccionado
                     */
                    self.buscarEgresoId = function (obj, callback) {
                        Request.realizarRequest(
                                API.E007.LISTAR_EGRESO_ID,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                        egreso_id: obj.data.egreso_id
                                    }
                                },
                                function (data) {

                                    callback(data);
                                }
                        );

                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 24/05/2018
                     * +Descripcion: Crea documento Definitivo
                     */
                    self.crearDocumento = function (objs, callback) {
                        var obj = {
                            session: objs.session,
                            data: {
                                empresaId: objs.data.empresaId,
                                concepto_egreso_id: objs.data.concepto_egreso_id,
                                tipo_id_tercero: objs.data.tipo_id_tercero,
                                tercero_id: objs.data.tercero_id,
                                docTmpId: objs.data.doc_tmp_id,
                                usuario_id: objs.data.usuario_id
                            }
                        };
                        console.log("obj",obj);
                        Request.realizarRequest(API.E007.CREAR_DOCUMENTO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };


                    return this;
                }]);
});