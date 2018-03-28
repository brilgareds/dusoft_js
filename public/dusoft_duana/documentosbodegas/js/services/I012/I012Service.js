define(["angular", "js/services"], function (angular, services) {


    services.factory('I012Service',
            ['$rootScope', 'Request', 'API', "AlertService",
                "$modal", "Usuario", "TipoTerceros", "localStorageService", function ($rootScope, Request, API,
                        AlertService, $modal, Usuario, TipoTerceros, localStorageService) {

                    var self = this;

                    /**
                     * @author German Andres Galvis
                     * @fecha  20/03/2018 DD/MM/YYYYY
                     * +Descripcion Consulta todos los tipos de documentos
                     */
                    self.listarTiposTerceros = function (obj, callback) {
                        Request.realizarRequest(API.I012.LISTAR_TIPOS_TERCEROS, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @author German Andres Galvis
                     * +Descripcion Funcion encargada de serializar el resultado de la
                     *              consulta que obtiene los tipos de documentos
                     * @fecha 20/03/2018 DD/MM/YYYYY
                     */
                    self.renderListarTipoTerceros = function (tipoDocumento) {

                        var tipoDocumentos = [];
                        for (var i in tipoDocumento) {

                            var _tipoDocumento = TipoTerceros.get(tipoDocumento[i].id, tipoDocumento[i].descripcion);
                            tipoDocumentos.push(_tipoDocumento);
                        }
                        return tipoDocumentos;
                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 24/03/2018
                     * +Descripcion: lista los clientes
                     */
                    self.listarClientes = function (obj, callback) {
                        Request.realizarRequest(
                                API.I012.LISTAR_CLIENTES,
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

                    /*
                     * @Author: German Galvis.
                     * @fecha 26/03/2018
                     * +Descripcion: lista las facturas
                     */
                    self.buscarFacturas = function (obj, callback) {
                        Request.realizarRequest(
                                API.I012.LISTAR_FACTURAS,
                                "POST",
                                {
                                    session: obj.session,
                                    data: {
                                        documento: obj.cliente.id,
                                        tipo_documento: obj.cliente.tipo_id_tercero,
                                        empresaId: obj.empresaId
                                    }
                                },
                                function (data) {

                                    callback(data);
                                }
                        );

                    };

                    /**
                     * @Author: German Galvis.
                     * @fecha 27/03/2018
                     * +Descripcion Metodo encargado de invocar el servicio que
                     *              borra los DocTemporal
                     */
                    self.eliminarGetDocTemporal = function (parametro, callback) {

                        var obj = {
                            session: parametro.session,
                            data: {
                                doc_tmp_id: parametro.data.doc_tmp_id,
//                     listado: parametro.data.listado,
//                     numero: parametro.data.numero,
//                     prefijo: parametro.data.prefijo
                            }
                        };
                        Request.realizarRequest(API.I012.ELIMINAR_GET_DOC_TEMPORAL, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /**
                     * @Author: German Galvis.
                     * @fecha 27/03/2018
                     * +Descripcion Metodo encargado de invocar el servicio que
                     *              agrega items al DocTemporal
                     */
                    self.agregarProductoTmp = function (parametro, callback) {

                        var obj = {
                            session: parametro.session,
                            data: {
                                bodega: parametro.data.bodega,
                                cantidad: parametro.data.cantidad,
                                centroUtilidad: parametro.data.centroUtilidad,
                                codigoProducto: parametro.data.codigoProducto,
                                docTmpId: parametro.data.docTmpId,
                                empresaId: parametro.data.empresaId,
                                fechaVencimiento: parametro.data.fechaVencimiento,
                                lote: parametro.data.lote,
                                item_id: parametro.data.item_id,
                                gravamen: parametro.data.gravamen,
                                totalCosto: parametro.data.totalCosto,
                                valorU: parametro.data.valorU,
                                totalCostoPedido: parametro.data.totalCostoPedido,
                                numero_doc: parametro.data.numero_doc,
                                prefijo: parametro.data.prefijo,
                                tipoDocumento: parametro.data.tipoDocumento
                            }
                        };
                        Request.realizarRequest(API.I012.AGREGAR_ITEM, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 28/03/2018
                     * +Descripcion: elimionar producto en temporal
                     */
                    self.eliminarProductoDevolucion = function (objs, callback) {
                        var obj = {
                            session: objs.session,
                            data: {
                                item_id: objs.item_id,
                                docTmpId: objs.docTmpId,
                                cantidad: objs.cantidad,
                                codigo_producto: objs.codigo_producto,
                                fechaVencimiento: objs.fechaVencimiento,
                                lote: objs.lote,
                                numero_doc: objs.numero_doc,
                                prefijo: objs.prefijo,
                                tipoDocumento: objs.tipoDocumento
                            }
                        };

                        Request.realizarRequest(API.I012.ELIMINAR_PRODUCTO_DEVOLUCION, "POST", obj, function (data) {
                            callback(data);
                        });
                    };

                    /*
                     * @Author: German Galvis.
                     * @fecha 14/02/2018
                     * +Descripcion: Crea documento Definitivo
                     */
                    /*self.crearDocumento = function (objs, callback) {
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
                     };*/


                    return this;
                }]);
});