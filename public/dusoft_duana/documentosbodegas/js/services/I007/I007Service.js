define(["angular", "js/services"], function (angular, services) {


    services.factory('I007Service',
            ['$rootScope', 'Request', 'API', "AlertService",
                "$modal", "Usuario", "TipoTerceros", "localStorageService", function ($rootScope, Request, API,
                        AlertService, $modal, Usuario, TipoTerceros, localStorageService) {

                    var self = this;

                    /**
                     * @author German Andres Galvis
                     * @fecha  01/06/2018 DD/MM/YYYYY
                     * +Descripcion Consulta todos los tipos de documentos
                     */
                    self.listarTiposTerceros = function (obj, callback) {
                        Request.realizarRequest(
                                API.I007.LISTAR_TIPOS_TERCEROS,
                                "POST", obj,
                                function (data) {

                                    callback(data);
                                });
                    };

                    /**
                     * @author German Andres Galvis
                     * @fecha  06/06/2018 DD/MM/YYYYY
                     * +Descripcion Consulta todos los tipos de prestamos
                     */
                    self.listarPrestamos = function (obj, callback) {
                        Request.realizarRequest(
                                API.I007.LISTAR_PRESTAMOS,
                                "POST", obj,
                                function (data) {

                                    callback(data);
                                });
                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 01/06/2018
                     * +Descripcion: lista los terceros
                     */
                    self.listarTerceros = function (obj, callback) {
                        Request.realizarRequest(
                                API.I007.LISTAR_TERCEROS,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                        filtro: obj.data.filtro,
                                        terminoBusqueda: obj.data.terminoBusqueda,
                                        empresaId: obj.data.empresaId,
                                        paginaActual: obj.data.paginaActual
                                    }
                                },
                                function (data) {

                                    callback(data);
                                }
                        );

                    };
                    
                    /**
                     * @Author: German Galvis.
                     * @fecha 01/06/2018
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
                        Request.realizarRequest(API.I007.LISTAR_PRODUCTOS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @Author: German Galvis.
                     * @fecha 06/06/2018
                     * +Descripcion Metodo encargado de invocar el servicio que
                     *              crea los DocTemporal
                     */
                    self.crearGetDocTemporal = function (parametro, callback) {

                        var obj = {
                            session: parametro.session,
                            data: {
                                bodega_doc_id: parametro.data.bodega_doc_id,
                                observacion: parametro.data.observacion,
                                prestamo: parametro.data.prestamo,
                                tipo_id_tercero: parametro.data.tipo_id_tercero,
                                tercero_id: parametro.data.tercero_id
                            }
                        };
                        Request.realizarRequest(API.I007.CREAR_NEW_DOCUMENTO_TEMPORAL, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @Author: German Galvis.
                     * @fecha 06/06/2018
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
                        Request.realizarRequest(API.I007.ELIMINAR_GET_DOC_TEMPORAL, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @Author: German Galvis.
                     * @fecha 07/06/2018
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
                                gravemen: parametro.data.gravemen,
                                costo: parametro.data.costo,
                                fechaVencimiento: parametro.data.fechaVencimiento,
                                bodega: parametro.data.bodega
                            }
                        };
                        Request.realizarRequest(API.I007.AGREGAR_ITEM, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 07/06/2018
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

                        Request.realizarRequest(API.I007.ELIMINAR_PRODUCTO_TRASLADO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 07/06/2018
                     * +Descripcion: trae registro del tercero seleccionado
                     */
                    self.buscarTerceroId = function (obj, callback) {
                        Request.realizarRequest(
                                API.I007.LISTAR_TERCERO_ID,
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
                     * @fecha 07/06/2018
                     * +Descripcion: trae registro del prestamo seleccionado
                     */
                    self.buscarPrestamoId = function (obj, callback) {
                        Request.realizarRequest(
                                API.I007.LISTAR_PRESTAMO_ID,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                        tipoprestamo: obj.data.tipoprestamo
                                    }
                                },
                                function (data) {

                                    callback(data);
                                }
                        );

                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 08/06/2018
                     * +Descripcion: Crea documento Definitivo
                     */
                    self.crearDocumento = function (objs, callback) {
                        var obj = {
                            session: objs.session,
                            data: {
                                empresaId: objs.data.empresaId,
                                prestamo_id: objs.data.prestamo_id,
                                prestamo: objs.data.prestamo,
                                tipo_id_tercero: objs.data.tipo_id_tercero,
                                tercero_id: objs.data.tercero_id,
                                nombreTercero: objs.data.nombreTercero,
                                docTmpId: objs.data.doc_tmp_id,
                                usuario_id: objs.data.usuario_id
                            }
                        };
                        Request.realizarRequest(API.I007.CREAR_DOCUMENTO, "POST", obj, function (data) {
                            callback(data);
                        });
                    };


                    return this;
                }]);
});