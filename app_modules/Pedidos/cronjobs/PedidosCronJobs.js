
var PedidosCronJobs = function() {

    console.log("Modulo Cron Jobs Pedidos Cargado ");
};



PedidosCronJobs.prototype.liberarReservas = function() {

    var that = this;
    
    //var cron = new G.cronJob({
        //cronTime: '* * * * *',
        //cronTime: '*/5 * * * * *',
       /* onTick: function() {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>> liberar Reservas");
        },
        start: false
    });
    cron.start();*/
    
    
    var job = new G.cronJob('*/5 * * * * *', function () {
        // Do some stuff here 
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>> liberar Reservas");
    });
    job.start()
};



//PedidosCronJobs.$inject = ["e_auth"];

module.exports = PedidosCronJobs;
