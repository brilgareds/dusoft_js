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
 * +Descripcion consulta todas las bodegas que tengan el id enviado
 * seleccionada
 * @params obj: bodegaId
 * @fecha 2018-03-06
 */
DocumentoBodegaI011.prototype.listarBodegaId = function (parametro,callback) {
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
    var subQuery = G.knex.raw("(\"invD\".\"cantidad\" -\"invD\".\"cantidad_recibida\")>0");
    var columnas = [
        "invD.movimiento_id",
        "invD.codigo_producto",
        "invenPro.tipo_producto_id",
        G.knex.raw("fc_descripcion_producto(\"invenPro\".\"codigo_producto\") as descripcion"),
        G.knex.raw("(\"invD\".\"cantidad\" -\"invD\".\"cantidad_recibida\") as  cantidad"),
        "invD.lote",
        "invD.fecha_vencimiento",
        "param.torre"
    ];

    var query = G.knex.select(columnas)
            .from('inv_bodegas_movimiento_d AS invD')
            .innerJoin("inventarios_productos AS invenPro ", "invD.codigo_producto", "invenPro.codigo_producto")
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
            .leftJoin("param_torreproducto AS param", "invD.codigo_producto", "param.codigo_producto")
            .where('invD.numero', parametros.numero_doc)
            .andWhere("invD.prefijo", parametros.prefijo)
            .andWhere(subQuery);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarProductosDevolucion]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion actualiza el producto devuelto 
 * @fecha 2018-02-27
 */
DocumentoBodegaI011.prototype.updateMovimientoD = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_d")
            .where('movimiento_id', parametros.movimiento_id)
            .update('cantidad_recibida', G.knex.raw('cantidad_recibida +' + parametros.cantidad));

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
 * +Descripcion actualiza el producto devuelto 
 * @fecha 2018-02-27
 */
DocumentoBodegaI011.prototype.restarCantidadMovimientoD = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_d")
            .where('movimiento_id', parametros.movimiento_id)
            .update('cantidad_recibida', G.knex.raw('cantidad_recibida -' + parametros.cantidad));
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
 * +Descripcion actualiza todos los productos devueltos
 * @fecha 2018-02-27
 */
DocumentoBodegaI011.prototype.updateAllMovimientoD = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_d")
            .where('movimiento_id', parametros.movimiento_id)
            .update('cantidad_recibida', parametros.cantidad);

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
 * +Descripcion agrega productos al documento temporal
 * @fecha 2018-02-15
 */
DocumentoBodegaI011.prototype.agregarItem = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_d")
            .returning('item_id')
            .insert({bodega: parametros.bodega, cantidad: parametros.cantidad, centro_utilidad: parametros.centroUtilidad,
                codigo_producto: parametros.codigoProducto, doc_tmp_id: parametros.docTmpId, empresa_id: parametros.empresaId,
                fecha_vencimiento: parametros.fechaVencimiento, lote: parametros.lote, usuario_id: parametros.usuarioId,
                item_id_compras: parametros.movimiento_id
            });
    if (transaccion)
        query.transacting(transaccion);

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
 * @fecha 2018-02-23
 */
DocumentoBodegaI011.prototype.agregarDocumentoVerificacionTmpD = function (parametros, transaccion, callback) {
    var query = G.knex("inv_documento_verificacion_tmp_d").
            insert({farmacia_id: parametros.empresa_envia, prefijo: parametros.prefijo, numero: parametros.numero,
                item_id: parametros.item_id, codigo_producto: parametros.codigoProducto, doc_tmp_id: parametros.docTmpId,
                usuario_id: parametros.usuarioId, lote: parametros.lote, fecha_vencimiento: parametros.fechaVencimiento,
                cantidad: parametros.cantidad, novedad_devolucion_id: parametros.novedad_id, novedad_anexa: parametros.novedad_anexa
            });
    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error agregarDocumentoVerificacionTmpD", err);
        callback(err);
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion agrega un registro a la tabla inv_bodegas_movimiento_tmp_devolucion_farmacia_producto
 * @fecha 2018-02-21
 */
DocumentoBodegaI011.prototype.agregarMovimientoDevolucionFarmaciaTmpD = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_devolucion_farmacia_productos").
            insert({movimiento_id: parametros.movimiento_id, doc_tmp_id: parametros.docTmpId, lote: parametros.lote,
                codigo_producto: parametros.codigoProducto, usuario_id: parametros.usuarioId, fecha_vencimiento: parametros.fechaVencimiento,
                cantidad: parametros.cantidad
            });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error agregarMovimientoDevolucionFarmaciaTmpD", err);
        callback(err);
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion lista los productos del documento temporal
 * @fecha 2018-02-15
 */
DocumentoBodegaI011.prototype.consultarProductosValidados = function (parametros, callback) {

    var columnas = [
        "invD.item_id",
        "invD.item_id_compras as movimiento_id",
        "invD.codigo_producto",
        "invenPro.tipo_producto_id",
        G.knex.raw("fc_descripcion_producto(\"invD\".\"codigo_producto\") as descripcion"),
        "invD.cantidad",
        "invD.lote",
        "n.descripcion as novedad",
        "invVer.novedad_anexa",
        "invD.fecha_vencimiento",
        "param.torre",
    ];

    var query = G.knex.select(columnas)
            .from('inv_bodegas_movimiento_tmp_d AS invD')
            .innerJoin("inventarios_productos AS invenPro", "invD.codigo_producto", "invenPro.codigo_producto")
            .innerJoin("inv_documento_verificacion_tmp_d AS invVer", function () {
                this.on("invD.doc_tmp_id", "invVer.doc_tmp_id")
                        .on("invD.codigo_producto", "invVer.codigo_producto")
                        .on("invD.item_id", "invVer.item_id")
            })
            .innerJoin("inv_novedades_devoluciones AS n", "invVer.novedad_devolucion_id", "n.novedad_devolucion_id")
            .leftJoin("param_torreproducto AS param", "invD.codigo_producto", "param.codigo_producto")
            .where('invD.doc_tmp_id', parametros.numero_doc)
            .andWhere("invD.usuario_id", parametros.usuario_id);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarProductosDevolucion]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion elimina el item seleccionado del documento parcial
 * @fecha 2018-02-14
 */
DocumentoBodegaI011.prototype.eliminarItem = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_d").
            where('doc_tmp_id', parametros.docTmpId).
            andWhere('usuario_id', parametros.usuarioId).
            andWhere('item_id', parametros.item_id).
            del();

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error eliminarItem", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion elimina el item seleccionado del documento parcial
 * @fecha 2018-02-14
 */
DocumentoBodegaI011.prototype.eliminarItemMovimientoDevolucionFarmacia = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_devolucion_farmacia_productos").
            where('doc_tmp_id', parametros.docTmpId).
            andWhere('usuario_id', parametros.usuarioId).
            andWhere('movimiento_id', parametros.movimiento_id).
            andWhere('lote', parametros.lote).
            del();

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error eliminarItem", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion elimina todos los productos asociados al documento parcial
 * @fecha 2018-02-14
 */
DocumentoBodegaI011.prototype.eliminarDocumentoTemporal_d = function (parametros, transaccion, callback) {
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
 * +Descripcion elimina el documento parcial para ingresos por devoluciones
 * @fecha 2018-02-14
 */
DocumentoBodegaI011.prototype.eliminarDocumentoTemporal = function (parametros, transaccion, callback) {

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
 * +Descripcion elimina los productos del documento parcial para devoluciones de farmacia
 * @fecha 2018-02-14
 */
DocumentoBodegaI011.prototype.eliminarMovimientoDevolucionFarmacia = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_devolucion_farmacia_productos").
            where('doc_tmp_id', parametros.docTmpId).
            andWhere('usuario_id', parametros.usuarioId).
            del();

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error eliminarMovimientoDevolucionFarmacia", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion agrega un registro a la tabla inv_bodegas_movimiento_devolucion_farmacia
 * @fecha 2018-02-28
 */
DocumentoBodegaI011.prototype.agregarMovimientoFarmacia = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_devolucion_farmacia").
            insert({farmacia_id: parametros.empresa_envia, empresa_id: parametros.empresa_id, prefijo: parametros.prefijoDocumento,
                numero: parametros.numeracionDocumento, prefijo_doc_farmacia: parametros.prefijo_doc, numero_doc_farmacia: parametros.numero_doc
            });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error agregarMovimientoFarmacia", err);
        callback(err);
    }).done();
};

// Crear documento 
DocumentoBodegaI011.prototype.creacion_documento = function (parametros, transaccion, callback) {

    // Ingresar Cabecera Documento temporal
    __ingresar_documento_verificacion(parametros, transaccion, function (err, result) {

        console.log('=============== __ingresar_documento_verificacion ========================');
        console.log(err, result);
        console.log('=====================================================================');

        if (err) {
            callback(err);
            return;
        }

        // Ingresar Detalle Documento temporal
        __ingresar_detalle_documento_verificacion(parametros, transaccion, function (err, result) {

            if (err) {
                callback(err);
                return;
            }
            callback(err, result);

        });
    });
};

/*==================================================================================================================================================================
 * 
 *                                                          FUNCIONES PRIVADAS
 * 
 * ==================================================================================================================================================================*/

// Ingresar cabecera documento verificacion
function __ingresar_documento_verificacion(parametros, transaccion, callback) {
    var query = G.knex("inv_documento_verificacion").
            insert({farmacia_id: parametros.empresa_envia, prefijo: parametros.prefijoDocumento, numero: parametros.numeracionDocumento,
                empresa_id: parametros.empresa_id, prefijo_doc_farmacia: parametros.prefijo_doc, numero_doc_farmacia: parametros.numero_doc,
                usuario_id: parametros.usuarioId
            });
    if (transaccion)
        query.transacting(transaccion);
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error __ingresar_documento_verificacion", err);
        callback(err);
    }).done();
}
;

// Ingresar detalle documento verificacion
function __ingresar_detalle_documento_verificacion(parametros, transaccion, callback) {
    var sql = " INSERT INTO inv_documento_verificacion_d ( \
                    farmacia_id, \
                    prefijo_doc_farmacia, \
                    numero_doc_farmacia, \
                    empresa_id, \
                    prefijo, \
                    numero, \
                    codigo_producto, \
                    lote, \
                    fecha_vencimiento, \
                    cantidad, \
                    novedad_devolucion_id, \
                    novedad_anexa, \
                    cantidad_enviada \
                )\
                    SELECT  \
                    a.farmacia_id, \
                    a.prefijo, \
                    a.numero, \
                    :3 AS empresa_id, \
                    :4 AS prefijo, \
                    :5 AS numeracion, \
                    a.codigo_producto, \
                    a.lote, \
                    a.fecha_vencimiento, \
                    a.cantidad, \
                    a.novedad_devolucion_id,\
                    a.novedad_anexa, \
                    b.cantidad_recibida \
                    FROM inv_documento_verificacion_tmp_d a\
                    inner join inv_bodegas_movimiento_d as b on (b.prefijo = :4 AND b.numero = :5 AND b.codigo_producto = a.codigo_producto)\
                    WHERE a.doc_tmp_id = :1  AND a.usuario_id = :2; ";
    var query = G.knex.raw(sql, {1: parametros.docTmpId, 2: parametros.usuarioId, 3: parametros.empresa_id, 4: parametros.prefijoDocumento, 5: parametros.numeracionDocumento});
    if (transaccion)
        query.transacting(transaccion);
    query.then(function (resultado) {
        callback(false, resultado.rows, resultado);
    }).catch(function (err) {
        callback(err);
    });
}
;
module.exports = DocumentoBodegaI011;
