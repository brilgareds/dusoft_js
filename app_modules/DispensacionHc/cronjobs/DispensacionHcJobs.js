var DispensacionHcJobs = function(c_dispensacion_hc) {
    var that = this;
    /*this.cronJob = require('cron').CronJob;  */
    this.c_dispensacion_hc = c_dispensacion_hc;
    console.log("///////////////////-----//////////////////////",G.program.prod);
    console.log("///////////////////-----//////////////////////",G.program.prod);
    console.log("///////////////////-----//////////////////////",G.program.prod);
//    if(!G.program.prod){
       
//        that.ejecutarJobEliminarFormulasSinMovimiento();
        that.ejecutarJobSincronizarFormulasDispensadas();
        
//    }
   
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

DispensacionHcJobs.prototype.ejecutarJobSincronizarFormulasDispensadas = function () {

    var that = this;
    var ip = require('ip');
    if (ip.address() === '10.0.2.158') {
        var job = new G.cronJob('10 * * * * *', function () {
            that.c_dispensacion_hc.sincronizacionFormulasDispensadas();
        });
            
        job.start();       
    }
};

DispensacionHcJobs.$inject = ["c_dispensacion_hc"];

module.exports = DispensacionHcJobs;
