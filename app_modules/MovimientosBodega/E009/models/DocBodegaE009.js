var DocumentoBodegaE009 = function () {
};

/**
 * @author German Galvis
 * +Descripcion consulta todas las bodegas que pertenezcan a la empresa y la bodega
 * seleccionada
 * @params obj: pedidoId
 * @fecha 2018-02-12
 */
DocumentoBodegaE009.prototype.listarBodegas = function (callback) {
    var query = G.knex
            .select()
            .from('bodegas')
            .where('bodega', '03');

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarBodegas]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion consulta todas las bodegas que tengan el id enviado
 * seleccionada
 * @params obj: bodegaId
 * @fecha 2018-03-06
 */
DocumentoBodegaE009.prototype.listarBodegaId = function (parametro,callback) {
    var query = G.knex
            .select()
            .from('bodegas')
            .where('bodega', parametro);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarBodegaId]:", err);
        callback(err);
    });
};


/**
 * @author German Galvis
 * +Descripcion consulta todas las productos
 * @fecha 2018-02-12
 */
DocumentoBodegaE009.prototype.listarProductos = function (parametros, callback) {
    var columnas = [
        "invenPro.codigo_producto",
        "invenPro.tipo_producto_id",
        "tPro.descripcion as nombreTipo",
        G.knex.raw("fc_descripcion_producto(\"invenPro\".\"codigo_producto\") as descripcion"),
        "exisLote.existencia_actual AS existencia",
        "subclase.descripcion AS subClase",
        "exisLote.lote",
        "exisLote.fecha_vencimiento"
    ];

    var query = G.knex.column(columnas)
            .from("existencias_bodegas as exisBodega")
            .innerJoin("inventarios_productos as invenPro", "exisBodega.codigo_producto", "invenPro.codigo_producto")
            .innerJoin("inv_subclases_inventarios AS subclase", function () {
                this.on("invenPro.subclase_id", "subclase.subclase_id")
                        .on("invenPro.clase_id", "subclase.clase_id")
            })
            .innerJoin("existencias_bodegas_lote_fv AS exisLote", function () {
                this.on("exisBodega.empresa_id", "exisLote.empresa_id")
                        .on("exisBodega.centro_utilidad", "exisLote.centro_utilidad")
                        .on("exisBodega.bodega", "exisLote.bodega")
                        .on("exisBodega.codigo_producto", "exisLote.codigo_producto")
            })
            .innerJoin("inv_tipo_producto as tPro", "invenPro.tipo_producto_id", "tPro.tipo_producto_id")
            .where("exisBodega.empresa_id", parametros.empresa_id)
            .andWhere("exisBodega.centro_utilidad", parametros.centro_utilidad)
            .andWhere("exisBodega.bodega", parametros.bodega)
            .andWhere("exisLote.existencia_actual", '>', 0)
            .andWhere(function () {
                if (parametros.tipoFiltro === '0') {
                    this.andWhere("invenPro.descripcion", G.constants.db().LIKE, "%" + parametros.descripcion + "%");
                } else if (parametros.tipoFiltro === '2') {
                    this.andWhere("subclase.descripcion", G.constants.db().LIKE, "%" + parametros.descripcion + "%");
                } else {
                    this.andWhere("invenPro.codigo_producto", parametros.descripcion);
                }
            });
    /* .limit(G.settings.limit).offset((parametros.pagina_actual - 1) * G.settings.limit);
    console.log("Query resultado", G.sqlformatter.format(
            query.toString()));*/

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarProductosEmpresa]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion actualiza el documento parcial para devoluciones
 * @fecha 2018-02-14
 */
DocumentoBodegaE009.prototype.insertarBodegasMovimientoDevolucionTmp = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp")
            .where('doc_tmp_id', parametros.doc_tmp_id)
            .update({
                abreviatura: parametros.abreviatura,
                empresa_destino: parametros.bodega_destino
            });

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
 * +Descripcion actualiza el documento parcial para devoluciones
 * @fecha 2018-02-14
 */
DocumentoBodegaE009.prototype.modificarDocumentoDevolucion = function (parametros, transaccion, callback) {
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
DocumentoBodegaE009.prototype.eliminarDocumentoTemporal_d = function (parametros, transaccion, callback) {
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
DocumentoBodegaE009.prototype.eliminarDocumentoTemporal = function (parametros, transaccion, callback) {

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
DocumentoBodegaE009.prototype.eliminarItem = function (parametros, callback) {
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
 * +Descripcion agrega productos al documento temporal
 * @fecha 2018-02-15
 */
DocumentoBodegaE009.prototype.agregarItem = function (parametros, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_d").
            insert({bodega: parametros.bodega, cantidad: parametros.cantidad, centro_utilidad: parametros.centroUtilidad,
                codigo_producto: parametros.codigoProducto, doc_tmp_id: parametros.docTmpId, empresa_id: parametros.empresaId,
                fecha_vencimiento: parametros.fechaVencimiento, lote: parametros.lote, usuario_id: parametros.usuarioId
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
 * +Descripcion agrega productos al documento temporal
 * @fecha 2018-02-15
 */
DocumentoBodegaE009.prototype.consultarItem = function (parametros, callback) {
    var query = G.knex
            .select()
            .from('inv_bodegas_movimiento_tmp_d')
            .where('empresa_id',parametros.empresaId )
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
 * @fecha 2018-02-15
 */
DocumentoBodegaE009.prototype.consultarDetalleDevolucion = function (parametros, callback) {
    var columnas = [
        "invD.item_id",
        "invD.codigo_producto",
        "invenPro.tipo_producto_id",
        G.knex.raw("fc_descripcion_producto(\"invD\".\"codigo_producto\") as descripcion"),
        "invD.cantidad",
        "subclase.descripcion AS subClase",
        "invD.lote",
        "invD.fecha_vencimiento"
    ];

    var query = G.knex.select(columnas)
            .from('inv_bodegas_movimiento_tmp_d AS invD')
            .innerJoin("inventarios_productos AS invenPro ", function () {
                this.on("invD.codigo_producto", "invenPro.codigo_producto")
            })
            .innerJoin("inv_subclases_inventarios AS subclase", function () {
                this.on("invenPro.subclase_id", "subclase.subclase_id")
                        .on("invenPro.grupo_id", "subclase.grupo_id")
                        .on("invenPro.clase_id", "subclase.clase_id")
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
            .where('invD.doc_tmp_id', parametros.numero_doc)
            .andWhere("invD.usuario_id", parametros.usuario_id);
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarProductosDevolucion]:", err);
        callback(err);
    });
};
//DocumentoBodegaE009.$inject = ["m_movimientos_bodegas", "m_pedidos_clientes", "m_pedidos_farmacias"];

module.exports = DocumentoBodegaE009;
