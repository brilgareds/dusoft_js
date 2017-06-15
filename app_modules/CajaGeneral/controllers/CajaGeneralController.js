var CajaGeneral = function(m_caja_general, m_sincronizacion,m_facturacion_proveedores,m_facturacion_clientes,m_gestion_terceros) {
    this.m_caja_general = m_caja_general;
    this.m_sincronizacion = m_sincronizacion;
    this.m_facturacion_proveedores = m_facturacion_proveedores;
    this.m_facturacion_clientes = m_facturacion_clientes;
    this.m_gestion_terceros = m_gestion_terceros;
};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo encargado de obtener la lista de las ordenes de compra
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
CajaGeneral.prototype.listarCajaGeneral = function(req, res) {

    var that = this;
    var args = req.body.data;

    if (args.usuario_id === undefined || args.empresa_id === undefined || args.centro_utilidad === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    console.log("args::: ", args);
    var parametros = {
        usuario_id: args.usuario_id,
        empresa_id: args.empresa_id,
        centro_utilidad: args.centro_utilidad
    };

    G.Q.ninvoke(that.m_caja_general, 'listarCajaGeneral', parametros).then(function(resultado) {

        if (resultado.length > 0) {
            res.send(G.utils.r(req.url, 'listarCajaGeneral', 200, {listarCajaGeneral: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function(err) {
        console.log("Error listarCajaGeneral ", err);
        res.send(G.utils.r(req.url, "Error listarCajaGeneral", 500, {}));
    }).done();
};
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo encargado de obtener la lista de las ordenes de compra
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
CajaGeneral.prototype.listarGrupos = function(req, res) {

    var that = this;
    var args = req.body.data;

//    if (args.listar_clientes === undefined || args.listar_clientes.paginaActual === undefined) {
//        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
//        return;
//    }
//    console.log("args::: ", args);
    var parametros = {
        empresa_id: args.empresa_id,
        contado: args.contado,
        credito: args.credito,
        conceptoId: args.concepto_id,
        grupoConcepto: args.grupo_concepto
    };

    G.Q.ninvoke(that.m_caja_general, 'listarGrupos', parametros).then(function(resultado) {

        if (resultado.length > 0) {
            res.send(G.utils.r(req.url, 'listarGrupos', 200, {listarGrupos: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function(err) {
        console.log("Error listarGrupos ", err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo encargado de obtener la lista de las ordenes de compra
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
CajaGeneral.prototype.insertarTmpDetalleConceptos = function(req, res) {

    var that = this;
    var args = req.body.data.datos;

    if (args.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definido empresa_id', 404, {}));
        return;
    }
    if (args.centro_utilidad === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definidos centro_utilidad', 404, {}));
        return;
    }
    if (args.concepto_id === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definidos centro_utilidad', 404, {}));
        return;
    }
    if (args.grupo_concepto === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definidos concepto_id', 404, {}));
        return;
    }
    if (args.tipo_id_tercero === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definidos tipo_id_tercero', 404, {}));
        return;
    }
    if (args.sw_tipo === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definidos sw_tipo', 404, {}));
        return;
    }
    if (args.cantidad === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definidos cantidad', 404, {}));
        return;
    }
    if (args.precio === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definidos precio', 404, {}));
        return;
    }
    if (args.valor_total === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definidos valor_total', 404, {}));
        return;
    }
    if (args.porcentaje_gravamen === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definidos porcentaje_gravamen', 404, {}));
        return;
    }
    if (args.valor_gravamen === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definidos valor_gravamen', 404, {}));
        return;
    }
    if (args.descripcion === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definidos descripcion', 404, {}));
        return;
    }
    if (args.tipo_pago_id === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definidos tipo_pago_id', 404, {}));
        return;
    }

    var parametros = args;

    G.Q.ninvoke(that.m_caja_general, 'insertarTmpDetalleConceptos', parametros).then(function(resultado) {

        if (resultado.rowCount > 0) {
            res.send(G.utils.r(req.url, 'insertarTmpDetalleConceptos', 200, {insertarTmpDetalleConceptos: 'Se Inserto el Concepto Correctamente'}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function(err) {
        console.log("Error insertarTmpDetalleConceptos ", err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo encargado de obtener la lista de las ordenes de compra
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
CajaGeneral.prototype.listarConceptosDetalle = function(req, res) {

    var that = this;
    var args = req.body.data.datos;

    if (args.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definido empresa_id', 404, {}));
        return;
    }
    if (args.tipo_id_tercero === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definidos tipo_id_tercero', 404, {}));
        return;
    }
    if (args.concepto_id === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definidos concepto_id', 404, {}));
        return;
    }

    var parametros={
	terceroId : args.tercero_id,
	empresaId : args.empresa_id,
	conceptoId : args.concepto_id,
	tipoIdTercero : args.tipo_id_tercero
    };

    G.Q.ninvoke(that.m_caja_general, 'listarConceptosDetalle', parametros).then(function(resultado) {

        if (resultado.length > 0) {
            res.send(G.utils.r(req.url, 'listarConceptosDetalle', 200, {listarConceptosDetalle: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function(err) {
        console.log("Error listarConceptosDetalle ", err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo encargado de obtener la lista de las ordenes de compra
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
CajaGeneral.prototype.eliminarTmpDetalleConceptos = function(req, res) {

    var that = this;
    var args = req.body.data.datos;

    if (args.rc_concepto_id === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definido rc_concepto_id', 404, {}));
        return;
    }

    var parametros = {rc_concepto_id: args.rc_concepto_id};

    G.Q.ninvoke(that.m_caja_general, 'eliminarTmpDetalleConceptos', parametros).then(function(resultado) {

        if (resultado > 0) {
            res.send(G.utils.r(req.url, 'Temporal Eliminado Correctamente', 200, {eliminarTmpDetalleConceptos: resultado}));
        } else {
            throw 'Consulta sin resultados';
        }

    }).fail(function(err) {
        console.log("Error eliminarTmpDetalleConceptos ", err);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};
/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo encargado de obtener la lista de las ordenes de compra
 * @fecha 2017-06-13 (YYYY-MM-DD)
 */
CajaGeneral.prototype.guardarFacturaCajaGenral = function(req, res) {

    var that = this;
    var args = req.body.data;
    var total ={totalFactura:0,totalGravamen:0};
    var empresa=[];
    var cliente=[];
    var conceptosDetalle=[];

    if (args.prefijoFac === undefined) {
        res.send(G.utils.r(req.url, 'No Estan Definido rc_concepto_id', 404, {}));
        return;
    }
  
     var parametros = {
	documentoId: args.prefijoFac,
	empresaId : args.empresaId, 
	empresa_id : args.empresaId, 
	estado : args.estado, 
	usuarioId : req.body.session.usuario_id,
	tipoIdTercero : args.tipoIdTercero, 
	terceroId : args.terceroId, 
	swClaseFactura : args.swClaseFactura,
	tipoFactura : args.tipoFactura, 
	centroUtilidad : args.centroUtilidad,
	conceptoId : args.conceptoId,
	cajaId : args.cajaId
    }; 
    
//    console.log("session ",req.body.session);
//    console.log("session ");
//    return;
  G.knex.transaction(function(transaccion) {
    
	    G.Q.nfcall(__crearPrefijoNumero,that, parametros,transaccion).then(function(resultado) {
		  
		if (resultado.length > 0) {
		    parametros.factura=resultado[0].numeracion;
		    parametros.prefijo=resultado[0].prefijo;
		  
		    return  G.Q.ninvoke(that.m_caja_general,'insertarFacFacturas', parametros,transaccion);
		   
		} else {
		    throw 'Consulta sin resultados';
		}

	    }).then(function(result) {
		
		if(result.rowCount >= 1){
		  
		  return G.Q.ninvoke(that.m_caja_general,'listarConceptosDetalle', parametros);  
		  
		}else{
		   throw 'Consulta sin resultados';
		}
		//
		//transaccion.commit();
	    }).then(function(result) {

		conceptosDetalle=result;
		return G.Q.nfcall(__insertarFacFacturasConceptos,that,0,result,parametros,total,transaccion);
		
	    }).then(function(result) {
		
		parametros.totalFactura=total.totalFactura;
		parametros.totalGravamen=total.totalGravamen;
		
		return G.Q.ninvoke(that.m_caja_general,'actualizarTotalesFacturas', parametros,transaccion);  
		
	    }).then(function(result) {
		
		return G.Q.ninvoke(that.m_caja_general,'eliminarTmpDetalleConceptosTerceros', parametros,transaccion); 
		
            }).then(function(result) {
		
		return G.Q.nfcall(__traerPorcentajeImpuestos,that,parametros);
		//console.log("result:::: ",result);
	    }).then(function(result) { //actualizarImpuestoFacturas
		var impuesto=result;
		impuesto.empresaId=parametros.empresaId;
		impuesto.prefijo=parametros.prefijo;
		impuesto.factura=parametros.factura;
	//	console.log("traer impuesto",impuesto);
		return G.Q.ninvoke(that.m_caja_general,'actualizarImpuestoFacturas', impuesto,transaccion);
	    }).then(function(result) { 
	         console.log("actualizarImpuestoFacturas::: ",result);	
		transaccion.commit();
	    }).fail(function(err) {
		console.log("Error ",err);
		transaccion.rollback(err);
	    }).done();
	    
    }).then(function(result) {
	
	var parametrosEmpresa = {
	    tercero: {
		id: parametros.terceroId,
		tipoDocumento: {id: parametros.tipoIdTercero},
		empresa_id: parametros.empresaId
	    }
	};
	
	return G.Q.ninvoke(that.m_gestion_terceros,'obtenerTercero',parametrosEmpresa);
	
   }).then(function(result) {
       
	cliente=result;
	return G.Q.ninvoke(that.m_caja_general,'listarEmpresa',parametros);
	
   }).then(function(result) {
      
	empresa=result;
	
//	console.log("result cliente ",cliente);
//	console.log("result empresa ",empresa);
//	console.log("result parametros ",parametros);
//	console.log("result req.protocol ",req.protocol);
//	console.log("result req.get('host') ",req.get('host'));
	console.log("result conceptosDetalle ",conceptosDetalle);
	__generarPdf({serverUrl: req.protocol + '://' + req.get('host') + "/",
                empresa: empresa[0],
                cliente: cliente[0],
                parametros: parametros,
                conceptosDetalle: conceptosDetalle,
//                impuestos: resultado[0],
                archivoHtml: 'facturaConceptos.html',
                }, function(nombre_pdf) {
                res.send(G.utils.r(req.url, 'SE HA CREADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nombre_pdf}));
            });	
    }).then(function(result) {
	//console.log("resultZZZZZZZZZZZZZ ",result);
        res.send(G.utils.r(req.url, 'guardarFacturaCajaGenral Correctamente', 200, {guardarFacturaCajaGenral: 'ok'}));
    }). catch (function(err) {
	console.log("error transaccion ",err);
         res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};


function __generarPdf(datos, callback) {  
   
    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/CajaGeneral/reports/'+datos.archivoHtml, 'utf8'),
            recipe: "html",
            engine: 'jsrender',
            phantom: {
                margin: "10px",
                width: '700px'
            }
        },
        data: datos
    }, function(err, response) {
        
        response.body(function(body) {
         //  var fecha = new Date();
          
//           var nombreTmp = datos.reporte + datos.cabecerae.prefijo + datos.cabecerae.numero + ".html";
           var nombreTmp = "factura_conceptocredito"+datos.parametros.prefijo+""+datos.parametros.factura+".html";
   console.log("nombreTmp:::::",nombreTmp);
           G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body,  "binary",function(err) {
                if(err) {
                    console.log("err [__generarPdf]: ", err);
                   callback(true, err);
                   return;
                } else {
                        console.log("___ [okkkkkkkkkk]: ");
                         callback(nombreTmp);
                         return;                  
                }
            });            
        });
    });
}

function __traerPorcentajeImpuestos(that,parametro,callback) {

    var parametros;
    var retencion;
    G.Q.ninvoke(that.m_facturacion_clientes, 'consultarTerceroContrato',parametro).then(function(resultado) {
	
	retencion=resultado[0];
	return  G.Q.ninvoke(that.m_facturacion_proveedores, 'listarParametrosRetencion',parametro);
	
    }).then(function(result) {
	
	parametros=result[0];
	var impuestos = {
	    porcentajeRtf : '0',
	    porcentajeIca : '0',
	    porcentajeReteiva : '0',
	    porcentajeCree : '0',
	    swRtf: parametros.sw_rtf,
	    swIca: parametros.sw_ica,
	    swReteiva : parametros.sw_reteiva
	};
	
        if (parametros.sw_rtf === '1' || parametros.sw_rtf === '3')
            impuestos.porcentajeRtf = retencion.porcentaje_rtf;
        if (parametros.sw_ica === '1' || parametros.sw_ica === '3')
            impuestos.porcentajeIca = retencion.porcentaje_ica;
        if (parametros.sw_reteiva === '1' || parametros.sw_reteiva === '3')
            impuestos.porcentajeReteiva = retencion.porcentaje_reteiva;
	
	 if(retencion.porcentaje_cree !== undefined){
            impuestos.porcentajeCree = retencion.porcentaje_cree;
        }
	
	callback(false,impuestos);
	
    }).fail(function(err) {
	console.log("Error __traerPorcentajeImpuestos ", err);
	callback(err);
    }).done();
};

function __insertarFacFacturasConceptos(that, index, result, parametros, total, transaccion, callback) {

    var conceptos = result[index];

    if (!conceptos) {
	callback(false, total);
	return;
    }

    conceptos.empresaId = parametros.empresaId;
    conceptos.prefijo = parametros.prefijo;
    conceptos.cajaId = parametros.cajaId;
    conceptos.concepto = parametros.conceptoId;
    conceptos.facturaFiscal = parametros.factura;
    conceptos.porcentajeGravamen = conceptos.porcentaje_gravamen;
    conceptos.valorTotal = conceptos.valor_total;
    conceptos.swTipo = conceptos.sw_tipo;
    conceptos.valorGravamen = conceptos.valor_gravamen;
    conceptos.grupoConceptoId = conceptos.grupo_concepto;

    total.totalFactura += parseInt(conceptos.valorTotal);
    total.totalGravamen += parseInt(conceptos.valorGravamen);

    G.Q.ninvoke(that.m_caja_general, 'insertarFacFacturasConceptos', conceptos, transaccion).then(function(resultado) {

	conceptos.id = resultado[0].fac_factura_concepto_id;
	return G.Q.ninvoke(that.m_caja_general, 'insertarFacFacturasConceptosDc', conceptos, transaccion);

    }).then(function(result) {
	if (result.rowCount >= 1) {
	    index++;
	    __insertarFacFacturasConceptos(that, index,  result, parametros, total,transaccion, callback);
	} else {
	    throw 'Error en __insertarFacFacturasConceptos ';
	}
    }).fail(function(err) {
	console.log("Error __insertarFacFacturasConceptos ", err);
	callback(err);
    }).done();

};


function __crearPrefijoNumero(that,parametros,transaccion,callback) {

    G.Q.ninvoke(that.m_caja_general, 'bloquearTablaDocumentos',transaccion).then(function(resultado) {
       return  G.Q.ninvoke(that.m_caja_general, 'actualizarTipoFormula',parametros,transaccion);

    }).then(function(resultado) {
	callback(false,resultado);
        return;
    }).fail(function(err) {
	console.log("Error __crearPrefijoNumero ", err);
	callback(err);
    }).done();
    
};



CajaGeneral.$inject = ["m_caja_general", "m_sincronizacion","m_facturacion_proveedores","m_facturacion_clientes","m_gestion_terceros"];

module.exports = CajaGeneral;