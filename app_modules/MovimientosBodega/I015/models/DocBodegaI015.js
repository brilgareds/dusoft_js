var DocumentoBodegaI015 = function () {
};

/**
 * @author German Galvis
 * +Descripcion consulta todas las bodegas que pertenezcan a la empresa y la bodega
 * seleccionada
 * @params obj: bodega
 * @fecha 2018-05-07
 */
DocumentoBodegaI015.prototype.listarBodegas = function (parametro, callback) {
    var query = G.knex
            .select()
            .from('bodegas')
            .whereNot('bodega', parametro.bodega)
            .andWhere('empresa_id', 'FD')
            .orderBy('descripcion', 'asc');

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarBodegas]:", err);
        callback(err);
    });
};

///**
// * @author German Galvis
// * +Descripcion consulta la bodega que pertenezca a la empresa y la bodega
// * seleccionada
// * @params obj: bodega
// * @fecha 2018-05-07
// */
//DocumentoBodegaE017.prototype.listarBodegaId = function (parametro, callback) {
//    var query = G.knex
//            .select()
//            .from('bodegas')
//            .where('bodega', parametro.bodega)
//            .andWhere('centro_utilidad', parametro.centro_utilidad)
//            .andWhere('empresa_id', parametro.empresa_id);
//
//    query.then(function (resultado) {
//        callback(false, resultado);
//    }).catch(function (err) {
//        console.log("err [listarBodegaId]:", err);
//        callback(err);
//    });
//};
//
///**
// * @author German Galvis
// * +Descripcion actualiza el documento parcial para devoluciones
// * @fecha 2018-05-03
// */
//DocumentoBodegaE017.prototype.insertarBodegasMovimientoTmp = function (parametros, transaccion, callback) {
//
//    var query = G.knex("inv_bodegas_movimiento_tmp")
//            .where('doc_tmp_id', parametros.doc_tmp_id)
//            .update('empresa_destino', parametros.bodega_destino);
//
//    if (transaccion)
//        query.transacting(transaccion);
//
//    query.then(function (resultado) {
//        callback(false, resultado);
//    }).catch(function (err) {
//        callback(err);
//    }).done();
//
//};
//
///**
// * @author German Galvis
// * +Descripcion crea registro tmp de traslado
// * @fecha 2018-05-03
// */
//DocumentoBodegaE017.prototype.insertarTrasladoFarmaciaTmp = function (parametros, transaccion, callback) {
//
//    var query = G.knex("inv_bodegas_movimiento_tmp_traslados_farmacia").
//            insert({usuario_id: parametros.usuario_id, doc_tmp_id: parametros.doc_tmp_id, farmacia_id: parametros.farmacia_id,
//                centro_utilidad: parametros.centro_utilidad, bodega: parametros.bodega
//            });
//
//    if (transaccion)
//        query.transacting(transaccion);
//
//
//    query.then(function (resultado) {
//        callback(false, resultado);
//    }).catch(function (err) {
//        console.log("Error insertarTrasladoFarmaciaTmp", err);
//        callback(err);
//    }).done();
//};
//
//
///**
// * @author German Galvis
// * +Descripcion elimina todos los productos asociados al documento parcial
// * @fecha 2018-05-03
// */
//DocumentoBodegaE017.prototype.eliminarDocumentoTemporal_d = function (parametros, transaccion, callback) {
//    var query = G.knex("inv_bodegas_movimiento_tmp_d").
//            where('doc_tmp_id', parametros.docTmpId).
//            andWhere('usuario_id', parametros.usuarioId).
//            del();
//
//    if (transaccion)
//        query.transacting(transaccion);
//
//    query.then(function (resultado) {
//        callback(false, resultado);
//    }).catch(function (err) {
//        console.log("Error eliminar_documento_temporal_d", err);
//        callback(err);
//    });
//};
//
///**
// * @author German Galvis
// * +Descripcion elimina el documento parcial para devoluciones
// * @fecha 2018-05-03
// */
//DocumentoBodegaE017.prototype.eliminarDocumentoTemporal = function (parametros, transaccion, callback) {
//
//    var query = G.knex("inv_bodegas_movimiento_tmp").
//            where('doc_tmp_id', parametros.docTmpId).
//            andWhere('usuario_id', parametros.usuarioId).
//            del();
//
//    if (transaccion)
//        query.transacting(transaccion);
//
//    query.then(function (resultado) {
//        callback(false, resultado);
//    }).catch(function (err) {
//        console.log("Error __eliminar_documento_temporal", err);
//        callback(err);
//    });
//};
//
///**
// * @author German Galvis
// * +Descripcion elimina el documento parcial para traslados de farmacia
// * @fecha 2018-05-03
// */
//DocumentoBodegaE017.prototype.eliminarDocumentoTrasladoFarmaciaTemporal = function (parametros, transaccion, callback) {
//
//    var query = G.knex("inv_bodegas_movimiento_tmp_traslados_farmacia").
//            where('doc_tmp_id', parametros.docTmpId).
//            andWhere('usuario_id', parametros.usuarioId).
//            del();
//
//    if (transaccion)
//        query.transacting(transaccion);
//
//    query.then(function (resultado) {
//        callback(false, resultado);
//    }).catch(function (err) {
//        console.log("Error eliminarDocumentoTrasladoFarmaciaTemporal", err);
//        callback(err);
//    });
//};
//
//
///**
// * @author German Galvis
// * +Descripcion consulta todos los productos
// * @fecha 2018-05-04
// */
//DocumentoBodegaE017.prototype.listarProductos = function (parametros, callback) {
//    var columnas = [
//        "invenPro.codigo_producto",
//        "invenPro.tipo_producto_id",
//        "tPro.descripcion as nombreTipo",
//        G.knex.raw("fc_descripcion_producto(\"invenPro\".\"codigo_producto\") as descripcion"),
//        "exisLote.existencia_actual AS existencia",
//        "subclase.descripcion AS subClase",
//        "exisLote.lote",
//        "exisLote.fecha_vencimiento"
//    ];
//    var query = G.knex.column(columnas)
//            .from("existencias_bodegas as exisBodega")
//            .innerJoin("inventarios_productos as invenPro", "exisBodega.codigo_producto", "invenPro.codigo_producto")
//            .innerJoin("inv_subclases_inventarios AS subclase", function () {
//                this.on("invenPro.subclase_id", "subclase.subclase_id")
//                        .on("invenPro.clase_id", "subclase.clase_id")
//            })
//            .innerJoin("existencias_bodegas_lote_fv AS exisLote", function () {
//                this.on("exisBodega.empresa_id", "exisLote.empresa_id")
//                        .on("exisBodega.centro_utilidad", "exisLote.centro_utilidad")
//                        .on("exisBodega.bodega", "exisLote.bodega")
//                        .on("exisBodega.codigo_producto", "exisLote.codigo_producto")
//            })
//            .innerJoin("inv_tipo_producto as tPro", "invenPro.tipo_producto_id", "tPro.tipo_producto_id")
//            .where("exisBodega.empresa_id", parametros.empresa_id)
//            .andWhere("exisBodega.centro_utilidad", parametros.centro_utilidad)
//            .andWhere("exisBodega.bodega", parametros.bodega)
//            .andWhere("exisLote.existencia_actual", '>', 0)
//            .andWhere(function () {
//                if (parametros.tipoFiltro === '0') {
//                    this.andWhere("invenPro.descripcion", G.constants.db().LIKE, "%" + parametros.descripcion + "%");
//                } else if (parametros.tipoFiltro === '2') {
//                    this.andWhere("subclase.descripcion", G.constants.db().LIKE, "%" + parametros.descripcion + "%");
//                } else {
//                    this.andWhere("invenPro.codigo_producto", parametros.descripcion);
//                }
//            }).limit(G.settings.limit).offset((parametros.paginaActual - 1) * G.settings.limit);
//
//    query.then(function (resultado) {
//        callback(false, resultado);
//    }).catch(function (err) {
//        console.log("err [listarProductosEmpresa]:", err);
//        callback(err);
//    });
//};
//
///**
// * @author German Galvis
// * +Descripcion agrega productos al documento temporal
// * @fecha 2018-05-04
// */
//DocumentoBodegaE017.prototype.agregarItem = function (parametros, callback) {
//    var query = G.knex("inv_bodegas_movimiento_tmp_d").
//            insert({bodega: parametros.bodega, cantidad: parametros.cantidad, centro_utilidad: parametros.centroUtilidad,
//                codigo_producto: parametros.codigoProducto, doc_tmp_id: parametros.docTmpId, empresa_id: parametros.empresaId,
//                fecha_vencimiento: parametros.fechaVencimiento, lote: parametros.lote, usuario_id: parametros.usuarioId
//            });
//
//    query.then(function (resultado) {
//        callback(false, resultado);
//    }).catch(function (err) {
//        console.log("Error agregarItem", err);
//        callback(err);
//    }).done();
//};
//
///**
// * @author German Galvis
// * +Descripcion valida si el producto ya esta en el documento temporal
// * @fecha 2018-05-04
// */
//DocumentoBodegaE017.prototype.consultarItem = function (parametros, callback) {
//    var query = G.knex
//            .select()
//            .from('inv_bodegas_movimiento_tmp_d')
//            .where('empresa_id', parametros.empresaId)
//            .andWhere('doc_tmp_id', parametros.docTmpId)
//            .andWhere('centro_utilidad', parametros.centroUtilidad)
//            .andWhere('bodega', parametros.bodega)
//            .andWhere('codigo_producto', parametros.codigoProducto)
//            .andWhere('lote', parametros.lote)
//            .andWhere('fecha_vencimiento', parametros.fechaVencimiento);
//
//    query.then(function (resultado) {
//        callback(false, resultado);
//    }).catch(function (err) {
//        console.log("Error consultarItem", err);
//        callback(err);
//    }).done();
//};
//
///**
// * @author German Galvis
// * +Descripcion lista los productos del documento temporal
// * @fecha 2018-05-05
// */
//DocumentoBodegaE017.prototype.consultarProductosTraslados = function (parametros, callback) {
//    var columnas = [
//        "invD.item_id",
//        "invD.codigo_producto",
//        "invenPro.tipo_producto_id",
//        G.knex.raw("fc_descripcion_producto(\"invD\".\"codigo_producto\") as descripcion"),
//        "invD.cantidad",
//        "subclase.descripcion AS subClase",
//        "invD.lote",
//        "invD.fecha_vencimiento"
//    ];
//
//    var query = G.knex.select(columnas)
//            .from('inv_bodegas_movimiento_tmp_d AS invD')
//            .innerJoin("inventarios_productos AS invenPro ", function () {
//                this.on("invD.codigo_producto", "invenPro.codigo_producto")
//            })
//            .innerJoin("inv_subclases_inventarios AS subclase", function () {
//                this.on("invenPro.subclase_id", "subclase.subclase_id")
//                        .on("invenPro.grupo_id", "subclase.grupo_id")
//                        .on("invenPro.clase_id", "subclase.clase_id")
//            })
//            .innerJoin("existencias_bodegas AS exisLote", function () {
//                this.on("invD.empresa_id", "exisLote.empresa_id")
//                        .on("invD.centro_utilidad", "exisLote.centro_utilidad")
//                        .on("invD.bodega", "exisLote.bodega")
//                        .on("invD.codigo_producto", "exisLote.codigo_producto")
//            })
//            .innerJoin("inventarios AS i", function () {
//                this.on("invenPro.codigo_producto", "i.codigo_producto")
//                        .on("exisLote.empresa_id", "i.empresa_id")
//                        .on("exisLote.codigo_producto", "i.codigo_producto")
//            })
//            .where('invD.doc_tmp_id', parametros.numero_doc)
//            .andWhere("invD.usuario_id", parametros.usuario_id);
//    query.then(function (resultado) {
//        callback(false, resultado);
//    }).catch(function (err) {
//        console.log("err [listarProductosDevolucion]:", err);
//        callback(err);
//    });
//};
//
///**
// * @author German Galvis
// * +Descripcion elimina el item seleccionado del documento parcial
// * @fecha 2018-05-05
// */
//DocumentoBodegaE017.prototype.eliminarItem = function (parametros, callback) {
//    var query = G.knex("inv_bodegas_movimiento_tmp_d").
//            where('doc_tmp_id', parametros.docTmpId).
//            andWhere('usuario_id', parametros.usuarioId).
//            andWhere('item_id', parametros.item_id).
//            del();
//
//    query.then(function (resultado) {
//        callback(false, resultado);
//    }).catch(function (err) {
//        console.log("Error eliminarItem", err);
//        callback(err);
//    });
//};
//
///**
// * @author German Galvis
// * +Descripcion agrega un registro a la tabla inv_bodegas_movimiento_traslados_farmacia
// * @fecha 2018-05-07
// */
//DocumentoBodegaE017.prototype.agregarMovimientoTrasladoFarmacia = function (parametros, transaccion, callback) {
//    var query = G.knex("inv_bodegas_movimiento_traslados_farmacia").
//            insert({farmacia_id: parametros.bodega_destino.empresa_id, empresa_id: parametros.empresaId, prefijo: parametros.prefijoDocumento,
//                numero: parametros.numeracionDocumento, sw_estado: parametros.sw_estado, centro_utilidad: parametros.bodega_destino.centro_utilidad,
//                bodega: parametros.bodega_destino.bodega
//            });
//
//    if (transaccion)
//        query.transacting(transaccion);
//
//    query.then(function (resultado) {
//        callback(false, resultado);
//    }).catch(function (err) {
//        console.log("Error agregarMovimientoTrasladoFarmacia", err);
//        callback(err);
//    }).done();
//};
//
///**
// * @author German Galvis
// * +Descripcion elimina el registro de la tabla temporal inv_bodegas_movimiento_tmp_traslados_farmacia
// * @fecha 2018-05-07
// */
//DocumentoBodegaE017.prototype.eliminarMovimientoTrasladoFarmacia = function (parametros, transaccion, callback) {
//    var query = G.knex("inv_bodegas_movimiento_tmp_traslados_farmacia").
//            where('doc_tmp_id', parametros.docTmpId).
//            andWhere('usuario_id', parametros.usuarioId).
//            del();
//
//    if (transaccion)
//        query.transacting(transaccion);
//
//    query.then(function (resultado) {
//        callback(false, resultado);
//    }).catch(function (err) {
//        console.log("Error eliminarMovimientoTrasladoFarmacia", err);
//        callback(err);
//    });
//};
//
///**
// * @author German Galvis
// * +Descripcion consulta los productos pertenecientes al documento a imprimir
// * @fecha 2018-05-07
// */
//DocumentoBodegaE017.prototype.consultar_detalle_documento = function (parametro, callback) {
//    var columnas = [
//        "a.codigo_producto",
//        "a.lote",
//        G.knex.raw("\"a\".\"cantidad\"::integer"),
//        G.knex.raw("to_char(\"a\".\"fecha_vencimiento\", 'dd-mm-yyyy') as fecha_vencimiento"),
//        G.knex.raw("fc_descripcion_producto(\"b\".\"codigo_producto\") as nombre"),
//        "param.torre"
//    ];
//
//    var query = G.knex.select(columnas)
//            .from('inv_bodegas_movimiento_d  AS a')
//            .innerJoin("inventarios_productos  AS b ", "a.codigo_producto", "b.codigo_producto")
//            .leftJoin("param_torreproducto AS param", "param.codigo_producto", "a.codigo_producto")
//            .where('a.empresa_id', parametro.empresaId)
//            .andWhere("a.prefijo", parametro.prefijoDocumento)
//            .andWhere("a.numero", parametro.numeracionDocumento)
//            .orderBy('param.torre', 'asc');
//
//    query.then(function (resultado) {
//        callback(false, resultado);
//    }).catch(function (err) {
//        callback(err);
//    });
//};
//
///**
// * @author German Galvis
// * +Descripcion consulta la bodega que pertenezca a la empresa y la bodega
// * seleccionada
// * @params obj: bodega
// * @fecha 2018-05-07
// */
//DocumentoBodegaE017.prototype.consultarFarmaciaDestino = function (parametro, callback) {
//    var query = G.knex
//            .select()
//            .from('inv_bodegas_movimiento_traslados_farmacia as a')
//            .innerJoin("bodegas as b", function () {
//                this.on("b.empresa_id", "a.farmacia_id")
//                        .on("b.centro_utilidad", "a.centro_utilidad")
//                        .on("b.bodega", "a.bodega")
//            })
//            .where('a.prefijo', parametro.prefijoDocumento)
//            .andWhere('a.numero', parametro.numeracionDocumento);
//
//    query.then(function (resultado) {
//        callback(false, resultado);
//    }).catch(function (err) {
//        console.log("err [consultarFarmaciaDestino]:", err);
//        callback(err);
//    });
//};
module.exports = DocumentoBodegaI015;
