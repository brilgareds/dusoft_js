/* global G */

var Notas = function (m_notas, m_sincronizacion, m_facturacion_proveedores, m_facturacion_clientes, c_sincronizacion) {
    this.m_notas = m_notas;
    this.m_sincronizacion = m_sincronizacion;
    this.m_facturacion_proveedores = m_facturacion_proveedores;
    this.m_facturacion_clientes = m_facturacion_clientes;
    this.c_sincronizacion = c_sincronizacion;
};


/**
 * @author German Galvis
 * +Descripcion  Metodo encargado de obtener la lista Facturas 
 * @fecha 2018-08-02 (YYYY-MM-DD)
 */
Notas.prototype.listarFacturas = function (req, res) {

    var that = this;
    var args = req.body.data;

    var parametros = {
        empresaId: args.empresaId,
        prefijo: args.prefijo,
        facturaFiscal: args.facturaFiscal
    };

    G.Q.ninvoke(that.m_notas, 'listarFacturas', parametros).then(function (resultado) {

        if (resultado.length > 0) {
            res.send(G.utils.r(req.url, 'listarFacturas', 200, {listarFacturas: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function (err) {
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion  Metodo encargado de obtener los porcentajes de la factura
 * @fecha 2018-08-15 (YYYY-MM-DD)
 */
Notas.prototype.listarPorcentajes = function (req, res) {

    var that = this;
    var args = req.body.data;
    var tabla_2;

    var parametros = {
        empresaId: args.empresaId,
        prefijo: args.prefijo,
        tipo_factura: args.tipo_factura,
        factura_fiscal: args.factura_fiscal
    };

    if (parametros.tipo_factura === 0) {
        tabla_2 = "inv_facturas_despacho";
    }

    if (parametros.tipo_factura === 1) {
        tabla_2 = "inv_facturas_agrupadas_despacho";
    }

    parametros.tabla_2 = tabla_2;


//    G.Q.ninvoke(that.m_facturacion_clientes, 'consultarParametrosRetencion', {empresaId: parametros.empresaId}).then(function (resultado) {
    G.Q.ninvoke(that.m_notas, 'porcentajes', parametros).then(function (resultado) {

        if (resultado.length > 0) {
            res.send(G.utils.r(req.url, 'listarPorcentajes', 200, {listarPorcentajes: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function (err) {
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion  Metodo encargado de obtener los porcentajes por año
 * @fecha 2018-09-10 (YYYY-MM-DD)
 */
Notas.prototype.listarPorcentajesAnio = function (req, res) {

    var that = this;
    var args = req.body.data;

    var parametros = {
        empresaId: args.empresaId,
        fecha: args.fecha
    };

    G.Q.ninvoke(that.m_notas, 'consultarParametrosRetencion', parametros).then(function (resultado) {

        if (resultado.length > 0) {
            res.send(G.utils.r(req.url, 'listarPorcentajesAnio', 200, {listarPorcentajesAnio: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function (err) {
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion  Metodo encargado de consultar las notas
 * @fecha 2018-08-06 (YYYY-MM-DD)
 */
Notas.prototype.ConsultarNotas = function (req, res) {

    var that = this;
    var args = req.body.data;
    var parametros = {
        empresa_id: args.empresaId,
        numero: args.numero,
        tipoConsulta: args.tipoConsulta
    };

    if (parametros.tipoConsulta === 'NC') {
        G.Q.ninvoke(that.m_notas, 'ConsultarNotasCredito', parametros).then(function (resultado) {
            if (resultado.length > 0) {
                res.send(G.utils.r(req.url, 'ConsultarNotas', 200, {ConsultarNotas: resultado}));
            } else {
                throw 'Consulta sin resultados';
            }
        }).fail(function (err) {
            console.log("Error ConsultarNotas ", err);
            res.send(G.utils.r(req.url, "Consulta sin resultados", 500, {}));
        }).done();
    } else if (parametros.tipoConsulta === 'ND') {

        G.Q.ninvoke(that.m_notas, 'ConsultarNotasDebito', parametros).then(function (resultado) {


            if (resultado.length > 0) {
                res.send(G.utils.r(req.url, 'ConsultarNotas', 200, {ConsultarNotas: resultado}));
            } else {
                throw 'Consulta sin resultados';
            }

        }).fail(function (err) {
            console.log("Error ConsultarNotas ", err);
            res.send(G.utils.r(req.url, "Consulta sin resultados", 500, {}));
        }).done();

    }
};

/**
 * @author German Galvis
 * +Descripcion  Metodo encargado de obtener el detalle de la factura 
 * @fecha 2018-08-06 (YYYY-MM-DD)
 */
Notas.prototype.ConsultarDetalleFactura = function (req, res) {

    var that = this;
    var args = req.body.data;
    var tabla, tabla2, tabla3, tabla4;

    var parametros = {
        tipoFactura: args.tipoFactura,
        empresa_id: args.empresa_id,
        factura_agrupada: args.factura_agrupada,
        facturaFiscal: args.facturaFiscal
    };

    if (parametros.tipoFactura === 0) {

        G.Q.ninvoke(that.m_notas, 'ConsultarDetalleFacturaDebito', parametros).then(function (resultado) {
            if (resultado.length > 0) {
                res.send(G.utils.r(req.url, 'ConsultarDetalleFactura', 200, {ConsultarDetalleFactura: resultado}));
            } else {
                throw 'Consulta sin resultados';
            }
        }).fail(function (err) {
            console.log("Error ConsultarDetalleFactura ", err);
            res.send(G.utils.r(req.url, "Consulta sin resultados", 500, {}));
        }).done();

    } else if (parametros.tipoFactura === 1) {

        parametros.tipoNota = 'VALOR';

        G.Q.ninvoke(that.m_notas, 'ConsultarDetalleFacturaCredito', parametros).then(function (resultado) {


            if (resultado.length > 0) {
                res.send(G.utils.r(req.url, 'ConsultarDetalleFactura', 200, {ConsultarDetalleFactura: resultado}));
            } else {
                throw 'Consulta sin resultados';
            }

        }).fail(function (err) {
            console.log("Error ConsultarDetalleFactura ", err);
            res.send(G.utils.r(req.url, "Consulta sin resultados", 500, {}));
        }).done();

    } else if (parametros.tipoFactura === 2) {

        parametros.tipoNota = 'DEVOLUCION';

        if (parametros.factura_agrupada === 0) {
            tabla = "inv_facturas_despacho";
            tabla2 = "inv_facturas_despacho_d";
            tabla3 = "notas_credito_despachos_clientes";
            tabla4 = "detalles_notas_credito_despachos_clientes";
        }

        if (parametros.factura_agrupada === 1) {
            tabla = "inv_facturas_agrupadas_despacho";
            tabla2 = "inv_facturas_agrupadas_despacho_d";
            tabla3 = "notas_credito_despachos_clientes_agrupados";
            tabla4 = "detalles_notas_credito_despachos_clientes_agrupados";
        }

        parametros.tabla_1 = tabla;
        parametros.tabla_2 = tabla2;
        parametros.tabla_3 = tabla3;
        parametros.tabla_4 = tabla4;

        G.Q.ninvoke(that.m_notas, 'ConsultarDetalleFacturaCreditoDevolucion', parametros).then(function (resultado) {


            if (resultado.length > 0) {
                res.send(G.utils.r(req.url, 'ConsultarDetalleFactura', 200, {ConsultarDetalleFactura: resultado}));
            } else {
                throw 'Consulta sin resultados';
            }

        }).fail(function (err) {
            console.log("Error ConsultarDetalleFactura ", err);
            res.send(G.utils.r(req.url, "Consulta sin resultados", 500, {}));
        }).done();

    }
};


/**
 * @author German Galvis
 * +Descripcion consulta los tipos de concepto
 * @fecha 2018-08-11 (YYYY-MM-DD)
 */
Notas.prototype.listarConceptos = function (req, res) {
    var that = this;
    G.Q.nfcall(that.m_notas.listarConceptos).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Consultar listar conceptos ok!!!!', 200, {listarConceptos: resultado}));
            }).fail(function (err) {
        res.send(G.utils.r(req.url, 'Error al Consultar tipos de conceptos', 500, {listarConceptos: {}}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion crea la nota 
 * @fecha 2018-08-09 (YYYY-MM-DD)
 */
Notas.prototype.crearNota = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;
    var tabla, tabla2, tabla3;
    var numeroNota;
    var paramt = [];
    var param = {};

    if (args.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'La empresaId NO estan definida', 404, {}));
        return;
    }
    if (args.prefijo === undefined) {
        res.send(G.utils.r(req.url, 'El prefijo NO esta definido', 404, {}));
        return;
    }
    if (args.factura_fiscal === undefined) {
        res.send(G.utils.r(req.url, 'La factura_fiscal NO esta definida', 404, {}));
        return;
    }
    if (args.valor === undefined) {
        res.send(G.utils.r(req.url, 'El valor NO esta definido', 404, {}));
        return;
    }



    if (args.tipo_factura === 0) {
        tabla = "notas_debito_despachos_clientes";
        tabla2 = "detalles_notas_debito_despachos_clientes";
        tabla3 = "inv_facturas_despacho";
    }
    if (args.tipo_factura === 1) {
        tabla = "notas_debito_despachos_clientes_agrupados";
        tabla2 = "detalles_notas_debito_despachos_clientes_agrupados";
        tabla3 = "inv_facturas_agrupadas_despacho";
    }


    var parametros = {
        empresaId: args.empresaId,
        prefijo: args.prefijo,
        factura_fiscal: args.factura_fiscal,
        usuario_id: usuarioId,
        valor: args.valor,
        total: args.total,
        tipo_factura: args.tipo_factura,
        tabla_1: tabla,
        tabla_2: tabla2,
        tabla_3: tabla3
    };

    G.knex.transaction(function (transaccion) {


        G.Q.nfcall(that.m_notas.agregarCabeceraNotaDebito, parametros, transaccion).then(function (result) {

            numeroNota = result[0];
            parametros.nota_debito_despacho_cliente_id = result[0];

            return G.Q.nfcall(__recorreListado, that, args.listado, parametros, 0, transaccion);

        }).then(function () {

            return G.Q.nfcall(that.m_notas.actualizarFacturaNotaDebito, parametros, transaccion);

        }).then(function () {
            transaccion.commit(numeroNota);
        }).fail(function (err) {
            transaccion.rollback(err);
        }).done();
    }).then(function (resultado) {
        paramt[0] = numeroNota;
        param = {param: paramt, funcion: 'notas_debito_cliente_fi'};


        return G.Q.ninvoke(that.m_sincronizacion, 'sincronizarCuentasXpagarFi', param);

    }).then(function (resultado) {

        res.send(G.utils.r(req.url, 'Nota creada Correctamente', 200, {crearNota: numeroNota, respuestaFI: resultado}));
    }).catch(function (err) {
        console.log("crearNota  ", err);
        res.send(G.utils.r(req.url, 'Error al crear la nota', 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion crea la nota 
 * @fecha 2018-08-13 (YYYY-MM-DD)
 */
Notas.prototype.crearNotaCredito = function (req, res) {
    var that = this;
    var args = req.body.data;
    var usuarioId = req.session.user.usuario_id;
    var tabla, tabla2, tabla3;
    var numeroNota;

    var paramt = [];
    var param = {};
    var concepto = [];

    if (args.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'La empresaId NO estan definida', 404, {}));
        return;
    }
    if (args.prefijo === undefined) {
        res.send(G.utils.r(req.url, 'El prefijo NO esta definido', 404, {}));
        return;
    }
    if (args.factura_fiscal === undefined) {
        res.send(G.utils.r(req.url, 'La factura_fiscal NO esta definida', 404, {}));
        return;
    }
    if (args.valor === undefined) {
        res.send(G.utils.r(req.url, 'El valor NO esta definido', 404, {}));
        return;
    }



    if (args.tipo_factura === 0) {
        tabla = "notas_credito_despachos_clientes";
        tabla2 = "detalles_notas_credito_despachos_clientes";
        tabla3 = "inv_facturas_despacho";
    }
    if (args.tipo_factura === 1) {
        tabla = "notas_credito_despachos_clientes_agrupados";
        tabla2 = "detalles_notas_credito_despachos_clientes_agrupados";
        tabla3 = "inv_facturas_agrupadas_despacho";
    }


    var parametros = {
        empresaId: args.empresaId,
        prefijo: args.prefijo,
        factura_fiscal: args.factura_fiscal,
        usuario_id: usuarioId,
        valor: args.valor,
        total: args.total,
        tipo_factura: args.tipo_factura,
        descripcionNota: args.descripcionNota,
        tabla_1: tabla,
        tabla_2: tabla2,
        tabla_3: tabla3

    };
    if (args.tipo_nota === 1) {

        G.knex.transaction(function (transaccion) {
            parametros.tipoNota = 'VALOR';
            parametros.conceptoId = args.concepto;

            G.Q.nfcall(that.m_notas.agregarCabeceraNotaCredito, parametros, transaccion).then(function (result) {

                numeroNota = result[0];
                parametros.nota_credito_despacho_cliente_id = result[0];

                return G.Q.nfcall(__recorreListadoCredito, that, args.listado, parametros, 0, transaccion);

            }).then(function () {

                return G.Q.nfcall(that.m_notas.actualizarFacturaNotaCredito, parametros, transaccion);

            }).then(function () {
                transaccion.commit(numeroNota);
            }).fail(function (err) {
                transaccion.rollback(err);
            }).done();
        }).then(function (resultado) {
            return  G.Q.ninvoke(that.m_notas, 'obtenerConceptoPorNota', numeroNota);

        }).then(function (resultado) {

            concepto = resultado[0];

            paramt[0] = numeroNota;
            paramt[1] = concepto;
            param = {param: paramt, funcion: 'notas_credito_clientes_fi'};

            return G.Q.ninvoke(that.m_sincronizacion, 'sincronizarCuentasXpagarFi', param);

        }).then(function (result) {

            res.send(G.utils.r(req.url, 'Nota creada Correctamente', 200, {crearNota: numeroNota, respuestaFI: result}));
        }).catch(function (err) {
            console.log("crearNota  ", err);
            res.send(G.utils.r(req.url, 'Error al crear la nota', 500, {}));
        }).done();

    } else if (args.tipo_nota === 2) {

        G.knex.transaction(function (transaccion) {

            parametros.tipoNota = 'DEVOLUCION';
            parametros.empresa_id_devolucion = args.empresa_id_devolucion;
            parametros.prefijo_devolucion = args.prefijo_devolucion;
            parametros.numero_devolucion = args.numero_devolucion;

            G.Q.nfcall(that.m_notas.agregarCabeceraNotaCreditoDevolucion, parametros, transaccion).then(function (result) {

                numeroNota = result[0];
                parametros.nota_credito_despacho_cliente_id = result[0];

                return G.Q.nfcall(__recorreListadoCredito, that, args.listado, parametros, 0, transaccion);

            }).then(function () {

                return G.Q.ninvoke(that.m_notas, 'actualizarFacturaNotaCreditoDevolucion', parametros, transaccion);

            }).then(function () {
                transaccion.commit(numeroNota);
            }).fail(function (err) {
                transaccion.rollback(err);
            }).done();
        }).then(function (resultado) {

            return  G.Q.ninvoke(that.m_notas, 'obtenerConceptoPorNota', numeroNota);

        }).then(function (resultado) {

            concepto = resultado[0];

            paramt[0] = numeroNota;
            paramt[1] = concepto;
            param = {param: paramt, funcion: 'notas_credito_clientes_fi'};

            return G.Q.ninvoke(that.m_sincronizacion, 'sincronizarCuentasXpagarFi', param);

        }).then(function (result) {

            res.send(G.utils.r(req.url, 'Nota creada Correctamente', 200, {crearNota: numeroNota, respuestaFI: result}));
        }).catch(function (err) {
            console.log("crearNota  ", err);
            res.send(G.utils.r(req.url, 'Error al crear la nota', 500, {}));
        }).done();
    }
};

/**
 * @author German Galvis
 * +Descripcion  Metodo encargado de crear las consultas para generar la impresion de las notas
 * @fecha 2018-08-10 (YYYY-MM-DD)
 */
Notas.prototype.generarReporteFacturaGeneradaDian = function (req, res) {
    var that = this;
    var args = req.body.data;
    var that = this;
    var args = req.body.data;
    var numero = args.imprimir_reporte_factura.numero;
    var tipo_documento = args.imprimir_reporte_factura.tipo_documento;
    
    var json = {
        tipoDocumento : tipo_documento,//factura
        factura : numero,//prefijo_nofactura
        tipoRespuesta : 'PDF'//factura
    };
        
    G.Q.ninvoke(that.c_sincronizacion, 'consultaFacturacionElectronica', json).then(function (resultado) {
        
        return res.send(G.utils.r(req.url, 'Factura generada satisfactoriamente', 200, {consulta_factura_generada_detalle: {nombre_pdf: resultado, resultados: {}}}));
        
    }).fail(function (err) {
      
        res.send(G.utils.r(req.url, err, 500, {}));
        
    }).done();
}
;

/**
 * @author German Galvis
 * +Descripcion  Metodo encargado de crear las consultas para generar la impresion de las notas
 * @fecha 2018-08-10 (YYYY-MM-DD)
 */
Notas.prototype.imprimirNota = function (req, res) {

    var that = this;
    var args = req.body.data;
    var valores = {};
    var tabla_1;
    var tabla_2;
    var tabla_3;
    var tabla_4;
    var subtotal_factura;
    var cliente = [];
    var porcentajes_factura = [];
    var empresa = [];
    var nota = [];
    var productos = [];
    var retencionFuente = 0;
    var retencionIca = 0;
    var retencionIva = 0;
    var totalFactura = 0;
    var subTotal = 0;
    var totalIva = 0;

    var parametros = {
        empresaId: args.empresaId,
        empresa_id: args.empresaId,
        numero: args.numeroNota,
        numeroNota: args.numeroNota
    };



    G.Q.ninvoke(that.m_notas, 'ConsultarNotasDebito', parametros).then(function (result) {

        nota = result;
        parametros.nombreNota = "DEBITO";
        nota[0].tipo_nota = "VALOR";

        if (nota[0].tipo_factura === 0) {
            tabla_1 = "notas_debito_despachos_clientes";
            tabla_2 = "inv_facturas_despacho";
            tabla_3 = "detalles_notas_debito_despachos_clientes";
            tabla_4 = "inv_facturas_despacho_d";
        }

        if (nota[0].tipo_factura === 1) {
            tabla_1 = "notas_debito_despachos_clientes_agrupados";
            tabla_2 = "inv_facturas_agrupadas_despacho";
            tabla_3 = "detalles_notas_debito_despachos_clientes_agrupados";
            tabla_4 = "inv_facturas_agrupadas_despacho_d";
        }
        parametros.tabla_1 = tabla_1;
        parametros.tabla_2 = tabla_2;
        parametros.tabla_3 = tabla_3;
        parametros.tabla_4 = tabla_4;


        return G.Q.nfcall(that.m_notas.clienteNota, parametros);
    }).then(function (result) {

        cliente = result;

        return G.Q.nfcall(that.m_notas.consultarProductosNotasDebito, parametros);

    }).then(function (result) {

        productos = result;

        parametros.prefijo = nota[0].prefijo;
        parametros.factura_fiscal = nota[0].factura_fiscal;

        return G.Q.ninvoke(that.m_notas, 'porcentajes', parametros);

    }).then(function (resultado) {

        porcentajes_factura = resultado;

        return G.Q.nfcall(that.m_notas.ConsultarSubtotalFactura, parametros);

    }).then(function (resultado) {

        subtotal_factura = resultado;

        return G.Q.ninvoke(that.m_notas, 'consultarParametrosRetencion', {empresaId: parametros.empresa_id, fecha: cliente[0].anio_factura});

    }).then(function (resultado) {

        if (resultado.length > 0) {
            productos.forEach(function (row) {

                subTotal += parseFloat(row.subtotal);
                totalIva += parseFloat(row.valor_iva);
            });


            if (subtotal_factura[0].subtotal >= parseFloat(resultado[0].base_rtf)) {
                retencionFuente = (subTotal * ((porcentajes_factura[0].porcentaje_rtf) / 100));
            }

            if (subtotal_factura[0].subtotal >= parseFloat(resultado[0].base_ica)) {
                retencionIca = (subTotal) * (parseFloat(porcentajes_factura[0].porcentaje_ica) / 1000);
            }

            if (subtotal_factura[0].subtotal >= parseFloat(resultado[0].base_reteiva)) {
                retencionIva = (totalIva) * (parseFloat(porcentajes_factura[0].porcentaje_reteiva) / 100);
            }

            totalFactura = ((((parseFloat(totalIva) + parseFloat(subTotal)) - parseFloat(retencionFuente)) - parseFloat(retencionIca)) - parseFloat(retencionIva));

        }

        valores.retencionIca = G.utils.numberFormat(retencionIca, 2);
        valores.retencionFuente = G.utils.numberFormat(retencionFuente, 2);
        valores.retencionIva = G.utils.numberFormat(retencionIva, 2);
        valores.ivaTotal = G.utils.numberFormat(parseFloat(totalIva), 2);
        valores.subTotal = G.utils.numberFormat(parseFloat(subTotal), 2);
        valores.totalFactura = G.utils.numberFormat(parseFloat(totalFactura), 2);
        valores.totalFacturaLetra = G.utils.numeroLetra(totalFactura);


        return G.Q.ninvoke(that.m_notas, 'listarEmpresa', parametros);

    }).then(function (result) {

        empresa = result;
        var informacion = {
            serverUrl: req.protocol + '://' + req.get('host') + "/",
            empresa: empresa[0],
            cliente: cliente[0],
            nota: nota[0],
            parametros: parametros,
            productos: productos,
            usuario: req.session.user.nombre_usuario,
            archivoHtml: 'notaFacturaPdf.html', //'notaFactura.html',
            valores: valores
        };

        return G.Q.nfcall(__generarPdf, informacion);

    }).then(function (result) {

        res.send(G.utils.r(req.url, 'Guardado Correctamente', 200, {imprimirNota: result}));

    }).catch(function (err) {
        console.log("error transaccion ", err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion  Metodo encargado de crear las consultas para generar la impresion de las notas
 * @fecha 2018-08-13 (YYYY-MM-DD)
 */
Notas.prototype.imprimirNotaCredito = function (req, res) {
    console.log("*************ESTA IMPRIMIO OK imprimirNotaCredito*****************");
    var that = this;
    var args = req.body.data;
    var valores = {};
    var tabla_1;
    var tabla_2;
    var tabla_3;
    var tabla_4;
    var cliente = [];
    var empresa = [];
    var nota = [];
    var productos = [];
    var subtotal_factura;
    var porcentajes_factura = [];
    var retencionFuente = 0;
    var retencionIca = 0;
    var retencionIva = 0;
    var totalFactura = 0;
    var subTotal = 0;
    var totalIva = 0;
    var reporte;

    var parametros = {
        empresaId: args.empresaId,
        empresa_id: args.empresaId,
        numero: args.numeroNota,
        numeroNota: args.numeroNota
    };



    G.Q.ninvoke(that.m_notas, 'ConsultarNotasCredito', parametros).then(function (result) {

        nota = result;


        parametros.nombreNota = "CREDITO";

        if (nota[0].tipo_factura === 0) {
            tabla_1 = "notas_credito_despachos_clientes";
            tabla_2 = "inv_facturas_despacho";
            tabla_3 = "detalles_notas_credito_despachos_clientes";
            tabla_4 = "inv_facturas_despacho_d";
        }

        if (nota[0].tipo_factura === 1) {
            tabla_1 = "notas_credito_despachos_clientes_agrupados";
            tabla_2 = "inv_facturas_agrupadas_despacho";
            tabla_3 = "detalles_notas_credito_despachos_clientes_agrupados";
            tabla_4 = "inv_facturas_agrupadas_despacho_d";
        }
        parametros.tabla_1 = tabla_1;
        parametros.tabla_2 = tabla_2;
        parametros.tabla_3 = tabla_3;
        parametros.tabla_4 = tabla_4;


        return G.Q.nfcall(that.m_notas.clienteNotaCredito, parametros);
    }).then(function (result) {

        cliente = result;

        return G.Q.nfcall(that.m_notas.consultarProductosNotasCredito, parametros);

    }).then(function (result) {

        productos = result;

        if (productos.length > 0) {
            reporte = 'notaFacturaPdf.html'; //'notaFactura.html';
        } else {
            reporte = 'notaFacturaSinProductoPdf.html'; //'notaFacturaSinProducto.html';
        }


        parametros.prefijo = nota[0].prefijo;
        parametros.factura_fiscal = nota[0].factura_fiscal;

        return G.Q.ninvoke(that.m_notas, 'porcentajes', parametros);

    }).then(function (resultado) {

        porcentajes_factura = resultado;

        return G.Q.nfcall(that.m_notas.ConsultarSubtotalFactura, parametros);

    }).then(function (resultado) {

        subtotal_factura = resultado;

        return G.Q.ninvoke(that.m_notas, 'consultarParametrosRetencion', {empresaId: parametros.empresa_id, fecha: cliente[0].anio_factura});

    }).then(function (resultado) {

        if (nota[0].concepto_id === 1 || nota[0].concepto_id === null) {

            if (resultado.length > 0) {
                productos.forEach(function (row) {

                    subTotal += parseFloat(row.subtotal);
                    totalIva += parseFloat(row.valor_iva);
                });

                if (subtotal_factura[0].subtotal >= parseFloat(resultado[0].base_rtf)) {
                    retencionFuente = (subTotal * ((porcentajes_factura[0].porcentaje_rtf) / 100));
                }

                if (subtotal_factura[0].subtotal >= parseFloat(resultado[0].base_ica)) {
                    retencionIca = (subTotal) * (parseFloat(porcentajes_factura[0].porcentaje_ica) / 1000);
                }

                if (subtotal_factura[0].subtotal >= parseFloat(resultado[0].base_reteiva)) {
                    retencionIva = (totalIva) * (parseFloat(porcentajes_factura[0].porcentaje_reteiva) / 100);
                }

                totalFactura = ((((parseFloat(totalIva) + parseFloat(subTotal)) - parseFloat(retencionFuente)) - parseFloat(retencionIca)) - parseFloat(retencionIva));

            }
        } else {
            subTotal = nota[0].valor_nota;
            totalFactura = nota[0].valor_nota;
        }

        valores.retencionIca = G.utils.numberFormat(retencionIca, 2);
        valores.retencionFuente = G.utils.numberFormat(retencionFuente, 2);
        valores.retencionIva = G.utils.numberFormat(retencionIva, 2);
        valores.ivaTotal = G.utils.numberFormat(parseFloat(totalIva), 2);
        valores.subTotal = G.utils.numberFormat(parseFloat(subTotal), 2);
        valores.totalFactura = G.utils.numberFormat(parseFloat(totalFactura), 2);
        valores.totalFacturaLetra = G.utils.numeroLetra(totalFactura);


        return G.Q.ninvoke(that.m_notas, 'listarEmpresa', parametros);

    }).then(function (result) {

        empresa = result;
        var informacion = {
            serverUrl: req.protocol + '://' + req.get('host') + "/",
            empresa: empresa[0],
            cliente: cliente[0],
            nota: nota[0],
            parametros: parametros,
            productos: productos,
            usuario: req.session.user.nombre_usuario,
            archivoHtml: reporte,
            valores: valores
        };

        return G.Q.nfcall(__generarPdf, informacion);

    }).then(function (result) {

        res.send(G.utils.r(req.url, 'Guardado Correctamente', 200, {imprimirNota: result}));

    }).catch(function (err) {
        console.log("error transaccion ", err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * @author German Galvis
 * +Descripcion  Metodo encargado para sincronizar las notas generadas  
 * @fecha 2018-08-14 (YYYY-MM-DD)
 */
Notas.prototype.sincronizarNotas = function (req, res) {
    var that = this;
    var args = req.body.data.sincronizarFI;

    if (args.nota === undefined) {
        res.send(G.utils.r(req.url, 'No Esta Definido nota', 404, {}));
        return;
    }

    if (args.tipoNota === undefined) {
        res.send(G.utils.r(req.url, 'No Esta Definido el tipoNota', 404, {}));
        return;
    }

    var paramt = [];
    var param = {};
    var concepto = [];
    if (args.tipoNota === 'C') {
        G.Q.ninvoke(that.m_notas, 'obtenerConceptoPorNota', args.nota).then(function (resultado) {

            concepto = resultado[0];

            paramt[0] = args.nota;
            paramt[1] = concepto;
            param = {param: paramt, funcion: 'notas_credito_clientes_fi'};

            return G.Q.ninvoke(that.m_sincronizacion, 'sincronizarCuentasXpagarFi', param);

        }).then(function (result) {

            res.send(G.utils.r(req.url, 'Factura sincronizada', 200, {respuestaFI: result}));

        }).catch(function (err) {
            console.log("ERROR", err);
            res.send(G.utils.r(req.url, err, 500, {err: err}));
        }).done();



    }

    if (args.tipoNota === 'D') {

        paramt[0] = args.nota;
        param = {param: paramt, funcion: 'notas_debito_cliente_fi'};


        G.Q.ninvoke(that.m_sincronizacion, 'sincronizarCuentasXpagarFi', param).then(function (resultado) {

            res.send(G.utils.r(req.url, 'Factura sincronizada', 200, {respuestaFI: resultado}));

        }).catch(function (err) {
            console.log("ERROR", err);
            res.send(G.utils.r(req.url, err, 500, {err: err}));
        }).done();

    }
};

/**
 * @author German Galvis
 * +Descripcion  Metodo encargado para sincronizar las notas generadas
 * @fecha 2018-09-04 (YYYY-MM-DD)
 */
Notas.prototype.generarSincronizacionDianDebito = function (req, res) {

    that = this;
    var args = req.body.data;
    var resultado;
    var data;

    G.Q.nfcall(__generarSincronizacionDianDebito, that, req).then(function (data) {
        resultado = data;

        return G.Q.nfcall(__productos, resultado.productos, 0, []);
    }).then(function (productos) {
        
var subTotal = resultado.valores.subTotal.replace(".", "");
var total = resultado.valores.totalFactura.replace(".", "");
        var json = {
            codigoMoneda: "COP",
            conceptoNota: "3", // falta validar
            fechaExpedicion: resultado.nota.fecha_registro_nota,
            fechaVencimiento: "", //falta
            codigoDocumentoDian: resultado.cliente.tipo_id_tercero,
            numeroIdentificacion: resultado.cliente.tercero_id,
            identificadorFactura: resultado.nota.prefijo + "_" + resultado.nota.factura_fiscal + "_E",
            nombreSucursal: "",
            numeroNota: resultado.nota.numero,
            observaciones: "", //falta
            perfilEmision: "CLIENTE",
            perfilUsuario: "CLIENTE",
            productos: productos,
            subtotalNotaDebitoElectronica: subTotal.replace(".", ""),
            ReteFuente: resultado.valores.retencionFuente.replace(".", ""),
            baseGravableReteFuente: resultado.valores.bases.base_rtf,
            IVA: resultado.valores.ivaTotal.replace(".", ""),
            baseGravableIVA: subTotal.replace(".", ""),
            ReteICA: resultado.valores.retencionIca.replace(".", ""),
            baseGravableReteICA: resultado.valores.bases.base_ica,
            ReteIVA: resultado.valores.retencionIva.replace(".", ""),
            baseGravableReteIVA: resultado.valores.bases.base_reteiva,
            tipoFactura: "ELECTRONICA",
            totalNotaDebitoElectronica: total.replace(".", ""),

            coordXQr: 172,
            coordYQr: 263,
            coordXCufe: 67,
            coordYCufe: 266,
            pdf: G.base64.base64Encode(G.dirname + "/public/reports/" + resultado.pdf)
        };

        return G.Q.ninvoke(that.c_sincronizacion, 'facturacionElectronicaNotaDebito', json);

    }).then(function (respuesta) {


        data = respuesta;
        var parametros = {
            empresa_id: args.empresaId, //obj.parametros.parametros.direccion_ip.replace("::ffff:", ""),
            prefijo: 'ND',
            factura_fiscal: resultado.nota.numero,
            sw_factura_dian: respuesta.sw_factura_dian,
            json_envio: data.lastRequest,
            respuesta_ws: data
        };

        if (respuesta.sw_factura_dian === '1') {

            return G.Q.ninvoke(that.m_facturacion_clientes, 'insertarLogFacturaDian', parametros);

        } else if (respuesta.sw_factura_dian === '0') {

            return G.Q.ninvoke(that.m_facturacion_clientes, 'insertarLogFacturaDian', parametros);

        }

    }).then(function (resultado) {

        if (data.sw_factura_dian === '1') {

            res.send(G.utils.r(req.url, 'Sincronizacion correcta con Certicamara', 200, data));

        } else if (data.sw_factura_dian === '0') {

            res.send(G.utils.r(req.url, data.msj, data.status, data));

        }

    }).fail(function (err) {

        res.send(G.utils.r(req.url, err.msj, err.status, err));

    }).done();

};

/**
 * @author German Galvis (duplica de imprimirNota)
 * +Descripcion Metodo encargado de generar el informe detallado de la nota debito generada
 * @fecha 2018-09-04 (YYYY-MM-DD)
 */
function __generarSincronizacionDianDebito(that, req, callback) {

    var that = that;
    var args = req.body.data;
    var valores = {};
    var tabla_1;
    var tabla_2;
    var tabla_3;
    var tabla_4;
    var subtotal_factura;
    var cliente = [];
    var porcentajes_factura = [];
    var empresa = [];
    var nota = [];
    var productos = [];
    var retencionFuente = 0;
    var retencionIca = 0;
    var retencionIva = 0;
    var totalFactura = 0;
    var subTotal = 0;
    var totalIva = 0;

    var parametros = {
        empresaId: args.empresaId,
        empresa_id: args.empresaId,
        numero: args.numeroNota,
        numeroNota: args.numeroNota
    };


    G.Q.ninvoke(that.m_notas, 'ConsultarNotasDebito', parametros).then(function (result) {

        nota = result;
        parametros.nombreNota = "DEBITO";
        nota[0].tipo_nota = "VALOR";

        if (nota[0].tipo_factura === 0) {
            tabla_1 = "notas_debito_despachos_clientes";
            tabla_2 = "inv_facturas_despacho";
            tabla_3 = "detalles_notas_debito_despachos_clientes";
            tabla_4 = "inv_facturas_despacho_d";
        }

        if (nota[0].tipo_factura === 1) {
            tabla_1 = "notas_debito_despachos_clientes_agrupados";
            tabla_2 = "inv_facturas_agrupadas_despacho";
            tabla_3 = "detalles_notas_debito_despachos_clientes_agrupados";
            tabla_4 = "inv_facturas_agrupadas_despacho_d";
        }
        parametros.tabla_1 = tabla_1;
        parametros.tabla_2 = tabla_2;
        parametros.tabla_3 = tabla_3;
        parametros.tabla_4 = tabla_4;


        return G.Q.nfcall(that.m_notas.clienteNota, parametros);
    }).then(function (result) {

        cliente = result;

        return G.Q.nfcall(that.m_notas.consultarProductosNotasDebito, parametros);

    }).then(function (result) {

        productos = result;

        parametros.prefijo = nota[0].prefijo;
        parametros.factura_fiscal = nota[0].factura_fiscal;

        return G.Q.ninvoke(that.m_notas, 'porcentajes', parametros);

    }).then(function (resultado) {

        porcentajes_factura = resultado;

        return G.Q.nfcall(that.m_notas.ConsultarSubtotalFactura, parametros);

    }).then(function (resultado) {

        subtotal_factura = resultado;

        return G.Q.ninvoke(that.m_notas, 'consultarParametrosRetencion', {empresaId: parametros.empresa_id, fecha: cliente[0].anio_factura});

    }).then(function (resultado) {

        if (resultado.length > 0) {
            valores.bases = resultado[0];
            productos.forEach(function (row) {

                subTotal += parseFloat(row.subtotal);
                totalIva += parseFloat(row.valor_iva);
            });


            if (subtotal_factura[0].subtotal >= parseFloat(resultado[0].base_rtf)) {
                retencionFuente = (subTotal * ((porcentajes_factura[0].porcentaje_rtf) / 100));
            }

            if (subtotal_factura[0].subtotal >= parseFloat(resultado[0].base_ica)) {
                retencionIca = (subTotal) * (parseFloat(porcentajes_factura[0].porcentaje_ica) / 1000);
            }

            if (subtotal_factura[0].subtotal >= parseFloat(resultado[0].base_reteiva)) {
                retencionIva = (totalIva) * (parseFloat(porcentajes_factura[0].porcentaje_reteiva) / 100);
            }

            totalFactura = ((((parseFloat(totalIva) + parseFloat(subTotal)) - parseFloat(retencionFuente)) - parseFloat(retencionIca)) - parseFloat(retencionIva));

        }

        valores.retencionIca = G.utils.numberFormat(retencionIca, 2);
        valores.retencionFuente = G.utils.numberFormat(retencionFuente, 2);
        valores.retencionIva = G.utils.numberFormat(retencionIva, 2);
        valores.ivaTotal = G.utils.numberFormat(parseFloat(totalIva), 2);
        valores.subTotal = G.utils.numberFormat(parseFloat(subTotal), 2);
        valores.totalFactura = G.utils.numberFormat(parseFloat(totalFactura), 2);
        valores.totalFacturaLetra = G.utils.numeroLetra(totalFactura);


        return G.Q.ninvoke(that.m_notas, 'listarEmpresa', parametros);

    }).then(function (result) {

        empresa = result;

        var info = {
            serverUrl: req.protocol + '://' + req.get('host') + "/",
            empresa: empresa[0],
            cliente: cliente[0],
            nota: nota[0],
            parametros: parametros,
            productos: productos,
            usuario: req.session.user.nombre_usuario,
            archivoHtml: 'notaFacturaPdf.html',
            valores: valores
        };

        return G.Q.nfcall(__generarPdf, info);

    }).then(function (result) {

        var informacion = {
            empresa: empresa[0],
            cliente: cliente[0],
            nota: nota[0],
            parametros: parametros,
            productos: productos,
            usuario: req.session.user.nombre_usuario,
            valores: valores,
            pdf: result
        };

        callback(false, informacion);

    }).fail(function (err) {
        console.log("Error  ", err);
        callback(err);
    }).done();
}
;

/**
 * @author German Galvis
 * +Descripcion  Metodo encargado para sincronizar las notas generadas
 * @fecha 2018-09-04 (YYYY-MM-DD)
 */
Notas.prototype.generarSincronizacionDianCredito = function (req, res) {

    that = this;
    var args = req.body.data;
    var resultado;
    var data;

    G.Q.nfcall(__generarSincronizacionDianCredito, that, req).then(function (data) {
        resultado = data;
        return G.Q.nfcall(__productos, resultado.productos, 0, []);
    }).then(function (productos) {

var subTotal = resultado.valores.subTotal.replace(".", "");
var total = resultado.valores.totalFactura.replace(".", "");
var retef = resultado.valores.retencionFuente.replace(".", "");
        var json = {
            codigoMoneda: "COP",
            conceptoNota: resultado.nota.prefijo_devolucion === 'IDC' ? "1" : "6",
            fechaExpedicion: resultado.nota.fecha_registro_nota,
            fechaVencimiento: "", //falta
            codigoDocumentoDian: resultado.nota.tipo_id_tercero,
            numeroIdentificacion: resultado.nota.tercero_id,
            identificadorFactura: resultado.nota.prefijo + "_" + resultado.nota.factura_fiscal + "_E",
            nombreSucursal: "",
            numeroNota: resultado.nota.numero,
            observaciones: resultado.nota.descripcion,
            perfilEmision: "CLIENTE",
            perfilUsuario: "CLIENTE",
            productos: productos,
            subtotalNotaCreditoElectronica: subTotal.replace(".", ""),
            ReteFuente: retef.replace(".", ""),
            baseGravableReteFuente: resultado.valores.bases.base_rtf,
            IVA: resultado.valores.ivaTotal.replace(".", ""),
            baseGravableIVA: subTotal.replace(".", ""),
            ReteICA: resultado.valores.retencionIca.replace(".", ""),
            baseGravableReteICA: resultado.valores.bases.base_ica,
            ReteIVA: resultado.valores.retencionIva.replace(".", ""),
            baseGravableReteIVA: resultado.valores.bases.base_reteiva,
            tipoFactura: "ELECTRONICA",
            totalNotaCreditoElectronica: total.replace(".", ""),

            coordXQr: 172,
            coordYQr: 263,
            coordXCufe: 67,
            coordYCufe: 266,
            pdf: G.base64.base64Encode(G.dirname + "/public/reports/" + resultado.pdf)
        };

        return G.Q.ninvoke(that.c_sincronizacion, 'facturacionElectronicaNotaCredito', json);

    }).then(function (respuesta) {

        data = respuesta;
        var parametros = {
            empresa_id: args.empresaId,
            prefijo: 'NC',
            factura_fiscal: resultado.nota.numero,
            sw_factura_dian: respuesta.sw_factura_dian,
            json_envio: data.lastRequest,
            respuesta_ws: data
        };

        if (respuesta.sw_factura_dian === '1') {

            return G.Q.ninvoke(that.m_facturacion_clientes, 'insertarLogFacturaDian', parametros);

        } else if (respuesta.sw_factura_dian === '0') {

            return G.Q.ninvoke(that.m_facturacion_clientes, 'insertarLogFacturaDian', parametros);

        }

    }).then(function (resultado) {

        if (data.sw_factura_dian === '1') {

            res.send(G.utils.r(req.url, 'Sincronizacion correcta con Certicamara', 200, data));

        } else if (data.sw_factura_dian === '0') {

            res.send(G.utils.r(req.url, data.msj, data.status, data));

        }

    }).fail(function (err) {

        res.send(G.utils.r(req.url, err.msj, err.status, err));

    }).done();

};
/**
 * @author German Galvis (duplica de imprimirNota)
 * +Descripcion Metodo encargado de generar el informe detallado de la nota credito generada
 * @fecha 2018-09-04 (YYYY-MM-DD)
 */
function __generarSincronizacionDianCredito(that, req, callback) {

    var that = that;
    var args = req.body.data;
    var valores = {};
    var tabla_1;
    var tabla_2;
    var tabla_3;
    var tabla_4;
    var reporte;
    var cliente = [];
    var empresa = [];
    var nota = [];
    var productos = [];
    var subtotal_factura;
    var porcentajes_factura = [];
    var retencionFuente = 0;
    var retencionIca = 0;
    var retencionIva = 0;
    var totalFactura = 0;
    var subTotal = 0;
    var totalIva = 0;

    var parametros = {
        empresaId: args.empresaId,
        empresa_id: args.empresaId,
        numero: args.numeroNota,
        numeroNota: args.numeroNota
    };



    G.Q.ninvoke(that.m_notas, 'ConsultarNotasCredito', parametros).then(function (result) {

        nota = result;


        parametros.nombreNota = "CREDITO";

        if (nota[0].tipo_factura === 0) {
            tabla_1 = "notas_credito_despachos_clientes";
            tabla_2 = "inv_facturas_despacho";
            tabla_3 = "detalles_notas_credito_despachos_clientes";
            tabla_4 = "inv_facturas_despacho_d";
        }

        if (nota[0].tipo_factura === 1) {
            tabla_1 = "notas_credito_despachos_clientes_agrupados";
            tabla_2 = "inv_facturas_agrupadas_despacho";
            tabla_3 = "detalles_notas_credito_despachos_clientes_agrupados";
            tabla_4 = "inv_facturas_agrupadas_despacho_d";
        }
        parametros.tabla_1 = tabla_1;
        parametros.tabla_2 = tabla_2;
        parametros.tabla_3 = tabla_3;
        parametros.tabla_4 = tabla_4;


        return G.Q.nfcall(that.m_notas.clienteNotaCredito, parametros);
    }).then(function (result) {

        cliente = result;

        return G.Q.nfcall(that.m_notas.consultarProductosNotasCredito, parametros);

    }).then(function (result) {

        productos = result;

        if (productos.length > 0) {
            reporte = 'notaFacturaPdf.html'; //'notaFactura.html';
        } else {
            reporte = 'notaFacturaSinProductoPdf.html'; //'notaFacturaSinProducto.html';
        }

        parametros.prefijo = nota[0].prefijo;
        parametros.factura_fiscal = nota[0].factura_fiscal;

        return G.Q.ninvoke(that.m_notas, 'porcentajes', parametros);

    }).then(function (resultado) {

        porcentajes_factura = resultado;

        return G.Q.nfcall(that.m_notas.ConsultarSubtotalFactura, parametros);

    }).then(function (resultado) {

        subtotal_factura = resultado;

        return G.Q.ninvoke(that.m_notas, 'consultarParametrosRetencion', {empresaId: parametros.empresa_id, fecha: cliente[0].anio_factura});

    }).then(function (resultado) {

        if (nota[0].concepto_id === 1 || nota[0].concepto_id === null) {

            if (resultado.length > 0) {
                valores.bases = resultado[0];
                productos.forEach(function (row) {

                    subTotal += parseFloat(row.subtotal);
                    totalIva += parseFloat(row.valor_iva);
                });

                if (subtotal_factura[0].subtotal >= parseFloat(resultado[0].base_rtf)) {
                    retencionFuente = (subTotal * ((porcentajes_factura[0].porcentaje_rtf) / 100));
                }

                if (subtotal_factura[0].subtotal >= parseFloat(resultado[0].base_ica)) {
                    retencionIca = (subTotal) * (parseFloat(porcentajes_factura[0].porcentaje_ica) / 1000);
                }

                if (subtotal_factura[0].subtotal >= parseFloat(resultado[0].base_reteiva)) {
                    retencionIva = (totalIva) * (parseFloat(porcentajes_factura[0].porcentaje_reteiva) / 100);
                }

                totalFactura = ((((parseFloat(totalIva) + parseFloat(subTotal)) - parseFloat(retencionFuente)) - parseFloat(retencionIca)) - parseFloat(retencionIva));

            }
        } else {
            valores.bases = resultado[0];
            subTotal = nota[0].valor_nota;
            totalFactura = nota[0].valor_nota;
        }

        valores.retencionIca = G.utils.numberFormat(retencionIca, 2);
        valores.retencionFuente = G.utils.numberFormat(retencionFuente, 2);
        valores.retencionIva = G.utils.numberFormat(retencionIva, 2);
        valores.ivaTotal = G.utils.numberFormat(parseFloat(totalIva), 2);
        valores.subTotal = G.utils.numberFormat(parseFloat(subTotal), 2);
        valores.totalFactura = G.utils.numberFormat(parseFloat(totalFactura), 2);
        valores.totalFacturaLetra = G.utils.numeroLetra(totalFactura);


        return G.Q.ninvoke(that.m_notas, 'listarEmpresa', parametros);

    }).then(function (result) {

        empresa = result;
        var info = {
            serverUrl: req.protocol + '://' + req.get('host') + "/",
            cliente: cliente[0],
            empresa: empresa[0],
            nota: nota[0],
            parametros: parametros,
            productos: productos,
            usuario: req.session.user.nombre_usuario,
            archivoHtml: reporte,
            valores: valores
        };

        return G.Q.nfcall(__generarPdf, info);

    }).then(function (resultado) {

        var informacion = {
            empresa: empresa[0],
            nota: nota[0],
            parametros: parametros,
            productos: productos,
            usuario: req.session.user.nombre_usuario,
            valores: valores,
            pdf: resultado
        };

        callback(false, informacion);

    }).fail(function (err) {
        console.log("Error  ", err);
        callback(err);
    }).done();
}
;

function __recorreListado(that, listado, parametros, index, transaccion, callback) {

    var item = listado[index];
    if (!item) {
        callback(false, 0);
        return;
    }

    parametros.observacion = item.observacion;
    parametros.valor = item.total_nota;
    parametros.item_id = item.item_id;
    parametros.valor_iva = ((item.cantidad_ingresada * (item.porc_iva / 100)) * item.cantidad);
    parametros.valor_rtf = 0;
    parametros.valor_ica = 0;

    return G.Q.nfcall(that.m_notas.agregarDetalleNotaDebito, parametros, transaccion).then(function (resultado) {
        var timer = setTimeout(function () {
            clearTimeout(timer);
            index++;
            __recorreListado(that, listado, parametros, index, transaccion, callback);
        }, 0);

    }).fail(function (err) {
        console.log("error", err);
        callback(err);

    }).done();

}
;

function __recorreListadoCredito(that, listado, parametros, index, transaccion, callback) {

    var item = listado[index];
    if (!item) {
        callback(false, 0);
        return;
    }

    parametros.observacion = item.observacion;
    parametros.valor = item.total_nota;
    parametros.item_id = item.item_id;
    parametros.valor_iva = ((item.cantidad_ingresada * (item.porc_iva / 100)) * item.cantidad);
    parametros.valor_rtf = 0;
    parametros.valor_ica = 0;
    parametros.movimiento_id = item.movimiento_id;

    return G.Q.nfcall(that.m_notas.agregarDetalleNotaCredito, parametros, transaccion).then(function (resultado) {
        var timer = setTimeout(function () {
            clearTimeout(timer);
            index++;
            __recorreListadoCredito(that, listado, parametros, index, transaccion, callback);
        }, 0);

    }).fail(function (err) {
        console.log("error", err);
        callback(err);

    }).done();

}
;

/**
 * +Descripcion Funcion encargada de generar el reporte hmtl procesando los datos enviados
 */
function __generarHtml(datos, callback) {

    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/Notas/reports/' + datos.archivoHtml, 'utf8'),
            recipe: "html",
            engine: 'jsrender',
            style: G.dirname + "/public/stylesheets/bootstrap.min.css",
            helpers: G.fs.readFileSync('app_modules/Notas/reports/javascripts/helpers.js', 'utf8'),
            phantom: {
                margin: "10px",
                width: '700px'
            }
        },
        data: datos
    }, function (err, response) {

        response.body(function (body) {
            var fecha = new Date();

            var nombreTmp = "nota" + datos.parametros.numeroNota + "-" + fecha.getTime() + ".html";

            G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body, "binary", function (err) {
                if (err) {
                    callback(true, err);
                    return;
                } else {
                    callback(false, nombreTmp);
                    return;
                }
            });
        });
    });
}

/**
 * +Descripcion Funcion encargada de generar el reporte pdf procesando los datos enviados
 */
function __generarPdf(datos, callback) {
//    datos.style = G.dirname + "/public/stylesheets/facturacion/style.css";
//console.log("datos",datos);
    var logo = G.base64Img.base64Sync("public/images/logocliente.png", function (err, data) {});
    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/Notas/reports/' + datos.archivoHtml, 'utf8'),
            helpers: G.fs.readFileSync('app_modules/CajaGeneral/reports/javascripts/helpers.js', 'utf8'),
            recipe: "phantom-pdf",
            engine: 'jsrender',
            phantom: {
                margin: "10px",
                width: '792px',
                headerHeight: "260px", // .imagent{position: absolute;top: 10px;}
                header:
                        `<style>
                            p {margin-top:0; margin-bottom:0;line-height: 75%; }
                            .letra_factura{font: 100% sans-serif;
                                           display: flex;
                                            justify-content: center;
                                            align-content: center;
                                            flex-direction: column;}
                            .letra_factura2{font: 100% sans-serif;margin-top:8px;   position: absolute;
                                           top: 13px;}
                            .imgQr{
//                                  position: absolute;
                                    top: 20px;
                                    margin:20px;
//                                  display:block;
                                    }
                            .letra_factura_info{font: 50% sans-serif;text-align: center;}
                            .letra_factura_info_ctr{font: 40% sans-serif; text-align: center;}
                            .letra_factura_info_jst{font: 40% sans-serif; text-align: justify; text-justify: inter-word;}
                            .letra_factura_info_40{font: 40% sans-serif;text-align: center;}
                            .letra_factura_info_40_jt{font: 40% sans-serif;text-align: justify;}
                           
                         </style>
                         <table border='0' width='100%' >
                           <tr>
                            <td align="center" width='40%'>
                                <p class="letra_factura_info">` + datos.empresa.tipo_id_tercero + `: ` + datos.empresa.id + ` - ` + datos.empresa.digito_verificacion + `</p>
                                <p class="letra_factura_info">` + datos.empresa.direccion + ` TELEFONO : ` + datos.empresa.telefonos + `</p>
                                <p class="letra_factura_info">` + datos.empresa.pais + ` - ` + datos.empresa.departamento + ` - ` + datos.empresa.municipio + `</p>
                            <td>
                            <td width='30%'> 
                                <p ><img  src="` + logo + `"  border='0' width="300px" height="80px"></p>                         
                            <td>
                            <td width='30%' valign="top">
                                 <b><p align="center" valign="top" >&nbsp;</p></b>                                                          
                                 <b><p align="center" valign="top" >NOTA ` + datos.parametros.nombreNota+ `</p></b>  
                                 <b><p align="center" valign="top" style="margin-top:3px;" >` + datos.parametros.numeroNota + `</p></b> 
                            <td>
                           </tr>
                         </table>
                            `
            }
        },
        data: datos
    }, function (err, response) {

        response.body(function (body) {
            var fecha = new Date();

            var nombreTmp = "nota" + datos.parametros.numeroNota + "-" + fecha.getTime() + ".pdf";

            G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body, "binary", function (err) {
                if (err) {
                    callback(true, err);
                    return;
                } else {
                    callback(false, nombreTmp);
                    return;
                }
            });
        });
    });
}

function __productos(productos, index, productosDian, callback) {
    var item = productos[index];

    if (!item) {
        callback(false, productosDian);
        return;
    }

    var prod = {//OPCIONAL
        cantidad: parseFloat(item.cantidad).toFixed(0),
        descripcion: item.descripcion, //String OPCIONAL -
        identificador: item.codigo_producto, //String -
        imprimible: true, //boolean -
        pagable: true, //boolean -
        valorUnitario: parseFloat(item.valor_unitario).toFixed(2)
    };
    var impuesto;
    var ivaPorcentaje = parseInt(item.porc_iva);
    if (ivaPorcentaje === 0) {
        impuesto = {
            nombre: "IVA0",
            baseGravable: item.porc_iva,
            valor: (parseFloat(item.iva_total).toFixed(2)).replace(",", ".")

        };
    }
    ;
    if (ivaPorcentaje === 19) {
        impuesto = {
            nombre: "IVA19",
            baseGravable: item.porc_iva,
            valor: (parseFloat(item.iva_total).toFixed(2)).replace(",", ".")
        }

    }
    ;
    if (ivaPorcentaje === 10) {
        impuesto = {
            nombre: "IVA10",
            baseGravable: item.porc_iva,
            valor: (parseFloat(item.iva_total).toFixed(2)).replace(",", ".")
        };
    }
    ;
    prod.listaImpuestosDeducciones = impuesto;
    productosDian.push(prod);

    var timer = setTimeout(function () {
        index++;
        __productos(productos, index, productosDian, callback);
        clearTimeout(timer);
    }, 0);
}



Notas.$inject = ["m_notas", "m_sincronizacion", "m_facturacion_proveedores", "m_facturacion_clientes", "c_sincronizacion"];
module.exports = Notas;