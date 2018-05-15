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

/**
 * @author German Galvis
 * +Descripcion consulta todos los traslados que pertenezcan a la empresa y la bodega
 * seleccionada y que sean dirigidos a la farmacia en sesion
 * @params obj: bodega origen y bodega destino
 * @fecha 2018-05-08
 */
DocumentoBodegaI015.prototype.listarTraslados = function (parametro, callback) {
    var query = G.knex
            .select()
            .from('inv_bodegas_movimiento as a')
            .innerJoin("inv_bodegas_movimiento_traslados_farmacia as b", function () {
                this.on("b.prefijo", "a.prefijo")
                        .on("b.numero", "a.numero");
            })
            .where('a.empresa_id',parametro.origen_empresa)
            .andWhere('a.centro_utilidad', parametro.origen_centro)
            .andWhere('a.bodega', parametro.origen_bodega)
            .andWhere('b.farmacia_id', parametro.destino_empresa)
            .andWhere('b.centro_utilidad', parametro.destino_centro)
            .andWhere('b.bodega', parametro.destino_bodega)
            .andWhere('b.sw_estado', '1')
            .orderBy('a.numero', 'desc');

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarTraslados]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion lista los productos a trasladar
 * @fecha 2018-05-08
 */
DocumentoBodegaI015.prototype.listarProductosTraslados = function (parametros, callback) {

    var columnas = [
        "invD.movimiento_id",
        "invD.codigo_producto",
        "invenPro.tipo_producto_id",
        "invD.cantidad",
        G.knex.raw("fc_descripcion_producto(\"invenPro\".\"codigo_producto\") as descripcion"),
        "invD.lote",
        "invD.fecha_vencimiento"
    ];

    var query = G.knex.select(columnas)
            .from('inv_bodegas_movimiento_d AS invD')
            .innerJoin("inventarios_productos AS invenPro ", "invD.codigo_producto", "invenPro.codigo_producto")
            .where('invD.numero', parametros.numero)
            .andWhere("invD.prefijo", parametros.prefijo);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarProductosTraslados]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion crea registro tmp de traslado
 * @fecha 2018-05-08
 */
DocumentoBodegaI015.prototype.insertarTrasladoFarmaciaTmp = function (parametros, transaccion, callback) {

    var query = G.knex("inv_bodegas_movimiento_tmp_ingresos_traslados_farmacia").
            insert({usuario_id: parametros.usuario_id, doc_tmp_id: parametros.doc_tmp_id, farmacia_id: parametros.farmacia_id,
                prefijo: parametros.prefijo, numero: parametros.numero
            });

    if (transaccion)
        query.transacting(transaccion);


    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error insertarTrasladoFarmaciaTmp", err);
        callback(err);
    }).done();
};


/**
 * @author German Galvis
 * +Descripcion elimina todos los productos asociados al documento parcial
 * @fecha 2018-05-08
 */
DocumentoBodegaI015.prototype.eliminarDocumentoTemporal_d = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_d").
            where('doc_tmp_id', parametros.docTmpId).
            andWhere('usuario_id', parametros.usuarioId).
            del();

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error eliminar_documento_temporal_d", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion elimina el documento temporal
 * @fecha 2018-05-08
 */
DocumentoBodegaI015.prototype.eliminarDocumentoTemporal = function (parametros, transaccion, callback) {

    var query = G.knex("inv_bodegas_movimiento_tmp").
            where('doc_tmp_id', parametros.docTmpId).
            andWhere('usuario_id', parametros.usuarioId).
            del();

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error __eliminar_documento_temporal", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion elimina el documento parcial para traslados de farmacia
 * @fecha 2018-05-08
 */
DocumentoBodegaI015.prototype.eliminarDocumentoTrasladoFarmaciaTemporal = function (parametros, transaccion, callback) {

    var query = G.knex("inv_bodegas_movimiento_tmp_ingresos_traslados_farmacia").
            where('doc_tmp_id', parametros.docTmpId).
            andWhere('usuario_id', parametros.usuarioId).
            del();

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error eliminarDocumentoTrasladoFarmaciaTemporal", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion agrega productos al documento temporal
 * @fecha 2018-05-09
 */
DocumentoBodegaI015.prototype.agregarItem = function (parametros, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_d").
            insert({bodega: parametros.bodega, cantidad: parametros.cantidad_enviada, centro_utilidad: parametros.centroUtilidad,
                codigo_producto: parametros.codigoProducto, doc_tmp_id: parametros.docTmpId, empresa_id: parametros.empresaId,
                fecha_vencimiento: parametros.fechaVencimiento, lote: parametros.lote, usuario_id: parametros.usuarioId,
                item_id_compras: parametros.item_id
            });

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error agregarItem", err);
        callback(err);
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion valida si el producto ya esta en el documento temporal
 * @fecha 2018-05-09
 */
DocumentoBodegaI015.prototype.consultarItem = function (parametros, callback) {
    var query = G.knex
            .select()
            .from('inv_bodegas_movimiento_tmp_d')
            .where('empresa_id', parametros.empresaId)
            .andWhere('doc_tmp_id', parametros.docTmpId)
            .andWhere('centro_utilidad', parametros.centroUtilidad)
            .andWhere('bodega', parametros.bodega)
            .andWhere('codigo_producto', parametros.codigoProducto)
            .andWhere('lote', parametros.lote)
            .andWhere('fecha_vencimiento', parametros.fechaVencimiento);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error consultarItem", err);
        callback(err);
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion lista los productos del documento temporal
 * @fecha 2018-05-09
 */
DocumentoBodegaI015.prototype.consultarProductosValidados = function (parametros, callback) {
    var columnas = [
        "invD.item_id",
        "invD.codigo_producto",
        "invD.item_id_compras",
        "invenPro.tipo_producto_id",
        G.knex.raw("fc_descripcion_producto(\"invD\".\"codigo_producto\") as descripcion"),
        "invD.cantidad",
        "invD.lote",
        "invD.fecha_vencimiento"
    ];

    var query = G.knex.select(columnas)
            .from('inv_bodegas_movimiento_tmp_d AS invD')
            .innerJoin("inventarios_productos AS invenPro ", function () {
                this.on("invD.codigo_producto", "invenPro.codigo_producto")
            })
            .where('invD.doc_tmp_id', parametros.numero_doc)
            .andWhere("invD.usuario_id", parametros.usuario_id);
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [consultarProductosValidados]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion elimina el item seleccionado del documento parcial
 * @fecha 2018-05-10
 */
DocumentoBodegaI015.prototype.eliminarItem = function (parametros, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_d").
            where('doc_tmp_id', parametros.docTmpId).
            andWhere('usuario_id', parametros.usuarioId).
            andWhere('item_id', parametros.item_id).
            del();

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error eliminarItem", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion consulta la bodega que pertenezca a la empresa y la bodega
 * seleccionada
 * @params obj: bodega
 * @fecha 2018-05-07
 */
DocumentoBodegaI015.prototype.listarDocumentoId = function (parametro, callback) {
    var query = G.knex
            .select()
            .from('inv_bodegas_movimiento as a')
            .innerJoin("inv_bodegas_movimiento_traslados_farmacia as b", function () {
                this.on("b.prefijo", "a.prefijo")
                        .on("b.numero", "a.numero");
            })
            .where('b.prefijo',parametro.prefijo)
            .andWhere('b.numero', parametro.numero);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarDocumentoId]:", err);
        callback(err);
    });
};
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
