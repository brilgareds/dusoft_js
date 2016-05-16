
var PedidosCronJobs = function(m_pedidos_farmacias, m_pedidos_clientes) {
    var that = this;
    that.m_pedidos_farmacias = m_pedidos_farmacias;
    that.m_pedidos_clientes = m_pedidos_clientes;
    if(G.program.prod){
        that.iniciar();
    }
};



/**
 * @author Eduar Garcia
 * +Descripcion: Metodo que da inicio al crontab
 * @param {type} callback
 * @returns {void}
 */
PedidosCronJobs.prototype.iniciar = function() {
    
    var that = this;
    
    var job = new G.cronJob('*/59 */59 */23 * * *', function () {
    //var job = new G.cronJob('*/10 * * * * *', function () {
        console.log("iniciando crontab de pedidos >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        G.Q.ninvoke(that, "borrarTemporalesPedidos").then(function(){
            return G.Q.ninvoke(that, "borrarReservasPedido");
        }).then(function(){
            console.log("finaliza eliminacion de temporales y liberacion de reservas ---------------");
        }).fail(function(err){
            console.log("error borrando temporales ", err);
        });
    });
    
    job.start();
};


/**
 * @author Eduar Garcia
 * +Descripcion: Invoca metodos de los modelos correspondients a clientes y farmacias para liberar reservas de los temporales
 * @param {type} callback
 * @returns {void}
 */
PedidosCronJobs.prototype.borrarTemporalesPedidos = function(callback) {
    var that = this;
   

    G.Q.ninvoke(that.m_pedidos_farmacias, "eliminarTemporalesFarmacias").then(function(){
        return G.Q.ninvoke(that.m_pedidos_clientes, "eliminarTemporalesClientes");
    }).then(function(){
         console.log("finaliza borrando temporales  ---------------");
        callback(false);
    }).fail(function(err){

        callback(err);
    }).done();
        

};

/**
 * @author Eduar Garcia
 * +Descripcion: Invoca metodos de los modelos correspondients a clientes y farmacias para liberar reservas
 * @param {type} callback
 * @returns {void}
 */
PedidosCronJobs.prototype.borrarReservasPedido = function(callback) {
    var that = this;
   
    G.Q.ninvoke(that.m_pedidos_farmacias, "borrarReservas").then(function(){
        return G.Q.ninvoke(that.m_pedidos_clientes, "borrarReservas");
    }).then(function(){
         console.log("finaliza reservas pedidos  ---------------");
        callback(false);
    }).fail(function(err){

        callback(err);
    }).done();
        
};

PedidosCronJobs.$inject = ["m_pedidos_farmacias", "m_pedidos_clientes"];

module.exports = PedidosCronJobs;
