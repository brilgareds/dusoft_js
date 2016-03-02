
var PedidosCronJobs = function() {

    console.log("Modulo Cron Jobs Pedidos Cargado ");
};



PedidosCronJobs.prototype.liberarReservas = function() {

    var that = this;
    
    var job = new G.cronJob('*/5 * * * * *', function () {
        // Do some stuff here 
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>> liberar Reservas");
    });
    job.start()
};



//PedidosCronJobs.$inject = ["e_auth"];

module.exports = PedidosCronJobs;
