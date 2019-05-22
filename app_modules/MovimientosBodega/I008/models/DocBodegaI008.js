/* global G */

var DocumentoBodegaI008 = function () {
};
/**
 * @author German Galvis
 * +Descripcion consulta todos los traslados que pertenezcan a la empresa y la bodega
 * seleccionada y que sean dirigidos a la farmacia en sesion
 * @params obj: farmacia
 * @fecha 2019-01-12 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.listarTraslados = function (parametro, callback) {

    var columnas = [
        "a.empresa_id",
        "a.prefijo",
        "a.numero",
        G.knex.raw("a.prefijo || '-' || a.numero as despacho")
//        G.knex.raw("a.empresa_id || '@' || a.prefijo || '@' || a.numero as documento"),
//        G.knex.raw("'DESPACHADO POR: ' || c.razon_social || ' PEDIDO: ' || a.solicitud_prod_a_bod_ppal_id as observacion")
    ];
    var query = G.knex
            .select(columnas);

    if (parametro.empresaId !== '17') {
        query.from('inv_bodegas_movimiento_despachos_farmacias as a')
                .innerJoin("solicitud_productos_a_bodega_principal as b", "b.solicitud_prod_a_bod_ppal_id", "a.solicitud_prod_a_bod_ppal_id")
                .innerJoin("empresas as c", "c.empresa_id", "a.empresa_id")
                .where('b.farmacia_id', parametro.empresaId)
                .andWhere('b.centro_utilidad', parametro.centroUtilidad)
                .andWhere('b.bodega', parametro.bodega)
                .andWhere('a.sw_confirma', '0')
                .orderBy('a.numero', 'desc');

    } else {
        query.from('inv_bodegas_movimiento_despachos_clientes as a')
                .innerJoin("ventas_ordenes_pedidos as b", "b.pedido_cliente_id", "a.pedido_cliente_id")
                .innerJoin("empresas as c", "c.empresa_id", "a.empresa_id")
                .where('b.estado', '3')
                .andWhere('b.tercero_id', parametro.empresaId)
                .andWhere('a.factura_gener', '0')
                .orderBy('a.numero', 'desc');

    }
    
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
 * @fecha 2019-01-14 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.listarProductosTraslados = function (parametros, callback) {
    var subQuery = G.knex.raw("(\"invD\".\"cantidad\" -\"invD\".\"cantidad_recibida\")>0");
    var columnas = [
        "invD.movimiento_id",
        "invD.codigo_producto",
        "invD.total_costo",
        "invenPro.tipo_producto_id",
        G.knex.raw("(\"invD\".\"cantidad\" -\"invD\".\"cantidad_recibida\") as  cantidad"),
        G.knex.raw("fc_descripcion_producto(\"invenPro\".\"codigo_producto\") as descripcion"),
        "invD.lote",
        "invD.fecha_vencimiento"
    ];

    var query = G.knex.select(columnas)
            .from('inv_bodegas_movimiento_d AS invD')
            .innerJoin("inventarios_productos AS invenPro ", "invD.codigo_producto", "invenPro.codigo_producto")
            .where('invD.numero', parametros.numero)
            .andWhere("invD.prefijo", parametros.prefijo)
            .andWhere(subQuery);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarProductosTraslados]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion crea registro tmp del ingreso del despacho
 * @fecha 2019-01-14 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.insertarIngresoDespachoTmp = function (parametros, transaccion, callback) {

    var query = G.knex(parametros.tabla).
            insert({usuario_id: parametros.usuario_id, doc_tmp_id: parametros.doc_tmp_id, empresa_id: parametros.empresa_id,
                prefijo: parametros.prefijo, numero: parametros.numero
            });

    if (transaccion)
        query.transacting(transaccion);


    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error insertarIngresoDespachoTmp", err);
        callback(err);
    }).done();
};


/**
 * @author German Galvis
 * +Descripcion elimina todos los productos asociados al documento parcial
 * @fecha 2019-01-14 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.eliminarDocumentoTemporal_d = function (parametros, transaccion, callback) {
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
 * @fecha 2019-01-14 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.eliminarDocumentoTemporal = function (parametros, transaccion, callback) {

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
 * +Descripcion elimina el documento parcial para ingreso de despachos a farmacia
 * @fecha 2019-01-14 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.eliminarDocumentoIngresoDespachoTemporal = function (parametros, transaccion, callback) {

    var query = G.knex(parametros.tabla).
            where('doc_tmp_id', parametros.docTmpId).
            andWhere('usuario_id', parametros.usuarioId).
            del();

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error eliminarDocumentoIngresoDespachoTemporal", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion agrega productos al documento temporal
 * @fecha 2019-01-14 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.agregarItem = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_d").
            insert({bodega: parametros.bodega, cantidad: parametros.cantidad_enviada, centro_utilidad: parametros.centroUtilidad,
                codigo_producto: parametros.codigoProducto, doc_tmp_id: parametros.docTmpId, empresa_id: parametros.empresaId,
                fecha_vencimiento: parametros.fechaVencimiento, lote: parametros.lote, usuario_id: parametros.usuarioId,
                item_id_compras: parametros.item_id,total_costo:parametros.total_costo
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
 * +Descripcion actualiza el producto devuelto del temporal
 * @fecha 2019-01-14 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.modificarAgregarItem = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_d")
            .where('empresa_id', parametros.empresaId)
            .andWhere('doc_tmp_id', parametros.docTmpId)
            .andWhere('centro_utilidad', parametros.centroUtilidad)
            .andWhere('bodega', parametros.bodega)
            .andWhere('codigo_producto', parametros.codigoProducto)
            .andWhere('lote', parametros.lote)
            .andWhere('fecha_vencimiento', parametros.fechaVencimiento)
            .update('cantidad', G.knex.raw('cantidad +' + parametros.cantidad_enviada));

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
 * @fecha 2019-05-10
 */
DocumentoBodegaI008.prototype.updateMovimientoD = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_d")
            .where('movimiento_id', parametros.item_id)
            .update('cantidad_recibida', G.knex.raw('cantidad_recibida +' + parametros.cantidad_enviada));

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
 * +Descripcion valida si el producto ya esta en el documento temporal
 * @fecha 2019-01-14 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.consultarItem = function (parametros, callback) {
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
 * @fecha 2019-01-14 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.consultarProductosValidados = function (parametros, callback) {
    var columnas = [
        "invD.item_id",
        "invD.codigo_producto",
        "invD.total_costo",
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
 * @fecha 2019-01-14 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.eliminarItem = function (parametros, transaccion, callback) {
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
 * +Descripcion actualiza el producto devuelto 
 * @fecha 2019-01-14 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.restarCantidadMovimientoD = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_d")
            .where('movimiento_id', parametros.item_id_compras)
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
 * +Descripcion consulta el documento que corresponda al temporal seleccionado
 * @fecha 2019-01-15 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.listarDocumentoId = function (parametro, callback) {

    var columnas = [
        "empresa_id",
        "prefijo",
        "numero",
        G.knex.raw("prefijo || '-' || numero as despacho")
    ];

    var query = G.knex
            .select(columnas)
            .from(parametro.tabla)
            .where('doc_tmp_id', parametro.tmp_id);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarDocumentoId]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion agrega un registro a la tabla inv_bodegas_movimiento_ingresosdespachos_farmacias
 *  o inv_bodegas_movimiento_ingresosdespachos_clientes
 * @fecha 2019-01-14 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.agregarMovimientoIngresoDespachoFarmacia = function (parametros, transaccion, callback) {
    var query = G.knex(parametros.tabla_1).
            insert({empresa_id: parametros.empresa_id, prefijo: parametros.prefijoDocumento, numero: parametros.numeracionDocumento,
                empresa_despacho: parametros.empresa_origen, prefijo_despacho: parametros.prefijo_despacho, numero_despacho: parametros.numero_despacho
            });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error agregarMovimientoIngresoDespachoFarmacia", err);
        callback(err);
    }).done();
};


/**
 * @author German Galvis
 * +Descripcion actualiza el registro de la tabla inv_bodegas_movimiento_despachos_clientes
 *  o inv_bodegas_movimiento_despachos_farmacias
 * @fecha 2019-01-15 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.updateEstadoMovimientoDespachoFarmacia = function (parametros, transaccion, callback) {
    
    var query = G.knex(parametros.tabla_2)
            .where('empresa_id', parametros.empresa_origen)
            .andWhere('prefijo', parametros.prefijo_despacho)
            .andWhere('numero', parametros.numero_despacho)
            .update("'" + parametros.modificacion + "'", parametros.sw_estado);
    //.update(G.knex.raw(parametros.modificacion + " SET " + parametros.sw_estado));

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error updateEstadoMovimientoDespachoFarmacia", err);
        callback(err);
    }).done();

};

/**
 * @author German Galvis
 * +Descripcion consulta los productos pertenecientes al documento a imprimir
 * @fecha 2019-01-15 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.consultar_detalle_documento = function (parametro, callback) {
    var columnas = [
        "a.codigo_producto",
        "a.lote",
        G.knex.raw("\"a\".\"cantidad\"::integer"),
        G.knex.raw("to_char(\"a\".\"fecha_vencimiento\", 'dd-mm-yyyy') as fecha_vencimiento"),
        G.knex.raw("fc_descripcion_producto(\"b\".\"codigo_producto\") as nombre")
    ];

    var query = G.knex.select(columnas)
            .from('inv_bodegas_movimiento_d  AS a')
            .innerJoin("inventarios_productos  AS b ", "a.codigo_producto", "b.codigo_producto")
            .where('a.empresa_id', parametro.empresaId)
            .andWhere("a.prefijo", parametro.prefijoDocumento)
            .andWhere("a.numero", parametro.numeracionDocumento);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion consulta la bodega de origen
 * @params obj: bodega
 * @fecha 2019-01-15 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.consultarBodegaOrigen = function (parametro, callback) {
    var columnas = ["b.descripcion"];
    var join;

    if (parametro.empresa_id === '17') {
        columnas.push("c.pedido_cliente_id as pedido");
        join = "inv_bodegas_movimiento_despachos_clientes";
    } else {
        columnas.push("c.solicitud_prod_a_bod_ppal_id as pedido");
        join = "inv_bodegas_movimiento_despachos_farmacias";
    }

    var query = G.knex
            .select(columnas)
            .from('inv_bodegas_movimiento as a')
            .innerJoin("bodegas as b", function () {
                this.on("b.empresa_id", "a.empresa_id")
                        .on("b.centro_utilidad", "a.centro_utilidad")
                        .on("b.bodega", "a.bodega");
            })
            .innerJoin(G.knex.raw(join + " as c"), function () {
                this.on("c.prefijo", "a.prefijo")
                        .on("c.numero", "a.numero");

            })
            .where('a.prefijo', parametro.prefijo_despacho)
            .andWhere('a.numero', parametro.numero_despacho);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [consultarBodegaOrigen]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion consulta el efc
 * @params obj: bodega
 * @fecha 2019-01-15 YYYY/MM/DD
 */
DocumentoBodegaI008.prototype.consultarEfc = function (parametro, callback) {
    var query = G.knex
            .select()
            .from(parametro.tabla_1)
            .where('prefijo', parametro.prefijoDocumento)
            .andWhere('numero', parametro.numeracionDocumento)
            .andWhere('empresa_id', parametro.empresa_id);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [consultarEfc]:", err);
        callback(err);
    });
};
module.exports = DocumentoBodegaI008;
