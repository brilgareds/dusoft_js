var DocumentoBodegaI007 = function () {
};

/**
 * @author German Galvis
 * @fecha 01/06/2018
 * +Descripcion Modelo encargado de listar los tipos de terceros
 */
DocumentoBodegaI007.prototype.listarTiposTerceros = function (callback) {

    G.knex.column('tipo_id_tercero as id', 'descripcion')
            .select()
            .from('tipo_id_terceros')
            .orderBy('tipo_id_tercero', 'asc')
            .then(function (resultado) {
                callback(false, resultado)
            }).catch(function (err) {
        console.log("err [listarTiposTerceros]:", err);
        callback({err: err, msj: "Error al consultar la lista de los tipos de terceros"});
    });
};

/**
 * @author German Galvis
 * @fecha 06/06/2018
 * +Descripcion Modelo encargado de buscar los tipos de prestamo
 */
DocumentoBodegaI007.prototype.listarPrestamos = function (callback) {

    var query = G.knex.select()
            .from('inv_bodegas_tipos_prestamos')
            .where('sw_estado', '1');


    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarPrestamos]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * @fecha 07/06/2018
 * +Descripcion Modelo encargado de buscar el prestamo seleccionado
 */
DocumentoBodegaI007.prototype.listarPrestamoId = function (parametros, callback) {

    var query = G.knex.select()
            .from('inv_bodegas_tipos_prestamos')
            .where('tipo_prestamo_id', parametros.tipoprestamo);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarPrestamoId]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * @fecha 01/06/2018
 * +Descripcion Metodo encargado de listar los terceros
 */
DocumentoBodegaI007.prototype.listarTerceros = function (obj, callback) {

    var query = G.knex
            .distinct('ter.*')
            .select()
            .from('terceros as ter')
            .where(function () {

                if ((obj.filtro.id !== 'Nombre') && obj.terminoBusqueda !== "") {
                    this.andWhere(G.knex.raw("ter.tercero_id  " + G.constants.db().LIKE + "'%" + obj.terminoBusqueda + "%'"))
                    this.andWhere(G.knex.raw("ter.tipo_id_tercero " + G.constants.db().LIKE + "'%" + obj.filtro.id + "%'"))
                }
                if ((obj.filtro.id !== 'Nombre') && obj.terminoBusqueda === "") {
                    this.andWhere(G.knex.raw("ter.tipo_id_tercero " + G.constants.db().LIKE + "'%" + obj.filtro.id + "%'"))
                }
                if ((obj.filtro.id === 'Nombre') && obj.terminoBusqueda !== "") {
                    this.andWhere(G.knex.raw("ter.nombre_tercero  " + G.constants.db().LIKE + "'%" + obj.terminoBusqueda + "%'"))
                }
            })
            .orderBy('ter.nombre_tercero');

    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)

    query.then(function (resultado) {

        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [listarTerceros]:", err);
        callback({err: err, msj: "Error al consultar la lista de los terceros"});
    });
};

/**
 * @author German Galvis
 * +Descripcion consulta todos los productos
 * @fecha 01/06/2018
 */
DocumentoBodegaI007.prototype.listarProductos = function (parametros, callback) {
    var columnas = [
        "invenPro.codigo_producto",
        "invenPro.tipo_producto_id",
        "invenPro.porc_iva",
        "inven.costo",
        G.knex.raw("fc_descripcion_producto(\"invenPro\".\"codigo_producto\") as descripcion")
    ];
    var query = G.knex.distinct()
            .column(columnas)
            .from("existencias_bodegas as exisBodega")
            .innerJoin("inventarios_productos as invenPro", "exisBodega.codigo_producto", "invenPro.codigo_producto")
            .innerJoin("inventarios as inven", function () {
                this.on("exisBodega.codigo_producto", "inven.codigo_producto")
                        .on("exisBodega.empresa_id", "inven.empresa_id")
            })
            .where("exisBodega.empresa_id", parametros.empresa_id)
            .andWhere("exisBodega.centro_utilidad", parametros.centro_utilidad)
            .andWhere("exisBodega.bodega", parametros.bodega)
            .andWhere(function () {
                if (parametros.tipoFiltro === '0') {
                    this.andWhere("invenPro.descripcion", G.constants.db().LIKE, "%" + parametros.descripcion + "%");
                } else if (parametros.tipoFiltro === '2') {
                    this.andWhere("subclase.descripcion", G.constants.db().LIKE, "%" + parametros.descripcion + "%");
                } else {
                    this.andWhere("invenPro.codigo_producto", parametros.descripcion);
                }
            }).limit(G.settings.limit).offset((parametros.paginaActual - 1) * G.settings.limit);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarProductos]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * @fecha 07/06/2018
 * +Descripcion Modelo encargado de buscar el tercero seleccionado
 */
DocumentoBodegaI007.prototype.listarTerceroId = function (parametros, callback) {

    var query = G.knex.select()
            .from('terceros')
            .where('tipo_id_tercero', parametros.tipoId)
            .andWhere('tercero_id', parametros.id);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarTerceroId]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion agrega un registro a la tabla inv_bodegas_movimiento_tmp_prestamo
 * @fecha 06/06/2018
 */
DocumentoBodegaI007.prototype.generarMovimientoPrestamoTmp = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_prestamo").
            insert({usuario_id: parametros.usuario_id, doc_tmp_id: parametros.doc_tmp_id, tipo_prestamo_id: parametros.prestamo,
                tipo_id_tercero: parametros.tipo_id_tercero, tercero_id: parametros.tercero_id
            });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error generarMovimientoPrestamoTmp", err);
        callback(err);
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion elimina todos los productos asociados al documento parcial
 * @fecha 06/06/2018
 */
DocumentoBodegaI007.prototype.eliminarDocumentoTemporal_d = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_d").
            where('doc_tmp_id', parametros.docTmpId).
            andWhere('usuario_id', parametros.usuarioId).
            del();

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error eliminarDocumentoTemporal_d", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion elimina el documento parcial para ITBM
 * @fecha 06/06/2018
 */
DocumentoBodegaI007.prototype.eliminarDocumentoTemporal = function (parametros, transaccion, callback) {

    var query = G.knex("inv_bodegas_movimiento_tmp").
            where('doc_tmp_id', parametros.docTmpId).
            andWhere('usuario_id', parametros.usuarioId).
            del();

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error eliminarDocumentoTemporal", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion elimina el documento parcial de inv_bodegas_movimiento_tmp_prestamo
 * @fecha 06/06/2018
 */
DocumentoBodegaI007.prototype.eliminarPrestamoTemporal = function (parametros, transaccion, callback) {

    var query = G.knex("inv_bodegas_movimiento_tmp_prestamo").
            where('doc_tmp_id', parametros.docTmpId).
            andWhere('usuario_id', parametros.usuarioId).
            del();

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error eliminarPrestamoTemporal", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion consulta los productos del documento tmp
 * @fecha 07/06/2018
 */
DocumentoBodegaI007.prototype.consultarItem = function (parametros, callback) {
    var query = G.knex
            .select()
            .from('inv_bodegas_movimiento_tmp_d')
            .where('empresa_id', parametros.empresa)
            .andWhere('doc_tmp_id', parametros.docTmpId)
            .andWhere('centro_utilidad', parametros.centro)
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
 * +Descripcion agrega productos al documento temporal
 * @fecha 07/06/2018
 */
DocumentoBodegaI007.prototype.agregarItem = function (parametros, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_d")
            .insert({bodega: parametros.bodega, cantidad: parametros.cantidad, centro_utilidad: parametros.centro,
                codigo_producto: parametros.codigoProducto, doc_tmp_id: parametros.docTmpId, empresa_id: parametros.empresa,
                usuario_id: parametros.usuarioId, fecha_vencimiento: parametros.fechaVencimiento, lote: parametros.lote,
                porcentaje_gravamen:parametros.gravemen, valor_unitario: parametros.costo, total_costo: parametros.total
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
 * +Descripcion lista los productos del documento temporal
 * @fecha 07/06/2018
 */
DocumentoBodegaI007.prototype.consultarProductosTraslado = function (parametros, callback) {
    var columnas = [
        "invD.item_id",
        "invD.codigo_producto",
        "invenPro.tipo_producto_id",
        G.knex.raw("fc_descripcion_producto(\"invD\".\"codigo_producto\") as descripcion"),
        "invD.cantidad",
        "invD.fecha_vencimiento",
        "invD.lote",
        "invD.porcentaje_gravamen",
        "invD.total_costo"
    ];

    var query = G.knex.select(columnas)
            .from('inv_bodegas_movimiento_tmp_d AS invD')
            .innerJoin("inventarios_productos AS invenPro ", function () {
                this.on("invD.codigo_producto", "invenPro.codigo_producto")
            })
            .where('invD.doc_tmp_id', parametros.docTmpId)
            .andWhere("invD.usuario_id", parametros.usuario_id);
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [consultarProductosTraslado]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion elimina el item seleccionado del documento parcial
 * @fecha 07/06/2018
 */
DocumentoBodegaI007.prototype.eliminarItem = function (parametros, callback) {
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
 * +Descripcion agrega un registro a la tabla inv_bodegas_movimiento_prestamos
 * @fecha 24/05/2018
 */
DocumentoBodegaI007.prototype.agregarMovimientoPrestamo = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_prestamos").
            insert({empresa_id: parametros.empresaId, prefijo: parametros.prefijoDocumento, numero: parametros.numeracionDocumento,
                tipo_id_tercero: parametros.tipo_id_tercero, tercero_id: parametros.tercero_id, tipo_prestamo_id: parametros.tipo_prestamo_id,
                tipo_movimiento: parametros.tipo_movimiento
            });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error agregarMovimientoPrestamo", err);
        callback(err);
    }).done();
};


/**
 * @author German Galvis
 * +Descripcion consulta los productos pertenecientes al documento a imprimir
 * @fecha 08/06/2018
 */
DocumentoBodegaI007.prototype.consultar_detalle_documento = function (parametro, callback) {
    var columnas = [
        "a.codigo_producto",
        "a.lote",
        "a.total_costo",
        "a.valor_unitario",
        G.knex.raw("\"a\".\"cantidad\"::integer"),
        G.knex.raw("to_char(\"a\".\"fecha_vencimiento\", 'dd-mm-yyyy') as fecha_vencimiento"),
        G.knex.raw("fc_descripcion_producto(\"b\".\"codigo_producto\") as nombre"),
        "param.torre"
    ];

    var query = G.knex.select(columnas)
            .from('inv_bodegas_movimiento_d  AS a')
            .innerJoin("inventarios_productos  AS b ", "a.codigo_producto", "b.codigo_producto")
            .leftJoin("param_torreproducto AS param", "param.codigo_producto", "a.codigo_producto")
            .where('a.empresa_id', parametro.empresaId)
            .andWhere("a.prefijo", parametro.prefijoDocumento)
            .andWhere("a.numero", parametro.numeracionDocumento)
            .orderBy('param.torre', 'asc');

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        callback(err);
    });
};


module.exports = DocumentoBodegaI007;
