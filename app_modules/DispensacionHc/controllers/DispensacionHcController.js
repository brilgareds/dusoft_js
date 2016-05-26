
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
   console.log("**************************************args******************");
   console.log("**************************************args******************");
   console.log("**************************************args******************");
   
   console.log("args ", args)
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
    
   
   
   var parametros = {empresaId:empresaId,
                    terminoBusqueda: terminoBusqueda,
                    paginaActual:paginaActual,
                    fechaInicial: fechaInicial,
                    fechaFinal: fechaFinal,
                    filtro: filtro,
                    estadoFormula: estadoFormula};
   
   
   G.Q.ninvoke(that.m_dispensacion_hc,'listarFormulas',parametros).then(function(resultado){
     
       res.send(G.utils.r(req.url, 'Consulta con formulas', 200, {listar_formulas:resultado}));
        
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
    
       res.send(G.utils.r(req.url, 'Consulta tipo documento', 200, {listar_tipo_documento:resultado}));
        
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
  
       res.send(G.utils.r(req.url, 'Consulta formulas pendientes', 200, {listar_formulas:resultado}));
        
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
   
    
    
    if (!args.cantidadProducto.codigoProducto) {
        res.send(G.utils.r(req.url, 'Se requiere el codigo de producto', 404, {cantidadProducto: []}));
        return;
    }
    
    if (!args.cantidadProducto.evolucionId) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucion', 404, {cantidadProducto: []}));
        return;
    }
    
    if (!args.cantidadProducto.principioActivo) {
        res.send(G.utils.r(req.url, 'Se requiere el principio activo', 404, {cantidadProducto: []}));
        return;
    }
    
   var parametros = {codigoProducto:args.cantidadProducto.codigoProducto,
                     evolucionId:args.cantidadProducto.evolucionId,
                     principioActivo:args.cantidadProducto.principioActivo
                    };
   
   
   G.Q.ninvoke(that.m_dispensacion_hc,'cantidadProductoTemporal',parametros).then(function(resultado){
     
       res.send(G.utils.r(req.url, 'Consulta con medicamentos formulados', 200, {cantidadProducto:resultado}));
        
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
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_formulas: []}));
        return;
    }
   
    
    
    if (args.listar_medicamentos_formulados.evolucionId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucionId', 404, {pedidos_clientes: []}));
        return;
    }

   var parametros = {evolucionId:args.listar_medicamentos_formulados.evolucionId};
   
   
   G.Q.ninvoke(that.m_dispensacion_hc,'listarMedicamentosFormulados',parametros).then(function(resultado){
     
       res.send(G.utils.r(req.url, 'Consulta con medicamentos formulados', 200, {listar_medicamentos_formulados:resultado}));
        
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
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_detalle_medicamentos_formulados: []}));
        return;
    }
   
    
    
    if (!args.existenciasBodegas.codigoProducto) {
        res.send(G.utils.r(req.url, 'Se requiere el codigo de producto', 404, {cantidadProducto: []}));
        return;
    }
    
    
    if (!args.existenciasBodegas.principioActivo) {
        res.send(G.utils.r(req.url, 'Se requiere el principio activo', 404, {cantidadProducto: []}));
        return;
    }
    
   var parametros = {empresa: 'FD',
                     centroUtilidad:'06', 
                     bodega:'06',
                     codigoProducto:args.existenciasBodegas.codigoProducto,
                     principioActivo:args.existenciasBodegas.principioActivo
                    };
   
   
   G.Q.ninvoke(that.m_dispensacion_hc,'existenciasBodegas',parametros).then(function(resultado){
     
       res.send(G.utils.r(req.url, 'Consulta los lotes de cada producto de los FOFO', 200, {existenciasBodegas:resultado}));
        
   }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

DispensacionHc.$inject = ["m_dispensacion_hc"];

module.exports = DispensacionHc;
