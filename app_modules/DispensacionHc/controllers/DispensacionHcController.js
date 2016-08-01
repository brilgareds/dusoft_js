
var DispensacionHc = function(m_dispensacion_hc, eventos_dispensacion) {

    this.m_dispensacion_hc = m_dispensacion_hc;
    this.e_dispensacion_hc = eventos_dispensacion;
  
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
       
     // console.log("resultado.rows ", resultado.rows);
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
 * @fecha 25/07/2016
 * +Descripcion Controlador encargado de consultar los medicamentos despachados
 *              
 */
DispensacionHc.prototype.consultarMedicamentosDespachados = function(req, res){
   
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
   
   
    G.Q.ninvoke(that.m_dispensacion_hc,'consultarMedicamentosDespachados',parametros).then(function(resultado){
       
     // console.log("---resultado.rows.length ---- ", resultado.rows.length)
        if(resultado.rows.length > 0){ 
              res.send(G.utils.r(req.url, 'Consulta con medicamentos formulados', 200, {listar_medicamentos_formulados:resultado.rows}));
        }else{
           throw 'Consulta sin resultados';
        }
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};


var sumaFecha = function(d, fechaP){
        
        var Fecha = new Date();
        var sFecha = fechaP || (Fecha.getDate() + "-" + (Fecha.getMonth() +1) + "-" + Fecha.getFullYear());      
        var sep = sFecha.indexOf('/') !== -1 ? '/' : '-'; 
        var aFecha = sFecha.split(sep);
        var fecha = aFecha[0]+'-'+aFecha[1]+'-'+aFecha[2];           
            fecha= new Date(fecha);        
            fecha.setDate(fecha.getDate()+parseInt(d));
        var anno=fecha.getFullYear();            
        var mes= fecha.getMonth()+1;         
        var dia= fecha.getDate();        
            mes = (mes < 10) ? ("0" + mes) : mes;
            dia = (dia < 10) ? ("0" + dia) : dia;
        var fechaFinal = anno+sep+mes+sep+dia;

        return (fechaFinal) === "NaN-NaN-NaN" ? "" : (fechaFinal);
    };
/*
 * @author Cristian Ardila
 * @fecha 24/05/2016
 * +Descripcion Controlador encargado de consultar la lista los lotes de cada 
 *              codigo del producto del FOFO
 *              
 */
DispensacionHc.prototype.existenciasBodegas = function(req, res){
   
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
    var today = yyyy+'-'+mm+'-'+dd;
    var fechaDias = sumaFecha(25,today);
    var that = this;
    var args = req.body.data;
    var fechaRegistro = "";
    var fechaDespacho = "";
    var def = G.Q.defer();
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
   var parametrosUltimoRegistroDispensacion = {tipoIdPaciente: 'CC', 
                                               pacienteId: '42076373', 
                                               principioActivo: args.existenciasBodegas.principioActivo, 
                                               producto: args.existenciasBodegas.codigoProducto,
                                               fechaDia: fechaDias,
                                               today: today
                                               };
G.Q.ninvoke(that.m_dispensacion_hc,'consultarUltimoRegistroDispensacion', parametrosUltimoRegistroDispensacion).then(function(resultado){

        if(resultado.rows.length > 0){ 
            fechaRegistro = resultado.rows[0].fecha_registro;
        }

        if(today >= fechaRegistro){
               fechaDespacho = sumaFecha(25,fechaRegistro);
         }
      
         if(today > fechaDespacho || args.existenciasBodegas.autorizado === '1'){
       
           return G.Q.ninvoke(that.m_dispensacion_hc,'existenciasBodegas',parametros);
           
         }else{
              def.resolve();             
              throw {msj: resultado.rows, codigo: 204};
         }
   
   }).then(function(resultado){
       console.log("AQUI QUE PASO ", resultado)
       if(resultado || resultado.rows.length > 0){ 
             res.send(G.utils.r(req.url, 'Consulta los lotes de cada producto de los FOFO', 200, {existenciasBodegas:resultado.rows}));
       }else{
           throw {msj: "Consulta sin resultado", codigo: 500};
       }
           
   }).fail(function(err){     
      res.send(G.utils.r(req.url, err.msj, err.codigo, {existenciasBodegas: []}));
      // res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};



/*
 * @author Cristian Ardila
 * @fecha 24/05/2016
 * +Descripcion Controlador encargado de consultar si el usuario cuenta con 
 *              privilegios para generar la accion
 *              
 */
DispensacionHc.prototype.usuarioPrivilegios = function(req, res){
    
    var that = this;
    var args = req.body.data;
    var usuario = req.session.user.usuario_id;
    
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
                    usuario:usuario              
                    };
                    
 G.Q.ninvoke(that.m_dispensacion_hc,'usuarioPrivilegios', parametros).then(function(resultado){
     
       if(resultado && resultado.rows.length > 0){ 
           res.send(G.utils.r(req.url, 'Usuario con privilegios de autorizar dispensacion', 200, {privilegios:resultado.rows}));
       }else{
           throw "Consulta sin resultado";
       }

}).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};



/*
 * @author Cristian Ardila
 * @fecha 07/06/2016
 * +Descripcion Controlador autorizar una dispensacion de un medicamento en caso
 *              de este ser confrontado
 *              
 */
DispensacionHc.prototype.autorizarDispensacionMedicamento  = function(req, res){
    
    console.log("DispensacionHc.prototype.autorizarDispensacionMedicamento  ");
    console.log("DispensacionHc.prototype.autorizarDispensacionMedicamento  ");
    console.log("DispensacionHc.prototype.autorizarDispensacionMedicamento  ");
    var that = this;
    var args = req.body.data;
    var usuario = req.session.user.usuario_id;
    if (args.autorizar_dispensacion === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {autorizar_dispensacion: []}));
        return;
    }
   
    if (!args.autorizar_dispensacion.evolucion || args.autorizar_dispensacion.evolucion.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucion', 404, {autorizar_dispensacion: []}));
        return;
    }
    
    if (!args.autorizar_dispensacion.producto || args.autorizar_dispensacion.producto.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere el codigo del producto', 404, {autorizar_dispensacion: []}));
        return;
    }
    
    if (!args.autorizar_dispensacion.observacion || args.autorizar_dispensacion.observacion.length === 0) {
        res.send(G.utils.r(req.url, 'Se requiere la observacion', 404, {autorizar_dispensacion: []}));
        return;
    }
    
    var parametros={evolucionId:args.autorizar_dispensacion.evolucion, 
                    usuario:usuario, 
                    observacion: args.autorizar_dispensacion.observacion,
                    producto:args.autorizar_dispensacion.producto};
      
    G.Q.ninvoke(that.m_dispensacion_hc,'autorizarDispensacionMedicamento',parametros).then(function(resultado){
        
        if(resultado.rows.length > 0){ 
           res.send(G.utils.r(req.url, 'Se autoriza la dispensacion del producto', 200, {autorizar_dispensacion:resultado.rows[0]}));
           
       }else{
           throw "Consulta sin resultado";
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


/**
 * @author Cristian Ardila
 * +Descripcion Controlador encargado de generar la dispensacion total de una
 *              formula, ejecutando en cascada los procesos pertinentes
 *              en el siguiente orden
 *  1) se ejecuta el model listarFormulas para obtener el plan id
 *  2) se ejecuta el model estadoParametrizacionReformular para obtener el valor
 *     de la variable de parametrizacion para formular
 *  3) se ejecuta el model estadoParametrizacionReformular para obtener el bodegas_doc_id
 *  4) se ejecuta el model consultarProductoTemporal para obtener los productos
 *     listos para ser dispensados
 *  5) se ejecuta el model bloquearTabla encargado de que la numeracion de la tabla
 *     bodegas_doc_numeraciones sea consistente y no se troque con una transaccion al tiempo
 *  6) se ejecuta el model asignacionNumeroDocumentoDespacho y se actualiza la numeracion
 *     segun el bodegas_doc_id enviado
 *  7) se ejecuta el model generarDispensacionFormula el cual ejecutara los siguientes procesos
 *      a traves de transacciones para que haya consistencia de datos, y si uno de los procesos
 *      falla se realizara un rollback
 *      (a)__insertarBodegasDocumentos se inserta la cabecera del despacho 
 *      (b)__insertarDespachoMedicamentos se inserta el documento generado
 *  8) se ejecuta la funcion privada recursiva __insertarBodegasDocumentosDetalle encargada
 *     de recorrer el arreglo con los productos preparados para dispensar
 *     (*)se ejecuta el model insertarBodegasDocumentosDetalle el cual ejecutara los siguientes procesos
 *      a traves de transacciones para que haya consistencia de datos, y si uno de los procesos
 *      falla se realizara un rollback
 *       (a)__actualizarExistenciasBodegasLotesFv se actualiza la existencias del lote
 *       (b)__actualizarExistenciasBodegas se actualiza las existencias de bodega
 *       (c)__insertarBodegasDocumentosDetalle se almacenan los productos dispensados
 *  9) se ejecuta el model consultarProductoTemporal para obtener los productos temporales
 *     y validar la cantidad pendiente que se dejo
 *  10) se ejecuta el model listarMedicamentosPendientes para listar los medicamentos pendientes
 *  11) se ejecuta la funcion privada recursiva __insertarMedicamentosPendientes encargada
 *      de recorrer el arreglo con los productos que quedan pendientes
 *      (a) se ejecuta el model insertarPendientesPorDispensar para almacenar lo que queda
 *      pendiente por dispensar
 *  12) se ejecuta el model eliminarTemporalesDispensados el cual eliminara los temporales
 *      de la formula actualmente dispensada 
 *  13) se ejecuta el model actualizarTipoFormula el cual actualizara el tipo 
 *      de la formula actualmente dispensada y con esto se termina el proceso de realizarEntregaFormula
 */
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
    
    if(!args.realizar_entrega_formula.tipoFormula){
        res.send(G.utils.r(req.url, 'Debe seleccionar el tipo de formula', 404, {realizar_entrega_formula: []}));
        return;
    } 
    
    var evolucionId = args.realizar_entrega_formula.evolucionId;
    var empresa = args.realizar_entrega_formula.empresa;
    var bodega = args.realizar_entrega_formula.bodega;
    var variable = args.realizar_entrega_formula.variable;
    var observacion = args.realizar_entrega_formula.observacion;
    var usuario = req.session.user.usuario_id;
    var tipoFormula = args.realizar_entrega_formula.tipoFormula;
    var bodegasDocId;
    var planId;
    var variableParametrizacion;
    var numeracion;
    var temporales;
    var todoPendiente;
    var parametrosReformular = {variable: variable,terminoBusqueda: evolucionId,
                                filtro: {tipo:'EV'},empresa: empresa,bodega: bodega,
                                observacion: observacion,tipoVariable : 0};
                                
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
            var parametrosGenerarDispensacion=
                  {
                    parametro1:{ bodegasDocId:bodegasDocId, 
                     numeracion:numeracion, 
                     observacion:observacion, 
                     estadoPendiente:0,
                     usuario: usuario,
                     evolucion: evolucionId,
                     todoPendiente: todoPendiente
                    },
                    
                    parametro2:{
                            temporales: temporales, 
                            usuario:usuario, 
                            bodegasDocId:bodegasDocId, 
                            numeracion:numeracion, 
                            planId: planId}
                  };
            
            /**
             * Inserta bodegas_documentos
             * Inserta hc_formulacion_despachos_medicamentos
             * Actualiza existencias_bodegas_lotes_fv, 
             * Actualiza existencias_bodegas
             * Inserta   bodegas_documentos_d
             * Inserta   hc_pendientes_por_dispensar
             * Consulta  hc_dispensacion_medicamentos_tmp
             * Consulta  Medicamentos pendientes
             * elimina   hc_dispensacion_medicamentos_tmp
             */        
            return G.Q.ninvoke(that.m_dispensacion_hc,'generarDispensacionFormula',parametrosGenerarDispensacion);
        };
            
            
    }).then(function(){          
         return G.Q.ninvoke(that.m_dispensacion_hc,'actualizarTipoFormula',{evolucionId:evolucionId, tipoFormula:tipoFormula.tipo});            
    }).then(function(resultado){
        
        if(resultado.rowCount === 0){
            throw 'Error al actualizar el tipo de formula'        
        }else{           
           res.send(G.utils.r(req.url, 'Se realiza la dispensacion correctamente', 200, {dispensacion: resultado}));
           that.e_dispensacion_hc.onNotificarEntregaFormula(); 
        }   
    }).fail(function(err){            
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();       
};

/*
 * @author Cristian Ardila
 * @fecha 15/06/2016
 * +Descripcion Controlador encargado listar los medicamentos pendientes
 *              por dispensar
 *              
 */
DispensacionHc.prototype.listarMedicamentosPendientesPorDispensar = function(req, res){
   
    var that = this;
    var args = req.body.data;
  
    if (args.listar_medicamentos_pendientes === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_medicamentos_pendientes: []}));
        return;
    }
   
    if (!args.listar_medicamentos_pendientes.evolucion || args.listar_medicamentos_pendientes.evolucion.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucion', 404, {listar_medicamentos_pendientes: []}));
        return;
    }
   var productosPendientes;
   var detalleCabecera;
   var parametros = {evolucionId:args.listar_medicamentos_pendientes.evolucion,
                    tipoIdPaciente: args.listar_medicamentos_pendientes.tipoIdPaciente,
                    pacienteId: args.listar_medicamentos_pendientes.pacienteId
                };
   
    G.Q.ninvoke(that.m_dispensacion_hc,'listarMedicamentosPendientesPorDispensar',parametros).then(function(resultado){
       
        if(resultado.rows.length > 0){ 
            
            productosPendientes = resultado.rows;
           
            return G.Q.ninvoke(that.m_dispensacion_hc,'obtenerCabeceraFormulaPendientesPorDispensar',parametros)
          
        }else{
           throw 'No hay pendientes por dispensar';
        }
      
   }).then(function(resultado){
       
       if(resultado.rows.length > 0){ 
            
            detalleCabecera = resultado.rows[0];
            return G.Q.ninvoke(that.m_dispensacion_hc,'profesionalFormula',parametros)
                
        }else{
            throw 'Consulta sin resultados';
        }
       
   }).then(function(resultado){
           
        if(resultado.rows.length > 0){ 
            console.log("resultado profesionales ", resultado.rows[0]);
            __generarPdf({productosPendientes:productosPendientes, 
                            serverUrl:req.protocol + '://' + req.get('host')+ "/", 
                            detalle: detalleCabecera, 
                            profesional:resultado.rows[0],
                            archivoHtml: 'medicamentosPendientesPorDispensar.html',
                            reporte: "Medicamentos_pendientes_por_dispensar_"}, function(nombre_pdf) {
                    
                    res.send(G.utils.r(req.url, 'Consulta exitosa con medicamentos pendientes', 200,{
                    
                        listar_medicamentos_pendientes: {nombre_pdf: nombre_pdf, resultadoos: productosPendientes}
                    }));
                });
        }else{
            throw 'Consulta sin resultados';
        }
           
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};


/*
 * @author Cristian Ardila
 * @fecha 15/06/2016
 * +Descripcion Controlador encargado listar los medicamentos Dispensados
 *              
 */
DispensacionHc.prototype.listarMedicamentosDispensados = function(req, res){
   
   console.log("*****DispensacionHc.prototype.listarMedicamentosDispensados ********");
   console.log("*****DispensacionHc.prototype.listarMedicamentosDispensados ********");
   console.log("*****DispensacionHc.prototype.listarMedicamentosDispensados ********");
   
    var that = this;
    var args = req.body.data;
  
    if (args.listar_medicamentos_dispensados === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_medicamentos_dispensados: []}));
        return;
    }
   
    if (!args.listar_medicamentos_dispensados.evolucion || args.listar_medicamentos_dispensados.evolucion.length === 0 ) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucion', 404, {listar_medicamentos_dispensados: []}));
        return;
    }
   var productosDispensados;
   var profesional;
   var detalleCabecera;
   
   var parametros = {evolucionId:args.listar_medicamentos_dispensados.evolucion,
                    tipoIdPaciente: args.listar_medicamentos_dispensados.tipoIdPaciente,
                    pacienteId: args.listar_medicamentos_dispensados.pacienteId,
                    ultimo: 1 
                };
   
    G.Q.ninvoke(that.m_dispensacion_hc,'listarMedicamentosDispensados',parametros).then(function(resultado){
       console.log("1) resultado ", resultado);
        if(resultado.rows.length > 0){ 
            console.log("resultado.rows ", resultado.rows);
            productosDispensados = resultado.rows;
           
            return G.Q.ninvoke(that.m_dispensacion_hc,'obtenerCabeceraFormulaPendientesPorDispensar',parametros)
          
        }else{
           throw 'No hay pendientes por dispensar';
        }
      
   }).then(function(resultado){
       console.log("2) resultado ", resultado);
       if(resultado.rows.length > 0){ 
            
            detalleCabecera = resultado.rows[0];
            return G.Q.ninvoke(that.m_dispensacion_hc,'profesionalFormula',parametros)
                
        }else{
            throw 'Consulta sin resultados';
        }
       
   }).then(function(resultado){
        console.log("3) resultado ", resultado);   
        if(resultado.rows.length > 0){ 
            
             profesional = resultado.rows;
            //return G.Q.ninvoke(that.m_dispensacion_hc,'listarMedicamentosPendientesDispensados',parametros);
            __generarPdf({productosDispensados:productosDispensados, 
                          serverUrl:req.protocol + '://' + req.get('host')+ "/", 
                          detalle: detalleCabecera, 
                          profesional:profesional,
                          archivoHtml: 'medicamentosDispensados.html',
                          reporte: "Medicamentos_dispensados"
                          }, function(nombre_pdf) {
                    
                    res.send(G.utils.r(req.url, 'Consulta exitosa con medicamentos pendientes', 200,{
                    
                        listar_medicamentos_dispensados: {nombre_pdf: nombre_pdf, resultado: productosDispensados}
                    }));
                    
                  });
        }else{
            throw 'Consulta sin resultados';
        }
           
    })./*.then(function(resultado){
        console.log("4) resultado ", resultado);
        if(resultado.rows.length > 0){ 
              console.log("Medicamentos pendientes dispensaods ", resultado.rows);
              
             /* __generarPdf({productosDispensados:productosDispensados, 
                          serverUrl:req.protocol + '://' + req.get('host')+ "/", 
                          detalle: detalleCabecera, 
                          profesional:profesional,
                          archivoHtml: 'medicamentosDispensados.html',
                          reporte: "Medicamentos_dispensados"
                          }, function(nombre_pdf) {
                    
                    res.send(G.utils.r(req.url, 'Consulta exitosa con medicamentos pendientes', 200,{
                    
                        listar_medicamentos_dispensados: {nombre_pdf: nombre_pdf, resultado: productosDispensados}
                    }));
                });*/
        
     /*   };
        
    }).*/fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

function __generarPdf(datos, callback) {  
   
    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/DispensacionHc/reports/'+datos.archivoHtml, 'utf8'),
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
           var fecha = new Date();
           var nombreTmp = datos.reporte + fecha.toFormat('DD-MM-YYYY') + ".html";
             
           G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body,  "binary",function(err) {
                if(err) {
                    console.log("err ",err);
                } else {
                    console.log("nombreTmp ", nombreTmp);
                    callback(nombreTmp);
                }
            });
                
            
        });
    });
}


DispensacionHc.$inject = ["m_dispensacion_hc", "e_dispensacion_hc"];

module.exports = DispensacionHc;
