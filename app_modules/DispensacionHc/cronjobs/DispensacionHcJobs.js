var DispensacionHcJobs = function(c_dispensacion_hc) {
    var that = this;
    /*this.cronJob = require('cron').CronJob;  */
    this.c_dispensacion_hc = c_dispensacion_hc;
    if(!G.program.prod){
       
        that.ejecutarJobEliminarFormulasSinMovimiento();
        
    }
   
};

DispensacionHcJobs.prototype.ejecutarJobEliminarFormulasSinMovimiento = function() {

    var that = this;   
    // '00 30 00 * * *'
    //'*/1 * * * *'
    var job = new G.cronJob('00 30 00 * * *', function () {
        
        that.c_dispensacion_hc.eliminarFormulasSinMovimiento();  

    });
    job.start();
    
};

DispensacionHcJobs.$inject = ["c_dispensacion_hc"];

module.exports = DispensacionHcJobs;
