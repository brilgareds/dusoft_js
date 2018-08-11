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
//
///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion  Metodo encargado de generar las consultas para imprimir las facturas notas
// * @fecha 2017-06-13 (YYYY-MM-DD)
// */
//Notas.prototype.imprimirFacturaNotas = function(req, res) {
//
//    var that = this;
//    var args = req.body.data;
//    var total = {totalFactura: 0, totalGravamen: 0};
//    var empresa = [];
//    var cliente = [];
//    var conceptosDetalle = [];
//    var impuesto;
//    var nombre_pdf = "";
//
//
//    var parametros = {
//	empresaId: args.empresaId,
//	empresa_id: args.empresaId,
//	facturaFiscal: args.facturaFiscal,
//	factura: args.facturaFiscal,
//	prefijo: args.prefijo
//    };
//
//    G.Q.ninvoke(that.m_notas, 'listarFacturasNotas', parametros).then(function(result) {
//	
//	conceptosDetalle = result;
//	parametros.terceroId= conceptosDetalle[0].tercero_id;
//        parametros.tipoIdTercero= conceptosDetalle[0].tipo_id_tercero;
//	var totales = {totalFactura:0,totalGravamen:0};
//	return G.Q.nfcall(__valorTotalGravamen, 0, result,totales);
//	
//    }).then(function(result) {
//	
//    	parametros.totalFactura = result.totalFactura;
//	parametros.totalGravamen = result.totalGravamen;
//	return G.Q.nfcall(__traerPorcentajeImpuestos, that, parametros);
//
//    }).then(function(result) {
//
//	impuesto = result;
//	impuesto.empresaId = parametros.empresaId;
//	impuesto.prefijo = parametros.prefijo;
//	impuesto.factura = parametros.facturaFiscal;
//	parametros.totalAbono = impuesto.totalGeneral;
//	parametros.totalEfectivo = impuesto.totalGeneral;
//	parametros.totalCheque = 0;
//	parametros.totalTarjeta = 0;
//	parametros.totalAbonos = 0;
//
//	var parametrosEmpresa = {
//	    tercero: {
//		id: parametros.terceroId,
//		tipoDocumento: {id: parametros.tipoIdTercero},
//		empresa_id: parametros.empresaId
//	    }
//	};
//
//	return G.Q.ninvoke(that.m_gestion_terceros, 'obtenerTercero', parametrosEmpresa);
//
//    }).then(function(result) {
//
//	cliente = result;
//	return G.Q.ninvoke(that.m_notas, 'listarEmpresa', parametros);
//
//    }).then(function(result) {
//	empresa = result;
//	var informacion = {
//	    serverUrl: req.protocol + '://' + req.get('host') + "/",
//	    empresa: empresa[0],
//	    cliente: cliente[0],
//	    parametros: parametros,
//	    conceptosDetalle: conceptosDetalle,
//	    informacion: __infoFooter(parametros.prefijo),
//	    usuario: req.session.user.nombre_usuario,
//	    archivoHtml: 'facturaConceptos.html',
//	    impuesto: impuesto
//	};
//	return G.Q.nfcall(__generarPdf, informacion);
//	
//    }).then(function(result) {
//	
//	res.send(G.utils.r(req.url, 'Guardado Correctamente', 200, {imprimirFacturaNotas: result}));
//
//    }). catch (function(err) {
//	console.log("error transaccion ", err);
//	res.send(G.utils.r(req.url, err, 500, {}));
//    }).done();
//};
//
///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion  Metodo encargado de generar las consultas de los detalles de las notas para su impresion
// * @fecha 2017-06-13 (YYYY-MM-DD)
// */
//Notas.prototype.imprimirFacturaNotasDetalle = function(req, res) {
// 
//    var that = this;
//    var args = req.body.data;
//    var total = {totalFactura: 0, totalGravamen: 0};
//    var empresa = [];
//    var cliente = [];
//    var conceptosDetalle = [];
//    var impuesto;
//    var nombre_pdf = "";
//
//
//    var parametros = {
//	empresaId: args.empresaId,
//	empresa_id: args.empresaId,
//	facturaFiscal: args.facturaFiscal,
//	factura: args.facturaFiscal,
//	prefijo: args.prefijo
//    };
//
//    G.Q.ninvoke(that.m_notas, 'listarFacturasNotas', parametros).then(function(result) {
//	
//	conceptosDetalle = result;
//	parametros.terceroId= conceptosDetalle[0].tercero_id;
//        parametros.tipoIdTercero= conceptosDetalle[0].tipo_id_tercero;
//	var totales = {totalFactura:0,totalGravamen:0};
//	return G.Q.nfcall(__valorTotalGravamen, 0, result,totales);
//	
//    }).then(function(result) {
//	
//    	parametros.totalFactura = result.totalFactura;
//	parametros.totalGravamen = result.totalGravamen;
//	return G.Q.nfcall(__traerPorcentajeImpuestos, that, parametros);
//
//    }).then(function(result) {
//
//	impuesto = result;
//	impuesto.empresaId = parametros.empresaId;
//	impuesto.prefijo = parametros.prefijo;
//	impuesto.factura = parametros.facturaFiscal;
//	parametros.totalAbono = impuesto.totalGeneral;
//	parametros.totalEfectivo = impuesto.totalGeneral;
//	parametros.totalCheque = 0;
//	parametros.totalTarjeta = 0;
//	parametros.totalAbonos = 0;
//
//	var parametrosEmpresa = {
//	    tercero: {
//		id: parametros.terceroId,
//		tipoDocumento: {id: parametros.tipoIdTercero},
//		empresa_id: parametros.empresaId
//	    }
//	};
//
//	return G.Q.ninvoke(that.m_gestion_terceros, 'obtenerTercero', parametrosEmpresa);
//
//    }).then(function(result) {
//
//	cliente = result;
//	return G.Q.ninvoke(that.m_notas, 'listarEmpresa', parametros);
//
//    }).then(function(result) {
//	empresa = result;
//	var informacion = {
//	    serverUrl: req.protocol + '://' + req.get('host') + "/",
//	    empresa: empresa[0],
//	    cliente: cliente[0],
//	    parametros: parametros,
//	    conceptosDetalle: conceptosDetalle,
//	    informacion: __infoFooter(parametros.prefijo),
//	    usuario: req.session.user.nombre_usuario,
//	    archivoHtml: 'facturaConceptos.html',
//	    impuesto: impuesto
//	};
//	return G.Q.nfcall(__generarPdf, informacion);
//	
//    }).then(function(result) {
//	
//	res.send(G.utils.r(req.url, 'Guardado Correctamente', 200, {imprimirFacturaNotas: result}));
//
//    }). catch (function(err) {
//	console.log("error transaccion ", err);
//	res.send(G.utils.r(req.url, err, 500, {}));
//    }).done();
//};
//
///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion  Metodo encargado de crear el texto del footer segun prefijo
// * @fecha 2017-07-13 (YYYY-MM-DD)
// */
//function __infoFooter(prefijo) {
//    var informacion = {};
//    
//    informacion.consignacion = "SIRVASE CONSIGNAR A FAVOR DE DUANA Y CIA LTDA LA SUMA CORRESPONDIENTE EN LAS CUENTAS CORRIENTES:";
//    informacion.bancos = "BBVA No. 50200364-3, COLPATRIA No 050104834-8, BANCO OCCIDENTE No 025041252.";
//    
//    switch (prefijo) {
//	case "FB":
//	    informacion.linea1 = "AUTORIZADOS POR LA DIAN PARA FACTURAR  SEGUN RESOLUCION No 310000061722 DE CALI FECHA 24 DE MAYO DE 2012 ";
//	    informacion.linea2 = "DEL 4331 AL 6000. SOMOS GRANDES CONTRIBUYENTES, NO EFECTUAR RETENCIONDE IVA RES. No 15633 DEL 18/12/2007-ACT. ";
//	    informacion.linea3 = "ECONOMICA 201-04 ICA  EN CALI 3.3 X 1.000.";
//	    break;
//	case "FE":
//	    informacion.linea1 = "AUTORIZADOS POR LA DIAN PARA FACTURAR SEGUN RESOLUCION No 310000070278 DE CALI FECHA 04 DE ABRIL DE 2013";
//	    informacion.linea2 = "DEL 4331 AL 6000. SOMOS GRANDES CONTRIBUYENTES, NO EFECTUAR RETENCIONDE IVA RES. No 15633 DEL 18/12/2007-ACT.";
//	    informacion.linea3 = "ECONOMICA 201-04 ICA EN CALI 3.3 X 1.000.";
//	    break;
//	case "BM":
//	    informacion.linea1 = "AUTORIZADOS POR LA DIAN PARA FACTURAR SEGUN RESOLUCION No 310000071348 DE CALI FECHA 25 DE JUNIO DE 2013 ";
//	    informacion.linea2 = "DEL 1118 AL 3000. SOMOS GRANDES CONTRIBUYENTES, NO EFECTUAR RETENCIONDE IVA RES. No 15633 DEL 18/12/2007-ACT. ";
//	    informacion.linea3 = "ECONOMICA 201-04 ICA EN CALI 3.3 X 1.000.";
//	    break;
//	default:
//	    informacion.linea1 = "";
//	    informacion.linea2 = "";
//	    informacion.linea3 = "";
//	    break;
//    }
//    return informacion;
//}
//
///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion  Metodo encargado de consultar los impuestos por tercero
// * @fecha 2017-07-13 (YYYY-MM-DD)
// */
//Notas.prototype.consultarImpuestosTercero = function(req, res) {
//    var retencionTercero;
//    var args = req.body.data;
//    var that = this;
//    
//    var obj={
//	empresaId : args.empresaId,
//	empresa_id : args.empresaId,
//	tipoIdTercero : args.tipoIdTercero,
//	terceroId : args.terceroId,
//	anio: args.anio
//    };
//    
//    G.Q.ninvoke(that.m_facturacion_clientes, 'consultarTerceroContrato', obj).then(function(resultado) {
//       
//	retencionTercero = resultado[0];
//	return  G.Q.ninvoke(that.m_facturacion_proveedores, 'listarParametrosRetencion', obj);
//
//    }).then(function(result) {
//	var retencion = result[0];
//	res.send(G.utils.r(req.url, 'Listar Impuestos', 200, {retencion: retencion,retencionTercero:retencionTercero}));
//
//    }). catch (function(err) {
//	console.log("error transaccion ", err);
//	res.send(G.utils.r(req.url, err, 500, {}));
//    }).done();
//};
//
///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion  Metodo encargado de calcular el total del valor gravamen
// * @fecha 2017-05-08 (YYYY-MM-DD)
// */
//function __valorTotalGravamen(index, conceptosDetalle,total,callback){
//
//   var totales = conceptosDetalle[index];
//   
//   if (!totales) {
//	callback(false, total);
//	return;
//    }
//    
//    total.totalFactura+=parseInt(totales.valor_total);
//    total.totalGravamen+=parseInt(totales.valor_gravamen);
//    
//    index++;
//   var timer = setTimeout(function(){
//       
//    __valorTotalGravamen(index, conceptosDetalle,total,callback);
//    
//    clearTimeout(timer);
//    
//   }, 0);
//  
//};
//
///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion  Metodo encargado de calcular los impuestos de la notas
// * @fecha 2017-07-13 (YYYY-MM-DD)
// */
//function __traerPorcentajeImpuestosNotas(that, obj, callback) {
//    var retencion;
//    G.Q.ninvoke(that.m_facturacion_clientes, 'consultarTerceroContrato', obj).then(function(resultado) {
//       
//	retencion = resultado[0];
//	return  G.Q.ninvoke(that.m_facturacion_proveedores, 'listarParametrosRetencion', obj);
//
//    }).then(function(result) {
//	var parametros = result[0];
//	
//	var impuestos = {
//	    porcentajeRtf: '0',
//	    porcentajeIca: '0',
//	    porcentajeReteiva: '0',
//	    porcentajeCree: '0',
//	    swRtf: parametros.sw_rtf,
//	    swIca: parametros.sw_ica,
//	    swReteiva: parametros.sw_reteiva,
//            totalGeneral:0,
//	    retencionFuente:0,
//	    retencionIca:0,
//	    valorSubtotal:0,
//	    valorSubtotalFactura:0
//	};
//	impuestos.valorSubtotalFactura = obj.totalFactura - obj.totalGravamen;
//	
//	if (parametros.sw_rtf === '2' || parametros.sw_rtf === '3'){
//	   
//	    if (impuestos.valorSubtotalFactura >= parametros.base_rtf) {
//
//	       impuestos.retencionFuente = obj.totalNota * (retencion.porcentaje_rtf / 100);
//
//	    }
//	}
//	
//	if (parametros.sw_ica === '2' || parametros.sw_ica === '3'){
//	    
//	    if (impuestos.valorSubtotalFactura >= parametros.base_ica) {
//	       impuestos.retencionIca = obj.totalNota * (retencion.porcentaje_ica / 1000);
//	    }
//	}
//	
//	impuestos.valorSubtotal =obj.totalNota;
//	impuestos.iva = obj.totalGravamenNota;
//	impuestos.totalGeneral = impuestos.valorSubtotal + obj.totalGravamenNota - (impuestos.retencionFuente + impuestos.retencionIca);
//	
//	var timer = setTimeout(function() {
//	    callback(false, impuestos);
//	    clearTimeout(timer);
//
//	}, 0);
//	
//    }).fail(function(err) {
//	console.log("Error __traerPorcentajeImpuestosNotas", err);
//	callback(err);
//    }).done();
//}
//
///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion  Metodo encargado de calcular los impuestos de la factura
// * @fecha 2017-07-13 (YYYY-MM-DD)
// */
//function __traerPorcentajeImpuestos(that, obj, callback) {
//
//    var parametros;
//    var retencion;
//
//    G.Q.ninvoke(that.m_facturacion_clientes, 'consultarTerceroContrato', obj).then(function(resultado) {
//  
//	
//	if (resultado.length > 0){
//	    
//	    retencion = resultado[0];
//	    return  G.Q.ninvoke(that.m_facturacion_proveedores, 'listarParametrosRetencion', obj);
//	
//	}else{
//	    
//	    throw {msj:'[consultarParametrosRetencion]: Consulta sin resultados 2', status: 404};  
//	}
//	
//    }).then(function(result) {
//
//	var parametros = result[0];
//	var impuestos = {
//	    porcentajeRtf: '0',
//	    porcentajeIca: '0',
//	    porcentajeReteiva: '0',
//	    porcentajeCree: '0',
//	    swRtf: parametros.sw_rtf,
//	    swIca: parametros.sw_ica,
//	    swReteiva: parametros.sw_reteiva,
//            totalGeneral:0,
//	    retencionFuente:0,
//	    retencionIca:0,
//	    valorSubtotal:0
//	};
//
//	if (parametros.sw_rtf === '1' || parametros.sw_rtf === '3')
//	    impuestos.porcentajeRtf = retencion.porcentaje_rtf;
//	if (parametros.sw_ica === '1' || parametros.sw_ica === '3')
//	    impuestos.porcentajeIca = retencion.porcentaje_ica;
//	if (parametros.sw_reteiva === '1' || parametros.sw_reteiva === '3')
//	    impuestos.porcentajeReteiva = retencion.porcentaje_reteiva;
//
//	if (retencion.porcentaje_cree !== undefined) {
//	    impuestos.porcentajeCree = retencion.porcentaje_cree;
//	}
//
//	impuestos.valorSubtotal = obj.totalFactura - obj.totalGravamen;
//	impuestos.iva = obj.totalGravamen;
//
//	if (impuestos.porcentajeRtf > 0) { 
//
//	    if (impuestos.valorSubtotal >= parametros.base_rtf) {
//		impuestos.retencionFuente = impuestos.valorSubtotal * (impuestos.porcentajeRtf / 100);
//		if (impuestos.retencionFuente > 0) {
//		    impuestos.retencionFuente = parseInt(impuestos.retencionFuente);
//		}
//	    }
//	}
//	if (impuestos.porcentajeIca > 0) {
//	    if (impuestos.valorSubtotal >= parametros.base_ica) {
//		
//		impuestos.retencionIca = impuestos.valorSubtotal * (impuestos.porcentajeIca / 1000);
//		
//		if (impuestos.retencionIca > 0) {
//		    impuestos.retencionIca = parseInt(impuestos.retencionIca);
//		}
//	    }
//	}
//	
//	impuestos.totalGeneral = impuestos.valorSubtotal + obj.totalGravamen - (impuestos.retencionFuente + impuestos.retencionIca);
//
//	callback(false, impuestos);
//
//    }).fail(function(err) {
//	console.log("Error __traerPorcentajeImpuestos ", err);
//	callback(err);
//    }).done();
//};
//
///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion  Metodo encargado de insertar factfacturas conceptos uno a uno
// * @fecha 2017-07-13 (YYYY-MM-DD)
// */
//function __insertarFacFacturasConceptos(that, index, conceptosDetalle, parametros, total, transaccion, callback) {
//
//    var conceptos = conceptosDetalle[index];
//
//    if (!conceptos) {
//	callback(false, total);
//	return;
//    }
//
//    conceptos.empresaId = parametros.empresaId;
//    conceptos.prefijo = parametros.prefijo;
//    conceptos.cajaId = parametros.cajaId;
//    conceptos.concepto = parametros.conceptoId;
//    conceptos.facturaFiscal = parametros.factura;
//    conceptos.porcentajeGravamen = conceptos.porcentaje_gravamen;
//    conceptos.valorTotal = conceptos.valor_total;
//    conceptos.swTipo = conceptos.sw_tipo;
//    conceptos.valorGravamen = conceptos.valor_gravamen;
//    conceptos.grupoConceptoId = conceptos.grupo_concepto;
//
//    total.totalFactura += parseInt(conceptos.valorTotal);
//    total.totalGravamen += parseInt(conceptos.valorGravamen);
//
//    G.Q.ninvoke(that.m_notas, 'insertarFacFacturasConceptos', conceptos, transaccion).then(function(resultado) {
//
//	conceptos.id = resultado[0].fac_factura_concepto_id;
//	return G.Q.ninvoke(that.m_notas, 'insertarFacFacturasConceptosDc', conceptos, transaccion);
//
//    }).then(function(result) {
//    if (result.rowCount >= 1) {
//	index++;
//	var timer = setTimeout(function() {
//	    __insertarFacFacturasConceptos(that, index, conceptosDetalle, parametros, total, transaccion, callback);
//	    clearTimeout(timer);
//
//	}, 0);
//
//    } else {
//	throw 'Error en __insertarFacFacturasConceptos ';
//    }
//    }).fail(function(err) {
//	console.log("Error __insertarFacFacturasConceptos ", err);
//	callback(err);
//    }).done();
//
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

            var nombreTmp = "nota" + datos.parametros.numeroNota + "" + datos.parametros.prefijo + "" + datos.parametros.factura + "-" + fecha.getTime() + ".html";

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