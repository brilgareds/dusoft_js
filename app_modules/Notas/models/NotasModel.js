var NotasModel = function () {
};


/**
 * @author German Galvis
 * +Descripcion Metodo encargado de listar facturas 
 * @fecha 2018-08-02 YYYY-MM-DD
 * @returns {callback}
 */
NotasModel.prototype.listarFacturas = function (obj, callback) {

    var columna_a = [
        "ifd.factura_fiscal",
        "ifd.prefijo",
        "t.tipo_id_tercero",
        "t.tercero_id",
        "t.nombre_tercero",
        G.knex.raw("0 as tipo_factura"),
        G.knex.raw("CAST(ifd.fecha_registro AS date) AS fecha_registro"),
        "ifd.valor_total",
        "ifd.saldo",
        "ibmdc.empresa_id AS empresa_id_devolucion",
        "ibmdc.prefijo AS prefijo_devolucion",
        G.knex.raw("to_char(ifd.fecha_registro, 'yyyy') as anio_factura"),
        "ifd.porcentaje_rtf",
        "ifd.porcentaje_ica",
        "ifd.empresa_id",
        G.knex.raw("(SELECT MAX(ibmdc_sc.numero)\
                        FROM inv_facturas_despacho ifd_sc\
                        LEFT OUTER JOIN inv_bodegas_movimiento_devolucion_cliente ibmdc_sc ON (ifd_sc.empresa_id = ibmdc_sc.empresa_id AND ifd_sc.factura_fiscal = ibmdc_sc.numero_doc_cliente AND ifd_sc.prefijo = ibmdc_sc.prefijo_doc_cliente) \
                        WHERE ifd_sc.factura_fiscal LIKE " + obj.facturaFiscal + "\
                        AND ifd_sc.empresa_id = '" + obj.empresaId + "' ) AS numero_devolucion"),
        G.knex.raw("(SELECT MAX(ncdc_sc.numero_devolucion) \
                        FROM inv_facturas_despacho ifd_sc \
                        LEFT OUTER JOIN notas_credito_despachos_clientes ncdc_sc ON (ifd_sc.empresa_id = ncdc_sc.empresa_id AND ifd_sc.factura_fiscal = ncdc_sc.factura_fiscal AND ifd_sc.prefijo = ncdc_sc.prefijo) \
                        WHERE ifd_sc.factura_fiscal LIKE " + obj.facturaFiscal + " \
                        AND ifd_sc.empresa_id = '" + obj.empresaId + "' ) AS numero_devolucion_nota_credito ")
    ];

    var columna_b = [
        "ifd.factura_fiscal",
        "ifd.prefijo",
        "t.tipo_id_tercero",
        "t.tercero_id",
        "t.nombre_tercero",
        G.knex.raw("1 as tipo_factura"),
        G.knex.raw("CAST(ifd.fecha_registro AS date) AS fecha_registro"),
        "ifd.valor_total",
        "ifd.saldo",
        "ibmdc.empresa_id AS empresa_id_devolucion",
        "ibmdc.prefijo AS prefijo_devolucion",
        G.knex.raw("to_char(ifd.fecha_registro, 'yyyy') as anio_factura"),
        "ifd.porcentaje_rtf",
        "ifd.porcentaje_ica",
        "ifd.empresa_id",
        G.knex.raw("(SELECT MAX(ibmdc_sc.numero)\
                        FROM inv_facturas_agrupadas_despacho ifd_sc\
                        LEFT OUTER JOIN inv_bodegas_movimiento_devolucion_cliente ibmdc_sc ON (ifd_sc.empresa_id = ibmdc_sc.empresa_id AND ifd_sc.factura_fiscal = ibmdc_sc.numero_doc_cliente AND ifd_sc.prefijo = ibmdc_sc.prefijo_doc_cliente) \
                        WHERE ifd_sc.factura_fiscal LIKE " + obj.facturaFiscal + "\
                        AND ifd_sc.empresa_id = '" + obj.empresaId + "' ) AS numero_devolucion"),
        G.knex.raw("(SELECT MAX(ncdc_sc.numero_devolucion) \
                        FROM inv_facturas_agrupadas_despacho ifd_sc \
                        LEFT OUTER JOIN notas_credito_despachos_clientes_agrupados ncdc_sc ON (ifd_sc.empresa_id = ncdc_sc.empresa_id AND ifd_sc.factura_fiscal = ncdc_sc.factura_fiscal AND ifd_sc.prefijo = ncdc_sc.prefijo) \
                        WHERE ifd_sc.factura_fiscal LIKE " + obj.facturaFiscal + " \
                        AND ifd_sc.empresa_id = '" + obj.empresaId + "' ) AS numero_devolucion_nota_credito ")
    ];


    var query = G.knex.select(G.knex.raw("distinct ON (ifd.empresa_id, ifd.factura_fiscal, ifd.prefijo)" + columna_a))
            .from('inv_facturas_despacho as ifd')
            .innerJoin('terceros as t', function () {

                this.on("t.tipo_id_tercero", "ifd.tipo_id_tercero")
                        .on("t.tercero_id", "ifd.tercero_id");

            })
            .leftOuterJoin('inv_bodegas_movimiento_devolucion_cliente as ibmdc', function () {

                this.on("ibmdc.empresa_id", "ifd.empresa_id")
                        .on("ibmdc.numero_doc_cliente", "ifd.factura_fiscal")
                        .on("ibmdc.prefijo_doc_cliente", "ifd.prefijo");

            })
            .leftOuterJoin('inv_bodegas_movimiento as ibm', function () {

                this.on("ibm.empresa_id", "ibmdc.empresa_id")
                        .on("ibm.prefijo", "ibmdc.prefijo_doc_cliente")
                        .on("ibm.numero", "ibmdc.numero_doc_cliente");

            })

            .where(function () {
                if (obj.empresaId !== undefined) {
                    this.andWhere('ifd.empresa_id ', obj.empresaId);
                }

                if (obj.facturaFiscal !== 'undefined') {
                    this.andWhere('ifd.factura_fiscal', obj.facturaFiscal);
                }

                if (obj.prefijo !== 'seleccionar') {
                    this.andWhere('ifd.prefijo', obj.prefijo);
                }

            });

    query.unionAll(function () {
        this.select(G.knex.raw("distinct ON (ifd.empresa_id, ifd.factura_fiscal, ifd.prefijo)" + columna_b))
                .from('inv_facturas_agrupadas_despacho as ifd')
                .innerJoin('terceros as t', function () {

                    this.on("t.tipo_id_tercero", "ifd.tipo_id_tercero")
                            .on("t.tercero_id", "ifd.tercero_id");

                })
                .leftOuterJoin('inv_bodegas_movimiento_devolucion_cliente as ibmdc', function () {

                    this.on("ibmdc.empresa_id", "ifd.empresa_id")
                            .on("ibmdc.numero_doc_cliente", "ifd.factura_fiscal")
                            .on("ibmdc.prefijo_doc_cliente", "ifd.prefijo");

                })
                .leftOuterJoin('inv_bodegas_movimiento as ibm', function () {

                    this.on("ibm.empresa_id", "ibmdc.empresa_id")
                            .on("ibm.prefijo", "ibmdc.prefijo_doc_cliente")
                            .on("ibm.numero", "ibmdc.numero_doc_cliente");

                })

                .where(function () {
                    if (obj.empresaId !== undefined) {
                        this.andWhere('ifd.empresa_id ', obj.empresaId);
                    }

                    if (obj.facturaFiscal !== 'undefined') {
                        this.andWhere('ifd.factura_fiscal', obj.facturaFiscal);
                    }

                    if (obj.prefijo !== 'seleccionar') {
                        this.andWhere('ifd.prefijo', obj.prefijo);
                    }

                });
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
 * +Descripcion Metodo encargado de consultar las notas debito
 * @fecha 2018-08-06 YYYY-MM-DD
 * @returns callback
 */
NotasModel.prototype.ConsultarNotasDebito = function (obj, callback) {

    var columna_a = [
        "ifd.factura_fiscal",
        "ifd.prefijo",
        "T.tipo_id_tercero",
        "T.tercero_id",
        "T.nombre_tercero",
        G.knex.raw("TO_CHAR(ifd.fecha_registro,'YYYY-MM-DD') as fecha_registro"),
        "ifd.valor_total",
        "ifd.saldo",
        "nddc.nota_debito_despacho_cliente_id AS numero",
        "nddc.valor AS valor_nota",
        G.knex.raw("TO_CHAR(nddc.fecha_registro,'YYYY-MM-DD') as fecha_registro_nota"),
        G.knex.raw("0 AS tipo_factura"),
        "a.estado",
        G.knex.raw("'D' AS tipo_nota_impresion"),
        G.knex.raw("CASE WHEN a.estado = 0 THEN\
	'Sincronizado' ELSE'NO sincronizado'\
	END AS descripcion_estado")
    ];

    var columna_b = [
        "ifd.factura_fiscal",
        "ifd.prefijo",
        "T.tipo_id_tercero",
        "T.tercero_id",
        "T.nombre_tercero",
        G.knex.raw("TO_CHAR(ifd.fecha_registro,'YYYY-MM-DD') as fecha_registro"),
        "ifd.valor_total",
        "ifd.saldo",
        "nddc.nota_debito_despacho_cliente_id AS numero",
        "nddc.valor AS valor_nota",
        G.knex.raw("TO_CHAR(nddc.fecha_registro,'YYYY-MM-DD') as fecha_registro_nota"),
        G.knex.raw("1 AS tipo_factura"),
        "a.estado",
        G.knex.raw("'D' AS tipo_nota_impresion"),
        G.knex.raw("CASE WHEN a.estado = 0 THEN\
	'Sincronizado' ELSE'NO sincronizado'\
	END AS descripcion_estado")
    ];

    var query = G.knex.select(columna_a)
//    .from(G.knex.raw("inv_facturas_despacho ifd"))
            .from(G.knex.raw("( SELECT estado, factura_fiscal, prefijo, numero_nota FROM logs_facturacion_clientes_ws_fi WHERE estado = '0' LIMIT 1 ) AS a, inv_facturas_despacho ifd"))
            .innerJoin('terceros as T', function () {

                this.on("T.tipo_id_tercero", "ifd.tipo_id_tercero")
                        .on("T.tercero_id", "ifd.tercero_id");

            })
            .innerJoin('notas_debito_despachos_clientes as nddc', function () {

                this.on("nddc.empresa_id", "ifd.empresa_id")
                        .on("nddc.factura_fiscal", "ifd.factura_fiscal")
                        .on("nddc.prefijo", "ifd.prefijo");

            })
//            .leftJoin('logs_facturacion_clientes_ws_fi as a', function () {
//
//                this.on("a.numero_nota", "nddc.nota_debito_despacho_cliente_id")
//                        .on("a.factura_fiscal", "ifd.factura_fiscal")
//                        .on("a.prefijo", "ifd.prefijo");
//
//            })
            .where(function () {

                this.andWhere('ifd.empresa_id', obj.empresa_id);

//                if (obj.tipoConsulta !== undefined && obj.tipoConsulta === 'F') {
//                    this.andWhere('ifd.factura_fiscal', obj.numero);
//                }
//
//                if (obj.tipoConsulta !== undefined && obj.tipoConsulta === 'ND') {
                this.andWhere('nddc.nota_debito_despacho_cliente_id', obj.numero);
//                }
            });


    query.unionAll(function () {

        this.select(columna_b)
//        .from(G.knex.raw("inv_facturas_agrupadas_despacho ifd"))
                .from(G.knex.raw("( SELECT estado, factura_fiscal, prefijo, numero_nota FROM logs_facturacion_clientes_ws_fi WHERE estado = '0' LIMIT 1 ) AS a, inv_facturas_agrupadas_despacho ifd"))
                .innerJoin('terceros as T', function () {

                    this.on("T.tipo_id_tercero", "ifd.tipo_id_tercero")
                            .on("T.tercero_id", "ifd.tercero_id");

                })
                .innerJoin('notas_debito_despachos_clientes_agrupados as nddc', function () {

                    this.on("nddc.empresa_id", "ifd.empresa_id")
                            .on("nddc.factura_fiscal", "ifd.factura_fiscal")
                            .on("nddc.prefijo", "ifd.prefijo");

                })
//                .leftJoin('logs_facturacion_clientes_ws_fi as a', function () {
//
//                    this.on("a.numero_nota", "nddc.nota_debito_despacho_cliente_id")
//                            .on("a.factura_fiscal", "ifd.factura_fiscal")
//                            .on("a.prefijo", "ifd.prefijo");
//
//                })
                .where(function () {

                    this.andWhere('ifd.empresa_id', obj.empresa_id);

//                    if (obj.tipoConsulta !== undefined && obj.tipoConsulta === 'F') {
//                        this.andWhere('ifd.factura_fiscal', obj.numero);
//                    }
//
//                    if (obj.tipoConsulta !== undefined && obj.tipoConsulta === 'ND') {
                    this.andWhere('nddc.nota_debito_despacho_cliente_id', obj.numero);
//                    }

                });
    });

    query.orderBy('nombre_tercero');

    query.then(function (resultado) {

        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [ConsultarNotasDebito]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de consultar las notas credito
 * @fecha 2018-08-06 YYYY-MM-DD
 * @returns callback
 */
NotasModel.prototype.ConsultarNotasCredito = function (obj, callback) {

    var columna_a = [
        "ifd.factura_fiscal",
        "ifd.prefijo",
        "T.tipo_id_tercero",
        "T.tercero_id",
        "T.nombre_tercero",
        G.knex.raw("TO_CHAR(ifd.fecha_registro,'YYYY-MM-DD') as fecha_registro"),
        "ifd.valor_total",
        "ifd.saldo",
        "ncdc.nota_credito_despacho_cliente_id AS numero",
        "ncdc.valor AS valor_nota",
        "ncdc.tipo AS tipo_nota",
        G.knex.raw("TO_CHAR(ncdc.fecha_registro,'YYYY-MM-DD') as fecha_registro_nota"),
        G.knex.raw("0 AS tipo_factura"),
        "a.estado",
        G.knex.raw("'C' AS tipo_nota_impresion"),
        G.knex.raw("CASE WHEN a.estado = 0 THEN\
	'Sincronizado' ELSE'NO sincronizado'\
	END AS descripcion_estado"),
        "b.descripcion AS descripcion_concepto",
        "ncdc.concepto_id"
    ];

    var columna_b = [
        "ifd.factura_fiscal",
        "ifd.prefijo",
        "T.tipo_id_tercero",
        "T.tercero_id",
        "T.nombre_tercero",
        G.knex.raw("TO_CHAR(ifd.fecha_registro,'YYYY-MM-DD') as fecha_registro"),
        "ifd.valor_total",
        "ifd.saldo",
        "ncdc.nota_credito_despacho_cliente_id AS numero",
        "ncdc.valor AS valor_nota",
        "ncdc.tipo AS tipo_nota",
        G.knex.raw("TO_CHAR(ncdc.fecha_registro,'YYYY-MM-DD') as fecha_registro_nota"),
        G.knex.raw("1 AS tipo_factura"),
        "a.estado",
        G.knex.raw("'C' AS tipo_nota_impresion"),
        G.knex.raw("CASE WHEN a.estado = 0 THEN\
	'Sincronizado' ELSE'NO sincronizado'\
	END AS descripcion_estado"),
        "b.descripcion AS descripcion_concepto",
        "ncdc.concepto_id"
    ];

    var query = G.knex.select(columna_a)
            .from("inv_facturas_despacho as ifd")
            .innerJoin('terceros as T', function () {

                this.on("T.tipo_id_tercero", "ifd.tipo_id_tercero")
                        .on("T.tercero_id", "ifd.tercero_id");

            })
            .innerJoin('notas_credito_despachos_clientes as ncdc', function () {

                this.on("ncdc.empresa_id", "ifd.empresa_id")
                        .on("ncdc.factura_fiscal", "ifd.factura_fiscal")
                        .on("ncdc.prefijo", "ifd.prefijo");

            })
            .leftJoin("concepto_nota as b", "b.id", "ncdc.concepto_id ")
            .leftJoin('logs_facturacion_clientes_ws_fi as a', function () {

                this.on("a.numero_nota", "ncdc.nota_credito_despacho_cliente_id")
                        .on("a.factura_fiscal", "ifd.factura_fiscal")
                        .on("a.prefijo", "ifd.prefijo");

            })
            .where(function () {

                this.andWhere('ifd.empresa_id', obj.empresa_id);

//                if (obj.tipoConsulta !== undefined && obj.tipoConsulta === 'F') {
//                    this.andWhere('ifd.factura_fiscal', obj.numero);
//                }
//
//                if (obj.tipoConsulta !== undefined && obj.tipoConsulta === 'NC') {
                this.andWhere('ncdc.nota_credito_despacho_cliente_id', obj.numero);
//                }
            });


    query.unionAll(function () {

        this.select(columna_b)
                .from("inv_facturas_agrupadas_despacho as ifd")
                .innerJoin('terceros as T', function () {

                    this.on("T.tipo_id_tercero", "ifd.tipo_id_tercero")
                            .on("T.tercero_id", "ifd.tercero_id");

                })
                .innerJoin('notas_credito_despachos_clientes_agrupados as ncdc', function () {

                    this.on("ncdc.empresa_id", "ifd.empresa_id")
                            .on("ncdc.factura_fiscal", "ifd.factura_fiscal")
                            .on("ncdc.prefijo", "ifd.prefijo");

                })
                .leftJoin("concepto_nota as b", "b.id", "ncdc.concepto_id ")
                .leftJoin('logs_facturacion_clientes_ws_fi as a', function () {

                    this.on("a.numero_nota", "ncdc.nota_credito_despacho_cliente_id")
                            .on("a.factura_fiscal", "ifd.factura_fiscal")
                            .on("a.prefijo", "ifd.prefijo");

                })
                .where(function () {

                    this.andWhere('ifd.empresa_id', obj.empresa_id);

//                    if (obj.tipoConsulta !== undefined && obj.tipoConsulta === 'F') {
//                        this.andWhere('ifd.factura_fiscal', obj.numero);
//                    }
//
//                    if (obj.tipoConsulta !== undefined && obj.tipoConsulta === 'NC') {
                    this.andWhere('ncdc.nota_credito_despacho_cliente_id', obj.numero);
//                    }
                });
    });

    query.orderBy(G.knex.raw("4"));

    query.then(function (resultado) {

        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [ConsultarNotasCredito]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de consultar los detalles de las facturas
 * @fecha 2018-08-06 YYYY-MM-DD
 * @returns callback
 */
NotasModel.prototype.ConsultarDetalleFacturaCredito = function (obj, callback) {

    var columnas = [
        "ifd.factura_fiscal",
        "ifd.fecha_registro",
        "ifd.valor_total",
        G.knex.raw("fc_descripcion_producto ( ifdd.codigo_producto ) AS producto"),
        "ifdd.item_id",
        "ifdd.codigo_producto",
        "ifdd.cantidad",
        G.knex.raw("( ifdd.cantidad - ifdd.cantidad_devuelta ) AS cantidad_existente"),
        "ifdd.lote",
        "ifdd.valor_unitario",
        "ifdd.porc_iva",
        "tdncdc.tmp_detalle_nota_credito_despacho_cliente_id AS id_nota",
        G.knex.raw("COALESCE ( tdncdc.valor, 0 ) AS valor"),
        "tdncdc.observacion",
        G.knex.raw("(round(( tdncdc.valor / ifdd.cantidad ), 4 )) AS valor_digitado_nota"),
        G.knex.raw("((ifdd.cantidad * ifdd.valor_unitario) - (COALESCE ( tdncdc.valor, 0 ))) AS diferencia"),
        "tdncdc.valor_iva",
        "tncdc.valor_nota",
        "tncdc.descripcion"
    ];

    var query = G.knex.select(G.knex.raw("distinct ON (ifdd.item_id)" + columnas))
            .from("inv_facturas_despacho as ifd")
            .innerJoin('inv_facturas_despacho_d as ifdd', function () {

                this.on("ifdd.empresa_id", "ifd.empresa_id")
                        .on("ifdd.factura_fiscal", "ifd.factura_fiscal")
                        .on("ifdd.prefijo", "ifd.prefijo");

            })
            .leftOuterJoin('tmp_notas_credito_despachos_clientes as tncdc', function () {

                this.on("tncdc.empresa_id", "ifd.empresa_id")
                        .on("tncdc.factura_fiscal", "ifd.factura_fiscal")
                        .on("tncdc.prefijo", "ifd.prefijo")
                        .on("tncdc.tipo", G.knex.raw("'" + obj.tipoNota + "'"));

            })
            .leftOuterJoin('tmp_detalles_notas_credito_despachos_clientes as tdncdc', function () {

                this.on("tdncdc.tmp_nota_credito_despacho_cliente_id", "tncdc.tmp_nota_credito_despacho_cliente_id")
                        .on("tdncdc.item_id", "ifdd.item_id");

            })
            .where('ifd.empresa_id', obj.empresa_id)
            .andWhere('ifd.factura_fiscal', obj.facturaFiscal);


    query.unionAll(function () {

        this.select(G.knex.raw("distinct ON (ifdd.item_id)" + columnas))
                .from("inv_facturas_agrupadas_despacho as ifd")
                .innerJoin('inv_facturas_agrupadas_despacho_d as ifdd', function () {

                    this.on("ifdd.empresa_id", "ifd.empresa_id")
                            .on("ifdd.factura_fiscal", "ifd.factura_fiscal")
                            .on("ifdd.prefijo", "ifd.prefijo");

                })
                .leftOuterJoin('tmp_notas_credito_despachos_clientes as tncdc', function () {

                    this.on("tncdc.empresa_id", "ifd.empresa_id")
                            .on("tncdc.factura_fiscal", "ifd.factura_fiscal")
                            .on("tncdc.prefijo", "ifd.prefijo")
                            .on("tncdc.tipo", G.knex.raw("'" + obj.tipoNota + "'"));

                })
                .leftOuterJoin('tmp_detalles_notas_credito_despachos_clientes as tdncdc', function () {

                    this.on("tdncdc.tmp_nota_credito_despacho_cliente_id", "tncdc.tmp_nota_credito_despacho_cliente_id")
                            .on("tdncdc.item_id", "ifdd.item_id");

                })
                .where('ifd.empresa_id', obj.empresa_id)
                .andWhere('ifd.factura_fiscal', obj.facturaFiscal);
    });


    query.then(function (resultado) {

        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [ConsultarDetalleFacturaCredito]:", err);
        callback(err);
    });
};


/**
 * @author German Galvis
 * +Descripcion Metodo encargado de consultar los detalles de las facturas
 * @fecha 2018-08-08 YYYY-MM-DD
 * @returns callback
 */
NotasModel.prototype.ConsultarDetalleFacturaCreditoDevolucion = function (obj, callback) {

    var columnas = [
        "f.numero",
        "a.factura_fiscal",
        "a.fecha_registro",
        "a.valor_total",
        G.knex.raw("fc_descripcion_producto ( b.codigo_producto ) AS producto"),
        "b.item_id",
        "b.codigo_producto",
        //"b.cantidad",
        "b.lote",
        "b.valor_unitario",
        "b.cantidad_devuelta",
        "e.prefijo as prefijo_devolucion",
        "e.empresa_id as empresa_devolucion",
        "e.numero as numero_devolucion",
        "f.documento_id",
        "g.movimiento_id",
        G.knex.raw("( CASE WHEN g.cantidad IS NULL THEN 0 ELSE CAST ( g.cantidad AS INTEGER ) END ) AS cantidad"),
        G.knex.raw("b.valor_unitario AS valor_digitado_nota")
    ];

    var query = G.knex.select(G.knex.raw("distinct ON (g.movimiento_id)" + columnas))
            .from(G.knex.raw(obj.tabla_1 + " as a"))
            .innerJoin(G.knex.raw(obj.tabla_2 + " as b"), function () {

                this.on("b.empresa_id", "a.empresa_id")
                        .on("b.factura_fiscal", "a.factura_fiscal")
                        .on("b.prefijo", "a.prefijo");

            })
            .innerJoin('inv_bodegas_movimiento_devolucion_cliente as e', function () {

                this.on("e.empresa_id", "a.empresa_id")
                        .on("e.numero_doc_cliente", "a.factura_fiscal")
                        .on("e.prefijo_doc_cliente", "a .prefijo");

            })
            .leftJoin('inv_bodegas_movimiento as f', function () {

                this.on("f.empresa_id", "e.empresa_id")
                        .on("f.numero", "e.numero")
                        .on("f.prefijo", "e.prefijo");

            })
            .rightJoin('inv_bodegas_movimiento_d as g', function () {

                this.on("g.empresa_id", "f.empresa_id")
                        .on("g.numero", "f.numero")
                        .on("g.prefijo", "f.prefijo")
                        .on("g.codigo_producto", "b.codigo_producto")
                        .on("g.lote", "b.lote")
                        .on("g.fecha_vencimiento", "b.fecha_vencimiento")
                        .on(G.knex.raw("g.movimiento_id NOT IN (SELECT DISTINCT ON ( b.movimiento_id ) aa.movimiento_id\
                            FROM inv_bodegas_movimiento_d aa \
                            INNER JOIN " + obj.tabla_4 + " b ON aa.movimiento_id = b.movimiento_id\
                            INNER JOIN " + obj.tabla_3 + " c ON c.nota_credito_despacho_cliente_id = b.nota_credito_despacho_cliente_id \
                            WHERE c.factura_fiscal = a.factura_fiscal)"))
                        .on(G.knex.raw("g.movimiento_id NOT IN (SELECT DISTINCT ON ( b.movimiento_id ) aa.movimiento_id\
                            FROM inv_bodegas_movimiento_d aa \
                            INNER JOIN tmp_detalles_notas_credito_despachos_clientes b ON aa.movimiento_id = b.movimiento_id\
                            INNER JOIN tmp_notas_credito_despachos_clientes c ON c.tmp_nota_credito_despacho_cliente_id = b.tmp_nota_credito_despacho_cliente_id\
                            WHERE c.factura_fiscal = a.factura_fiscal)"));
            })
            .where('a.empresa_id', obj.empresa_id)
            .andWhere('a.factura_fiscal', obj.facturaFiscal);

    query.then(function (resultado) {

        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [ConsultarDetalleFacturaCreditoDevolucion]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de consultar los detalles de las facturas 
 * @fecha 2018-08-06 YYYY-MM-DD
 * @returns callback
 */
NotasModel.prototype.ConsultarDetalleFacturaDebito = function (obj, callback) {



    var columnas = [
        "ifd.factura_fiscal",
        "ifd.fecha_registro",
        "ifd.valor_total",
        G.knex.raw("fc_descripcion_producto ( ifdd.codigo_producto ) AS producto"),
        "ifdd.item_id",
        "ifdd.codigo_producto",
        "ifdd.cantidad",
        "ifdd.lote",
        "ifdd.valor_unitario",
        "tdnddc.tmp_detalle_nota_debito_despacho_cliente_id AS id_nota",
        G.knex.raw("COALESCE ( tdnddc.valor, 0 ) AS valor"),
        "tdnddc.observacion",
        G.knex.raw("(round(( tdnddc.valor / ifdd.cantidad ), 4 )) AS valor_digitado_nota"),
        "tdnddc.valor_iva",
        "ifdd.porc_iva"
    ];

    var query = G.knex.select(G.knex.raw("distinct ON (ifdd.item_id)" + columnas))
            .from("inv_facturas_despacho as ifd")
            .innerJoin('inv_facturas_despacho_d as ifdd', function () {

                this.on("ifdd.empresa_id", "ifd.empresa_id")
                        .on("ifdd.factura_fiscal", "ifd.factura_fiscal")
                        .on("ifdd.prefijo", "ifd.prefijo");

            })
            .leftOuterJoin('tmp_notas_debito_despachos_clientes as tnddc', function () {

                this.on("tnddc.empresa_id", "ifd.empresa_id")
                        .on("tnddc.factura_fiscal", "ifd.factura_fiscal")
                        .on("tnddc.prefijo", "ifd.prefijo");

            })
            .leftOuterJoin('tmp_detalles_notas_debito_despachos_clientes as tdnddc', function () {

                this.on("tdnddc.tmp_nota_debito_despacho_cliente_id", "tnddc.tmp_nota_debito_despacho_cliente_id")
                        .on("tdnddc.item_id", "ifdd.item_id");

            })
            .where('ifd.empresa_id', obj.empresa_id)
            .andWhere('ifd.factura_fiscal', obj.facturaFiscal);


    query.unionAll(function () {

        this.select(G.knex.raw("distinct ON (ifdd.item_id)" + columnas))
                .from("inv_facturas_agrupadas_despacho as ifd")
                .innerJoin('inv_facturas_agrupadas_despacho_d as ifdd', function () {

                    this.on("ifdd.empresa_id", "ifd.empresa_id")
                            .on("ifdd.factura_fiscal", "ifd.factura_fiscal")
                            .on("ifdd.prefijo", "ifd.prefijo");

                })
                .leftOuterJoin('tmp_notas_debito_despachos_clientes as tnddc', function () {

                    this.on("tnddc.empresa_id", "ifd.empresa_id")
                            .on("tnddc.factura_fiscal", "ifd.factura_fiscal")
                            .on("tnddc.prefijo", "ifd.prefijo");

                })
                .leftOuterJoin('tmp_detalles_notas_debito_despachos_clientes as tdnddc', function () {

                    this.on("tdnddc.tmp_nota_debito_despacho_cliente_id", "tnddc.tmp_nota_debito_despacho_cliente_id")
                            .on("tdnddc.item_id", "ifdd.item_id");

                })
                .where('ifd.empresa_id', obj.empresa_id)
                .andWhere('ifd.factura_fiscal', obj.facturaFiscal);
    });

    query.then(function (resultado) {

        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [ConsultarDetalleFacturaDebito]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion agrega nota
 * @fecha 2018-08-06 YYYY-MM-DD
 */
NotasModel.prototype.agregarCabeceraNotaDebito = function (parametros, transaccion, callback) {

    var query = G.knex(parametros.tabla_1).
            returning('nota_debito_despacho_cliente_id').
            insert({empresa_id: parametros.empresaId, prefijo: parametros.prefijo, factura_fiscal: parametros.factura_fiscal,
                valor: parametros.valor, usuario_id: parametros.usuario_id
            });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error agregarCabeceraNotaDebito", err);
        callback(err);
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion agrega nota
 * @fecha 2018-08-13 YYYY-MM-DD
 */
NotasModel.prototype.agregarCabeceraNotaCredito = function (parametros, transaccion, callback) {

    var query = G.knex(parametros.tabla_1).
            returning('nota_credito_despacho_cliente_id').
            insert({empresa_id: parametros.empresaId, prefijo: parametros.prefijo, factura_fiscal: parametros.factura_fiscal,
                valor: parametros.valor, usuario_id: parametros.usuario_id, tipo: parametros.tipoNota, concepto_id: parametros.conceptoId
            });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error agregarCabeceraNotaCredito", err);
        callback(err);
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion agrega nota
 * @fecha 2018-08-13 YYYY-MM-DD
 */
NotasModel.prototype.agregarCabeceraNotaCreditoDevolucion = function (parametros, transaccion, callback) {

    var query = G.knex(parametros.tabla_1).
            returning('nota_credito_despacho_cliente_id').
            insert({empresa_id: parametros.empresaId, prefijo: parametros.prefijo, factura_fiscal: parametros.factura_fiscal,
                valor: parametros.valor, usuario_id: parametros.usuario_id, tipo: parametros.tipoNota,
                empresa_id_devolucion: parametros.empresa_id_devolucion, prefijo_devolucion: parametros.prefijo_devolucion, numero_devolucion: parametros.numero_devolucion
            });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error agregarCabeceraNotaCreditoDevolucion", err);
        callback(err);
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion agrega nota
 * @fecha 2018-08-06 YYYY-MM-DD
 */
NotasModel.prototype.agregarDetalleNotaDebito = function (parametros, transaccion, callback) {


    var query = G.knex(parametros.tabla_2).
            insert({nota_debito_despacho_cliente_id: parametros.nota_debito_despacho_cliente_id, item_id: parametros.item_id, valor: parametros.valor,
                observacion: parametros.observacion, valor_iva: parametros.valor_iva, valor_rtf: parametros.valor_rtf,
                valor_ica: parametros.valor_ica
            });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error agregarDetalleNotaDebito", err);
        callback(err);
    }).done();


};

/**
 * @author German Galvis
 * +Descripcion agrega detalle nota
 * @fecha 2018-08-13 YYYY-MM-DD
 */
NotasModel.prototype.agregarDetalleNotaCredito = function (parametros, transaccion, callback) {


    var query = G.knex(parametros.tabla_2).
            insert({nota_credito_despacho_cliente_id: parametros.nota_credito_despacho_cliente_id, item_id: parametros.item_id, valor: parametros.valor,
                observacion: parametros.observacion, valor_iva: parametros.valor_iva, valor_rtf: parametros.valor_rtf,
                valor_ica: parametros.valor_ica, movimiento_id: parametros.movimiento_id
            });

    if (transaccion)
        query.transacting(transaccion);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("Error agregarDetalleNotaCredito", err);
        callback(err);
    }).done();


};


/**
 * @author German Galvis
 * +Descripcion Metodo encargado de listar la empresa
 * @fecha 2018-08-10 YYYY-MM-DD
 * @returns {callback}
 */
NotasModel.prototype.listarEmpresa = function (obj, callback) {

    var columna = [
        "a.id",
        "a.razon_social",
        "a.direccion",
        "a.telefonos",
        "a.tipo_id_tercero",
        "b.departamento	",
        "c.municipio"
    ];

    var query = G.knex.select(columna)
            .from('empresas as a')
            .innerJoin('tipo_dptos as b',
                    function () {
                        this.on("b.tipo_pais_id", "a.tipo_pais_id")
                                .on("b.tipo_dpto_id", "a.tipo_dpto_id")
                    })
            .innerJoin('tipo_mpios as c',
                    function () {
                        this.on("c.tipo_pais_id", "a.tipo_pais_id")
                                .on("c.tipo_dpto_id", "a.tipo_dpto_id")
                                .on("c.tipo_mpio_id", "a.tipo_mpio_id")
                    }).where("empresa_id", obj.empresaId);

    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit);


    query.then(function (resultado) {
        callback(false, resultado);

    }).catch(function (err) {
        console.log("err [listarEmpresa]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de listar los productos de la nota debito
 * @fecha 2018-08-10 YYYY-MM-DD
 * @returns {callback}
 */
NotasModel.prototype.consultarProductosNotasDebito = function (parametros, callback) {

    var columna = [
        "dnddc.detalle_nota_debito_despacho_cliente_id",
        "ifdd.codigo_producto",
        G.knex.raw("fc_descripcion_producto ( ifdd.codigo_producto ) AS descripcion"),
        "ifdd.item_id",
        "ifdd.cantidad",
        "ifdd.porc_iva",
        G.knex.raw("(dnddc.valor * (ifdd.porc_iva/100)) AS iva_total"),
        G.knex.raw("(dnddc.valor/ ifdd.cantidad) AS valor_unitario"),
        "dnddc.valor as subtotal",
        "b.sw_medicamento",
        "b.sw_insumos",
        "dnddc.valor_iva",
        "dnddc.valor_rtf",
        "dnddc.valor_ica",
        "dnddc.observacion"
    ];

    var query = G.knex.select(columna)
            .from(G.knex.raw(parametros.tabla_3 + " as dnddc"))
            .innerJoin(G.knex.raw(parametros.tabla_4 + " as ifdd"), function () {

                this.on("ifdd.item_id", "dnddc.item_id");

            })
            .innerJoin("inventarios_productos as a", "a.codigo_producto", "ifdd.codigo_producto")
            .innerJoin("inv_grupos_inventarios as b", "b.grupo_id", "a.grupo_id ")
            .where("dnddc.nota_debito_despacho_cliente_id", parametros.numeroNota);

    query.then(function (resultado) {
        callback(false, resultado);

    }).catch(function (err) {
        console.log("err [consultarProductosNotasDebito]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de listar los productos de la nota credito
 * @fecha 2018-08-13 YYYY-MM-DD
 * @returns {callback}
 */
NotasModel.prototype.consultarProductosNotasCredito = function (parametros, callback) {

    var columna = [
        "dncdc.detalle_nota_credito_despacho_cliente_id",
        "ifdd.codigo_producto",
        G.knex.raw("fc_descripcion_producto ( ifdd.codigo_producto ) AS descripcion"),
        "ibmd.cantidad AS cantidad_devuelta",
        "ifdd.item_id",
        "ifdd.porc_iva",
        G.knex.raw("CASE WHEN ibmd.cantidad IS NULL THEN\
        ifdd.cantidad ELSE ibmd.cantidad END AS cantidad"),
        G.knex.raw("CASE WHEN ibmd.cantidad IS NULL THEN\
        (dncdc.valor / ifdd.cantidad ) ELSE (dncdc.valor / ibmd.cantidad ) END AS valor_unitario"),
        G.knex.raw("(dncdc.valor * (ifdd.porc_iva/100)) AS iva_total"),
        "dncdc.valor as subtotal",
        "b.sw_medicamento",
        "b.sw_insumos",
        "dncdc.valor_iva",
        "dncdc.valor_rtf",
        "dncdc.valor_ica",
        "c.costo",
        G.knex.raw("( ifdd.cantidad_devuelta * C.costo ) AS total_costo"),
        "dncdc.observacion"
    ];

    var query = G.knex.select(columna)
            .from(G.knex.raw(parametros.tabla_3 + " as dncdc"))
            .innerJoin(G.knex.raw(parametros.tabla_4 + " as ifdd"), function () {

                this.on("ifdd.item_id", "dncdc.item_id");

            })
            .leftJoin("inv_bodegas_movimiento_d as ibmd", "ibmd.movimiento_id", "dncdc.movimiento_id")
            .innerJoin("inventarios_productos as a", "a.codigo_producto", "ifdd.codigo_producto")
            .innerJoin("inv_grupos_inventarios as b", "b.grupo_id", "a.grupo_id ")
            .innerJoin("inventarios as c", function () {

                this.on("c.codigo_producto", "ifdd.codigo_producto")
                        .on("c.empresa_id", "ifdd.empresa_id");

            })
            .where("dncdc.nota_credito_despacho_cliente_id", parametros.numeroNota);
    
    console.log("Query resultado", G.sqlformatter.format(
               query.toString()));

    query.then(function (resultado) {
        callback(false, resultado);

    }).catch(function (err) {
        console.log("err [consultarProductosNotasCredito]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de traer la informacion del tercero
 * @fecha 2018-08-10 YYYY-MM-DD
 * @returns {callback}
 */
NotasModel.prototype.clienteNota = function (parametros, callback) {

    var columna = [
        G.knex.raw("CAST(ifd.fecha_registro AS date) AS fecha_registro"),
        G.knex.raw("CAST(nddc.fecha_registro AS date) AS fecha_registro_nota"),
        "T.tipo_id_tercero",
        "T.tercero_id",
        "T.direccion",
        "T.telefono",
        "T.nombre_tercero",
        "ifd.factura_fiscal",
        "ifd.prefijo",
        G.knex.raw("to_char(ifd.fecha_registro, 'yyyy') as anio_factura"),
        "ifd.porcentaje_rtf",
        "ifd.porcentaje_reteiva",
        "ifd.empresa_id",
        "ifd.porcentaje_ica"
    ];

    var query = G.knex.select(columna)
            .from(G.knex.raw(parametros.tabla_1 + " as nddc"))
            .innerJoin(G.knex.raw(parametros.tabla_2 + " as ifd"), function () {

                this.on("ifd.empresa_id", "nddc.empresa_id")
                        .on("ifd.factura_fiscal", "nddc.factura_fiscal")
                        .on("ifd.prefijo", "nddc.prefijo");


            })
            .innerJoin("terceros as T", function () {

                this.on("T.tipo_id_tercero", "ifd.tipo_id_tercero")
                        .on("T.tercero_id", "ifd.tercero_id");


            })
            .where("nddc.nota_debito_despacho_cliente_id", parametros.numeroNota);

    query.then(function (resultado) {
        callback(false, resultado);

    }).catch(function (err) {
        console.log("err [clienteNota]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de traer la informacion del tercero para nota credito
 * @fecha 2018-08-13 YYYY-MM-DD
 * @returns {callback}
 */
NotasModel.prototype.clienteNotaCredito = function (parametros, callback) {

    var columna = [
        "ncdc.tipo",
        G.knex.raw("CAST(ifd.fecha_registro AS date) AS fecha_registro"),
        G.knex.raw("CAST(ncdc.fecha_registro AS date) AS fecha_registro_nota"),
        "T.tipo_id_tercero",
        "T.tercero_id",
        "T.direccion",
        "T.telefono",
        "T.nombre_tercero",
        "ifd.factura_fiscal",
        "ifd.prefijo",
        G.knex.raw("to_char(ifd.fecha_registro, 'yyyy') as anio_factura"),
        "ifd.porcentaje_rtf",
        "ifd.porcentaje_reteiva",
        "ifd.empresa_id",
        "ifd.porcentaje_ica",
        "ncdc.concepto_id",
        "c.descripcion AS descripcion_concepto",
        "ncdc.descripcion AS descripcion_nota"
    ];

    var query = G.knex.select(columna)
            .from(G.knex.raw(parametros.tabla_1 + " as ncdc"))
            .innerJoin(G.knex.raw(parametros.tabla_2 + " as ifd"), function () {

                this.on("ifd.empresa_id", "ncdc.empresa_id")
                        .on("ifd.factura_fiscal", "ncdc.factura_fiscal")
                        .on("ifd.prefijo", "ncdc.prefijo");


            })
            .innerJoin("terceros as T", function () {

                this.on("T.tipo_id_tercero", "ifd.tipo_id_tercero")
                        .on("T.tercero_id", "ifd.tercero_id");


            })
            .leftJoin("concepto_nota as c", "c.id", "ncdc.concepto_id ")
            .where("ncdc.nota_credito_despacho_cliente_id", parametros.numeroNota);


    query.then(function (resultado) {
        callback(false, resultado);

    }).catch(function (err) {
        console.log("err [clienteNotaCredito]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de traer los conceptos
 * @fecha 2018-08-11 YYYY-MM-DD
 * @returns {callback}
 */
NotasModel.prototype.listarConceptos = function (callback) {

    var query = G.knex.select()
            .from('concepto_nota')
            .where('sw_mostrar', '1')
            .orderBy('id');

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarConceptos]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de traer el concepto de la nota
 * @fecha 2018-08-14 YYYY-MM-DD
 * @returns {callback}
 */
NotasModel.prototype.obtenerConceptoPorNota = function (nota, callback) {

    var columna = [
        "a.concepto_id AS id",
        "b.descripcion",
        "b.naturaleza",
        "b.cuenta"
    ];
    var query = G.knex.select(columna)
            .from("notas_credito_despachos_clientes as a")
            .innerJoin("concepto_nota as b", "b.id", "a.concepto_id ")
            .where('a.nota_credito_despacho_cliente_id', nota);

    query.unionAll(function () {
        this.select(columna)
                .from("notas_credito_despachos_clientes_agrupados as a")
                .innerJoin("concepto_nota as b", "b.id", "a.concepto_id ")
                .where('a.nota_credito_despacho_cliente_id', nota);
    });

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [obtenerConceptoPorNota]:", err);
        callback(err);
    });
};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de traer el concepto de la nota
 * @fecha 2018-08-14 YYYY-MM-DD
 * @returns {callback}
 */
NotasModel.prototype.porcentajes = function (obj, callback) {

    var columna = [
        "porcentaje_rtf",
        "porcentaje_ica",
        "porcentaje_reteiva"

    ];
    var query = G.knex.select(columna)
            .from(G.knex.raw(obj.tabla_2))
            .where('factura_fiscal', obj.factura_fiscal)
            .andWhere('prefijo', obj.prefijo);

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [porcentajes]:", err);
        callback(err);
    });
};


/**
 * @author German Galvis
 * @fecha 2018-08-14 YYYY-MM-DD
 * +Descripcion Modelo encargado de consultar las retenciones segun la empresa
 */
NotasModel.prototype.consultarParametrosRetencion = function (obj, callback) {

    var query = G.knex.select('*')
            .from('vnts_bases_retenciones')
            .where(function () {
                this.andWhere("estado", '1')
                        .andWhere("anio", obj.fecha)
                        .andWhere("empresa_id", obj.empresaId);
            });

    query.then(function (resultado) {
        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [consultarParametrosRetencion]:", err);
        callback({err: err, msj: "Error al consultar los parametros de retencion"});
    });

};

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de actualizar la factura deacuerdo a la nota debito
 * @fecha 2018-08-13 YYYY-MM-DD
 * @returns {callback}
 */
NotasModel.prototype.actualizarFacturaNotaDebito = function (parametros, transaccion, callback) {

    var query = G.knex(G.knex.raw(parametros.tabla_3))
            .where('empresa_id', parametros.empresaId)
            .andWhere('factura_fiscal', parametros.factura_fiscal)
            .andWhere('prefijo', parametros.prefijo)
            .update({
                valor_notadebito: G.knex.raw('valor_notadebito +' + parametros.total),
                saldo: G.knex.raw('saldo +' + parametros.total)
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
 * +Descripcion Metodo encargado de actualizar la factura deacuerdo a la nota credito
 * @fecha 2018-08-13 YYYY-MM-DD
 * @returns {callback}
 */
NotasModel.prototype.actualizarFacturaNotaCredito = function (parametros, transaccion, callback) {

    var query = G.knex(G.knex.raw(parametros.tabla_3))
            .where('empresa_id', parametros.empresaId)
            .andWhere('factura_fiscal', parametros.factura_fiscal)
            .andWhere('prefijo', parametros.prefijo)
            .update({
                valor_notacredito: G.knex.raw('valor_notacredito +' + parametros.total),
                saldo: G.knex.raw('saldo -' + parametros.total)
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
 * +Descripcion Metodo encargado de consultar los productos de las facturas 
 * @fecha 2018-08-18 YYYY-MM-DD
 * @returns callback
 */
NotasModel.prototype.ConsultarSubtotalFactura = function (obj, callback) {



    var columnas = [
        G.knex.raw("SUM ((a.valor_unitario * a.cantidad)) as subtotal")
    ];

    var query = G.knex.select(columnas)
            .from(G.knex.raw(obj.tabla_2 + " as b"))
            .innerJoin(G.knex.raw(obj.tabla_4 + " as a"), function () {

                this.on("a.empresa_id", "b.empresa_id")
                        .on("a.factura_fiscal", "b.factura_fiscal")
                        .on("a.prefijo", "b.prefijo");

            })
            .where('a.empresa_id', obj.empresa_id)
            .andWhere('a.prefijo', obj.prefijo)
            .andWhere('a.factura_fiscal', obj.factura_fiscal);

    query.then(function (resultado) {

        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [ConsultarSubtotalFactura]:", err);
        callback(err);
    });
};

NotasModel.$inject = [];
module.exports = NotasModel;