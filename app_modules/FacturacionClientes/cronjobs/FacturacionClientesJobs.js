var FacturacionClientesJobs = function(c_facturacion_clientes) {
    var that = this;
    /*this.cronJob = require('cron').CronJob;  */
    this.c_facturacion_clientes = c_facturacion_clientes;
    if(!G.program.prod){
       
        that.ejecutarJobProcesarDespachos();
        
    }
    
    console.log("Modulo Cron Jobs Facturacion Clientes Cargado... ");
      
};

FacturacionClientesJobs.prototype.ejecutarJobProcesarDespachos = function() {

    var that = this;   
    
    var job = new G.cronJob( '*/1 * * * *', function () {
        
        that.c_facturacion_clientes.generarFacturasAgrupadasEnProceso();  
        console.log("INVOCANDO CONTROLADOR ejecutarJobProcesarDespachos... ");
    });
    job.start();
   
};

FacturacionClientesJobs.$inject = ["c_facturacion_clientes"];

module.exports = FacturacionClientesJobs;
