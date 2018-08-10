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
                    this.andWhere(G.knex.raw("ifd.factura_fiscal  " + G.constants.db().LIKE + "'%" + obj.facturaFiscal + "%'"))
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
                        this.andWhere(G.knex.raw("ifd.factura_fiscal  " + G.constants.db().LIKE + "'%" + obj.facturaFiscal + "%'"))
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
        "ifd.fecha_registro",
        "ifd.valor_total",
        "ifd.saldo",
        "nddc.nota_debito_despacho_cliente_id AS numero",
        "nddc.valor AS valor_nota",
        "nddc.fecha_registro AS fecha_registro_nota",
        G.knex.raw("0 AS tipo_factura"),
        "a.estado",
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
        "ifd.fecha_registro",
        "ifd.valor_total",
        "ifd.saldo",
        "nddc.nota_debito_despacho_cliente_id AS numero",
        "nddc.valor AS valor_nota",
        "nddc.fecha_registro AS fecha_registro_nota",
        G.knex.raw("1 AS tipo_factura"),
        "a.estado",
        G.knex.raw("CASE WHEN a.estado = 0 THEN\
	'Sincronizado' ELSE'NO sincronizado'\
	END AS descripcion_estado")
    ];

    var query = G.knex.select(columna_a)
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
            .where(function () {

                this.andWhere('ifd.empresa_id', obj.empresa_id);

                if (obj.tipoConsulta !== undefined && obj.tipoConsulta === 'F') {
                    this.andWhere('ifd.factura_fiscal', obj.numero);
                }

                if (obj.tipoConsulta !== undefined && obj.tipoConsulta === 'ND') {
                    this.andWhere('nddc.nota_debito_despacho_cliente_id', obj.numero);
                }
            });


    query.unionAll(function () {

        this.select(columna_b)
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
                .where(function () {

                    this.andWhere('ifd.empresa_id', obj.empresa_id);

                    if (obj.tipoConsulta !== undefined && obj.tipoConsulta === 'F') {
                        this.andWhere('ifd.factura_fiscal', obj.numero);
                    }

                    if (obj.tipoConsulta !== undefined && obj.tipoConsulta === 'ND') {
                        this.andWhere('nddc.nota_debito_despacho_cliente_id', obj.numero);
                    }

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
        "ifd.fecha_registro",
        "ifd.valor_total",
        "ifd.saldo",
        "ncdc.nota_credito_despacho_cliente_id AS numero",
        "ncdc.valor AS valor_nota",
        "ncdc.tipo AS tipo_nota",
        "ncdc.fecha_registro AS fecha_registro_nota",
        G.knex.raw("0 AS tipo_factura"),
        "a.estado",
        G.knex.raw("CASE WHEN a.estado = 0 THEN\
	'Sincronizado' ELSE'NO sincronizado'\
	END AS descripcion_estado"),
        "b.descripcion AS descripcion_concepto"
    ];

    var columna_b = [
        "ifd.factura_fiscal",
        "ifd.prefijo",
        "T.tipo_id_tercero",
        "T.tercero_id",
        "T.nombre_tercero",
        "ifd.fecha_registro",
        "ifd.valor_total",
        "ifd.saldo",
        "ncdc.nota_credito_despacho_cliente_id AS numero",
        "ncdc.valor AS valor_nota",
        "ncdc.tipo AS tipo_nota",
        "ncdc.fecha_registro AS fecha_registro_nota",
        G.knex.raw("1 AS tipo_factura"),
        "a.estado",
        G.knex.raw("CASE WHEN a.estado = 0 THEN\
	'Sincronizado' ELSE'NO sincronizado'\
	END AS descripcion_estado"),
        "b.descripcion AS descripcion_concepto"
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

                if (obj.tipoConsulta !== undefined && obj.tipoConsulta === 'F') {
                    this.andWhere('ifd.factura_fiscal', obj.numero);
                }

                if (obj.tipoConsulta !== undefined && obj.tipoConsulta === 'NC') {
                    this.andWhere('ncdc.nota_credito_despacho_cliente_id', obj.numero);
                }
            });


    query.unionAll(function () {

        this.select(columna_b)
                .from("inv_facturas_agrupadas_despacho as ifd")
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

                    if (obj.tipoConsulta !== undefined && obj.tipoConsulta === 'F') {
                        this.andWhere('ifd.factura_fiscal', obj.numero);
                    }

                    if (obj.tipoConsulta !== undefined && obj.tipoConsulta === 'NC') {
                        this.andWhere('ncdc.nota_credito_despacho_cliente_id', obj.numero);
                    }
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
        "tdnddc.valor_iva"
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
//
///*
// * Autor : Andres Mauricio Gonzalez
// * Descripcion : SQL encargado de eliminar los conceptos tmp_detalle_conceptos
// * @fecha: 08/06/2015 2:43 pm
// */
//NotasModel.prototype.eliminarTmpDetalleConceptos = function(obj, callback) {
//
//    var query = G.knex('tmp_detalle_conceptos')
//	.where('rc_concepto_id', obj.rc_concepto_id)
//	.del();
//
//	query.then(function(resultado) {
//
//	callback(false, resultado);
//	
//    }). catch (function(err) {
//        console.log("err (/catch) [eliminarTmpDetalleConceptos]: ", err);
//        callback({err: err, msj: "Error al eliminar los temporales"});
//    });
//};
//
///**
// * +Descripcion Metodo encargado de bloquear la tabla documentos
// * @returns {callback}
// */
//NotasModel.prototype.bloquearTablaDocumentos = function(transaccion, callback) {
//
//    var sql = "LOCK TABLE documentos IN ROW EXCLUSIVE MODE ;";
//
//    var query = G.knex.raw(sql);
//
//    if (transaccion)
//	query.transacting(transaccion);
//   
//	query.then(function(resultado) {
//        callback(false, resultado);
//    }). catch (function(err) {
//        console.log("err (/catch) [bloquearTabla documentos]: ", err);
//        callback(err);
//    });
//
//};
//
///**
// * +Descripcion Metodo encargado de consultar documentos e incrementar en uno
// * @returns {undefined}
// */
//NotasModel.prototype.numeracionDocumento= function(obj,transaccion, callback) {
//
//    var query = G.knex('documentos')
//	.where('documento_id', obj.documentoId)
//	.returning(['numeracion','prefijo'])
//	.increment('numeracion', 1);
//    
//   if (transaccion)
//	query.transacting(transaccion);   
//    
//	query.then(function(resultado) {
//	    callback(false, resultado);
//	}). catch (function(err) {
//	    console.log("err (/catch) [numeracionDocumento]: ", err);
//	    callback("Error al actualizar el tipo de formula");
//	});
//};
//
//
///**
// * +Descripcion Metodo encargado de registrar en la tabla fac_facturas
//
// * @param {type} transaccion
// * @param {type} callback
// * @returns {undefined}
// */
//NotasModel.prototype.insertarFacFacturas = function(parametros,transaccion, callback) {
//    
//    var parametro={
//	empresa_id : parametros.empresaId, 
//	prefijo :  parametros.prefijo, 
//	factura_fiscal : parametros.factura, 
//	estado : parametros.estado, 
//	usuario_id : parametros.usuarioId, 
//	fecha_registro : 'now()', 
//	tipo_id_tercero : parametros.tipoIdTercero, 
//	tercero_id : parametros.terceroId, 
//	sw_clase_factura : parametros.swClaseFactura,
//	documento_id : parametros.documentoId, 
//	tipo_factura : parametros.tipoFactura, 
//	centro_utilidad : parametros.centroUtilidad
//    };
//        
//    var query = G.knex('fac_facturas').insert(parametro);
//
//   if (transaccion)
//	query.transacting(transaccion); 
//	query.then(function(resultado) {
//        
//	callback(false, resultado);
//	
//    }). catch (function(err) {
//        console.log("err (/catch) [insertarFacFacturas]: ", err);
//        callback({err: err, msj: "Error al guardar en insertarFacFacturas]"});
//    });
//};
//
///**
// * +Descripcion Metodo encargado de registrar en la tabla tmp_detalle_conceptos
//
// * @param {type} transaccion
// * @param {type} callback
// * @returns {undefined}
// */
//NotasModel.prototype.insertarFacFacturasConceptos = function(parametro,transaccion,callback) {
//
//    var parametros = {
//		    empresa_id : parametro.empresaId,
//		    prefijo : parametro.prefijo,
//		    factura_fiscal : parametro.facturaFiscal,
//		    sw_tipo : parametro.swTipo,
//		    cantidad : parametro.cantidad,
//		    precio : parametro.precio,
//		    valor_total : parametro.valorTotal,
//		    porcentaje_gravamen : parametro.porcentajeGravamen,
//		    valor_gravamen : parametro.valorGravamen,
//		    concepto : parametro.descripcion,
//		    caja_id :  parametro.cajaId
//    };
//
//    var query = G.knex('fac_facturas_conceptos')
//	.insert(parametros)
//	.returning(['fac_factura_concepto_id']);
//
//     if (transaccion)
//        query.transacting(transaccion); 
//    
//	query.then(function(resultado) {
//       
//        callback(false, resultado);
//    }). catch (function(err) {
//        console.log("err (/catch) [insertarFacFacturasConceptos]: ", err);
//        callback({err: err, msj: "Error al guardar la factura conceptos]"});
//    });
//};
//
///**
// * +Descripcion Metodo encargado de registrar en la tabla fac_facturas_conceptos_notas
//
// * @param {type} transaccion
// * @param {type} callback
// * @returns {undefined}
// */
//NotasModel.prototype.insertarFacFacturasConceptosNotas = function(parametro,transaccion,callback) {
//
//    var parametros = {
//		    documento_id : parametro.documentoId,
//		    prefijo : parametro.prefijo,
//		    factura_fiscal : parametro.facturaFiscal,
//		    sw_contable : parametro.swContable,
//		    valor_nota_total : parametro.valorNotaTotal,
//		    valor_gravamen : parametro.porcentajeGravamen,
//		    descripcion : parametro.descripcion,
//		    usuario_id : parametro.usuarioId,
//		    fecha_registro : 'now()',
//		    empresa_id : parametro.empresaId,
//		    prefijo_nota : parametro.prefijoNota,
//		    numero_nota : parametro.numeroNota,
//	            bodega: parametro.bodega
//    };
//    var query = G.knex('fac_facturas_conceptos_notas') 
//	//.returning(['fac_facturas_conceptos_notas_id'])
//	.insert(parametros);
//
//     if(transaccion)
//        query.transacting(transaccion);  
//    
//	query.then(function(resultado) {
//        callback(false, resultado);
//    }). catch (function(err) {
//        console.log("err (/catch) [insertarFacFacturasConceptosNotas]: ", err);
//        callback({err: err, msj: "Error al guardar la factura conceptos Notas]"});
//    });
//};
//
///**
// * +Descripcion Metodo encargado de registrar la direccion ip en el 
//
// * @param {type} transaccion
// * @param {type} callback
// * @returns {undefined}
// */
//NotasModel.prototype.insertarPcFactura = function(parametro,transaccion, callback){
//   
//    var parametros = {ip: parametro.direccionIp,
//            prefijo: parametro.prefijo,
//            factura_fiscal: parametro.factura,
//            sw_tipo_factura : parametro.swTipoFactura,
//            fecha_registro: G.knex.raw('now()'),
//            empresa_id: parametro.empresaId
//            };
//        
//    var query = G.knex('pc_factura_clientes').insert(parametros);
//    
//    if(transaccion)
//        query.transacting(transaccion);   
//    
//        query.then(function(resultado){   
//        callback(false, resultado);
//        }).catch(function(err){    
//        callback({err:err, msj: "Error al guardar la insertarPcFactura"});   
//        });
//};
//
///**
// * +Descripcion Metodo encargado de registrar en la tabla tmp_detalle_conceptos
// * @returns {callback}
// */
//NotasModel.prototype.insertarFacFacturasConceptosDc = function(parametro,transaccion,callback) {
//
//    var parametros = {
//		    empresa_id : parametro.empresaId,
//		    fac_factura_concepto_id: parametro.id,	    
//		    concepto_id : parametro.concepto,
//		    grupo_concepto :  parametro.grupoConceptoId
//    };
//
//    var query = G.knex('fac_facturas_conceptos_dc')
//	        .insert(parametros);
//     if (transaccion)
//        query.transacting(transaccion); 
//    
//	query.then(function(resultado) {
//       
//        callback(false, resultado);
//    }). catch (function(err) {
//        console.log("err (/catch) [insertarFacFacturasConceptosDc]: ", err);
//        callback({err: err, msj: "Error al guardar la factura conceptos dc]"});
//    });
//};
///**
// * +Descripcion Metodo encargado de registrar en la tabla tmp_detalle_conceptos
// * @returns {undefined}
// */
//NotasModel.prototype.insertarFacturasContado = function(parametro,transaccion,callback) {
//
//    var parametros = {
//		    empresa_id : parametro.empresaId,
//		    factura_fiscal: parametro.factura,	    
//		    centro_utilidad : parametro.centroUtilidad,
//		    prefijo : parametro.prefijo,
//		    total_abono : parametro.totalAbono,
//		    total_efectivo : parametro.totalEfectivo,
//		    total_cheques : parametro.totalCheque,
//		    total_tarjetas : parametro.totalTarjeta,
//		    total_bonos : parametro.totalAbonos,
//		    estado : '0',
//		    tipo_id_tercero : parametro.tipoIdTercero,
//		    tercero_id : parametro.terceroId,
//		    fecha_registro : G.knex.raw('now()'),
//		    usuario_id : parametro.usuarioId,
//		    caja_id : parametro.cajaId
//    };
//   
//    var query = G.knex('fac_facturas_contado')
//	        .insert(parametros);
//     if (transaccion)
//        query.transacting(transaccion); 
//    
//	query.then(function(resultado) {
//       
//        callback(false, resultado);
//    }). catch (function(err) {
//        console.log("err (/catch) [insertarFacturasContado]: ", err);
//        callback({err: err, msj: "Error al guardar Facturas Contado]"});
//    });
//};
//
///**
// * +Descripcion Metodo encargado de actualizar fac_facturas total_factura
// * @returns {callback}
// */
//NotasModel.prototype.actualizarTotalesFacturas= function(obj,transaccion, callback) {
//
//    var query = G.knex('fac_facturas')
//		.where('empresa_id', obj.empresaId)
//		.andWhere('prefijo', obj.prefijo)
//		.andWhere('factura_fiscal', obj.factura)
//		.update({
//		    total_factura:obj.totalFactura,
//		    gravamen:obj.totalGravamen
//		});		
//     if (transaccion)
//        query.transacting(transaccion); 
//    
//	query.then(function(resultado){ 
//	callback(false, resultado);
//	
//    }).catch(function(err){    
//       console.log("err (/catch) [actualizarTotalesFacturas]: ", err);
//       callback("Error al actualizar fac_facturas");  
//    });
//};
//
///**
// * +Descripcion Metodo encargado de actualizar fac_facturas impuestos
// * @returns {callback}
// */
//NotasModel.prototype.actualizarImpuestoFacturas= function(obj,transaccion, callback) {
//
//    var query = G.knex('fac_facturas')
//		.where('empresa_id', obj.empresaId)
//		.andWhere('prefijo', obj.prefijo)
//		.andWhere('factura_fiscal', obj.factura)
//		.update({
//		    porcentaje_rtf:obj.porcentajeRtf,
//		    porcentaje_ica:obj.porcentajeIca,
//		    porcentaje_reteiva:obj.porcentajeReteiva,
//		    porcentaje_cree:obj.porcentajeCree
//		});
//		
//    if (transaccion)
//        query.transacting(transaccion); 
//    
//	query.then(function(resultado){ 
//       callback(false, resultado);
//    }).catch(function(err){    
//       console.log("err (/catch) [actualizarImpuestoFacturas]: ", err);
//       callback("Error al actualizar fac_facturas");  
//    });
//};
///**
// * +Descripcion Metodo encargado de actualizar saldos de la factura este solo se invoca 
// * porque realmente el que actualiza el saldo es el triger
// * @returns {callback}
// */
//NotasModel.prototype.actualizarSaldoFacturas= function(obj,transaccion, callback) {
//
//    var query = G.knex('fac_facturas')
//		.where('empresa_id', obj.empresaId)
//		.andWhere('prefijo', obj.prefijo)
//		.andWhere('factura_fiscal', obj.facturaFiscal)
//		.increment('saldo',obj.saldo);
//		
//    if (transaccion)
//        query.transacting(transaccion); 
//    
//	query.then(function(resultado){ 	    
//        callback(false, resultado);
//    }).catch(function(err){    
//        console.log("err (/catch) [actualizarImpuestoFacturas]: ", err);
//        callback("Error al actualizar fac_facturas");  
//    });
//};
//
//
///*
// * Autor : Andres Mauricio Gonzalez
// * Descripcion : SQL encargado de eliminar los conceptos tmp_detalle_conceptos
// * @fecha: 08/06/2015 2:43 pm
// */
//NotasModel.prototype.eliminarTmpDetalleConceptosTerceros = function(obj,transaccion, callback) {
//
//    var query = G.knex('tmp_detalle_conceptos')
//		.where('tipo_id_tercero', obj.tipoIdTercero)
//		.where('tercero_id', obj.terceroId)
//		.where('empresa_id', obj.empresaId)
//		.del();
//    
//     if (transaccion)
//        query.transacting(transaccion); 
//    
//	query.then(function(resultado) {	    
//        callback(false, resultado);
//    }). catch (function(err) {
//        console.log("err (/catch) [eliminarTmpDetalleConceptosTerceros]: ", err);
//        callback({err: err, msj: "Error al eliminar los temporales por terceros"});
//    });
//};
//
///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion Metodo encargado de listar los Conceptos
// * @fecha 2017-06-02 YYYY-MM-DD
// * @returns {callback}
// */
//NotasModel.prototype.listarEmpresa = function(obj, callback) {
//
//    var columna = [
//        "a.id",
//        "a.razon_social",
//        "a.direccion",
//        "a.telefonos",
//        "a.tipo_id_tercero",
//        "b.departamento	",
//        "c.municipio"
//    ];
//
//    var query = G.knex.select(columna)
//            .from('empresas as a')
//            .innerJoin('tipo_dptos as b',
//            function() {
//                this.on("b.tipo_pais_id", "a.tipo_pais_id")
//                    .on("b.tipo_dpto_id", "a.tipo_dpto_id")
//            })
//            .innerJoin('tipo_mpios as c',
//            function() {
//                this.on("c.tipo_pais_id", "a.tipo_pais_id")
//                    .on("c.tipo_dpto_id", "a.tipo_dpto_id")
//                    .on("c.tipo_mpio_id", "a.tipo_mpio_id")
//            }).where("empresa_id", obj.empresaId);
//
//	query.limit(G.settings.limit).
//            offset((obj.paginaActual - 1) * G.settings.limit);
//	query.then(function(resultado) {
//        callback(false, resultado);
//	
//    }). catch (function(err) {
//        console.log("err [listarGrupos]:", err);
//        callback(err);
//    });
//};

NotasModel.$inject = [];

module.exports = NotasModel;