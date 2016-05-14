
var PedidosCronJobs = function(m_pedidos_farmacias, m_pedidos_clientes) {
    var that = this;
    that.m_pedidos_farmacias = m_pedidos_farmacias;
    that.m_pedidos_clientes = m_pedidos_clientes;
    //if(G.program.prod){
        //that.iniciar();
   // }
};



PedidosCronJobs.prototype.iniciar = function() {

    var that = this;
    
    var job = new G.cronJob('*/5 * * * * *', function () {
        console.log("borrando temporales de pedidos");
           
        G.Q.ninvoke(that.m_pedidos_farmacias, "eliminarTemporalesFarmacias").then(function(){
            return G.Q.ninvoke(that.m_pedidos_clientes, "eliminarTemporalesClientes");
        }).then(function(){
            console.log("temporales de pedidos borrados");
        }).fail(function(err){
            console.log("error borrando temporales ", err);
        }).done();
        
    });
    job.start();
};



PedidosCronJobs.$inject = ["m_pedidos_farmacias", "m_pedidos_clientes"];

module.exports = PedidosCronJobs;
