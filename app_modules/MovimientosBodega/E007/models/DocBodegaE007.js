var DocumentoBodegaE007 = function () {
};

/**
 * @author German Galvis
 * @fecha 17/05/2018
 * +Descripcion Modelo encargado de buscar los tipos de egresos
 */
DocumentoBodegaE007.prototype.listarEgresos = function (callback) {

    var query = G.knex.select()
            .from('inv_bodegas_conceptos_egresos')
            .where('sw_estado', '1');


    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarEgresos]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * @fecha 24/05/2018
 * +Descripcion Modelo encargado de buscar el egreso seleccionado
 */
DocumentoBodegaE007.prototype.listarEgresoId = function (parametros, callback) {

    var query = G.knex.select()
            .from('inv_bodegas_conceptos_egresos')
            .where('concepto_egreso_id', parametros.egreso_id);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarEgresoId]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * @fecha 18/05/2018
 * +Descripcion Modelo encargado de listar los tipos de terceros
 */
DocumentoBodegaE007.prototype.listarTiposTerceros = function (callback) {

    G.knex.column('tipo_id_tercero as id', 'descripcion')
            .select()
            .from('tipo_id_terceros')
            .orderBy('tipo_id_tercero', 'asc')
            .then(function (resultado) {
                callback(false, resultado)
            }).catch(function (err) {
        console.log("err [listarTipoDocumento]:", err);
        callback({err: err, msj: "Error al consultar la lista de los tipos de terceros"});
    });
};

/**
 * @author German Galvis
 * @fecha 18/05/2018
 * +Descripcion Metodo encargado de listar los clientes
 */
DocumentoBodegaE007.prototype.listarClientes = function (obj, callback) {

    var query = G.knex
            .distinct('ter.*')
            .select()
            .from('terceros as ter')
            .join('inv_bodegas_movimiento_prestamos as b', function () {
                this.on("ter.tipo_id_tercero", "b.tipo_id_tercero")
                        .on("ter.tercero_id", "b.tercero_id")
                        .on('b.empresa_id', G.knex.raw("'" + obj.empresaId + "'"))
            }).join("tipo_pais AS tp ", "ter.tipo_pais_id", "tp.tipo_pais_id")
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
            .andWhere('b.sw_devolucion', '0')
            .andWhere('b.tipo_movimiento', 'I')
            .orderBy('ter.nombre_tercero');

    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)

    query.then(function (resultado) {

        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [listarClientes]:", err);
        callback({err: err, msj: "Error al consultar la lista de los clientes"});
    });
};

/**
 * @author German Galvis
 * @fecha 24/05/2018
 * +Descripcion Modelo encargado de buscar el cliente seleccionado
 */
DocumentoBodegaE007.prototype.listarClienteId = function (parametros, callback) {

    var query = G.knex.select()
            .from('terceros')
            .where('tipo_id_tercero', parametros.tipoId)
            .andWhere('tercero_id', parametros.id);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarClienteId]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion agrega un registro a la tabla inv_bodegas_movimiento_tmp_conceptos_egresos
 * @fecha 18/05/2018
 */
DocumentoBodegaE007.prototype.generarMovimientoConceptoEgresoTmp = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_conceptos_egresos").
            insert({usuario_id: parametros.usuario_id, doc_tmp_id: parametros.doc_tmp_id, sw_costo_manual: parametros.sw_costo_manual,
                concepto_egreso_id: parametros.concepto_egreso_id, tipo_id_tercero: parametros.tipo_id_tercero,
                tercero_id: parametros.tercero_id
            });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error generarMovimientoConceptoEgresoTmp", err);
        callback(err);
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion elimina todos los productos asociados al documento parcial
 * @fecha 21/05/2018
 */
DocumentoBodegaE007.prototype.eliminarDocumentoTemporal_d = function (parametros, transaccion, callback) {
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
 * +Descripcion elimina el documento parcial para ETB
 * @fecha 21/05/2018
 */
DocumentoBodegaE007.prototype.eliminarDocumentoTemporal = function (parametros, transaccion, callback) {

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
 * +Descripcion elimina el documento parcial de inv_bodegas_movimiento_tmp_conceptos_egresos
 * @fecha 21/05/2018
 */
DocumentoBodegaE007.prototype.eliminarConceptoEgresoTemporal = function (parametros, transaccion, callback) {

    var query = G.knex("inv_bodegas_movimiento_tmp_conceptos_egresos").
            where('doc_tmp_id', parametros.docTmpId).
            andWhere('usuario_id', parametros.usuarioId).
            del();

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error __eliminarConceptoEgresoTemporal", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion consulta todos los productos
 * @fecha 21/05/2018
 */
DocumentoBodegaE007.prototype.listarProductos = function (parametros, callback) {
    var columnas = [
        "invenPro.codigo_producto",
        "invenPro.tipo_producto_id",
        G.knex.raw("fc_descripcion_producto(\"invenPro\".\"codigo_producto\") as descripcion"),
        "exisBodega.existencia AS existencia",
        G.knex.raw("case when COALESCE(( \"exisBodega\".existencia - COALESCE( h.cantidad_total_pendiente,'0') - COALESCE( i.total_solicitado,'0'))::integer, 0) < 0 then 0\
                         else COALESCE(( \"exisBodega\".existencia - COALESCE( h.cantidad_total_pendiente,'0') - COALESCE( i.total_solicitado,'0'))::integer, 0) end as cantidad_disponible")
    ];

    var columnas_pedido = [
        "aa.empresa_id",
        "aa.codigo_producto",
        "aa.bodega",
        G.knex.raw("sum(\"aa\".\"cantidad_total_pendiente\") as cantidad_total_pendiente")
    ];

    var columnas_pedido_tmp = [
        "aa.empresa_id",
        "aa.codigo_producto",
        "aa.bodega_origen_producto",
        G.knex.raw("sum(\"aa\".\"total_reservado\") as total_solicitado")
    ];

    var columna_2 = [
        "a.empresa_id",
        "b.codigo_producto",
        "a.bodega_destino as bodega",
        G.knex.raw("sum((\"b\".\"numero_unidades\" - \"b\".\"cantidad_despachada\")) as cantidad_total_pendiente"),
        1
    ];

    var columna_3 = [
        "b.codigo_producto",
        "a.empresa_destino as empresa_id",
        "b.bodega_origen_producto",
        G.knex.raw("sum(\"b\".\"cantidad_solic\")::integer as total_reservado")
    ];

    var select_pedidos = G.knex.column(columna_2)
            .from("ventas_ordenes_pedidos as a")
            .innerJoin("ventas_ordenes_pedidos_d as b", "a.pedido_cliente_id", "b.pedido_cliente_id")
            .where(G.knex.raw("(\"b\".\"numero_unidades\" - \"b\".\"cantidad_despachada\") > 0"))
            .andWhere("a.estado", 1)
            .groupBy(G.knex.raw("1,2,3"));

    var select_pedidos_tmp = G.knex.column(columna_3)
            .from("solicitud_bodega_principal_aux as a")
            .innerJoin("solicitud_pro_a_bod_prpal_tmp as b", function () {
                this.on("a.farmacia_id", "b.farmacia_id")
                        .on("a.centro_utilidad", "b.centro_utilidad")
                        .on("a.bodega", "b.bodega")
                        .on("a.usuario_id", "b.usuario_id")
            })
            .groupBy(G.knex.raw("1,2,3"));


    var pedidos = G.knex.column(columnas_pedido)
            .select()
            .from(G.knex.raw('( ' + select_pedidos))
            .union(function () {
                this.select(["a.empresa_destino as empresa_id",
                    "b.codigo_producto",
                    "a.bodega_destino as bodega",
                    G.knex.raw("sum(\"b\".\"cantidad_pendiente\") as cantidad_total_pendiente"),
                    2])
                        .from('solicitud_productos_a_bodega_principal as a')
                        .innerJoin("solicitud_productos_a_bodega_principal_detalle as b", "a.solicitud_prod_a_bod_ppal_id", "b.solicitud_prod_a_bod_ppal_id")
                        .where(G.knex.raw("(\"b\".\"cantidad_pendiente\") > 0"))
                        .groupBy(G.knex.raw("1,2,3"));
            });

    var pedidos_tmp = G.knex.column(columnas_pedido_tmp)
            .select()
            .from(G.knex.raw('( ' + select_pedidos_tmp))
            .union(function () {
                this.select(["a.empresa_id",
                    "b.codigo_producto",
                    "b.bodega_origen_producto",
                    G.knex.raw("sum(\"b\".\"numero_unidades\")::integer as total_reservado")])
                        .from('ventas_ordenes_pedidos_tmp as a')
                        .innerJoin("ventas_ordenes_pedidos_d_tmp as b", "b.pedido_cliente_id_tmp", "a.pedido_cliente_id_tmp")
                        .where("a.estado", 1)
                        .groupBy(G.knex.raw("1,2,3"));
            });


    var query = G.knex.column(columnas)
            .from("existencias_bodegas as exisBodega")
            .innerJoin("inventarios_productos as invenPro", "exisBodega.codigo_producto", "invenPro.codigo_producto")
            .leftJoin(G.knex.raw('(' + pedidos + ') as aa group by 1,2,3 ) as h'), function () {
                this.on("exisBodega.empresa_id", "h.empresa_id")
                        .on("invenPro.codigo_producto", "h.codigo_producto")
                        .on('exisBodega.bodega', "h.bodega")
            })
            .leftJoin(G.knex.raw('(' + pedidos_tmp + ') as aa group by 1,2,3 ) as i'), function () {
                this.on("exisBodega.empresa_id", "i.empresa_id")
                        .on("invenPro.codigo_producto", "i.codigo_producto")
                        .on('exisBodega.bodega', "i.bodega_origen_producto")
            })
            .where("exisBodega.empresa_id", parametros.empresa_id)
            .andWhere("exisBodega.centro_utilidad", parametros.centro_utilidad)
            .andWhere("exisBodega.bodega", parametros.bodega)
            .andWhere("exisBodega.existencia", '>', 0)
            .andWhere(function () {
                if (parametros.tipoFiltro === '0') {
                    this.andWhere("invenPro.descripcion", G.constants.db().LIKE, "%" + parametros.descripcion + "%");
                } else if (parametros.tipoFiltro === '2') {
                    this.andWhere("subclase.descripcion", G.constants.db().LIKE, "%" + parametros.descripcion + "%");
                } else {
                    this.andWhere("invenPro.codigo_producto", parametros.descripcion);
                }
            }
            ).limit(G.settings.limit).offset((parametros.paginaActual - 1) * G.settings.limit);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarProductosEmpresa]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * @fecha 26/05/2018
 * +Descripcion Metodo encargado de listar los lotes
 */
DocumentoBodegaE007.prototype.consultarLotesProducto = function (obj, callback) {

    var query = G.knex.select()
            .from('existencias_bodegas_lote_fv')
            .where('codigo_producto', obj.codigo_producto)
            .andWhere('empresa_id', obj.empresa_id)
            .andWhere('centro_utilidad', obj.centro_utilidad)
            .andWhere('bodega', obj.bodega)
            .andWhere('estado', '1')
            .andWhere('existencia_actual', '>', 0);

    query.then(function (resultado) {

        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [consultarLotesProducto]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion agrega productos al documento temporal
 * @fecha 23/05/2018
 */
DocumentoBodegaE007.prototype.agregarItem = function (parametros, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_d")
            .insert({bodega: parametros.bodega, cantidad: parametros.cantidad, centro_utilidad: parametros.centro,
                codigo_producto: parametros.codigoProducto, doc_tmp_id: parametros.docTmpId, empresa_id: parametros.empresa,
                usuario_id: parametros.usuarioId, cantidad_sistema: parametros.disponible, fecha_vencimiento: parametros.fechaVencimiento,
                lote: parametros.lote
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
 * @fecha 24/05/2018
 */
DocumentoBodegaE007.prototype.consultarProductosTraslado = function (parametros, callback) {
    var columnas = [
        "invD.item_id",
        "invD.codigo_producto",
        "invenPro.tipo_producto_id",
        G.knex.raw("fc_descripcion_producto(\"invD\".\"codigo_producto\") as descripcion"),
        "invD.cantidad",
        "invD.fecha_vencimiento",
        "invD.lote",
        "invD.cantidad_sistema as cantidad_disponible"
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
 * @fecha 24/05/2018
 */
DocumentoBodegaE007.prototype.eliminarItem = function (parametros, callback) {
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
 * +Descripcion agrega un registro a la tabla inv_bodegas_movimiento_conceptos_egresos
 * @fecha 24/05/2018
 */
DocumentoBodegaE007.prototype.agregarMovimientoConceptoEgreso = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_conceptos_egresos").
            insert({empresa_id: parametros.empresaId, prefijo: parametros.prefijoDocumento, numero: parametros.numeracionDocumento,
                tipo_id_tercero: parametros.tipo_id_tercero, tercero_id: parametros.tercero_id, sw_costo_manual: parametros.sw_costo_manual,
                concepto_egreso_id: parametros.concepto_egreso_id
            });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error agregarMovimientoConceptoEgreso", err);
        callback(err);
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion elimina los productos del documento parcial para traslados de bodega
 * @fecha 24/05/2018
 */
DocumentoBodegaE007.prototype.eliminarMovimientoConceptoEgreso = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_conceptos_egresos").
            where('doc_tmp_id', parametros.docTmpId).
            andWhere('usuario_id', parametros.usuarioId).
            del();

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error eliminarMovimientoConceptoEgreso", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion consulta los productos pertenecientes al documento a imprimir
 * @fecha 25/05/2018
 */
DocumentoBodegaE007.prototype.consultar_detalle_documento = function (parametro, callback) {
    var columnas = [
        "a.codigo_producto",
        "a.lote",
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

/**
 * @author German Galvis
 * +Descripcion crea el documento definitivo
 * @fecha 25/05/2018
 */
DocumentoBodegaE007.prototype.crear_documento = function (documento_temporal_id, usuario_id, transaccion, callback) {

    // Consultar cabecera del docuemnto temporal
    __consultar_documento_bodega_temporal(documento_temporal_id, usuario_id, function (err, documento_temporal) {

        if (err || documento_temporal === null) {
            console.log('Se ha generado un error o el docuemnto está vacío.');
            callback(err);
            return;
        } else {
            var documento_id = documento_temporal.documento_id;

            var empresa_id = documento_temporal.empresa_id;
            var centro_utilidad = documento_temporal.centro_utilidad;
            var bodega = documento_temporal.bodega;


            // Consultar detalle del docuemnto temporal
            __consultar_detalle_movimiento_bodega_temporal(documento_temporal_id, usuario_id, function (err, detalle_documento_temporal) {
                if (err || detalle_documento_temporal.length === 0) {
                    console.log('Se ha generado un error o el documento está vacío...');
                    callback(err);
                    return;
                } else {
                    // Consultar numeracion del documento    
                    __obtener_numeracion_documento(empresa_id, documento_id, function (err, numeracion, result) {

                        if (err || numeracion.length === 0) {
                            console.log('Se ha generado un error o no se pudo tener la numeracion del documento');
                            callback(err);
                            return;
                        } else {

                            var prefijo_documento = numeracion[0].prefijo;
                            var numeracion_documento = numeracion[0].numeracion;
                            var observacion = documento_temporal.observacion;


                            // Ingresar Cabecera Documento temporal
                            __ingresar_movimiento_bodega(documento_id, empresa_id, centro_utilidad, bodega, prefijo_documento, numeracion_documento, observacion, usuario_id, transaccion, function (err, result) {

                                console.log('=============== __ingresar_movimiento_bodega ========================');
                                console.log(err, result);
                                console.log('=====================================================================');

                                if (err) {
                                    callback(err);
                                    return;
                                }
                                callback(err, {empresa_id: empresa_id, prefijo_documento: prefijo_documento, numeracion_documento: numeracion_documento});

                            });
                        }
                    });
                }
            });
        }
    });
};

/**
 * @author German Galvis
 * +Descripcion crea el detalle del documnto definitivo
 * @fecha 25/05/2018
 */
DocumentoBodegaE007.prototype.agregardocumento_d = function (parametros, transaccion, callback) {

    var sql = " INSERT INTO inv_bodegas_movimiento_d ( \
                    empresa_id, \
                    prefijo, \
                    numero, \
                    centro_utilidad, \
                    bodega, \
                    codigo_producto, \
                    cantidad, \
                    porcentaje_gravamen, \
                    total_costo, \
                    fecha_vencimiento, \
                    lote, \
                    observacion_cambio, \
                    total_costo_pedido, \
                    valor_unitario, \
                    cantidad_sistema,\
                    numero_caja,\
                    tipo_caja \
                )\
                    SELECT  \
                    :3 AS empresa_id, \
                    :4 AS prefijo, \
                    :5 AS numeracion, \
                    a.centro_utilidad, \
                    a.bodega, \
                    a.codigo_producto, \
                    a.cantidad, \
                    a.porcentaje_gravamen,\
                    a.total_costo,\
                    a.fecha_vencimiento, \
                    a.lote, \
                    a.observacion_cambio,\
                    a.total_costo_pedido, \
                    (a.total_costo/a.cantidad) as valor_unitario, \
                    COALESCE(a.cantidad_sistema,0) AS cantidad_sistema, \
                    a.numero_caja,\
                    a.tipo_caja \
                    FROM inv_bodegas_movimiento_tmp_d a\
                    inner join inventarios_productos b on a.codigo_producto = b.codigo_producto\
                    inner join unidades c on b.unidad_id = c.unidad_id \
                    WHERE a.doc_tmp_id = :1  AND a.usuario_id = :2; ";


    var query = G.knex.raw(sql, {1: parametros.docTmpId, 2: parametros.usuarioId, 3: parametros.empresaId, 4: parametros.prefijoDocumento, 5: parametros.numeracionDocumento});
    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado.rows, resultado);
    }).catch(function (err) {
        callback(err);
    });

};


/**
 * @author German Galvis
 * +Descripcion consulta los productos del documento tmp
 * @fecha 29/05/2018
 */
DocumentoBodegaE007.prototype.consultarItem = function (parametros, callback) {
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
/*==================================================================================================================================================================
 * 
 *                                                          FUNCIONES PRIVADAS
 * 
 * ==================================================================================================================================================================*/

// Consultar documento temporal
function __consultar_documento_bodega_temporal(documento_temporal_id, usuario_id, callback) {

    var sql = " SELECT\
                t.*,\
                c.inv_tipo_movimiento as tipo_movimiento,\
                b.tipo_doc_general_id as tipo_doc_bodega_id,\
                c.descripcion as tipo_clase_documento,\
                b.prefijo,\
                b.descripcion,\
                a.documento_id,\
                a.empresa_id,\
                a.centro_utilidad,\
                a.bodega\
                FROM inv_bodegas_movimiento_tmp t\
                INNER JOIN inv_bodegas_documentos a ON t.bodegas_doc_id = a.bodegas_doc_id\
                INNER JOIN documentos b ON a.empresa_id = b.empresa_id AND a.documento_id = b.documento_id\
                INNER JOIN tipos_doc_generales c ON b.tipo_doc_general_id = c.tipo_doc_general_id\
                WHERE doc_tmp_id = :1 AND usuario_id = :2;";

    G.knex.raw(sql, {1: documento_temporal_id, 2: usuario_id}).
            then(function (resultado) {
                callback(false, resultado.rows.length > 0 ? resultado.rows[0] : null);
            }).catch(function (err) {
        callback(err);
    });

}
;

// Consultar detalle movimiento temporal 
function __consultar_detalle_movimiento_bodega_temporal(documento_temporal_id, usuario_id, callback) {


    var sql = " select\
                b.item_id,\
                b.doc_tmp_id,\
                b.empresa_id,\
                b.centro_utilidad as centro_utilidad_id,\
                b.bodega as bodega_id,\
                b.codigo_producto,\
                fc_descripcion_producto(b.codigo_producto) as descripcion_producto,\
                b.cantidad :: integer as cantidad_ingresada,\
                b.porcentaje_gravamen,\
                b.total_costo,\
                to_char(b.fecha_vencimiento, 'dd-mm-yyyy') as fecha_vencimiento,\
                b.lote,\
                b.local_prod,\
                b.observacion_cambio,\
                b.valor_unitario,\
                b.total_costo_pedido,\
                b.sw_ingresonc,\
                b.item_id_compras,\
                b.prefijo_temp,\
                b.lote_devuelto,\
                b.cantidad_sistema,\
                b.auditado,\
                c.codigo_barras,\
                b.numero_caja, \
                c.porc_iva as porcentaje_gravament,\
                a.usuario_id\
                from inv_bodegas_movimiento_tmp a \
                inner join inv_bodegas_movimiento_tmp_d b on a.doc_tmp_id = b.doc_tmp_id and a.usuario_id = b.usuario_id\
                inner join inventarios_productos c on b.codigo_producto = c.codigo_producto\
                where a.doc_tmp_id = :1 and a.usuario_id = :2 ";

    G.knex.raw(sql, {1: documento_temporal_id, 2: usuario_id}).
            then(function (resultado) {
                callback(false, resultado.rows);
            }).catch(function (err) {
        callback(err);
    });
}
;

// Consultar numeracion del documento
function __obtener_numeracion_documento(empresa_id, documento_id, callback) {

    var sql = " SELECT prefijo, numeracion FROM documentos WHERE  empresa_id = :1 AND documento_id = :2 ;  ";
    G.knex.raw(sql, {1: empresa_id, 2: documento_id}).
            then(function (resultado) {
                sql = " UPDATE documentos SET numeracion = numeracion + 1 WHERE empresa_id = :1 AND  documento_id = :2 ; ";

                G.knex.raw(sql, {1: empresa_id, 2: documento_id}).
                        then(function (resultado2) {
                            callback(false, resultado.rows, resultado);
                        }).catch(function (err) {
                    callback(err);
                })

            }).catch(function (err) {
        callback(err);
    });

}
;

// Ingresar cabecera docuemento movimiento
function __ingresar_movimiento_bodega(documento_id, empresa_id, centro_utilidad, bodega, prefijo, numero, observacion, usuario_id, transaccion, callback) {

    var sql = " INSERT INTO inv_bodegas_movimiento (documento_id, empresa_id, centro_utilidad, bodega, prefijo, numero, observacion, sw_estado, usuario_id, fecha_registro, abreviatura ) \
                VALUES ( :1, :2, :3, :4, :5, :6, :7, '1', :8, NOW(), NULL) ;  ";

    var query = G.knex.raw(sql, {1: documento_id, 2: empresa_id, 3: centro_utilidad, 4: bodega, 5: prefijo, 6: numero, 7: observacion.substring(0, 253), 8: usuario_id});
    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado.rows, resultado);
    }).catch(function (err) {
        callback(err);
    });

}
;

module.exports = DocumentoBodegaE007;
