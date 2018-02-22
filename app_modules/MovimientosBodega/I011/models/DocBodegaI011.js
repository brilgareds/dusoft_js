var DocumentoBodegaI011 = function () {
};

/**
 * @author German Galvis
 * +Descripcion consulta todas las bodegas
 * seleccionada
 * @params obj: sesion
 * @fecha 2018-02-17
 */
DocumentoBodegaI011.prototype.listarBodegas = function (parametros, callback) {
    var query = G.knex
            .select()
            .from('bodegas')
            .where('empresa_id', parametros.empresa)
            .andWhere('centro_utilidad', parametros.centro_utilidad);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarBodegas]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion consulta todas las devoluciones que cuenta la bodega
 * seleccionada
 * @params obj: bodega
 * @fecha 2018-02-19
 */
DocumentoBodegaI011.prototype.listarDevoluciones = function (parametros, callback) {

    var subquery = G.knex
            .select('numero_doc_farmacia')
            .from('inv_documento_verificacion');

    var query = G.knex
            .select()
            .from('inv_bodegas_movimiento')
            .where('prefijo', 'EDB')
            .andWhere('empresa_destino', parametros)
            .andWhere('numero', 'not in', subquery)
            .orderBy('numero', 'desc');

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarDevoluciones]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion lista todas los novedades disponibles paralas devoluciones
 * @fecha 2018-02-19
 */
DocumentoBodegaI011.prototype.listarNovedades = function (callback) {
    var query = G.knex
            .select()
            .from('inv_novedades_devoluciones')
            .where('estado', 1);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarNovedades]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion lista los productos devueltos
 * @fecha 2018-02-19
 */
DocumentoBodegaI011.prototype.consultarDetalleDevolucion = function (parametros, callback) {
    var columnas = [
        "invD.movimiento_id",
        "invD.codigo_producto",
        "invenPro.tipo_producto_id",
        "invenPro.descripcion",
        "invD.cantidad",
        "invD.lote",
        "invD.fecha_vencimiento"
    ];

    var query = G.knex.select(columnas)
            .from('inv_bodegas_movimiento_d AS invD')
            .innerJoin("inventarios_productos AS invenPro ", function () {
                this.on("invD.codigo_producto", "invenPro.codigo_producto")
            })
            .innerJoin("existencias_bodegas AS exisLote", function () {
                this.on("invD.empresa_id", "exisLote.empresa_id")
                        .on("invD.centro_utilidad", "exisLote.centro_utilidad")
                        .on("invD.bodega", "exisLote.bodega")
                        .on("invD.codigo_producto", "exisLote.codigo_producto")
            })
            .innerJoin("inventarios AS i", function () {
                this.on("invenPro.codigo_producto", "i.codigo_producto")
                        .on("exisLote.empresa_id", "i.empresa_id")
                        .on("exisLote.codigo_producto", "i.codigo_producto")
            })
            .where('invD.numero', parametros.numero_doc)
            .andWhere("invD.prefijo", parametros.prefijo);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarProductosDevolucion]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion actualiza el documento parcial para devoluciones
 * @fecha 2018-02-19
 */
DocumentoBodegaI011.prototype.modificarIngresoDevolucionTmp = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp")
            .where('doc_tmp_id', parametros.doc_tmp_id)
            .update('abreviatura', parametros.abreviatura);

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        callback(err);
    }).done();

};


/**
 * @author German Galvis
 * +Descripcion agrega productos al documento temporal
 * @fecha 2018-02-15
 */
DocumentoBodegaI011.prototype.agregarDocumentoVerificacionTmp = function (parametros, transaccion, callback) {
    var query = G.knex("inv_documento_verificacion_tmp").
            insert({farmacia_id: parametros.empresa_envia, prefijo: parametros.prefijo, numero: parametros.numero,
                empresa_id: parametros.empresaId, centro_utilidad: parametros.centroUtilidad, bodega: parametros.bodega,
                doc_tmp_id: parametros.doc_tmp_id, usuario_id: parametros.usuarioId
            });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error agregarDocumentoVerificacionTmp", err);
        callback(err);
    }).done();
};


/**
 * @author German Galvis
 * +Descripcion agrega un registro a la tabla inv_bodegas_movimiento_tmp_devolucion_farmacia
 * @fecha 2018-02-21
 */
DocumentoBodegaI011.prototype.generarMovimientoDevolucionFarmaciaTmp = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_devolucion_farmacia").
            insert({farmacia_id: parametros.empresa_envia, doc_tmp_id: parametros.doc_tmp_id, prefijo: parametros.prefijo,
                numero: parametros.numeracionDocumento, usuario_id: parametros.usuario_id
            });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error generarMovimientoDevolucionFarmaciaTmp", err);
        callback(err);
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion actualiza el documento parcial para devoluciones
 * @fecha 2018-02-14
 */
/*DocumentoBodegaE009.prototype.modificarDocumentoDevolucion = function (parametros, transaccion, callback) {
 var query = G.knex("inv_bodegas_movimiento")
 .where('prefijo', parametros.prefijoDocumento)
 .andWhere('numero', parametros.numeracionDocumento)
 .update('empresa_destino', parametros.bodega_destino);
 if (transaccion)
 query.transacting(transaccion);
 
 query.then(function (resultado) {
 callback(false, resultado);
 }).catch(function (err) {
 callback(err);
 }).done();
 
 };
 
 /**
 * @author German Galvis
 * +Descripcion elimina todos los productos asociados al documento parcial
 * @fecha 2018-02-14
 */
/*DocumentoBodegaE009.prototype.eliminarDocumentoTemporal_d = function (parametros, transaccion, callback) {
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
 * +Descripcion elimina el documento parcial para devoluciones
 * @fecha 2018-02-14
 */
/*DocumentoBodegaE009.prototype.eliminarDocumentoTemporal = function (parametros, transaccion, callback) {
 
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
 * +Descripcion elimina el item seleccionado del documento parcial
 * @fecha 2018-02-14
 */
/*DocumentoBodegaE009.prototype.eliminarItem = function (parametros, callback) {
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
 */
//DocumentoBodegaE009.$inject = ["m_movimientos_bodegas", "m_pedidos_clientes", "m_pedidos_farmacias"];

module.exports = DocumentoBodegaI011;
