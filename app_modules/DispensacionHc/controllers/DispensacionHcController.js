
var DispensacionHc = function(m_dispensacion_hc) {

    this.m_dispensacion_hc = m_dispensacion_hc;
  
  //  this.m_pedidos_clientes_log = m_pedidos_clientes_log;
};

/*
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Controlador encargado de consultar la lista de formulas
 *              
 */
DispensacionHc.prototype.listarFormulas = function(req, res){
    
    var that = this;
    var args = req.body.data;
  
    if (args.listar_formulas === undefined || args.listar_formulas.paginaActual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_formulas: []}));
        return;
    }
     
    if (args.listar_formulas.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {pedidos_clientes: []}));
        return;
    }

    if (args.listar_formulas.paginaActual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {pedidos_clientes: []}));
        return;
    }
    
    if (!args.listar_formulas.filtro) {
        res.send(G.utils.r(req.url, 'Error en la lista de filtros de busqueda', 404, {}));
        return;
    }
    
    var empresaId = args.listar_formulas.empresaId;
    var terminoBusqueda = args.listar_formulas.terminoBusqueda;
    var paginaActual = args.listar_formulas.paginaActual;
    var filtro = args.listar_formulas.filtro;
    var fechaInicial = args.listar_formulas.fechaInicial;
    var fechaFinal = args.listar_formulas.fechaFinal;
    var estadoFormula = args.listar_formulas.estadoFormula;
    
   
   
   var parametros={ empresaId:empresaId,
                    terminoBusqueda: terminoBusqueda,
                    paginaActual:paginaActual,
                    fechaInicial: fechaInicial,
                    fechaFinal: fechaFinal,
                    filtro: filtro,
                    estadoFormula: estadoFormula};
  
   
    G.Q.ninvoke(that.m_dispensacion_hc,'listarFormulas',parametros).then(function(resultado){
   
    if(resultado.length >0){
        res.send(G.utils.r(req.url, 'Consulta con formulas', 200, {listar_formulas:resultado}));
    }else{
        throw 'Consulta sin resultados';
    }
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};


/*
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Controlador encargado de consultar los tipos de documentos
 *              
 */
DispensacionHc.prototype.listarTipoDocumento = function(req, res){
    
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_dispensacion_hc,'listarTipoDocumento').then(function(resultado){
      
        if(resultado.rows.length > 0){
       
           res.send(G.utils.r(req.url, 'Consulta tipo documento', 200, {listar_tipo_documento:resultado.rows}));
        }else{
           throw 'Consulta sin resultados';
        }
      
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};


/*
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Controlador encargado de consultar las formulas que
 *              tienen medicamentos pendientes
 *              
 */
DispensacionHc.prototype.listarFormulasPendientes = function(req, res){
      
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_dispensacion_hc,'listarFormulasPendientes').then(function(resultado){
       
        if(resultado.rows.length > 0){
            res.send(G.utils.r(req.url, 'Consulta formulas pendientes', 200, {listar_formulas:resultado}));
        }else{
           throw 'Consulta sin resultados';
        }
      
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};



/*
 * @author Cristian Ardila
 * @fecha 24/05/2016
 * +Descripcion Controlador encargado de consultar la lista de los medicamentos
 *              formulados
 *              
 */
DispensacionHc.prototype.cantidadProductoTemporal = function(req, res){
   
    var that = this;
    var args = req.body.data;
   
    if (args.cantidadProducto === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_detalle_medicamentos_formulados: []}));
        return;
    }
   
    if (!args.cantidadProducto.codigoProducto || args.cantidadProducto.codigoProducto.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere el codigo de producto', 404, {cantidadProducto: []}));
        return;
    }
    
    if (!args.cantidadProducto.evolucionId || args.cantidadProducto.evolucionId.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucion', 404, {cantidadProducto: []}));
        return;
    }
    
    if (!args.cantidadProducto.principioActivo || args.cantidadProducto.principioActivo.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere el principio activo', 404, {cantidadProducto: []}));
        return;
    }
    
    var parametros={codigoProducto:args.cantidadProducto.codigoProducto,
                    evolucionId:args.cantidadProducto.evolucionId,
                    principioActivo:args.cantidadProducto.principioActivo
                    };
   
   
    G.Q.ninvoke(that.m_dispensacion_hc,'cantidadProductoTemporal',parametros).then(function(resultado){
      
        if(resultado.rows.length > 0){
            res.send(G.utils.r(req.url, 'Consulta con medicamentos formulados', 200, {cantidadProducto:resultado.rows}));
        }else{
           throw 'Consulta sin resultados';
        }
        
    }).fail(function(err){      
       
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};


/*
 * @author Cristian Ardila
 * @fecha 24/05/2016
 * +Descripcion Controlador encargado de consultar la lista de los medicamentos
 *              formulados
 *              
 */
DispensacionHc.prototype.listarMedicamentosFormulados = function(req, res){
   
    var that = this;
    var args = req.body.data;
   
    if (args.listar_medicamentos_formulados === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_medicamentos_formulados: []}));
        return;
    }
   
    if (!args.listar_medicamentos_formulados.evolucionId || args.listar_medicamentos_formulados.evolucionId.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucionId', 404, {listar_medicamentos_formulados: []}));
        return;
    }

    var parametros = {evolucionId:args.listar_medicamentos_formulados.evolucionId};
   
   
    G.Q.ninvoke(that.m_dispensacion_hc,'listarMedicamentosFormulados',parametros).then(function(resultado){
       
      
        if(resultado.rows.length > 0){ 
              res.send(G.utils.r(req.url, 'Consulta con medicamentos formulados', 200, {listar_medicamentos_formulados:resultado.rows}));
        }else{
           throw 'Consulta sin resultados';
        }
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/*
 * @author Cristian Ardila
 * @fecha 24/05/2016
 * +Descripcion Controlador encargado de consultar la lista los lotes de cada 
 *              codigo del producto del FOFO
 *              
 */
DispensacionHc.prototype.existenciasBodegas = function(req, res){
   
    var that = this;
    var args = req.body.data;
   
    if (args.existenciasBodegas === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {existenciasBodegas: []}));
        return;
    }
   
    if (!args.existenciasBodegas.codigoProducto) {
        res.send(G.utils.r(req.url, 'Se requiere el codigo de producto', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.existenciasBodegas.principioActivo || args.existenciasBodegas.principioActivo.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere el principio activo', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.existenciasBodegas.empresa || args.existenciasBodegas.empresa.length === 0 ) {
        res.send(G.utils.r(req.url, 'La empresa esta llegando vacia ó nula', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.existenciasBodegas.centroUtilidad || args.existenciasBodegas.centroUtilidad.length === 0 ) {
        res.send(G.utils.r(req.url, 'El centro de utilidad esta llegando vacio ó nulo', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.existenciasBodegas.bodega || args.existenciasBodegas.bodega.length === 0 ) {
        res.send(G.utils.r(req.url, 'La bodega esta llegando vacia ó nula', 404, {existenciasBodegas: []}));
        return;
    }
    
    var parametros={empresa: args.existenciasBodegas.empresa,
                    centroUtilidad:args.existenciasBodegas.centroUtilidad, 
                    bodega:args.existenciasBodegas.bodega,
                    codigoProducto:args.existenciasBodegas.codigoProducto,
                    principioActivo:args.existenciasBodegas.principioActivo
                    };
   
   
   G.Q.ninvoke(that.m_dispensacion_hc,'existenciasBodegas',parametros).then(function(resultado){
       
       if(resultado.rows.length > 0){ 
             res.send(G.utils.r(req.url, 'Consulta los lotes de cada producto de los FOFO', 200, {existenciasBodegas:resultado.rows}));
       }else{
           throw 'Consulta sin resultados';
       }
      
        
   }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de almacenar los productos de la formula
 *              en la tabla de temporales
 * @fecha 2016-07-06 (YYYY-DD-MM)
 * 
 */
DispensacionHc.prototype.temporalLotes = function(req, res){
    
    var that = this;
    var args = req.body.data;
   
    if (args.temporalLotes === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {existenciasBodegas: []}));
        return;
    }
   
    if (!args.temporalLotes.detalle || args.temporalLotes.detalle.length === 0 ) {
        res.send(G.utils.r(req.url, 'Los parametros estan llegando vacios', 404, {existenciasBodegas: []}));
        return;
    }
    
    if(args.temporalLotes.detalle.cantidadDispensada > args.temporalLotes.detalle.lotes[0].cantidad){
        res.send(G.utils.r(req.url, 'La cantidad dispensada no debe ser mayor a la existencia', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.temporalLotes.empresa || args.temporalLotes.empresa.length === 0 ) {
        res.send(G.utils.r(req.url, 'La empresa esta llegando vacia ó nula', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.temporalLotes.centroUtilidad || args.temporalLotes.centroUtilidad.length === 0 ) {
        res.send(G.utils.r(req.url, 'El centro de utilidad esta llegando vacio ó nulo', 404, {existenciasBodegas: []}));
        return;
    }
    
    if (!args.temporalLotes.bodega || args.temporalLotes.bodega.length === 0 ) {
        res.send(G.utils.r(req.url, 'La bodega esta llegando vacia ó nula', 404, {existenciasBodegas: []}));
        return;
    }
    
    
    
    var cantidadDispensada = parseInt(args.temporalLotes.detalle.cantidadDispensada);
    var codigoProductoLote = args.temporalLotes.detalle.codigo_producto;
    var fechaVencimientoLote = args.temporalLotes.detalle.lotes[0].fecha_vencimiento;
    var usuario = req.session.user.usuario_id;
    var medicamentoFormulado = args.temporalLotes.codigoProducto;
    var lote = args.temporalLotes.detalle.lotes[0].codigo_lote;
    
    var parametros={codigoProducto:medicamentoFormulado,
                    evolucionId:args.temporalLotes.evolucion,
                    principioActivo:args.temporalLotes.detalle.principioActivo
                    };
   
    G.Q.ninvoke(that.m_dispensacion_hc,'cantidadProductoTemporal',parametros).then(function(resultado){
       var total;
       
        if(resultado.rows.length > 0){         
            total = parseInt(resultado.rows[0].total) + cantidadDispensada;          
        }else{
            total = parseInt(cantidadDispensada);
        }
      
        if( total <= args.temporalLotes.cantidadSolicitada){
             
            var parametrosConsultarProductoTemporal = {
                evolucionId:args.temporalLotes.evolucion,
                lote: lote,
                fechaVencimiento: fechaVencimientoLote,
                codigoProducto: codigoProductoLote       
              };

            return G.Q.ninvoke(that.m_dispensacion_hc,'consultarProductoTemporal', parametrosConsultarProductoTemporal,0);     

            }else{
                 throw 'La cantidad dispensada no debe ser mayor a la solicitada';
            }
       
    }).then(function(resultado){
        
        var parametrosGuardarProductoTemporal = {
                evolucionId:args.temporalLotes.evolucion,
                empresa: args.temporalLotes.empresa,
                centroUtilidad: args.temporalLotes.centroUtilidad,
                bodega: args.temporalLotes.bodega,
                codigoProducto: codigoProductoLote,
                cantidad: cantidadDispensada,
                fechaVencimiento: fechaVencimientoLote,
                lote: lote,
                formulado: medicamentoFormulado,
                usuario: usuario,
                rango: 0                    
              };
            
        if(resultado.rows.length >0){
            throw 'El lote ya se encuentra registrado en temporal';
        }else{
            return G.Q.ninvoke(that.m_dispensacion_hc,'guardarTemporalFormula', parametrosGuardarProductoTemporal); 
        }
        
    }).then(function(){
         
        res.send(G.utils.r(req.url, 'Se almacena el temporal satisfactoriamente', 200, {existenciasBodegas: []}));  
    
     }).fail(function(err){  
      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();   
      
};


/*
 * @author Cristian Ardila
 * @fecha 07/06/2016
 * +Descripcion Controlador encargado listar los temporales de cada  medicamento
 *              formulado
 *              
 */
DispensacionHc.prototype.listarMedicamentosTemporales = function(req, res){
   
    var that = this;
    var args = req.body.data;
   
    if (args.listar_medicamentos_temporales === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_medicamentos_temporales: []}));
        return;
    }
   
    if (!args.listar_medicamentos_temporales.evolucion || args.listar_medicamentos_temporales.evolucion.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucionId', 404, {listar_medicamentos_temporales: []}));
        return;
    }

   var parametros = {evolucionId:args.listar_medicamentos_temporales.evolucion};
  
    G.Q.ninvoke(that.m_dispensacion_hc,'consultarProductoTemporal',parametros,1).then(function(resultado){
      
        if(resultado.rows.length > 0){ 
              res.send(G.utils.r(req.url, 'Consulta con medicamentos temporales', 200, {listar_medicamentos_temporales:resultado.rows}));
        }else{
           throw 'Consulta sin resultados';
        }
      
   }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};





/*
 * @author Cristian Ardila
 * @fecha 07/06/2016
 * +Descripcion Controlador encargado eliminar los temporales de una formula
 *              
 */
DispensacionHc.prototype.eliminarTemporalFormula  = function(req, res){
    
    var that = this;
    var args = req.body.data;
    
    if (args.eliminar_medicamentos_temporales === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {eliminar_medicamentos_temporales: []}));
        return;
    }
   
    if (!args.eliminar_medicamentos_temporales.evolucion || args.eliminar_medicamentos_temporales.evolucion.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucion', 404, {eliminar_medicamentos_temporales: []}));
        return;
    }
    
    if (!args.eliminar_medicamentos_temporales.serialId || args.eliminar_medicamentos_temporales.serialId.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere el serialId', 404, {eliminar_medicamentos_temporales: []}));
        return;
    }
    
    if (!args.eliminar_medicamentos_temporales.codigoProducto || args.eliminar_medicamentos_temporales.codigoProducto.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere el codigo del producto', 404, {eliminar_medicamentos_temporales: []}));
        return;
    }
    
    var parametros={serialId:args.eliminar_medicamentos_temporales.serialId, 
                    evolucionId:args.eliminar_medicamentos_temporales.evolucion, 
                    codigoProducto:args.eliminar_medicamentos_temporales.codigoProducto};
      
    G.Q.ninvoke(that.m_dispensacion_hc,'eliminarTemporalFormula',parametros).then(function(resultado){
        
          res.send(G.utils.r(req.url, 'Se elimina temporal satisfactoriamente', 200, {eliminar_medicamentos_temporales:resultado}));
      
   }).fail(function(err){      
      
       res.send(G.utils.r(req.url, 'Error al eliminar el temporal', 500, {}));
    }).done();
};



/*
 * @author Cristian Ardila
 * @fecha 24/05/2016
 * +Descripcion Controlador encargado de consultar los tipos de formulas
 *              
 */
DispensacionHc.prototype.listarTipoFormula = function(req, res){
   
    var that = this;
    var args = req.body.data;
   
    if (!args.listar_tipo_formula) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_tipo_formula: []}));
        return;
    }
   
    
    G.Q.ninvoke(that.m_dispensacion_hc,'listarTipoFormula').then(function(resultado){
       
        if(resultado.rows.length > 0){ 
              res.send(G.utils.r(req.url, 'Consulta con tipos de formula', 200, {listar_tipo_formula:resultado.rows}));
        }else{
           throw 'Consulta sin resultados';
        }
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};



DispensacionHc.prototype.realizarEntregaFormula = function(req, res){
    
    var that = this;
    var args = req.body.data;
    
   
    if(!args.realizar_entrega_formula){
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {realizar_entrega_formula: []}));
        return;
    } 
    
    if(!args.realizar_entrega_formula.variable){
        res.send(G.utils.r(req.url, 'La variable de parametrizacion de formulacion esta vacia ó indefinida', 404, {realizar_entrega_formula: []}));
        return;
    } 
    
    if(!args.realizar_entrega_formula.evolucionId){
        res.send(G.utils.r(req.url, 'La evolucion esta vacia ó indefinida', 404, {realizar_entrega_formula: []}));
        return;
    } 
    
    var evolucionId = args.realizar_entrega_formula.evolucionId;
    var empresa = args.realizar_entrega_formula.empresa;
    var bodega = args.realizar_entrega_formula.bodega;
    var variable = args.realizar_entrega_formula.variable;
    var observacion = args.realizar_entrega_formula.observacion;
    var usuario = req.session.user.usuario_id;
    var bodegasDocId;
    var planId;
    var variableParametrizacion;
    var numeracion;
    var temporales;
    var todoPendiente;
    var parametrosReformular = {variable: variable,
                                terminoBusqueda: evolucionId,
                                filtro: {tipo:'EV'},                             
                                empresa: empresa,
                                bodega: bodega,
                                observacion: observacion,
                                tipoVariable : 0
                                
    
    };
   
    G.Q.ninvoke(that.m_dispensacion_hc,'listarFormulas',parametrosReformular).then(function(resultado){
        
        if(resultado.length > 0){
           planId =  resultado[0].plan_id;
            return G.Q.ninvoke(that.m_dispensacion_hc,'estadoParametrizacionReformular',parametrosReformular);
        }else{
            throw 'Consulta sin resultados '
        }
        
    }).then(function(resultado){
       
        
        if(resultado.length > 0){
            
            var parametroBodegaDocId = {variable:"documento_dispensacion_"+empresa+"_"+bodega, tipoVariable:1, modulo:'Dispensacion' };
                variableParametrizacion = resultado[0].valor;
            /**
             *+Descripcion Se consulta el bodegas_doc_id correspondiente
             */
            return G.Q.ninvoke(that.m_dispensacion_hc,'estadoParametrizacionReformular',parametroBodegaDocId);
        }else{
            
            throw 'Variable reformular no se encontro';
            
        }
      
        
    }).then(function(resultado){
        
        if(resultado.length > 0){
            
           bodegasDocId = resultado[0].valor;
           
           return G.Q.ninvoke(that.m_dispensacion_hc,'consultarProductoTemporal',{evolucionId:evolucionId},1);
            
        }else{
            throw 'No hay temporales'
        }
            
    }).then(function(resultado){
          
        if(resultado.rows.length > 0){
             temporales = resultado.rows;
             return G.Q.ninvoke(that.m_dispensacion_hc,'bloquearTabla');
             
        }else{
            throw 'No hay temporales separados'
        }
           
    }).then(function(resultado){
            
            return G.Q.ninvoke(that.m_dispensacion_hc,'asignacionNumeroDocumentoDespacho',{bodegasDocId:bodegasDocId});
            
    }).then(function(resultado){
        
         
        if(resultado.rowCount === 0){
            throw 'No se genero numero de despacho'
        }else{
            numeracion = resultado.rows[0].numeracion;
            var parametrosGenerarDispensacion={bodegasDocId:bodegasDocId, 
                    numeracion:numeracion, 
                    observacion:observacion, 
                    estadoPendiente:0,
                    usuario: usuario,
                    evolucion: evolucionId};
               // console.log("parametrosGenerarDispensacion ", parametrosGenerarDispensacion);
          
            return G.Q.ninvoke(that.m_dispensacion_hc,'generarDispensacionFormula',
                    parametrosGenerarDispensacion);
        };
            
            
    }).then(function(){

     var parametrosBodegasDocumentosDetalle = {temporales: temporales, usuario:usuario, bodegasDocId:bodegasDocId, numeracion:numeracion, planId: planId};
     /*__insertarBodegasDocumentosDetalle(that,0, parametrosBodegasDocumentosDetalle, function(estado){
           
            if(!estado){
              
                G.Q.ninvoke(that.m_dispensacion_hc,'consultarProductoTemporal',{evolucionId:evolucionId},1).then(function(resultado){
                    
                    if(resultado.rows.length >0){                       
                       return G.Q.ninvoke(that.m_dispensacion_hc,'listarMedicamentosPendientes',{evolucionId:evolucionId});                        
                    }
                  
                }).then(function(resultado){
                
                }).fail(function(err){              
                    res.send(G.utils.r(req.url, err, 500, {}));
                }).done();
           
            }
          
     });*/
     
    return  G.Q.nfcall(__insertarBodegasDocumentosDetalle,that,0, parametrosBodegasDocumentosDetalle);
    
     
    }).then(function(estado){
        
        return G.Q.ninvoke(that.m_dispensacion_hc,'consultarProductoTemporal',{evolucionId:evolucionId},1)
        
    }).then(function(resultado){
        
       /**
         * +Descripcion Si hay productos en la temporal o si se va a dejar
         *              la formula como todo pendiente se procede a consultar tambien
         *              el pendiente que se deja en la dispensacion
         */
        if(resultado.rows.length >0 || todoPendiente === '1'){                       
            
            return G.Q.ninvoke(that.m_dispensacion_hc,'listarMedicamentosPendientes',{evolucionId:evolucionId});                        
            
        }
            
    }).then(function(resultado){
        
        /**
         * Se valida de que hallan medicamentos pendientes
         */
        if(resultado.rows.length >0){ 
            
          /**
           * +Descripcion Funcion recursiva que se encargada de almacenar los pendientes
           */
         return G.Q.nfcall(__insertarMedicamentosPendientes,that,0, resultado.rows, evolucionId,0, usuario);
        }
    
    }).then(function(resultado){
        
         return G.Q.ninvoke(that.m_dispensacion_hc,'eliminarTemporalesDispensados',{evolucionId:evolucionId}); 
          
    }).then(function(resultado){
                
          res.send(G.utils.r(req.url, 'Se realiza la dispensacion correctamente', 200, {dispensacion: resultado}));
                
    }).fail(function(err){      
       
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
    
    
};

/**
 * @author Cristian Ardila
 * +Descripcion Funcion recursiva encargada de recorrer el arreglo de los productos
 *              temporales que se dispensaran
 */
function __insertarBodegasDocumentosDetalle(that, index, parametros, callback) {
    
  
    //console.log(" parametrosBodegasDocumentosDetalle ", parametros);
    var producto = parametros.temporales[index];
    
    if (!producto) {       
        //console.log("Debe salir a qui ");
        callback(false);
        return;
    }  
    
    
    G.Q.ninvoke(that.m_dispensacion_hc,'insertarBodegasDocumentosDetalle',producto,parametros.bodegasDocId, parametros.numeracion, parametros.planId).then(function(resultado){    
        index++;
       // console.log(" producto /** ", producto);
        setTimeout(function() {
            __insertarBodegasDocumentosDetalle(that, index, parametros, callback);
        }, 300);
       // console.log("RRRR resultado", resultado);
    }).fail(function(err){      
        callback(true);            
    }).done();
}



/**
 * @author Cristian Ardila
 * +Descripcion Funcion recursiva encargada de recorrer el arreglo de los productos
 *              temporales que se almacenaran como pendientes
 */
function __insertarMedicamentosPendientes(that, index, productos,evolucionId,todoPendiente,usuario, callback) {
    
  
   
    var producto = productos[index];
    
     //console.log(" parametrosBodegasDocumentosDetalle ", productos);
    if (!producto) {       
        //console.log("Debe salir a qui ");
        callback(false);
        return;
    }  
    
    
    
    console.log("productos ", producto);
    G.Q.ninvoke(that.m_dispensacion_hc,'insertarPendientesPorDispensar',producto, evolucionId, todoPendiente, usuario).then(function(resultado){    
        index++;
        console.log("Se van insertando ", resultado);
       // console.log(" index /** ", index);
        //setTimeout(function() {
            __insertarMedicamentosPendientes(that, index, productos,evolucionId,todoPendiente,usuario, callback);
        //}, 300);
       // console.log("RRRR resultado", resultado);
    }).fail(function(err){      
        callback(true);            
    }).done();
}
DispensacionHc.$inject = ["m_dispensacion_hc"];

module.exports = DispensacionHc;
