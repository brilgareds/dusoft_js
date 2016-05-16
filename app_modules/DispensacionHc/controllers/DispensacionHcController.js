
var DispensacionHc = function(dispensacion_hc) {


    this.m_dispensacion_hc = dispensacion_hc;
  
  //  this.m_pedidos_clientes_log = m_pedidos_clientes_log;
};


DispensacionHc.prototype.listarFormulas = function(req, res){
    
    var that = this;
    var args = req.body.data;
    
    var param = {};
    G.Q.ninvoque(that.m_dispensacion_hc,'listarFormulas',param).then(function(resultado){
        
        
         res.send(G.utils.r(req.url, 'Consulta exitosa', 200, {pedidos_clientes: {}}));
    });
};


DispensacionHc.$inject = ["m_dispensacion_hc"];

module.exports = DispensacionHc;
