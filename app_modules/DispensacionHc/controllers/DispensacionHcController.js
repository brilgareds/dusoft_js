
var DispensacionHc = function(m_dispensacion_hc) {

    this.m_dispensacion_hc = m_dispensacion_hc;
  
  //  this.m_pedidos_clientes_log = m_pedidos_clientes_log;
};


DispensacionHc.prototype.listarFormulas = function(req, res){
    
    var that = this;
    var args = req.body.data;
    console.log("AQOI LISTA FORMULAS")
   var parametros = {};
   
   
   G.Q.ninvoke(that.m_dispensacion_hc,'listarFormulas',parametros).then(function(resultado){
     
       res.send(G.utils.r(req.url, 'Consulta con formulas', 200, {listar_formulas:resultado}));
        
   }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};


DispensacionHc.$inject = ["m_dispensacion_hc"];

module.exports = DispensacionHc;
