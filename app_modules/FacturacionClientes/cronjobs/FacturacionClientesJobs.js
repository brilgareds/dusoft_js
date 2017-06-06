var FacturacionClientesJobs = function(c_facturacion_clientes) {
    
    this.cronJob = require('cron').CronJob;  
    this.c_facturacion_clientes = c_facturacion_clientes;

    console.log("Modulo Cron Jobs Facturacion Clientes Cargado... ");
      
};

FacturacionClientesJobs.prototype.ejecutarJobProcesarDespachos = function() {

    var that = this;   
    var cron = new this.cronJob({
        cronTime: '*/1 * * * *',       
        onTick: function() {
            that.c_facturacion_clientes.generarFacturasAgrupadasEnProceso();           
            console.log("Cada minuto y Dios sigue siendo Bueno")
        },
        start: false
    });
    cron.start();
};

FacturacionClientesJobs.$inject = ["c_facturacion_clientes"];

module.exports = FacturacionClientesJobs;
