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
    console.log("parametros",parametros);
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
        tipoFactura:args.tipoFactura,
        empresa_id: args.empresa_id,
        facturaFiscal: args.facturaFiscal
    };

    G.Q.ninvoke(that.m_notas, 'ConsultarDetalleFactura', parametros).then(function (resultado) {

        if (resultado.length > 0) {
            res.send(G.utils.r(req.url, 'detalleFactura', 200, {detalleFactura: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function (err) {
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion  Metodo encargado de insertar en la tabla insertarTmpDetalleConceptos
// * @fecha 2017-05-08 (YYYY-MM-DD)
// */
//Notas.prototype.insertarTmpDetalleConceptos = function(req, res) {
//
//    var that = this;
//    var args = req.body.data.datos;
//
//    if (args.empresa_id === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definido empresa_id', 404, {}));
//        return;
//    }
//    if (args.centro_utilidad === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos centro_utilidad', 404, {}));
//        return;
//    }
//    if (args.concepto_id === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos centro_utilidad', 404, {}));
//        return;
//    }
//    if (args.grupo_concepto === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos concepto_id', 404, {}));
//        return;
//    }
//    if (args.tipo_id_tercero === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos tipo_id_tercero', 404, {}));
//        return;
//    }
//    if (args.sw_tipo === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos sw_tipo', 404, {}));
//        return;
//    }
//    if (args.cantidad === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos cantidad', 404, {}));
//        return;
//    }
//    if (args.precio === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos precio', 404, {}));
//        return;
//    }
//    if (args.valor_total === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos valor_total', 404, {}));
//        return;
//    }
//    if (args.porcentaje_gravamen === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos porcentaje_gravamen', 404, {}));
//        return;
//    }
//    if (args.valor_gravamen === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos valor_gravamen', 404, {}));
//        return;
//    }
//    if (args.descripcion === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos descripcion', 404, {}));
//        return;
//    }
//    if (args.tipo_pago_id === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos tipo_pago_id', 404, {}));
//        return;
//    }
//
//    var parametros = args;
//    
//    var parametroscosulta = {
//	empresaId : args.empresa_id,
//	tipoIdTercero : args.tipo_id_tercero,
//	terceroId : args.tercero_id
//    };
//    
//
//    G.Q.ninvoke(that.m_facturacion_clientes, 'consultarTerceroContrato', parametroscosulta).then(function(resultado) {
//	
//     if (resultado.length > 0) {
//	 
//        return G.Q.ninvoke(that.m_notas, 'insertarTmpDetalleConceptos', parametros);
//       
//       } else {
//	   
//        throw 'El cliente no tiene configurado el contrato';
//	
//       }
//       
//     }).then(function(resultado) {
//	 
//        if (resultado.rowCount > 0) {
//	    
//            res.send(G.utils.r(req.url, 'insertarTmpDetalleConceptos', 200, {insertarTmpDetalleConceptos: 'Se Inserto el Concepto Correctamente'}));
//	    
//        } else {
//	    
//            throw 'Error al insertar temporal';
//        }
//
//    }).fail(function(err) {
//        console.log("Error insertarTmpDetalleConceptos ", err);
//        res.send(G.utils.r(req.url, err, 500, {}));
//    }).done();
//};
///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion  Metodo encargado de insertar las insertarFacFacturasConceptosNotas
// * @fecha 2017-05-08 (YYYY-MM-DD)
// */
//Notas.prototype.insertarFacFacturasConceptosNotas = function(req, res) {
//
//    var that = this;
//    var args = req.body.data;
//
//    if (args.descripcion === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definido descrpicion', 404, {}));
//        return;
//    }
//    if (args.empresaId === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definida la empresaId', 404, {}));
//        return;
//    }
//    if (args.bodega === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definida la bodega', 404, {}));
//        return;
//    }
//    if (args.facturaFiscal === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos facturaFiscal', 404, {}));
//        return;
//    }
//    if (args.porcentajeGravamen === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos porcentajeGravamen', 404, {}));
//        return;
//    }
//    if (args.swContable === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos swContable', 404, {}));
//        return;
//    }
//    if (args.prefijo === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos prefijo', 404, {}));
//        return;
//    }
//    if (args.valorNotaTotal === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos valorNotaTotal', 404, {}));
//        return;
//    } 
//    
//    var credito='506';
//    var debito='504';
//    
//    if(G.program.prod){
//      credito='502';
//      debito='504';
//     }
//       
//     var parametros = {
//	descripcion:args.descripcion,
//	empresaId:args.empresaId,
//	bodega:args.bodega.codigo,
//	facturaFiscal:args.facturaFiscal,
//	porcentajeGravamen:args.porcentajeGravamen,
//	prefijo:args.prefijo,
//	swContable:args.swContable,
//	valorNotaImpuestos:args.valorNotaImpuestos ,
//	usuarioId:req.body.session.usuario_id,
//	documentoId:args.swContable===1?credito:debito,
//	saldo : args.valorNotaTotal,
//	valorNotaTotal:args.valorNotaTotal
//    };
//		
//    parametros.valorNotaTotal = parseInt(parametros.valorNotaTotal)+parseInt(parametros.porcentajeGravamen);   
//    
//    G.knex.transaction(function(transaccion) {
//	
//	G.Q.nfcall(__crearPrefijoNumero,that, parametros,transaccion).then(function(resultado) {
//	    
//	    parametros.documentoId = args.swContable===1?credito:debito;
//	    parametros.prefijoNota = resultado[0].prefijo;
//	    parametros.numeroNota = resultado[0].numeracion;
//	
//	G.Q.ninvoke(that.m_notas, 'insertarFacFacturasConceptosNotas', parametros,transaccion);
//
//	}).then(function(resultado) {
//	    
//	   return G.Q.ninvoke(that.m_notas, 'actualizarSaldoFacturas', parametros,transaccion);
//
//	}).then(function(result) {
//
//	   transaccion.commit();
//
//	}).fail(function(err) {
//	    console.log("Error ",err);
//	    transaccion.rollback(err);
//	}).done();
//			
//			
//     }).then(function(result) {
//        
//	 res.send(G.utils.r(req.url, 'insertarFacFacturasConceptosNotas', 200, {insertarFacFacturasConceptosNotas: 'Se Inserto el Concepto Correctamente',resultado:result}));
//	
//    }). catch (function(err) {
//	 console.log("error transaccion ",err);
//         res.send(G.utils.r(req.url, err, 500, {}));
//    }).done();
//};
//
///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion  Metodo encargado de obtener la lista de las conceptos de las notas
// * @fecha 2017-05-08 (YYYY-MM-DD)
// */
//Notas.prototype.listarFacConceptosNotas = function(req, res) {
//
//    var that = this;
//    var args = req.body.data;
//  
//    if (args.facturaFiscal === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos facturaFiscal', 404, {}));
//        return;
//    }
//   
//    if (args.prefijo === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos prefijo', 404, {}));
//        return;
//    }
//   
//     var parametros = {			
//	facturaFiscal:args.facturaFiscal,			
//	prefijo:args.prefijo		
//     };
//
//    G.Q.ninvoke(that.m_notas, 'listarFacConceptosNotas', parametros).then(function(resultado) {
//	
//    if (resultado.length > 0) {
//	 res.send(G.utils.r(req.url, 'listarFacConceptosNotas', 200, {listarFacConceptosNotas:resultado}));
//
//    } else {
//	throw 'Consulta sin resultados';
//    }
//
//    }).fail(function(err) {
//        console.log("Error listarFacConceptosNotas ", err);
//        res.send(G.utils.r(req.url, err, 500, {}));
//    }).done();
//};
///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion  Metodo encargado de obtener la lista de los conceptos
// * @fecha 2017-05-08 (YYYY-MM-DD)
// */
//Notas.prototype.listarConceptosDetalle = function(req, res) {
//
//    var that = this;
//    var args = req.body.data.datos;
//    var conceptos={};
//    var mensaje="";
//    
//    if (args.empresa_id === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definido empresa_id', 404, {}));
//        return;
//    }
//    if (args.tipo_id_tercero === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos tipo_id_tercero', 404, {}));
//        return;
//    }
//    if (args.tercero_id === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos tercero_id', 404, {}));
//        return;
//    }
//    if (args.concepto_id === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definidos concepto_id', 404, {}));
//        return;
//    }
//    
//    var parametros={
//	terceroId : args.tercero_id,
//	empresa_id : args.empresa_id,
//	empresaId : args.empresa_id,
//	conceptoId : args.concepto_id,
//	tipoIdTercero : args.tipo_id_tercero
//    };
//    
//
//    G.Q.ninvoke(that.m_notas, 'listarConceptosDetalle', parametros).then(function(resultado) {
//       
//       if(resultado.length > 0){
//	   
//	conceptos.detalle=resultado;
//	var total={totalFactura:0,totalGravamen:0};
//	
//       return G.Q.nfcall(__valorTotalGravamen,0,resultado,total);
//	
//       }else{
//	   throw {msj:'[listarConceptosDetalle]: Consulta sin resultados', status: 404};
//       }
//       
//      }).then(function(result) {
//	  
//	parametros.totalFactura=result.totalFactura;
//	parametros.totalGravamen=result.totalGravamen;
//	
//	return G.Q.nfcall(__traerPorcentajeImpuestos,that,parametros);
//      
//     }).then(function(result) {
//	 	 
//        conceptos.impuestos=result;
//	
//        if (conceptos.detalle.length > 0) {
//	    
//            res.send(G.utils.r(req.url, 'listarConceptosDetalle', 200, {listarConceptosDetalle: conceptos}));
//	    
//        } else {
//	    mensaje="0";
//            throw 'Error al __traerPorcentajeImpuestos';
//        }
//
//    }).fail(function(err) {
//        console.log("Error listarConceptosDetalle ", err);
//        res.send(G.utils.r(req.url, err, 500, {listarConceptosDetalle: err}));
//    }).done();
//};
//
///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion  Metodo encargado de eliminar los tmp del detalle concepto
// * @fecha 2017-05-08 (YYYY-MM-DD)
// */
//Notas.prototype.eliminarTmpDetalleConceptos = function(req, res) {
//
//    var that = this;
//    var args = req.body.data.datos;
//
//    if (args.rc_concepto_id === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definido rc_concepto_id', 404, {}));
//        return;
//    }
//
//    var parametros = {rc_concepto_id: args.rc_concepto_id};
//
//    G.Q.ninvoke(that.m_notas, 'eliminarTmpDetalleConceptos', parametros).then(function(resultado) {
//
//    if (resultado > 0) {
//	res.send(G.utils.r(req.url, 'Temporal Eliminado Correctamente', 200, {eliminarTmpDetalleConceptos: resultado}));
//    } else {
//	throw 'Consulta sin resultados';
//    }
//
//    }).fail(function(err) {
//        console.log("Error eliminarTmpDetalleConceptos ", err);
//        res.send(G.utils.r(req.url, err, 500, {}));
//    }).done();
//};
//
///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion  Metodo encargado de guardar las facturas de caja general
// * @fecha 2017-06-13 (YYYY-MM-DD)
// */
//Notas.prototype.guardarFacturaNotas = function(req, res) {
//
//    var that = this;
//    var args = req.body.data;
//    var total ={totalFactura:0,totalGravamen:0};
//    var empresa=[];
//    var cliente=[];
//    var conceptosDetalle=[];
//    var impuesto;
//    var nombre_pdf="";
//
//    if (args.prefijoFac === undefined) {
//        res.send(G.utils.r(req.url, 'No Estan Definido rc_concepto_id', 404, {}));
//        return;
//    }
//    
//     var ip = req.headers['x-forwarded-for'] || 
//     req.connection.remoteAddress || 
//     req.socket.remoteAddress ||
//     req.connection.socket.remoteAddress;
//    
//     var parametros = {
//	documentoId: args.prefijoFac,
//	empresaId : args.empresaId, 
//	empresa_id : args.empresaId, 
//	estado : args.estado, 
//	usuarioId : req.body.session.usuario_id,
//	tipoIdTercero : args.tipoIdTercero, 
//	terceroId : args.terceroId, 
//	swClaseFactura : args.swClaseFactura,
//	tipoFactura : args.tipoFactura, 
//	centroUtilidad : args.centroUtilidad,
//	conceptoId : args.conceptoId,
//	cajaId : args.cajaId,
//	tipoPago:args.tipoPago
//    }; 
//    
//  G.knex.transaction(function(transaccion) {
//    
//    G.Q.nfcall(__crearPrefijoNumero,that, parametros,transaccion).then(function(resultado) {
//
//	if (resultado.length > 0) {
//	    parametros.factura=resultado[0].numeracion;
//	    parametros.prefijo=resultado[0].prefijo;
//
//	    return  G.Q.ninvoke(that.m_notas,'insertarFacFacturas', parametros,transaccion);
//
//	} else {
//	    throw 'Consulta sin resultados';
//	}
//
//	}).then(function(result) {
//
//	    if(result.rowCount >= 1){
//
//	      return G.Q.ninvoke(that.m_notas,'listarConceptosDetalle', parametros);  
//
//	    }else{
//	       throw 'Consulta sin resultados';
//	    }
//	}).then(function(result) {
//
//	    conceptosDetalle=result;            
//	    ip=ip.replace('::ffff:', '');
//	   
//	    return G.Q.ninvoke(that.m_facturacion_clientes,'consultarDireccionIp',{direccionIp:ip});     
//
//	}).then(function(resultado){	
//	    if (ip.substr(0, 6) === '::1' || !resultado || resultado.length > 0) {
//		parametros.direccionIp = ip;
//		parametros.swTipoFactura = 2;
//		return G.Q.ninvoke(that.m_notas, 'insertarPcFactura', parametros, transaccion);
//	    } else {
//		throw {msj: 'La Ip # ' + ip + ' No tiene permisos para realizar la peticion', status: 409};
//	    }
//
//	}).then(function(result) {
//
//	    return G.Q.nfcall(__insertarFacFacturasConceptos,that,0,conceptosDetalle,parametros,total,transaccion);
//
//	}).then(function(result) {
//
//	    parametros.totalFactura=total.totalFactura;
//	    parametros.totalGravamen=total.totalGravamen;
//
//	    return G.Q.ninvoke(that.m_notas,'actualizarTotalesFacturas', parametros,transaccion);  
//
//	}).then(function(result) {
//
//	    return G.Q.ninvoke(that.m_notas,'eliminarTmpDetalleConceptosTerceros', parametros,transaccion); 
//
//	}).then(function(result) {
//
//	    return G.Q.nfcall(__traerPorcentajeImpuestos,that,parametros);
//
//	}).then(function(result) {
//
//	    impuesto=result;
//	    impuesto.empresaId=parametros.empresaId;
//	    impuesto.prefijo=parametros.prefijo;
//	    impuesto.factura=parametros.factura;
//	    return G.Q.ninvoke(that.m_notas,'actualizarImpuestoFacturas', impuesto,transaccion);
//
//
//	}).then(function(result) { 
//
//	    parametros.totalAbono = impuesto.totalGeneral;
//	    parametros.totalEfectivo = impuesto.totalGeneral;
//	    parametros.totalCheque = 0;
//	    parametros.totalTarjeta = 0;
//	    parametros.totalAbonos = 0;
//
//	    if(parametros.tipoPago===0){
//		return G.Q.ninvoke(that.m_notas,'insertarFacturasContado', parametros,transaccion); 
//	    }else{
//	       return false; 
//	    }
//
//	}).then(function(result) {
//	 
//	    transaccion.commit();
//
//	}).fail(function(err) {
//	    console.log("Error ",err);
//	    transaccion.rollback(err);
//	}).done();
//	    
//    }).then(function(result) {
//	
//	var parametrosEmpresa = {
//	    tercero: {
//		id: parametros.terceroId,
//		tipoDocumento: {id: parametros.tipoIdTercero},
//		empresa_id: parametros.empresaId
//	    }
//	};
//	
//	return G.Q.ninvoke(that.m_gestion_terceros,'obtenerTercero',parametrosEmpresa);
//	
//   }).then(function(result) {
//       
//	cliente=result;
//	return G.Q.ninvoke(that.m_notas,'listarEmpresa',parametros);
//	
//   }).then(function(result) {
//      
//	empresa=result;
//	var informacion =  {
//		 serverUrl: req.protocol + '://' + req.get('host') + "/",
//		 empresa: empresa[0],
//		 cliente: cliente[0],
//		 parametros: parametros,
//		 conceptosDetalle: conceptosDetalle,
//		 informacion :__infoFooter(parametros.prefijo),
//		 usuario: req.session.user.nombre_usuario,
//		 archivoHtml: 'facturaConceptos.html',
//		 impuesto: impuesto
//	     };
//	return G.Q.nfcall(__generarPdf,informacion);	
//	
//    }).then(function(result) {
//       
//        res.send(G.utils.r(req.url, 'Guardado Correctamente', 200, {guardarFacturaNotas: result}));
//	
//    }). catch (function(err) {
//	 console.log("error transaccion ",err);
//         res.send(G.utils.r(req.url, err, 500, {}));
//    }).done();
//};
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
// * +Descripcion  Metodo encargado de crear las consultas para generar el contenido de las notas
// * @fecha 2017-06-13 (YYYY-MM-DD)
// */
//Notas.prototype.listarNotas = function(req, res) {
//    var that = this;
//    var args = req.body.data;
//    
//    var parametros = {
//	empresaId: args.empresaId,
//	prefijoNota: args.prefijoNota,
//	numeroNota: args.numeroNota
//    };
//    
//    G.Q.ninvoke(that.m_notas, 'listarNotasGeneradas', parametros).then(function(result) {
//	
//      res.send(G.utils.r(req.url, 'listado Correctamente', 200, {listadoNota: result}));
//
//    }). catch (function(err) {
//	console.log("error listarNotas ", err);
//	res.send(G.utils.r(req.url, err, 500, {error:err}));
//    }).done();
//    
//};
///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion  Metodo encargado de crear las consultas para generar el contenido de las notas
// * @fecha 2017-06-13 (YYYY-MM-DD)
// */
//Notas.prototype.imprimirNota = function(req, res) {
//console.log("*************ESTA IMPRIMIO OK imprimirNota*****************");
//    var that = this;
//    var args = req.body.data;
//    var impuesto;
//    var cliente = [];
//    var empresa = [];
//    var conceptosDetalle = [];
//
//    var parametros = {
//	empresaId: args.empresaId,
//	bodega: args.bodega,
//	prefijo: args.prefijo,
//	factura: args.facturaFiscal,
//	facturaFiscal: args.facturaFiscal,
//	prefijoNota: args.prefijoNota,
//	numeroNota: args.numeroNota
//    };
//    
//    G.Q.ninvoke(that.m_notas, 'listarNotasGeneradas', parametros).then(function(result) {
//	
//	conceptosDetalle=result;
//    	parametros.nombreNota = result[0].sw_contable==='0'?"DEBITO":"CREDITO";
//    	parametros.empresaId = result[0].empresa_id;
//    	parametros.empresa_id = result[0].empresa_id;
//    	parametros.tipoIdTercero = result[0].tipo_id_tercero;
//    	parametros.terceroId = result[0].tercero_id;
//    	
//	parametros.totalFactura = parseInt(result[0].total_factura) + parseInt(result[0].gravamen);//valor_nota_total
//	parametros.totalGravamen = parseInt(result[0].gravamen);
//	
//	parametros.totalNota=parseInt(result[0].valor_nota_total) - parseInt(result[0].valor_gravamen);
//	parametros.totalGravamenNota=parseInt(result[0].valor_gravamen);
//	
//
//	return G.Q.nfcall(__traerPorcentajeImpuestosNotas, that, parametros);
//
//    }).then(function(result) {
//	
//	impuesto = result;
//	impuesto.empresaId = parametros.empresaId;
//	impuesto.prefijo = parametros.prefijo;
//	impuesto.factura = parametros.facturaFiscal;
//
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
//	
//	empresa = result;
//	var informacion = {
//	    serverUrl: req.protocol + '://' + req.get('host') + "/",
//	    empresa: empresa[0],
//	    cliente: cliente[0],
//	    parametros: parametros,
//	    conceptosDetalle: conceptosDetalle,
//	    informacion: __infoFooter(parametros.prefijo),
//	    usuario: req.session.user.nombre_usuario,
//	    archivoHtml: 'notaFactura.html',
//	    impuesto: impuesto
//	};
//      
//	return G.Q.nfcall(__generarPdf, informacion);
//	
//    }).then(function(result) {
//	
//	res.send(G.utils.r(req.url, 'Guardado Correctamente', 200, {imprimirNota: result}));
//
//    }). catch (function(err) {
//	console.log("error transaccion ", err);
//	res.send(G.utils.r(req.url, err, 500, {}));
//    }).done();
//};
//
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
// * +Descripcion  Metodo encargado de generar los pdf del modulo
// * @fecha 2017-07-13 (YYYY-MM-DD)
// */
//function __generarPdf(datos, callback) {
//
//    G.jsreport.render({
//	template: {
//	    content: G.fs.readFileSync('app_modules/Notas/reports/' + datos.archivoHtml, 'utf8'),
//	    recipe: "html",
//	    engine: 'jsrender',
//	    style: G.dirname + "/public/stylesheets/bootstrap.min.css",
//	    helpers: G.fs.readFileSync('app_modules/Notas/reports/javascripts/helpers.js', 'utf8'),
//	    phantom: {
//		margin: "10px",
//		width: '700px'
//	    }
//	},
//	data: datos
//    }, function(err, response) {
//
//	response.body(function(body) {
//        var fecha = new Date();
//        //var nombreTmp = datos.reporte + fecha.getTime() + ".html";
//             
//	var nombreTmp = "factura_conceptocredito" + datos.parametros.prefijo + "" + datos.parametros.factura +"-" + fecha.getTime() + ".html";
//
//	G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body, "binary", function(err) {
//	    if (err) {
//		callback(true, err);
//		return;
//	    } else {
//		callback(false, nombreTmp);
//		return;
//	    }
//	    });
//	});
//    });
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
//
///**
// * @author Andres Mauricio Gonzalez
// * +Descripcion  Metodo encargado de crear el consecutivo de la numeracion del documento
// * @fecha 2017-07-13 (YYYY-MM-DD)
// */
//function __crearPrefijoNumero(that,parametros,transaccion,callback) {
//
//    G.Q.ninvoke(that.m_notas, 'bloquearTablaDocumentos',transaccion).then(function(resultado) {
//	
//       return  G.Q.ninvoke(that.m_notas, 'numeracionDocumento',parametros,transaccion);
//
//    }).then(function(resultado) {
//	callback(false,resultado);
//        return;
//    }).fail(function(err) {
//	console.log("Error __crearPrefijoNumero ", err);
//	callback(err);
//    }).done();
//    
//};



Notas.$inject = ["m_notas", "m_sincronizacion", "m_facturacion_proveedores", "m_facturacion_clientes", "m_gestion_terceros"];
module.exports = Notas;