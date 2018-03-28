var DocumentoBodegaI012 = function () {
};

/**
 * @author German Galvis
 * @fecha 20/03/2018
 * +Descripcion Modelo encargado de listar los tipos de terceros
 */
DocumentoBodegaI012.prototype.listarTiposTerceros = function (callback) {

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
 * @fecha 24/03/2018
 * +Descripcion Metodo encargado de listar los clientes
 */
DocumentoBodegaI012.prototype.listarClientes = function (obj, callback) {

    var columnas = [G.knex.raw("DISTINCT ter.tipo_id_tercero as tipo_id_tercero"),
        "ter.tercero_id",
        "ter.direccion",
        "ter.telefono",
        "ter.nombre_tercero",
        "ter.dv",
        "tp.pais"
    ];
    var query = G.knex.select(columnas)
            .from('terceros as ter')
            .join('inv_facturas_despacho as b', function () {
                this.on("ter.tipo_id_tercero", "b.tipo_id_tercero")
                        .on("ter.tercero_id", "b.tercero_id")
                        .on('b.empresa_id', G.knex.raw("'" + obj.empresaId + "'"))
            }).join("tipo_pais AS tp ", "ter.tipo_pais_id", "tp.tipo_pais_id")
            .where(function () {

                if ((obj.filtro.tipo !== 'Nombre') && obj.terminoBusqueda !== "") {
                    this.andWhere(G.knex.raw("ter.tercero_id  " + G.constants.db().LIKE + "'%" + obj.terminoBusqueda + "%'"))
                    this.andWhere(G.knex.raw("ter.tipo_id_tercero " + G.constants.db().LIKE + "'%" + obj.filtro.tipo + "%'"))
                }
                if ((obj.filtro.tipo !== 'Nombre') && obj.terminoBusqueda === "") {
                    this.andWhere(G.knex.raw("ter.tipo_id_tercero " + G.constants.db().LIKE + "'%" + obj.filtro.tipo + "%'"))
                }
                if ((obj.filtro.tipo === 'Nombre') && obj.terminoBusqueda !== "") {
                    this.andWhere(G.knex.raw("ter.nombre_tercero  " + G.constants.db().LIKE + "'%" + obj.terminoBusqueda + "%'"))
                }
            });
    query.union(function () {
        this.select(columnas)
                .from('terceros as ter')
                .join('inv_facturas_agrupadas_despacho as c', function () {
                    this.on("ter.tipo_id_tercero", "c.tipo_id_tercero")
                            .on("ter.tercero_id", "c.tercero_id")
                            .on('c.empresa_id', G.knex.raw("'" + obj.empresaId + "'"))
                }).join("tipo_pais AS tp ", "ter.tipo_pais_id", "tp.tipo_pais_id")
                .where(function () {

                    if ((obj.filtro.tipo !== 'Nombre') && obj.terminoBusqueda !== "") {
                        this.andWhere(G.knex.raw("ter.tercero_id  " + G.constants.db().LIKE + "'%" + obj.terminoBusqueda + "%'"))
                        this.andWhere(G.knex.raw("ter.tipo_id_tercero " + G.constants.db().LIKE + "'%" + obj.filtro.tipo + "%'"))
                    }
                    if ((obj.filtro.tipo !== 'Nombre') && obj.terminoBusqueda === "") {
                        this.andWhere(G.knex.raw("ter.tipo_id_tercero " + G.constants.db().LIKE + "'%" + obj.filtro.tipo + "%'"))
                    }
                    if ((obj.filtro.tipo === 'Nombre') && obj.terminoBusqueda !== "") {
                        this.andWhere(G.knex.raw("ter.nombre_tercero  " + G.constants.db().LIKE + "'%" + obj.terminoBusqueda + "%'"))
                    }
                });
    });

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
 * @fecha 26/03/2018
 * +Descripcion Metodo encargado de listar las facturas
 */
DocumentoBodegaI012.prototype.listarFacturas = function (parametros, callback) {

    var columnas = [
        "a.empresa_id",
        "a.factura_fiscal",
        "a.prefijo",
        "a.documento_id",
        "a.tipo_id_tercero",
        "a.tercero_id",
        "a.valor_notacredito",
        "a.valor_notadebito",
        "a.fecha_registro",
        "a.usuario_id",
        "a.valor_total",
        "a.fecha_vencimiento_factura",
        "a.observaciones",
        "a.porcentaje_rtf",
        "a.porcentaje_ica",
        "a.porcentaje_reteiva",
        "a.saldo",
        "a.porcentaje_cree",
        G.knex.raw("0 as fac_agrupada")
    ];

    var columnas2 = [
        "a.empresa_id",
        "a.factura_fiscal",
        "a.prefijo",
        "a.documento_id",
        "a.tipo_id_tercero",
        "a.tercero_id",
        "a.valor_notacredito",
        "a.valor_notadebito",
        "a.fecha_registro",
        "a.usuario_id",
        "a.valor_total",
        "a.fecha_vencimiento_factura",
        "a.observaciones",
        "a.porcentaje_rtf",
        "a.porcentaje_ica",
        "a.porcentaje_reteiva",
        "a.saldo",
        "a.porcentaje_cree",
        G.knex.raw("1 as fac_agrupada")
    ];

    var query = G.knex.select(columnas)
            .from('inv_facturas_despacho as a')
            .innerJoin("inv_facturas_despacho_d AS c", function () {
                this.on("a.empresa_id", "c.empresa_id")
                        .on("a.prefijo", "c.prefijo")
                        .on("a.factura_fiscal", "c.factura_fiscal")
            })
            .where('a.empresa_id', parametros.empresaId)
            .andWhere('a.tipo_id_tercero', parametros.tipo_documento)
            .andWhere('a.tercero_id', parametros.documento)
            .andWhere(G.knex.raw("(\"c\".\"cantidad\" <> \"c\".\"cantidad_devuelta\")"));

    query.union(function () {
        this.select(columnas2)
                .from('inv_facturas_agrupadas_despacho as a')
                .innerJoin("inv_facturas_agrupadas_despacho_d AS c", function () {
                    this.on("a.empresa_id", "c.empresa_id")
                            .on("a.prefijo", "c.prefijo")
                            .on("a.factura_fiscal", "c.factura_fiscal")
                })
                .where('a.empresa_id', parametros.empresaId)
                .andWhere('a.tipo_id_tercero', parametros.tipo_documento)
                .andWhere('a.tercero_id', parametros.documento)
                .andWhere(G.knex.raw("(\"c\".\"cantidad\" <> \"c\".\"cantidad_devuelta\")"))
                .groupBy(G.knex.raw("1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18"))
                .orderBy(G.knex.raw("2"));
    });

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarFacturas]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion lista los productos de la factura
 * @fecha 27/03/2018
 */
DocumentoBodegaI012.prototype.listarProductosFacturas = function (parametros, callback) {

    var columnas = [
        "a.item_id",
        "a.empresa_id",
        "a.prefijo",
        "a.factura_fiscal",
        "a.codigo_producto",
        G.knex.raw("fc_descripcion_producto(\"a\".\"codigo_producto\") as descripcion_producto"),
        "a.cantidad",
        "a.cantidad_devuelta",
        "a.fecha_vencimiento",
        "a.lote",
        "a.valor_unitario",
        "a.porc_iva",
        G.knex.raw("(\"a\".\"valor_unitario\" * (\"a\".\"porc_iva\"/100)) as iva"),
        G.knex.raw("(\"a\".\"valor_unitario\" +(\"a\".\"valor_unitario\" *(\"a\".\"porc_iva\"/100))) as valor_unitario_iva"),
        G.knex.raw("((\"a\".\"cantidad\") * (\"a\".\"valor_unitario\" +(\"a\".\"valor_unitario\" *(\"a\".\"porc_iva\"/100)))) as valor_total_iva"),
        "i.costo",
        "param.torre",
        "invenPro.tipo_producto_id"
    ];

    var columnasQuery = [
        "item_id",
        "empresa_id",
        "prefijo",
        "factura_fiscal",
        "codigo_producto",
        "cantidad",
        "cantidad_devuelta",
        "fecha_vencimiento",
        "lote",
        "valor_unitario",
        "porc_iva",
        0
    ];
    var columnasQuery2 = [
        "item_id",
        "empresa_id",
        "prefijo",
        "factura_fiscal",
        "codigo_producto",
        "cantidad",
        "cantidad_devuelta",
        "fecha_vencimiento",
        "lote",
        "valor_unitario",
        "porc_iva",
        1
    ];

    var subQuery = G.knex.select(columnasQuery)
            .from('inv_facturas_despacho_d')
            .union(function () {
                this.select(columnasQuery2)
                        .from('inv_facturas_agrupadas_despacho_d');
            });

    var query = G.knex.select(columnas)
            .from(G.knex.raw("(" + subQuery + ") as a"))
            .innerJoin("inventarios AS i", function () {
                this.on("a.codigo_producto", "i.codigo_producto")
                        .on("a.empresa_id", "i.empresa_id")
            })
            .innerJoin("inventarios_productos AS invenPro ", "a.codigo_producto", "invenPro.codigo_producto")
            .leftJoin("param_torreproducto AS param", "a.codigo_producto", "param.codigo_producto")
            .where('a.prefijo', parametros.prefijo)
            .andWhere("a.factura_fiscal", parametros.numero_doc)
            .andWhere("a.empresa_id", parametros.empresa_id)
            .andWhere(G.knex.raw("(\"a\".\"cantidad\" <> \"a\".\"cantidad_devuelta\")"));

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarProductosFactura]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion actualiza el documento parcial para IDC
 * @fecha 27/03/2018
 */
DocumentoBodegaI012.prototype.modificarDevolucionFacturaTmp = function (parametros, transaccion, callback) {
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
 * +Descripcion agrega un registro a la tabla inv_bodegas_movimiento_tmp_devolucion_cliente
 * @fecha 27/03/2018
 */
DocumentoBodegaI012.prototype.generarMovimientoDevolucionClienteTmp = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_devolucion_cliente").
            insert({empresa_id: parametros.empresa_id, doc_tmp_id: parametros.doc_tmp_id, prefijo: parametros.prefijoFactura,
                numero: parametros.numeroFactura, usuario_id: parametros.usuario_id, tipo_id_tercero: parametros.tipo_id_tercero,
                tercero_id: parametros.tercero_id
            });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error generarMovimientoDevolucionClienteTmp", err);
        callback(err);
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion elimina todos los productos asociados al documento parcial
 * @fecha 27/03/2018
 */
DocumentoBodegaI012.prototype.eliminarDocumentoTemporal_d = function (parametros, transaccion, callback) {
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
 * +Descripcion elimina el documento parcial para IDC
 * @fecha 27/03/2018
 */
DocumentoBodegaI012.prototype.eliminarDocumentoTemporal = function (parametros, transaccion, callback) {

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
 * +Descripcion agrega productos al documento temporal
 * @fecha 27/03/2018
 */
DocumentoBodegaI012.prototype.agregarItem = function (parametros, transaccion, callback) {
    var query = G.knex("inv_bodegas_movimiento_tmp_d")
            .insert({bodega: parametros.bodega, cantidad: parametros.cantidad, centro_utilidad: parametros.centroUtilidad,
                codigo_producto: parametros.codigoProducto, doc_tmp_id: parametros.docTmpId, empresa_id: parametros.empresaId,
                fecha_vencimiento: parametros.fechaVencimiento, lote: parametros.lote, usuario_id: parametros.usuarioId,
                item_id_compras: parametros.item_id, porcentaje_gravamen: parametros.gravamen, total_costo: parametros.totalCosto,
                valor_unitario: parametros.valorU, total_costo_pedido: parametros.totalCostoPedido
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
 * +Descripcion actualiza el producto devuelto 
 * @fecha 28/03/2018
 */
DocumentoBodegaI012.prototype.updatefacturaD = function (parametros, transaccion, callback) {
    var query = G.knex(parametros.tabla)
            .where('prefijo', parametros.prefijo)
            .andWhere('factura_fiscal', parametros.numero_doc)
            .andWhere('codigo_producto', parametros.codigoProducto)
            .andWhere('lote', parametros.lote)
            .andWhere('fecha_vencimiento', parametros.fechaVencimiento)
            .update('cantidad_devuelta', G.knex.raw('cantidad_devuelta +' + parametros.cantidad));

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
 * +Descripcion lista los productos del documento temporal
 * @fecha 27/03/2018
 */
DocumentoBodegaI012.prototype.consultarProductosDevueltos = function (parametros, callback) {

    var columnas = [
        "a.item_id",
        "a.usuario_id",
        "a.doc_tmp_id",
        "a.empresa_id",
        "a.centro_utilidad",
        "a.bodega",
        "a.codigo_producto",
        "a.cantidad",
        "a.porcentaje_gravamen",
        "a.total_costo",
        "a.fecha_vencimiento",
        "a.lote",
        "a.local_prod",
        "a.valor_unitario",
        "a.total_costo_pedido",
        "a.sw_ingresonc",
        "a.item_id_compras",
        "a.lote_devuelto",
        "a.prefijo_temp",
        "a.observacion_cambio",
        G.knex.raw("COALESCE(a.cantidad_sistema,0)as cantidad_sistema"),
        G.knex.raw("fc_descripcion_producto(\"b\".\"codigo_producto\") as descripcion"),
        "b.contenido_unidad_venta",
        "b.unidad_id",
        "c.descripcion as descripcion_unidad",
        G.knex.raw("(((a.total_costo)/((a.porcentaje_gravamen/100)+1))/a.cantidad) as valor_unit"),
        G.knex.raw("((a.total_costo/a.cantidad)-(((a.total_costo)/((a.porcentaje_gravamen/100)+1))/a.cantidad)) as iva"),
        G.knex.raw("((((a.total_costo)/((a.porcentaje_gravamen/100)+1))/a.cantidad)*a.cantidad) as valor_total"),
        G.knex.raw("(((a.total_costo/a.cantidad)-(((a.total_costo)/((a.porcentaje_gravamen/100)+1))/a.cantidad))*a.cantidad) as iva_total"),
        "a.numero_caja",
        "param.torre",
        "b.tipo_producto_id"
    ];

    var query = G.knex.select(columnas)
            .from("inv_bodegas_movimiento_tmp_d as a")
            .innerJoin("inventarios_productos as b", "b.codigo_producto", "a.codigo_producto")
            .innerJoin("unidades as c", "c.unidad_id", "b.unidad_id")
            .leftJoin("param_torreproducto AS param", "a.codigo_producto", "param.codigo_producto")
            .where('a.doc_tmp_id', parametros.numero_doc)
            .andWhere("a.usuario_id", parametros.usuario_id)
            .orderBy("a.item_id", "asc");


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
 * @fecha 27/03/2018
 */
DocumentoBodegaI012.prototype.eliminarItem = function (parametros, transaccion, callback) {
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
 * @fecha 28/03/2018
 */
DocumentoBodegaI012.prototype.restarCantidadFacturaD = function (parametros, transaccion, callback) {
    var query = G.knex(parametros.tabla)
            .where('prefijo', parametros.prefijo)
            .andWhere('factura_fiscal', parametros.numero_doc)
            .andWhere('codigo_producto', parametros.codigo_producto)
            .andWhere('lote', parametros.lote)
            .andWhere('fecha_vencimiento', parametros.fechaVencimiento)
            .update('cantidad_devuelta', G.knex.raw('cantidad_devuelta -' + parametros.cantidad));
    if (transaccion)
        query.transacting(transaccion);

    console.log("Query resultado", G.sqlformatter.format(
            query.toString()));

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
/*DocumentoBodegaI011.prototype.updateAllMovimientoD = function (parametros, transaccion, callback) {
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
 * +Descripcion agrega productos al documento temporal
 * @fecha 2018-02-15
 */
/*DocumentoBodegaI011.prototype.agregarDocumentoVerificacionTmp = function (parametros, transaccion, callback) {
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
 * +Descripcion agrega productos al documento temporal
 * @fecha 2018-02-23
 */
/*DocumentoBodegaI011.prototype.agregarDocumentoVerificacionTmpD = function (parametros, transaccion, callback) {
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
/*DocumentoBodegaI011.prototype.agregarMovimientoDevolucionFarmaciaTmpD = function (parametros, transaccion, callback) {
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
 * +Descripcion elimina el item seleccionado del documento parcial
 * @fecha 2018-02-14
 */
/*DocumentoBodegaI011.prototype.eliminarItemMovimientoDevolucionFarmacia = function (parametros, transaccion, callback) {
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
 * +Descripcion agrega un registro a la tabla inv_bodegas_movimiento_devolucion_farmacia
 * @fecha 2018-02-28
 */
/*DocumentoBodegaI011.prototype.agregarMovimientoFarmacia = function (parametros, transaccion, callback) {
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
 
 /**
 * @author German Galvis
 * +Descripcion consulta los productos pertenecientes al documento a imprimir
 * @fecha 2018-03-08
 */
/*DocumentoBodegaI011.prototype.consultar_detalle_documento = function (parametro, callback) {
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
 .where('a.empresa_id', parametro.empresa_id)
 .andWhere("a.prefijo", parametro.prefijoDocumento)
 .andWhere("a.numero", parametro.numeracionDocumento)
 .orderBy('param.torre', 'asc');
 
 query.then(function (resultado) {
 callback(false, resultado);
 }).catch(function (err) {
 callback(err);
 });
 };
 /*==================================================================================================================================================================
 * 
 *                                                          FUNCIONES PRIVADAS
 * 
 * ==================================================================================================================================================================*/

// Ingresar cabecera documento verificacion
/*function __ingresar_documento_verificacion(parametros, transaccion, callback) {
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
 
 var columnasConsulta = [
 "a.farmacia_id",
 "a.prefijo",
 "a.numero",
 G.knex.raw("'"+ parametros.empresa_id + "' AS empresa_id"),
 G.knex.raw("'"+ parametros.prefijoDocumento + "' AS prefijo"),
 G.knex.raw("'"+ parametros.numeracionDocumento + "' AS numeracion"),
 "a.codigo_producto",
 "a.lote",
 "a.fecha_vencimiento",
 "a.cantidad",
 "a.novedad_devolucion_id",
 "a.novedad_anexa",
 "b.cantidad_recibida"
 ];
 
 var columnasInsert = [
 "farmacia_id",
 "prefijo_doc_farmacia",
 "numero_doc_farmacia",
 "empresa_id",
 "prefijo",
 "numero",
 "codigo_producto",
 "lote",
 "fecha_vencimiento",
 "cantidad",
 "novedad_devolucion_id",
 "novedad_anexa",
 "cantidad_enviada"
 ];
 
 var sqlSelect = G.knex.select(columnasConsulta)
 .from('inv_documento_verificacion_tmp_d as a')
 .innerJoin("inv_bodegas_movimiento_d as b", function () {
 this.on("b.prefijo",G.knex.raw("'"+ parametros.prefijoDocumento + "'"))
 .on("b.numero", parametros.numeracionDocumento)
 .on("b.codigo_producto", "a.codigo_producto")
 })
 .where('a.doc_tmp_id', parametros.docTmpId)
 .andWhere("a.usuario_id", parametros.usuarioId);
 
 var query = G.knex().
 insert(sqlSelect).into(G.knex.raw("inv_documento_verificacion_d ("+columnasInsert+")"));
 
 if (transaccion)
 query.transacting(transaccion);
 
 query.then(function (resultado) {
 callback(false, resultado.rows, resultado);
 }).catch(function (err) {
 callback(err);
 });
 }
 ;*/
module.exports = DocumentoBodegaI012;
