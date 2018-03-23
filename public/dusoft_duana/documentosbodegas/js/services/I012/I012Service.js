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
                     * @fecha 17/02/2018
                     * +Descripcion: lista las bodegas
                     */
                    /*self.buscarBodega = function (obj, callback) {
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
                     * @fecha 06/03/2018
                     * +Descripcion: trae registro de la bodega seleccionada
                     */
                    /*self.buscarBodegaId = function (obj, callback) {
                     Request.realizarRequest(
                     API.I011.LISTAR_BODEGA_ID,
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
                     
                     /*
                     * @Author: German Galvis.
                     * @fecha 19/02/2018
                     * +Descripcion: lista las bodegas
                     */
                    /*self.buscarNovedades = function (obj, callback) {
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
                    /*self.buscarDevoluciones = function (obj, callback) {
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
                    /*self.eliminarGetDocTemporal = function (parametro, callback) {
                     
                     var obj = {
                     session: parametro.session,
                     data: {
                     doc_tmp_id: parametro.data.doc_tmp_id,
                     listado: parametro.data.listado,
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
                    /*self.eliminarProductoDevolucion = function (objs, callback) {
                     var obj = {
                     session: objs.session,
                     data: {
                     item_id: objs.item_id,
                     lote: objs.lote,
                     cantidad: objs.cantidad,
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