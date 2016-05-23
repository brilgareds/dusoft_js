
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
   
    console.log("******************DispensacionHc.prototype.listarFormulas *********************");
    console.log("******************DispensacionHc.prototype.listarFormulas *********************");
    console.log("******************DispensacionHc.prototype.listarFormulas *********************");
    
    var that = this;
    var args = req.body.data;
   
   console.log("args ", args)
   
   if (args.listar_empresas === undefined || args.listar_empresas.paginaActual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {listar_empresas: []}));
        return;
    }
    
   
   var parametros = {};
   
   
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
        console.log("AQOI LISTA TIPO DOCUMENTOS")
    var that = this;
    var args = req.body.data;

   
   
   G.Q.ninvoke(that.m_dispensacion_hc,'listarTipoDocumento').then(function(resultado){
     console.log("resultado --- ", resultado)
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
      
      console.log("***********************DispensacionHc.prototype.listarFormulasPendientes ***************************");
      console.log("***********************DispensacionHc.prototype.listarFormulasPendientes ***************************");
      console.log("***********************DispensacionHc.prototype.listarFormulasPendientes ***************************");
      console.log("***********************DispensacionHc.prototype.listarFormulasPendientes ***************************");
      
    var that = this;
    var args = req.body.data;

   
   
   G.Q.ninvoke(that.m_dispensacion_hc,'listarFormulasPendientes').then(function(resultado){
  
       res.send(G.utils.r(req.url, 'Consulta formulas pendientes', 200, {listar_formulas_pendientes:resultado}));
        
   }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};
DispensacionHc.$inject = ["m_dispensacion_hc"];

module.exports = DispensacionHc;
