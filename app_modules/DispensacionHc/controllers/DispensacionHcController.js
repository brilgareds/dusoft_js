
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
DispensacionHc.prototype.listarLotesMedicamentosFormulados = function(req, res){
   
    var that = this;
    var args = req.body.data;
   
   if (args.listar_lotes_medicamentos_formulados === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_formulas: []}));
        return;
    }
   
    
    
    if (args.listar_medicamentos_formulados.evolucionId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la evolucionId', 404, {pedidos_clientes: []}));
        return;
    }

   var parametros = {evolucionId:args.listar_lotes_medicamentos_formulados.evolucionId};
   
   
   G.Q.ninvoke(that.m_dispensacion_hc,'listarLotesMedicamentosFormulados',parametros).then(function(resultado){
     
       res.send(G.utils.r(req.url, 'Consulta con medicamentos formulados', 200, {listar_lotes_medicamentos_formulados:resultado}));
        
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


DispensacionHc.$inject = ["m_dispensacion_hc"];

module.exports = DispensacionHc;
