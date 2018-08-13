var Notas = function (m_notas, m_sincronizacion, m_facturacion_proveedores, m_facturacion_clientes, m_gestion_terceros) {
    this.m_notas = m_notas;
    this.m_sincronizacion = m_sincronizacion;
    this.m_facturacion_proveedores = m_facturacion_proveedores;
    this.m_facturacion_clientes = m_facturacion_clientes;
    this.m_gestion_terceros = m_gestion_terceros;
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

    var parametros = {
        tipoFactura: args.tipoFactura,
        empresa_id: args.empresa_id,
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
    var tabla, tabla2;
    var numeroNota;

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
    }
    if (args.tipo_factura === 1) {
        tabla = "notas_debito_despachos_clientes_agrupados";
        tabla2 = "detalles_notas_debito_despachos_clientes_agrupados";
    }


    var parametros = {
        empresaId: args.empresaId,
        prefijo: args.prefijo,
        factura_fiscal: args.factura_fiscal,
        usuario_id: usuarioId,
        valor: args.valor,
        tipo_factura: args.tipo_factura,
        tabla_1: tabla,
        tabla_2: tabla2

    };

    G.knex.transaction(function (transaccion) {


        G.Q.nfcall(that.m_notas.agregarCabeceraNotaDebito, parametros, transaccion).then(function (result) {

            numeroNota = result[0];
            parametros.nota_debito_despacho_cliente_id = result[0];

            return G.Q.nfcall(__recorreListado, that, args.listado, parametros, 0, transaccion);

        }).then(function () {
            transaccion.commit(numeroNota);
        }).fail(function (err) {
            transaccion.rollback(err);
        }).done();
    }).then(function (resultado) {
        res.send(G.utils.r(req.url, 'Nota creada Correctamente', 200, {crearNota: numeroNota}));
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
    var tabla, tabla2;
    var numeroNota;

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
    }
    if (args.tipo_factura === 1) {
        tabla = "notas_credito_despachos_clientes_agrupados";
        tabla2 = "detalles_notas_credito_despachos_clientes_agrupados";
    }


    var parametros = {
        empresaId: args.empresaId,
        prefijo: args.prefijo,
        factura_fiscal: args.factura_fiscal,
        usuario_id: usuarioId,
        valor: args.valor,
        tipo_factura: args.tipo_factura,
        tabla_1: tabla,
        tabla_2: tabla2

    };
    if (args.tipo_nota === 1) {

        G.knex.transaction(function (transaccion) {
            parametros.tipoNota = 'VALOR';

            G.Q.nfcall(that.m_notas.agregarCabeceraNotaCredito, parametros, transaccion).then(function (result) {

                numeroNota = result[0];
                parametros.nota_credito_despacho_cliente_id = result[0];

                return G.Q.nfcall(__recorreListadoCredito, that, args.listado, parametros, 0, transaccion);

            }).then(function () {
                transaccion.commit(numeroNota);
            }).fail(function (err) {
                transaccion.rollback(err);
            }).done();
        }).then(function (resultado) {
            res.send(G.utils.r(req.url, 'Nota creada Correctamente', 200, {crearNota: numeroNota}));
        }).catch(function (err) {
            console.log("crearNota  ", err);
            res.send(G.utils.r(req.url, 'Error al crear la nota', 500, {}));
        }).done();

    } else if (args.tipo_nota === 2) {

        G.knex.transaction(function (transaccion) {

            parametros.tipoNota = 'DEVOLUCION';
            G.Q.nfcall(that.m_notas.agregarCabeceraNotaCreditoDevolucion, parametros, transaccion).then(function (result) {

                numeroNota = result[0];
                parametros.nota_credito_despacho_cliente_id = result[0];

                return G.Q.nfcall(__recorreListado, that, args.listado, parametros, 0, transaccion);

            }).then(function () {
                transaccion.commit(numeroNota);
            }).fail(function (err) {
                transaccion.rollback(err);
            }).done();
        }).then(function (resultado) {
            res.send(G.utils.r(req.url, 'Nota creada Correctamente', 200, {crearNota: numeroNota}));
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
Notas.prototype.imprimirNota = function (req, res) {
    console.log("*************ESTA IMPRIMIO OK imprimirNota*****************");
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

        return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarParametrosRetencion', {empresaId: parametros.empresa_id});

    }).then(function (resultado) {

        if (resultado.length > 0) {
            productos.forEach(function (row) {

                subTotal += parseFloat(row.subtotal);
                totalIva += parseFloat(row.valor_iva);
            });

            if (subTotal >= resultado[0].base_rtf) {
                retencionFuente = (subTotal * ((resultado[0].porcentaje_rtf) / 100));
            }

            if (subTotal >= resultado[0].base_ica) {
                retencionIca = (subTotal) * (parseFloat(resultado[0].porcentaje_ica) / 1000);
            }

            if (subTotal >= resultado[0].base_reteiva) {
                retencionIva = (totalIva) * (parseFloat(resultado[0].porcentaje_reteiva) / 100);
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
            archivoHtml: 'notaFactura.html',
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

        return G.Q.ninvoke(that.m_facturacion_clientes, 'consultarParametrosRetencion', {empresaId: parametros.empresa_id});

    }).then(function (resultado) {

        if (resultado.length > 0) {
            productos.forEach(function (row) {

                subTotal += parseFloat(row.subtotal);
                totalIva += parseFloat(row.valor_iva);
            });

            if (subTotal >= resultado[0].base_rtf) {
                retencionFuente = (subTotal * ((resultado[0].porcentaje_rtf) / 100));
            }

            if (subTotal >= resultado[0].base_ica) {
                retencionIca = (subTotal) * (parseFloat(resultado[0].porcentaje_ica) / 1000);
            }

            if (subTotal >= resultado[0].base_reteiva) {
                retencionIva = (totalIva) * (parseFloat(resultado[0].porcentaje_reteiva) / 100);
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
            archivoHtml: 'notaFactura.html',
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
//
///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion  Metodo encargado para sincronizar las facturas generadas en caja general 
// * @fecha 2017-06-13 (YYYY-MM-DD)
// */
//Notas.prototype.sincronizarFacturaNotas = function(req, res) {
//        var that = this;
//        var args = req.body.data.sincronizarFI;
//	
//	if (args.empresaId === undefined) {
//        res.send(G.utils.r(req.url, 'No Esta Definido empresaId', 404, {}));
//        return;
//	}
//	
//	if (args.prefijo === undefined) {
//        res.send(G.utils.r(req.url, 'No Esta Definido el prefijo', 404, {}));
//        return;
//	}
//	
//	if (args.factura === undefined) {
//        res.send(G.utils.r(req.url, 'No Esta Definido la factura', 404, {}));
//        return;
//	}
//	
//        var paramt = [];
//        paramt[0] = args.empresaId;
//        paramt[1] = args.prefijo;
//        paramt[2] = args.factura;
//        var param = {param: paramt,funcion:'facturas_talonario_fi'};
//    
//       G.Q.ninvoke(that.m_sincronizacion,'sincronizarCuentasXpagarFi', param).then(function(resultado){       	    
//
//        res.send(G.utils.r(req.url, 'Factura sincronizada', 200, {respuestaFI: resultado})); 
//        
//	}).catch(function(err){
//	    console.log("ERROR",err);
//	   res.send(G.utils.r(req.url, err, 500, {err: err}));
//	}).done(); 
//};


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

    return G.Q.nfcall(that.m_notas.agregarDetalleNotaCredito, parametros, transaccion).then(function (resultado) {
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


function __generarPdf(datos, callback) {

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

Notas.$inject = ["m_notas", "m_sincronizacion", "m_facturacion_proveedores", "m_facturacion_clientes", "m_gestion_terceros"];
module.exports = Notas;