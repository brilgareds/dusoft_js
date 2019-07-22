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
// Notas.prototype.generarSincronizacionDianDebito = function (req, res) {
//
//     that = this;
//     var args = req.body.data;
//     var resultado;
//     var data;
//
//     G.Q.nfcall(__generarSincronizacionDianDebito, that, req).then(function (data) {
//         resultado = data;
//
//         return G.Q.nfcall(__productos, resultado.productos, 0, []);
//     }).then(function (productos) {
//
// var subTotal = resultado.valores.subTotal.replace(".", "");
// var total = resultado.valores.totalFactura.replace(".", "");
//         var json = {
//             codigoMoneda: "COP",
//             conceptoNota: "3", // falta validar
//             fechaExpedicion: resultado.nota.fecha_registro_nota,
//             fechaVencimiento: "", //falta
//             codigoDocumentoDian: resultado.cliente.tipo_id_tercero,
//             numeroIdentificacion: resultado.cliente.tercero_id,
//             identificadorFactura: resultado.nota.prefijo + "_" + resultado.nota.factura_fiscal + "_E",
//             nombreSucursal: "",
//             numeroNota: resultado.nota.numero,
//             observaciones: "", //falta
//             perfilEmision: "CLIENTE",
//             perfilUsuario: "CLIENTE",
//             productos: productos,
//             subtotalNotaDebitoElectronica: subTotal.replace(".", ""),
//             ReteFuente: resultado.valores.retencionFuente.replace(".", ""),
//             baseGravableReteFuente: resultado.valores.bases.base_rtf,
//             IVA: resultado.valores.ivaTotal.replace(".", ""),
//             baseGravableIVA: subTotal.replace(".", ""),
//             ReteICA: resultado.valores.retencionIca.replace(".", ""),
//             baseGravableReteICA: resultado.valores.bases.base_ica,
//             ReteIVA: resultado.valores.retencionIva.replace(".", ""),
//             baseGravableReteIVA: resultado.valores.bases.base_reteiva,
//             tipoFactura: "ELECTRONICA",
//             totalNotaDebitoElectronica: total.replace(".", ""),
//
//             coordXQr: 172,
//             coordYQr: 263,
//             coordXCufe: 67,
//             coordYCufe: 266,
//             pdf: G.base64.base64Encode(G.dirname + "/public/reports/" + resultado.pdf)
//         };
//
//         return G.Q.ninvoke(that.c_sincronizacion, 'facturacionElectronicaNotaDebito', json);
//
//     }).then(function (respuesta) {
//
//
//         data = respuesta;
//         var parametros = {
//             empresa_id: args.empresaId, //obj.parametros.parametros.direccion_ip.replace("::ffff:", ""),
//             prefijo: 'ND',
//             factura_fiscal: resultado.nota.numero,
//             sw_factura_dian: respuesta.sw_factura_dian,
//             json_envio: data.lastRequest,
//             respuesta_ws: data
//         };
//
//         if (respuesta.sw_factura_dian === '1') {
//
//             return G.Q.ninvoke(that.m_facturacion_clientes, 'insertarLogFacturaDian', parametros);
//
//         } else if (respuesta.sw_factura_dian === '0') {
//
//             return G.Q.ninvoke(that.m_facturacion_clientes, 'insertarLogFacturaDian', parametros);
//
//         }
//
//     }).then(function (resultado) {
//
//         if (data.sw_factura_dian === '1') {
//
//             res.send(G.utils.r(req.url, 'Sincronizacion correcta con Certicamara', 200, data));
//
//         } else if (data.sw_factura_dian === '0') {
//
//             res.send(G.utils.r(req.url, data.msj, data.status, data));
//
//         }
//
//     }).fail(function (err) {
//
//         res.send(G.utils.r(req.url, err.msj, err.status, err));
//
//     }).done();
//
// };

Notas.prototype.generarSincronizacionDianDebito = function (req, res) {
    console.log('Sincronizacion de debito!!!');

    that = this;
    var args = req.body.data.imprimir_reporte_factura;
    var productos;
    var resultado;
    var data;
    var Factura = this.m_facturas;
    var Pago = this.m_pago;
    var Facturador = this.m_facturador;
    var Adquiriente = this.m_adquiriente;
    var Resolucion = this.m_resolucion;
    var Numeracion = this.m_numeracion;

    G.Q.nfcall(__generarSincronizacionDian, that, req).then(function (data) {
        resultado = data;

        return G.Q.nfcall(__productosAdjunto, that, resultado.detalle, 0, []);
    }).then(function (productos) {
        var subTotal = resultado.valores.subTotal.replace(".", "");
        var total = resultado.valores.totalFactura.replace(".", "");
        Factura.set_Tipodocumento('FE');
        Factura.set_Versiondocumento('1.0');
        Factura.set_Registrar(false);
        Factura.set_Codigotipodocumento('01');
        Factura.set_Tipooperacion('10');
        Factura.set_Prefijodocumento(resultado.cabecera.prefijo);
        Factura.set_Numerodocumento(resultado.cabecera.factura_fiscal);
        Factura.set_Fechaemision(resultado.cabecera.fecha_registro);
        Factura.set_Numerolineas(resultado.detalle.length);
        Factura.set_Subtotal(subTotal);
        Factura.set_Totalbaseimponible(subTotal); // falta validar
        Factura.set_SubtotalMasTributos(total);
        Factura.set_TotalDescuentos(0);
        Factura.set_Totalcargos(0);
        Factura.set_Totalanticipos(0);
        Factura.set_Total(total);
        Factura.set_Codigomoneda('COP');
        /*-----Clase Pago------*/
        Pago.setId(1); // 1 Contado, 2 Credito
        Pago.setCodigoMedioPago('47'); // 47 Transferencia Bancaria
        /*--------------------*/
        Factura.set_Pago(Pago);

        Factura.set_Listaproductos(productos);

        const p1 = new Promise((resolve, reject) => {
            documentosAnexos(that, resultado.cabecera.pedido_array, 0, [], function (err, resul) {
                resolve(resul);
            });
        });

        /*-----Clase Facturador------*/
        Facturador.setRazonSocial(resultado.cabecera.razon_social);
        Facturador.setNombreRegistrado(resultado.cabecera.razon_social);
        Facturador.setTipoIdentificacion(codigoDocumentoDian(resultado.cabecera.tipo_id_empresa));
        Facturador.setIdentificacion(resultado.cabecera.id);
        Facturador.setDigitoVerificacion(resultado.cabecera.digito_verificacion);
        Facturador.setNaturaleza('1'); // 1- Juridica 2- Natural
        Facturador.setTelefono(resultado.cabecera.telefono_empresa);
        Facturador.setDireccion(resultado.cabecera.direccion_empresa);
        Facturador.setDireccionFiscal(resultado.cabecera.direccion_empresa);
        /*--------------------*/
        Factura.set_Facturador(Facturador);

        /*-----Clase Adquiriente------*/
        Adquiriente.setRazonSocial(resultado.cabecera.nombre_tercero);
        Adquiriente.setNombreRegistrado(resultado.cabecera.nombre_tercero);
        Adquiriente.setTipoIdentificacion(codigoDocumentoDian(resultado.cabecera.tipo_id_tercero));
        Adquiriente.setIdentificacion(resultado.cabecera.tercero_id);
        Adquiriente.setDigitoVerificacion(resultado.cabecera.dv);
        Adquiriente.setNaturaleza(resultado.cabecera.sw_persona_juridica === '0' ? '2' : '1'); // 1- Juridica 2- Natural
        Adquiriente.setTelefono(resultado.cabecera.telefono);
        Adquiriente.setDireccion(resultado.cabecera.direccion);
        Adquiriente.setDireccionFiscal(resultado.cabecera.direccion);
        Adquiriente.setSucursal('Principal');
        /*--------------------*/
        Factura.set_Adquiriente(Adquiriente); // otra clase
        Factura.set_Posicionxcufe(110);
        Factura.set_Posicionycufe(256);
        Factura.set_Posicionxqr(164);
        Factura.set_Posicionyqr(260);

        /*-----Clase Resolucion------*/
        Resolucion.setNumero(resultado.cabecera.prefijo === 'FDC' ? G.constants.IDENTIFICADOR_DIAN().IDENTIFICADOR_RESOLUCION : G.constants.IDENTIFICADOR_DIAN().IDENTIFICADOR_RESOLUCION_BQ);
        Resolucion.setFechaInicio('2018-08-30');
        Resolucion.setFechaFin('2020-08-30');
        /*-----Clase Resolucion------*/
        Numeracion.setPrefijo(resultado.cabecera.prefijo);
        Numeracion.setDesde(resultado.cabecera.prefijo === 'FDC' ? G.constants.IDENTIFICADOR_DIAN().DESDE : G.constants.IDENTIFICADOR_DIAN().DESDE_BQ);
        Numeracion.setHasta(resultado.cabecera.prefijo === 'FDC' ? G.constants.IDENTIFICADOR_DIAN().HASTA : G.constants.IDENTIFICADOR_DIAN().HASTA_BQ);
        Numeracion.setFechaInicio('2018-08-30');
        Numeracion.setFechaFin('2020-08-30');
        /*----------------------------*/
        Resolucion.setNumeracion(Numeracion);
        /*----------------------------*/
        Factura.set_Resolucion(Resolucion);
        return false;

        Promise.all([p1])
            .then(values => {
                Factura.set_Documentosanexos(values[0]);
                console.log("factura", Factura);
            }, reason => {
                console.log("reason", reason);
            });
        return false;
    }).fail(function (err) {
        res.send(G.utils.r(req.url, err.msj, err.status, err));
    }).done();
};

FacturacionClientes.prototype.generarSincronizacionDian = function (req, res) {
    that = this;
    var args = req.body.data.imprimir_reporte_factura;
    var productos;
    var resultado;
    var data;
    var Factura = this.m_facturas;
    var Pago = this.m_pago;
    var Facturador = this.m_facturador;
    var Adquiriente = this.m_adquiriente;
    var Resolucion = this.m_resolucion;
    var Numeracion = this.m_numeracion;

    G.Q.nfcall(__generarSincronizacionDian, that, req).then(function (data) {
        resultado = data;
//        console.log('Data: ', resultado);
        return G.Q.nfcall(__productosAdjunto, that, resultado.detalle, 0, []);

    }).then(function (productos) {

        var subTotal = resultado.valores.subTotal.replace(".", "");
        var total = resultado.valores.totalFactura.replace(".", "");
        Factura.set_Tipodocumento('FE');
        Factura.set_Versiondocumento('1.0');
        Factura.set_Registrar(false);
        // factura.set_Control(''); //falta que certicamara nos de el token
        Factura.set_Codigotipodocumento('01');
        Factura.set_Tipooperacion('10');
        Factura.set_Prefijodocumento(resultado.cabecera.prefijo);
        Factura.set_Numerodocumento(resultado.cabecera.factura_fiscal);
        Factura.set_Fechaemision(resultado.cabecera.fecha_registro);
        // factura.set_Horaemision('10'); // todavia no sabemos si enviarla
        // factura.set_Periodofacturacion('10'); // no se envia
        Factura.set_Numerolineas(resultado.detalle.length);
        Factura.set_Subtotal(subTotal);
        Factura.set_Totalbaseimponible(subTotal); // falta validar
        Factura.set_SubtotalMasTributos(total);
        Factura.set_TotalDescuentos(0);
        Factura.set_Totalcargos(0);
        Factura.set_Totalanticipos(0);
        Factura.set_Total(total);
        Factura.set_Codigomoneda('COP');
        // factura.set_Tasacambio(); // no se envia

        /*-----Clase Pago------*/
        Pago.setId(1); // 1 Contado, 2 Credito
        Pago.setCodigoMedioPago('47'); // 47 Transferencia Bancaria
        /*--------------------*/
        Factura.set_Pago(Pago); // otra clase

        Factura.set_Listaproductos(productos); // listado de otra clase
//        Factura.set_Listadescripciones(); // por validar
//        Factura.set_Listadocumentosreferenciados();
////        Factura.set_Notasreferenciadas(); // no se usa

        const p1 = new Promise((resolve, reject) => {
            documentosAnexos(that, resultado.cabecera.pedido_array, 0, [], function (err, resul) {
                resolve(resul);
            });
        });
//        const p2 = new Promise((resolve, reject) => {
//            gruposImpuestos(that, resultado.cabecera.pedido_array, 0, [], function (err, resul) {
//                resolve(resul);
//            });
//        });
//        documentosAnexos(that, resultado.cabecera.pedido_array, 0, [], function (err,resul) {
//            console.log("retorno",resul);
//            Factura.set_Documentosanexos(resul);
//        });
////        Factura.set_Listaanticipos(); // no se usa
////        Factura.set_Listacargosdescuentos(); // no se usa
////        Factura.set_Gruposdeducciones(); // no se usa

        /*-----Clase Facturador------*/
        Facturador.setRazonSocial(resultado.cabecera.razon_social);
        Facturador.setNombreRegistrado(resultado.cabecera.razon_social);
        Facturador.setTipoIdentificacion(codigoDocumentoDian(resultado.cabecera.tipo_id_empresa));
        Facturador.setIdentificacion(resultado.cabecera.id);
        Facturador.setDigitoVerificacion(resultado.cabecera.digito_verificacion);
        Facturador.setNaturaleza('1'); // 1- Juridica 2- Natural
//        Facturador.setCodigoRegimen();
//        Facturador.setResponsabilidadFiscal(); // por validar
//        Facturador.setCodigoImpuesto(); // por validar
//        Facturador.setNombreImpuesto(); // por validar
        Facturador.setTelefono(resultado.cabecera.telefono_empresa);
//        Facturador.setEmail(); // no se usa
//        Facturador.setContacto(); // no se usa
        Facturador.setDireccion(resultado.cabecera.direccion_empresa);
        Facturador.setDireccionFiscal(resultado.cabecera.direccion_empresa);
//        Facturador.setListaResponsabilidadesTributarias();
//        Facturador.setCodigoCIUU(); // no se usa
//        Facturador.setSucursal(); // no se usa
//        Facturador.setListaParticipantesConsorcio(); // no se usa
        /*--------------------*/
        Factura.set_Facturador(Facturador); // otra clase

        /*-----Clase Adquiriente------*/
        Adquiriente.setRazonSocial(resultado.cabecera.nombre_tercero);
        Adquiriente.setNombreRegistrado(resultado.cabecera.nombre_tercero);
        Adquiriente.setTipoIdentificacion(codigoDocumentoDian(resultado.cabecera.tipo_id_tercero));
        Adquiriente.setIdentificacion(resultado.cabecera.tercero_id);
        Adquiriente.setDigitoVerificacion(resultado.cabecera.dv);
        Adquiriente.setNaturaleza(resultado.cabecera.sw_persona_juridica === '0' ? '2' : '1'); // 1- Juridica 2- Natural
//        Adquiriente.setCodigoRegimen();
//        Adquiriente.setResponsabilidadFiscal(); // por validar
//        Adquiriente.setCodigoImpuesto(); // por validar
//        Adquiriente.setNombreImpuesto(); // por validar
        Adquiriente.setTelefono(resultado.cabecera.telefono);
//        Adquiriente.setEmail(); // no se usa
//        Adquiriente.setContacto(); // no se usa
        Adquiriente.setDireccion(resultado.cabecera.direccion);
        Adquiriente.setDireccionFiscal(resultado.cabecera.direccion);
//        Adquiriente.setListaResponsabilidadesTributarias(); // otra clase  por validar
//        Adquiriente.setCodigoCIUU(); // no se usa
        Adquiriente.setSucursal('Principal');
//        Adquiriente.setCentroCosto(); // no se usa
        /*--------------------*/
        Factura.set_Adquiriente(Adquiriente); // otra clase

//        Factura.set_Autorizado(); // no se usa
//        Factura.set_Entrega(); // no se usa
//        Factura.set_Urlanexos(); // no se usa
//        Factura.set_Base64(G.base64.base64Encode(G.dirname + "/public/reports/" + resultado.pdf));
        Factura.set_Posicionxcufe(110);
        Factura.set_Posicionycufe(256);
//        Factura.set_Rotacioncufe(0); // no se usa
//        Factura.set_Fuentecufe(); // no se usa
        Factura.set_Posicionxqr(164);
        Factura.set_Posicionyqr(260);
//        Factura.Factura.set_Fechaenvio(); // por validar
//        Factura.set_Descripciongeneral();

        /*-----Clase Resolucion------*/
        Resolucion.setNumero(resultado.cabecera.prefijo === 'FDC' ? G.constants.IDENTIFICADOR_DIAN().IDENTIFICADOR_RESOLUCION : G.constants.IDENTIFICADOR_DIAN().IDENTIFICADOR_RESOLUCION_BQ);
        Resolucion.setFechaInicio('2018-08-30');
        Resolucion.setFechaFin('2020-08-30');
        /*-----Clase Resolucion------*/
        Numeracion.setPrefijo(resultado.cabecera.prefijo);
        Numeracion.setDesde(resultado.cabecera.prefijo === 'FDC' ? G.constants.IDENTIFICADOR_DIAN().DESDE : G.constants.IDENTIFICADOR_DIAN().DESDE_BQ);
        Numeracion.setHasta(resultado.cabecera.prefijo === 'FDC' ? G.constants.IDENTIFICADOR_DIAN().HASTA : G.constants.IDENTIFICADOR_DIAN().HASTA_BQ);
        Numeracion.setFechaInicio('2018-08-30');
        Numeracion.setFechaFin('2020-08-30');
        /*----------------------------*/
        Resolucion.setNumeracion(Numeracion);
        /*----------------------------*/
        Factura.set_Resolucion(Resolucion);
//
//        Factura.set_ListaCorrecciones();

        Promise.all([p1])
            .then(values => {
//                    console.log("values",values);
                Factura.set_Documentosanexos(values[0]);
//                    Factura.set_Gruposimpuestos(values[1]);
                console.log("factura", Factura);
            }, reason => {
                console.log("reason", reason);
            });




//        console.log("factura", Factura);
        // return G.Q.ninvoke(that.c_sincronizacion, 'facturacionElectronica', json);
        return false;

        // }).then(function (respuesta) {
        //
        //     data = respuesta;
        //     var parametros = {
        //         empresa_id: args.empresaId,
        //         prefijo: resultado.cabecera.prefijo,
        //         factura_fiscal: resultado.cabecera.factura_fiscal,
        //         sw_factura_dian: respuesta.sw_factura_dian,
        //         json_envio: data.lastRequest,
        //         respuesta_ws: data
        //     };
        //
        //     if (respuesta.sw_factura_dian === '1') {
        //
        //         return G.Q.ninvoke(that.m_facturacion_clientes, 'insertarLogFacturaDian', parametros);
        //
        //     } else if (respuesta.sw_factura_dian === '0') {
        //
        //         return G.Q.ninvoke(that.m_facturacion_clientes, 'insertarLogFacturaDian', parametros);
        //
        //     }
        //
        // }).then(function (resultado) {
        //
        //     if (data.sw_factura_dian === '1') {
        //
        //         res.send(G.utils.r(req.url, 'Sincronizacion correcta con Certicamara', 200, data));
        //
        //     } else if (data.sw_factura_dian === '0') {
        //
        //         res.send(G.utils.r(req.url, data.msj, data.status, data));
        //
        //     }

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
//    var logo = G.base64Img.base64Sync("public/images/logocliente.png", function (err, data) {});
   // var logo ='data:image/png;base64,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';
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
                                <p ><img src="{#asset /logocliente.png @encoding=dataURI}" style="display:block" border='0' width="300px" height="80px"/></p>                         
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