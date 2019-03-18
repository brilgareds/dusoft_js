var SincronizacionDocumentosModel = function () {

};

SincronizacionDocumentosModel.prototype.listarPrefijos = function (obj, callback) {
    console.log('entro en el modelo!', obj);
    var data = {prefijos: '', prefijosFiltrados: ''};

    var query = G.knex
        .distinct('a.prefijo', 'a.tipo_doc_general_id', 'a.texto1')
        .select()
        .from('documentos as a')
        .where('a.empresa_id', obj.empresaId)
        .orderBy('a.prefijo');
    query.then(function (resultado) {
        data.prefijos = resultado;
        var query = G.knex
            .distinct('a.prefijo', 'a.tipo_doc_general_id', 'a.texto1')
            .select()
            .from('documentos as a')
            .innerJoin('documentos_cuentas as b', 'a.prefijo', 'b.prefijo')
            .where('a.empresa_id', obj.empresaId)
            .orderBy('a.prefijo');
        query.then(function (resultado) {
            data.prefijosFiltrados = resultado;
            callback(false, data);
        }).catch(function (err) {
            console.log("error sql", err);
            callback(err);
        })
    }).catch(function (err) {
        console.log("error sql", err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.listarFacturas = function (obj, callback) {
    console.log('In model of "buscarServicio"');

    var query = G.knex.distinct([
        'pm.parametrizacion_ws_fi_id as id',
        'pm.nombre as descripcion'])
        .select()
        .from('documentos_cuentas as dc')
        .innerJoin('parametrizacion_ws_fi as pm', 'dc.parametrizacion_ws_fi', 'pm.parametrizacion_ws_fi_id')
        .where('dc.empresa_id', obj.empresaId)
        .andWhere('dc.centro_id', obj.centroId)
        .andWhere('dc.bodega_id', obj.bodegaId)
        .andWhere('dc.prefijo', obj.prefijoId);

    console.log('SQL en buscarServicio ', G.sqlformatter.format(query.toString()));

    query.then(function (resultado) {
        console.log('Sql fine in Model buscarServicio!');
        //data.serviciosFiltrados = resultado;
        callback(false, resultado[0]);
    }).catch(function (err) {
        console.log("error sql in buscarServicio!", err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.listarEncabezadoReciboRCC = function (obj, callback) {
    console.log('In model "listarEncabezadoReciboRCC" : ', obj);

    let query = G.knex.column('RC.*',
        G.knex.raw("TO_CHAR(\"RC\".\"fecha_registro\", 'DD-MM-YYYY') as fecha_registro"))
        .select()
        .from('recibos_caja as RC')
        .where('RC.recibo_caja', obj.facturaFiscal)
        .andWhere('RC.prefijo', obj.prefijo);

    console.log('Query is: ', G.sqlformatter.format(query.toString()));

    query.then(function (resultado) {
        console.log('encabezado fine!!');

        if (resultado[0] !== undefined) {
            let encabezado = resultado[0];

            let query = G.knex.select()
                .from('parametrizacion_ws_fi')
                .where({
                    parametrizacion_ws_fi_id: obj.wsFi
                });
            query.then(function (result) {
                console.log('Consulta encabezado parametrizado fine: ', result);

                let encabezadoParametrizado = result[0];

                let response = [{
                    coddocumentoencabezado: encabezadoParametrizado.coddocumentoencabezado,
                    codempresa: encabezadoParametrizado.codempresa,
                    estadoencabezado: encabezadoParametrizado.estadoencabezado,
                    fecharegistroencabezado: encabezado.fecha_registro,
                    identerceroencabezado: encabezado.documento_id,
                    numerodocumentoencabezado: encabezado.numerodocumentoencabezado,
                    observacionencabezado: encabezado.observacion,
                    usuariocreacion: encabezado.usuariocreacion,
                    tipotercero: encabezadoParametrizado.tipotercero,
                    tercero_id: encabezado.tercero_id,
                    empresa_recibo: encabezado.empresa_recibo,
                    cuenta_contable: encabezado.cuenta_contable
                }];

                console.log('Encabezado finish is: ', response);

                callback(false, response);
            });
        } else {
            callback(false);
        }
    }).catch(function (err) {
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.listarEncabezadoRCD = function (obj, callback) {
    console.log('In listarEncabezadoRCD of Model!! obj is: ', obj);

    let query = G.knex.column(
        G.knex.raw("TO_CHAR(rc.fecha_registro, 'DD-MM-YYYY') as fecharegistroencabezado"),
        'rc.tercero_id as identerceroencabezado',
        'rc.recibo_caja as numerodocumentoencabezado',
        'rc.observacion as observacionencabezado',
        'rc.usuario_id as usuariocreacion',
        G.knex.raw("'3' as tipotercero"),
        'rc.tercero_id',
        'rc.empresa_recibo',
        'tc.cuenta_contable')
        .select()
        .from('recibos_caja as rc')
        .leftJoin('terceros_clientes as tc',
            function () {
                this.on('rc.tipo_id_tercero', 'tc.tipo_id_tercero')
                    .on('rc.tercero_id', 'tc.tercero_id')
            })
        .where('rc.recibo_caja', obj.factura_fiscal)
        .andWhere('rc.prefijo', obj.prefijo);

    console.log('SQL en listarEncabezadoRCD: ', G.sqlformatter.format(query.toString()));

    query.then(function (resultado) {
        if (resultado[0] !== undefined) {
            let encabezado = resultado[0];

            let query = G.knex.select()
                .from('parametrizacion_ws_fi')
                .where({
                    parametrizacion_ws_fi_id: obj.wsFi
                });

            query.then(function (result) {
                console.log('Consulta encabezado parametrizado fine: ', result);

                if (result.length > 0) {
                    let encabezadoParametrizado = result[0];

                    if (encabezado.numerodocumentoencabezado !== undefined) {
                        encabezado.numerodocumentoencabezado = String(encabezado.numerodocumentoencabezado);
                    }
                    if (encabezado.usuariocreacion !== undefined) {
                        encabezado.usuariocreacion = String(encabezado.usuariocreacion);
                    }

                    let response = [{
                        coddocumentoencabezado: encabezadoParametrizado.coddocumentoencabezado,
                        codempresa: encabezadoParametrizado.codempresa,
                        estadoencabezado: encabezadoParametrizado.estadoencabezado,
                        fecharegistroencabezado: encabezado.fecharegistroencabezado,
                        identerceroencabezado: encabezado.identerceroencabezado,
                        numerodocumentoencabezado: encabezado.numerodocumentoencabezado,
                        observacionencabezado: encabezado.observacionencabezado,
                        usuariocreacion: encabezado.usuariocreacion,
                        tipotercero: encabezadoParametrizado.tipotercero,
                        tercero_id: encabezado.tercero_id,
                        empresa_recibo: encabezado.empresa_recibo,
                        cuenta_contable: encabezado.cuenta_contable
                    }];

                    callback(false, response);
                } else {
                    callback(false);
                }
            });
        } else {
            callback(false);
        }
    });
};

SincronizacionDocumentosModel.prototype.listarFacturasDFIN1121 = function (obj, callback) {
    var response = {
        'facturas': [],
        'credito': 0
    };
    //console.log('In listarFacturasDFIN1121 of Model!! obj is: ', obj);

    var column1 = [
        G.knex.raw("'0' as codcentrocostoasiento"),
        G.knex.raw("'0' as codcentroutilidadasiento"),
        G.knex.raw("'" + obj.cuentaContable + "' AS codcuentaasiento"),
        G.knex.raw("'0' as  codlineacostoasiento"),
        G.knex.raw("'" + obj.terceroId + "' AS identerceroasiento"),
        G.knex.raw("'SIN OBSERVACION PARA EL ASIENTO' AS observacionasiento"),
        G.knex.raw("'0' AS valorbaseasiento"),
        'RES.valor_abonado_rt as valorcreditoasiento',
        G.knex.raw("'0' AS valordebitoasiento"),
        G.knex.raw("'0' AS valortasaasiento")
    ];

    var column2 = [
        G.knex.raw("SUM(valor_abonado_rt) AS total_credito")
    ];
    //console.log('Antes de la funcion!!');

    var query = G.knex.column(column1)
        .select()
        .from(function () {
            this.select(
                'u.prefijo',
                'u.recibo_caja',
                G.knex.raw("'1' AS estado_1121"),
                G.knex.raw("SUM(valor_abonado) AS valor_abonado_rt"))
                .from('rc_detalle_tesoreria_facturas as u')
                .where('u.prefijo', obj.prefijo)
                .andWhere('u.recibo_caja', obj.factura_fiscal)
                .groupBy(G.knex.raw("1, 2, 3")).as('RES')
        })
        .where('RES.valor_abonado_rt', '>', '0');

//    console.log("Queryyyy listarFacturasDFIN1121: ", G.sqlformatter.format(query.toString()));

    query.then(function (facturas) {
        if (facturas.length > 0 && facturas[0].valorcreditoasiento !== undefined) {
            facturas[0].valordebitoasiento = String(facturas[0].valordebitoasiento);
            facturas[0].valorcreditoasiento = parseFloat(facturas[0].valorcreditoasiento);
            response.facturas = facturas;

            var query = G.knex.column(column2)
                .select()
                .from(function () {
                    this.select(
                        'u.prefijo',
                        'u.recibo_caja',
                        G.knex.raw("'1' AS estado_1121"),
                        G.knex.raw("SUM(valor_abonado) AS valor_abonado_rt"))
                        .from('rc_detalle_tesoreria_facturas as u')
                        .where('u.prefijo', obj.prefijo)
                        .andWhere('u.recibo_caja', obj.facturaFiscal)
                        .groupBy(G.knex.raw("1, 2, 3")).as('RES')
                })
                .where('RES.valor_abonado_rt', '>', '0');

            return query;
        } else {
            console.log('Sin facturas!!!');
            return false;
        }
    }).then(function (data) {
        var total_credito = data[0].total_credito;
        response.credito = total_credito;

        console.log('All fine total is: ', total_credito);
        callback(false, response);
    }).catch(function (err) {
        console.log('Hubo un error: ', err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.obtenerEncabezadoBonificacion = function (obj, callback) {
    console.log('In Model "obtenerEncabezadoBonificacion": ', obj);
    var response = {};

    var query = G.knex.column(
        'a.numero',
        'a.tercero_id',
        'observacion'
    )
        .select()
        .from('inv_bodegas_movimiento_prestamos as a')

        .innerJoin('terceros as b', function () {
            this.on('a.tipo_id_tercero', 'b.tipo_id_tercero')
                .on('a.tercero_id', 'b.tercero_id')
        })
        .innerJoin('inv_bodegas_tipos_prestamos as c', 'a.tipo_prestamo_id', 'c.tipo_prestamo_id')
        .innerJoin('inv_bodegas_movimiento as d', function () {
            this.on('a.prefijo', 'd.prefijo')
                .on('a.numero', 'd.numero')
        })
        .where('a.empresa_id', obj.empresa_id)
        .andWhere('a.prefijo', obj.prefijo)
        .andWhere('a.numero', obj.factura_fiscal);

//    console.log('SQL en obtenerEncabezadoBonificacion ', G.sqlformatter.format(query.toString()));

    query.then(function (resultado) {
        response = resultado;
        console.log('First function in "obtenerEncabezadoBonificacion" is fine');

        var query2 = G.knex.column(G.knex.raw("COALESCE(b.prefijo, '') as prefijo_fi"))
            .from('documentos as a')
            .innerJoin('prefijos_financiero as b', 'a.prefijos_financiero_id', 'b.id')
            .where('a.prefijo', obj.prefijo)
            .andWhere('a.empresa_id', obj.empresa_id);
        //.andWhere('a.empresa_id', obj.empresa_id);

//        console.log('sql in "obtenerPrefijoFI": ', G.sqlformatter.format(query2.toString()));

        return query2;
    }).then(function (resultado2) {
        console.log('Second function in "obtenerEncabezadoBonificacion" is fine');

        if (resultado2.length > 0 && resultado2[0].prefijo_fi !== undefined) {
            response[0].coddocumentoencabezado = resultado2[0].prefijo_fi.trim();
            callback(false, response);
        } else {
            callback('Error!!!');
        }
    }).catch(function (err) {
        console.log('Function in Model is broken!!');
        callback(err);
    })
};


SincronizacionDocumentosModel.prototype.obtenerDetalleBonificacion = function (obj, callback) {
    console.log('In Model "obtenerDetalleBonificacion": ', obj);

    let response = {
        asientos: [],
        medicamentos_gravados: 0,
        medicamentos_no_gravados: 0,
        insumos_gravados: 0,
        insumos_no_gravados: 0,
        iva: 0,
        subtotal: 0,
        total: 0
    };

    const asientoDefault = {
        codcentrocostoasiento: '0',
        codcentroutilidadasiento: '0',
        codconcepto: '',
        codcuentaasiento: '14352010',
        codlineacostoasiento: '0',
        identerceroasiento: obj.tercero_id,
        observacionasiento: 'No Aplica Observacion Asiento',
        valorbaseasiento: '0',
        valorcreditoasiento: '0',
        valordebitoasiento: '0',
        valortasaasiento: '0'
    };

    let asientoMedicamentosGravados = JSON.parse(JSON.stringify(asientoDefault));
    let asientoMedicamentosNoGravados = JSON.parse(JSON.stringify(asientoDefault));
    let asientoInsumosGravados = JSON.parse(JSON.stringify(asientoDefault));
    let asientoInsumosNoGravados = JSON.parse(JSON.stringify(asientoDefault));
    let asientoIva = JSON.parse(JSON.stringify(asientoDefault));
    let asientoTotal = JSON.parse(JSON.stringify(asientoDefault));

    let query = G.knex.column(
        'a.*',
        'b.descripcion',
        'b.unidad_id',
        'b.contenido_unidad_venta',
        'c.descripcion as descripcion_unidad',
        G.knex.raw('fc_descripcion_producto(b.codigo_producto) as nombre'),
        G.knex.raw('(a.valor_unitario * a.cantidad) as subtotal'),
        G.knex.raw('(a.valor_unitario*(a.porcentaje_gravamen/100)) as iva'),
        G.knex.raw('((a.valor_unitario * a.cantidad) * (a.porcentaje_gravamen/100)) as iva_total'),
        G.knex.raw('((a.cantidad)*(a.valor_unitario+(a.valor_unitario*(a.porcentaje_gravamen/100)))) as total'),
        'd.sw_insumos',
        'd.sw_medicamento')
        .from('inv_bodegas_movimiento_d as a')
        .innerJoin('inventarios_productos as b', 'a.codigo_producto', 'b.codigo_producto')
        .innerJoin('unidades as c', 'b.unidad_id', 'c.unidad_id')
        .innerJoin('inv_grupos_inventarios as d', 'b.grupo_id', 'd.grupo_id')
        .where('a.empresa_id', obj.empresa_id)
        .andWhere('a.prefijo', obj.prefijo)
        .andWhere('a.numero', obj.factura_fiscal)
        .orderBy('a.codigo_producto');

//    console.log('Sql in "obtenerDetalleBonificacion" is: ', G.sqlformatter.format(query.toString()));

    query.then(function (facturas) {
        if (facturas && facturas.length > 0) {

            for (let factura of facturas) {
                if (factura.sw_medicamento == "1") {
                    if (factura.iva > 0) {
                        response.medicamentos_gravados += factura.subtotal;
                    } else {
                        response.medicamentos_no_gravados += factura.subtotal;
                    }
                } else if (factura.sw_insumos == "1") {
                    if (factura.iva > 0) {
                        response.insumos_gravados += factura.subtotal;
                    } else {
                        response.insumos_no_gravados += factura.subtotal;
                    }
                }

                response.subtotal += factura.subtotal;
                response.iva += factura.iva_total;
                response.total += factura.total;
            }

            if (response.medicamentos_gravados > 0) {
                asientoMedicamentosGravados.valordebitoasiento = response.medicamentos_gravados;
                response.asientos.push(asientoMedicamentosGravados);
            }
            if (response.medicamentos_no_gravados > 0) {
                asientoMedicamentosNoGravados.valordebitoasiento = response.medicamentos_no_gravados;
                response.asientos.push(asientoMedicamentosNoGravados);
            }
            if (response.insumos_gravados > 0) {
                asientoInsumosGravados.valordebitoasiento = response.insumos_gravados;
                response.asientos.push(asientoInsumosGravados);
            }
            if (response.insumos_no_gravados > 0) {
                asientoInsumosNoGravados.valordebitoasiento = response.insumos_no_gravados;
                response.asientos.push(asientoInsumosNoGravados);
            }

            if (response.iva > 0) {
                asientoIva.valordebitoasiento = response.iva;
                asientoIva.valorbaseasiento = response.medicamentos_gravados + response.insumos_gravados;
                response.asientos.push(asientoIva);
            }

            // Total
            asientoTotal.codcuentaasiento = '42950505';
            asientoTotal.valorcreditoasiento = response.total;
            response.asientos.push(asientoTotal);

            callback(false, response);
        } else {
            throw {error: 1, status: 500, mensaje: 'Result empty in "obtenerDetalleBonificacion"'};
        }
    }).catch(function (err) {
        console.log('Error in query!!!', err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.listarDetalleRCWSFI = function (obj, callback) {
    console.log('In model "listarDetalleRCWSFI"');
    var credito = parseFloat('0');
    var debito = parseFloat('0');
    var response = {};

    var query = G.knex.distinct(
        G.knex.raw("'0' AS codcentrocostoasiento"),
        G.knex.raw("'0' AS codcentroutilidadasiento"),
        G.knex.raw("CASE WHEN \"RCT\".\"cuenta\" IS NULL THEN '0' ELSE \"RCT\".\"cuenta\" END AS codcuentaasiento"),
        G.knex.raw("'0' AS codlineacostoasiento"),
        G.knex.raw("'" + obj.terceroId + "' AS identerceroasiento"),
        G.knex.raw("'ASIENTO PARA EL CONCEPTO' AS observacionasiento"),
        G.knex.raw("'0' AS valorbaseasiento"),
        G.knex.raw("CASE WHEN \"RCT\".\"sw_naturaleza\" = 'D' THEN '0' ELSE \"RDTC\".\"valor\" END AS valorcreditoasiento"),
        G.knex.raw("CASE WHEN \"RCT\".\"sw_naturaleza\" = 'D' THEN \"RDTC\".\"valor\" ELSE '0' END AS valordebitoasiento"),
        G.knex.raw("'0' AS valortasaasiento"))
        .from('facturas_rc_detalles as RDTF')
        .leftJoin('fac_facturas as FF',
            function () {
                this.on('FF.empresa_id', 'RDTF.empresa_id')
                    .on('FF.prefijo', 'RDTF.prefijo_factura')
                    .on('FF.factura_fiscal', 'RDTF.factura_fiscal')
            })
        .leftJoin('rc_detalle_tesoreria_conceptos as RDTC',
            function () {
                this.on('RDTC.empresa_id', 'RDTF.empresa_id')
                    .on('RDTC.centro_utilidad', 'RDTF.centro_utilidad')
                    .on('RDTC.prefijo', 'RDTF.rc_prefijo_tras')
                    .on('RDTC.recibo_caja', 'RDTF.rc_id_tras')
            })
        .leftJoin('rc_conceptos_tesoreria as RCT',
            function () {
                this.on('RCT.concepto_id', 'RDTC.concepto_id')
                    .on('RCT.empresa_id', 'RDTC.empresa_id')
            })
        .leftJoin('rc_detalle_tesoreria_conceptos as RDTC1',
            function () {
                this.on('RDTC1.prefijo', 'RDTF.prefijo_rc')
                    .on('RDTC1.recibo_caja', 'RDTF.recibo_caja')
            })
        .leftJoin('rc_conceptos_tesoreria as RCT1',
            function () {
                this.on('RCT1.concepto_id', 'RDTC1.concepto_id')
                    .on('RCT1.empresa_id', 'RDTC1.empresa_id')
            })
        .where('RDTF.rc_prefijo_tras', obj.prefijo)
        .andWhere('RDTF.rc_id_tras', obj.factura_fiscal)
        .andWhere('RDTC.valor', '>', '0');

//    console.log('SQL en listarDetalleRCWSFIIIII ', G.sqlformatter.format(query.toString()));

    query.then(function (resultado) {
        for (var detalle of resultado) {
            if (!detalle.valorcreditoasiento) {
                detalle.valorcreditoasiento = 0;
            }
            if (!detalle.valordebitoasiento) {
                detalle.valordebitoasiento = 0;
            }

            detalle.valorcreditoasiento = parseFloat(detalle.valorcreditoasiento);
            credito += detalle.valorcreditoasiento;
            detalle.valordebitoasiento = parseFloat(detalle.valordebitoasiento);
            debito += detalle.valordebitoasiento;
        }
        response.detalle = resultado;

        if (credito) {
            response.credito = parseFloat(credito);
        } else {
            response.credito = String(0);
        }
        if (debito) {
            response.debito = parseFloat(debito);
        } else {
            response.debito = String(0);
        }

//        console.log('Response is: ', response);
        callback(false, response);
    }).catch(function (err) {
        console.log("error sql", err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.listarTiposServicios = function (obj, callback) {
    console.log('Entro en el modelo de "listarTiposServicios"!');
//    console.log('Objeto en modelo: ', obj);
    var data = {servicios: '', serviciosFiltrados: ''};

    var query = G.knex.distinct([
        'para_ws.parametrizacion_ws_fi_id as id',
        'para_ws.nombre as descripcion'])
        .select()
        .from('parametrizacion_ws_fi as para_ws');
    //console.log('SQL en AjustePrecios ',G.sqlformatter.format(query.toString()));

    query.then(function (resultado) {
        data.servicios = resultado;
        if (obj.prefijo !== undefined) {
            var prefijo = obj.prefijo;
            var query = G.knex.distinct([
                'para_ws.parametrizacion_ws_fi_id as id',
                'para_ws.nombre as descripcion'])
                .select()
                .from('parametrizacion_ws_fi as para_ws')
                .innerJoin('documentos_cuentas as doc_cu', 'para_ws.parametrizacion_ws_fi_id', 'doc_cu.parametrizacion_ws_fi')
                .where('doc_cu.prefijo', prefijo);
            //console.log('SQL en AjustePrecios ',G.sqlformatter.format(query.toString()));
            query.then(function (resultado) {
                data.serviciosFiltrados = resultado;
                callback(false, data);
            }).catch(function (err) {
                console.log("error sql", err);
                callback(err);
            });
        } else {
            data.serviciosFiltrados = [];
            callback(false, data);
        }
    }).catch(function (err) {
        console.log("error sql", err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.cuentasFiltradas = function (obj, callback) {
    console.log('In model "cuentasFiltradas"');

    var query = G.knex.select()
        .from('documentos_cuentas')
        .where({
            prefijo: obj.prefijo,
            empresa_id: obj.empresa_id,
            centro_id: obj.centro_id,
            bodega_id: obj.bodega_id,
            parametrizacion_ws_fi: obj.parametrizacion
        });
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.guardarCuentas = function (obj, callback) {
    console.log('entro en el modelo de "guardarCuentas"!');
    if (obj.id_tercero_asiento === '') {
        obj.id_tercero_asiento = null;
    }
    if (obj.centro_costos_asientos === '') {
        obj.centro_costos_asientos = null;
    }
    if (obj.centro_utilidad_asiento === '') {
        obj.centro_utilidad_asiento = null;
    }
    if (obj.cod_linea_costo_asiento === '') {
        obj.cod_linea_costo_asiento = null;
    }
    if (obj.observacion_asiento === '') {
        obj.observacion_asiento = null;
    }

    var query = G.knex.select('documentos_cuentas_id')
        .from('documentos_cuentas')
        .where({
            prefijo: obj.prefijo_id,
            empresa_id: obj.empresa_id,
            centro_id: obj.centro_id,
            bodega_id: obj.bodega_id,
            cuenta: obj.cuenta_id,
            sw_cuenta: obj.sw_cuenta,
            parametrizacion_ws_fi: obj.parametrizacion_ws_fi,
            cuenta_categoria: obj.categoria_id
        });
    //console.log('Query: ', G.sqlformatter.format(query.toString()));

    query.then(function (resultado) {
        //console.log('Resultado de consulta es: ', resultado);
        if (resultado.length === 0) {
            //console.log('Dentro del IF!!!!');
            var insert = G.knex('documentos_cuentas')
                .insert({
                    prefijo: obj.prefijo_id,
                    empresa_id: obj.empresa_id,
                    centro_id: obj.centro_id,
                    bodega_id: obj.bodega_id,
                    cuenta: obj.cuenta_id,
                    sw_cuenta: obj.sw_cuenta,
                    centro_costos_asientos: obj.centro_costos_asientos,
                    centro_utilidad_asiento: obj.centro_utilidad_asiento,
                    cod_linea_costo_asiento: obj.cod_linea_costo_asiento,
                    id_tercero_asiento: obj.id_tercero_asiento,
                    observacion_asiento: obj.observacion_asiento,
                    parametrizacion_ws_fi: obj.parametrizacion_ws_fi,
                    cuenta_categoria: obj.categoria_id
                });
//            console.log('Insert: ', G.sqlformatter.format(insert.toString()));

            insert.then(function (resultado) {
                callback(false, true);
            }).catch(function (err) {
                console.log("error sql", err);
                callback(err);
            });
        } else {
            //console.log('Dentro del ELSE!!!!');

            var update = G.knex('documentos_cuentas')
                .where({
                    prefijo: obj.prefijo_id,
                    empresa_id: obj.empresa_id,
                    centro_id: obj.centro_id,
                    bodega_id: obj.bodega_id,
                    cuenta: obj.cuenta_id,
                    sw_cuenta: obj.sw_cuenta,
                    parametrizacion_ws_fi: obj.parametrizacion_ws_fi,
                    cuenta_categoria: obj.categoria_id
                })
                .update({
                    centro_costos_asientos: obj.centro_costos_asientos,
                    centro_utilidad_asiento: obj.centro_utilidad_asiento,
                    cod_linea_costo_asiento: obj.cod_linea_costo_asiento,
                    id_tercero_asiento: obj.id_tercero_asiento,
                    observacion_asiento: obj.observacion_asiento
                });
//            console.log('Update: ', G.sqlformatter.format(update.toString()));
            update.then(function (resultado) {
                callback(false, true);
            }).catch(function (err) {
                console.log("error sql", err);
                callback(err);
            });
        }
    }).catch(function (err) {
        console.log("error sql", err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.listarTipoCuentaCategoria = function (obj, callback) {
    console.log('entro en el modelo de "listarTiposCuentasCategorias"!');

    var query = G.knex.select(['categoria_id as id', 'categoria_descripcion as descripcion'])
        .from('tipos_cuentas_categorias');

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("error sql", err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.listarTiposCuentas = function (obj, callback) {
    //console.log('entro en el modelo de "listarTiposCuentas"!');

    var query = G.knex.select(
        'doc_cu.prefijo as prefijo_id',
        'doc_cu.empresa_id',
        'doc_cu.centro_id',
        'doc_cu.bodega_id',
        'doc_cu.cuenta',
        'doc_cu.sw_cuenta',
        'doc_cu.centro_costos_asientos',
        'doc_cu.centro_utilidad_asiento',
        'doc_cu.cod_linea_costo_asiento',
        'doc_cu.id_tercero_asiento',
        'doc_cu.observacion_asiento',
        'doc_cu.parametrizacion_ws_fi',
        'tipos_cate.categoria_descripcion',
        'tipos_cate.categoria_id')
        .from('documentos_cuentas as doc_cu')
        .leftJoin('tipos_cuentas_categorias as tipos_cate', 'doc_cu.cuenta_categoria', 'tipos_cate.categoria_id')
        .where('doc_cu.empresa_id', '=', obj.empresa_id)
        .andWhere('doc_cu.centro_id', obj.centro_id)
        .andWhere('doc_cu.bodega_id', obj.bodega_id)
        .andWhere('doc_cu.prefijo', obj.prefijo_id)
        .andWhere('doc_cu.parametrizacion_ws_fi', obj.servicio)
        .orderBy('tipos_cate.categoria_descripcion');

    //console.log(G.sqlformatter.format(query.toString()));

    query.then(function (resultado) {
        //console.log('Cuentas desde modelo: ', resultado);
        callback(false, resultado);
    }).catch(function (err) {
        console.log("error sql", err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.obtenerPrefijoFi = function (obj, callback) {
    console.log('entro en el modelo de "obtener_prefijo_fi"!: ', obj);

    var query = G.knex.select(G.knex.raw("COALESCE(b.prefijo ,'') as prefijo_fi"))
        .from('documentos as a')
        .innerJoin('prefijos_financiero as b', 'a.prefijos_financiero_id', 'b.id')
        .where(function () {
        }).andWhere('a.prefijo', obj.prefijo)
        .andWhere('a.empresa_id', obj.empresaId);

//    console.log(G.sqlformatter.format(query.toString()));

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("error sql", err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.parametrizacionCabeceraFi = function (obj, callback) {
    console.log('entro en el modelo de "obtener_prefijo_fi"!');

    var query = G.knex.select(
        [
            'parametrizacion_ws_fi_id',
            'nombre',
            'estadoencabezado',
            'tipotercero',
            'plazotercero',
            'numeroradicacion',
            'codempresa',
            'coddocumentoencabezado',
            'observacionencabezado'
        ]
    ).from('parametrizacion_ws_fi as a')
        .andWhere('a.parametrizacion_ws_fi_id', obj.parametrizacion);
//    console.log(G.sqlformatter.format(query.toString())); 
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("error sql", err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.listarCuentasDetalle = function (obj, callback) {
    console.log('entro en el modelo de "listarCuentasDetalle"!');

    var query = G.knex.select([
        'documentos_cuentas_id',
        'prefijo',
        'empresa_id',
        'centro_id',
        'bodega_id',
        'cuenta',
        'sw_cuenta',
        'centro_costos_asientos',
        'centro_utilidad_asiento',
        'cod_linea_costo_asiento',
        'id_tercero_asiento',
        'observacion_asiento',
        'categoria_id',
        'categoria_descripcion',
        'parametrizacion_ws_fi',
        'ica_porcentaje',
        'cree_porcentaje',
        'rtf_porcentaje'
    ])
        .from('documentos_cuentas as doc_cu')
        .innerJoin('tipos_cuentas_categorias as tipos_cate', 'doc_cu.cuenta_categoria', 'tipos_cate.categoria_id')
        .where(function () {
            this.andWhere('prefijo', obj.prefijo)
                .andWhere('empresa_id', obj.empresaId)
                .andWhere('bodega_id', obj.bodega)
                .andWhere('parametrizacion_ws_fi', obj.wsFi);
        }).orderBy("cuenta_categoria", "asc");

//    console.log("listarCuentasDetalle", G.sqlformatter.format(query.toString()));
//console.log(G.sqlformatter.format(query.toString())); 
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("error sql", err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.listarDocumentosCuentas = function (obj, callback) {
    console.log('entro en el modelo de "listarDocumentosCuentas"!');

    var query = G.knex.select([
        'doc_cu.prefijo',
        'doc_cu.empresa_id',
        'doc_cu.centro_id',
        'doc_cu.bodega_id',
        'doc_cu.cuenta_debito as cuenta_debito_num',
        'tipos_cate.categoria_descripcion as cuenta_debito_des',
        'doc_cu.cuenta_credito as cuenta_credito_num',
        'tipos_cate2.categoria_descripcion as cuenta_credito_des'])
        .from('documentos_cuentas as doc_cu')
        .innerJoin('tipos_cuentas as tipos_cu', 'doc_cu.cuenta_debito', 'tipos_cu.cuenta_id')
        .innerJoin('tipos_cuentas_categorias as tipos_cate', 'tipos_cu.cuenta_categoria', 'tipos_cate.categoria_id')
        .innerJoin('tipos_cuentas as tipos_cu2', 'doc_cu.cuenta_credito', 'tipos_cu2.cuenta_id')
        .innerJoin('tipos_cuentas_categorias as tipos_cate2', 'tipos_cu2.cuenta_categoria', 'tipos_cate2.categoria_id');


    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("error sql", err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.insertTiposCuentas = function (obj, callback) {
    console.log('entro en el modelo de "insertTiposCuentas"!', obj);
    var observacion_asiento = 'No Aplica Observacion Asiento - ' + obj.cuentaCategoriaDescripcion;

    var select = G.knex('documentos_cuentas')
        .select('documentos_cuentas_id')
        .where({
            prefijo: obj.prefijo,
            empresa_id: obj.empresaId,
            centro_id: obj.centroId,
            bodega_id: obj.bodegaId,
            cuenta: obj.cuentaId,
            sw_cuenta: obj.cuentaTipo,
            cuenta_categoria: obj.cuentaCategoriaId,
            parametrizacion_ws_fi: obj.cuentaServicio
        });
//    console.log('Select en insertTiposCuentas ', G.sqlformatter.format(select.toString()));

    select.then(function (resultado) {
        console.log('Resultado en modelo es: ', resultado);
        if (resultado === undefined || resultado[0] === undefined) {
            //console.log('Entro en el if!!!');
            var query = G.knex('documentos_cuentas')
                .insert({
                    prefijo: obj.prefijo,
                    empresa_id: obj.empresaId,
                    centro_id: obj.centroId,
                    bodega_id: obj.bodegaId,
                    cuenta: obj.cuentaId,
                    sw_cuenta: obj.cuentaTipo,
                    observacion_asiento: observacion_asiento,
                    parametrizacion_ws_fi: obj.cuentaServicio,
                    cuenta_categoria: obj.cuentaCategoriaId
                });
            query.then(function (resultado) {
                console.log('Insert fine!!!');
                callback(false, resultado);
            }).catch(function (err) {
                console.log("error sql", err);
                callback(err);
            });
        } else {
            console.log('Entro en el else!!!');
            var response = ['repetido'];
            callback(false, response);
        }
    }).catch(function (err) {
        console.log("error sql", err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.insertDocumentosCuentas = function (obj, callback) {
    console.log('entro en el modelo de "documentos_cuentas"!');

    var query = G.knex('documentos_cuentas')
        .insert({
            prefijo: obj.prefijo,
            empresa_id: obj.empresaId,
            centro_id: obj.centro_id,
            bodega_id: obj.bodega,
            cuenta_debito: obj.cuentaDebito,
            cuenta_credito: obj.cuentaCredito
        });

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("error sql", err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.insertTiposCuentasCategorias = function (obj, callback) {
    console.log('entro en el modelo de "tipos_cuentas_categorias"!');

    var query = G.knex('tipos_cuentas_categorias')
        .insert({
            categoria_id: obj.categoriaId,
            categoria_descripcion: obj.categoriaDescripcion
        });

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("error sql", err);
        callback(err);
    });
};

SincronizacionDocumentosModel.prototype.sincronizarFinaciero = function (obj, callback) {
    console.log("*********sincronizarFinaciero*************");
//    var url = G.constants.WS().FI.DUSOFT_FI;
    var url = obj.url;
    obj.error = false;

    G.Q.nfcall(G.soap.createClient, url).then(function (client) {

        return G.Q.ninvoke(client, obj.funcion, obj.parametros);

    }).spread(function (result, raw, soapHeader) {
        obj.obj = result.crearInformacionContableResult;
//        console.log("result crearInformacionContableResult---", result);
//        console.log("result crearInformacionContableResult---", result.crearInformacionContableResult.descripcion);
//console.log("result.return---",result.return);
//console.log("raw---",raw);
//console.log("soapHeader---",soapHeader);
//        if (!result.return.msj["$value"]) {
//            throw {msj: "Se ha generado un error", status: 403, obj: {}};
//        } else {
//            obj.resultado = JSON.parse(result.return.msj["$value"]);
//        }

    }).then(function () {
        callback(false, obj.obj);

    }).fail(function (err) {
        console.log("Error sincronizarFinaciero ", err);
        obj.error = true;
        obj.tipo = '0';
        callback(err);

    }).done();
};

SincronizacionDocumentosModel.$inject = [];

module.exports = SincronizacionDocumentosModel;