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
            .from('bodegas');
    //.where('bodega','03');

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarBodegas]:", err);
        callback(err);
    });
};


/**
 * @author German Galvis
 * +Descripcion consulta todas las productos
 * @fecha 2018-02-12
 */
DocumentoBodegaE009.prototype.listarProductos = function (parametros, callback) {
    console.log("modelo productos", parametros);
    var columnas = [
        "invenPro.codigo_producto",
        "invenPro.tipo_producto_id",
        "invenPro.descripcion",
        "exisBodega.existencia",
        "subclase.descripcion AS subClase",
        "exisLote.lote",
        "exisLote.fecha_vencimiento"
    ];

    var query = G.knex.distinct('invenPro.codigo_producto')
            .select(columnas)
            .from("inventarios_productos AS invenPro")
            .innerJoin("existencias_bodegas AS exisBodega ", function () {
                this.on("invenPro.codigo_producto", "exisBodega.codigo_producto")
            })
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
            })
            .limit(G.settings.limit).offset((parametros.pagina_actual - 1) * G.settings.limit);


    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarProductosEmpresa]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion crea el documento parcial para devoluciones
 * @fecha 2018-02-14
 */
DocumentoBodegaE009.prototype.insertarBodegasMovimientoDevolucionTmp = function (parametros, transaccion, callback) {
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
 * +Descripcion elimina los productos asociados al documento parcial
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
        console.log("Error eliminar_documento_temporal", err);
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
        console.log("Error __eliminar", err);
        callback(err);
    });
};

DocumentoBodegaE009.prototype.agregarItem = function(parametros, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_d").
            insert({bodega: parametros.bodega, cantidad: parametros.cantidad, centro_utilidad: parametros.centroUtilidad,
        codigo_producto: parametros.codigoProducto, doc_tmp_id: parametros.docTmpId, empresa_id: parametros.empresaId,
        fecha_vencimiento: parametros.fechaVencimiento,lote: parametros.lote,usuario_id: parametros.usuarioId
    });

    query.then(function(resultado) {
        callback(false, resultado);
    }). catch (function(err) {
        console.log("Error agregarItem", err);
        callback(err);
    }).done();
};

//DocumentoBodegaE009.$inject = ["m_movimientos_bodegas", "m_pedidos_clientes", "m_pedidos_farmacias"];

module.exports = DocumentoBodegaE009;
