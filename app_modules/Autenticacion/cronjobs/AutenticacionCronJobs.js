
var AutenticacionCronJobs = function(auth_events) {

    console.log("Modulo Cron Jobs Autenticacion Cargado ");
    
    this.cronJob = require('cron').CronJob;
    this.e_auth = auth_events;
};



AutenticacionCronJobs.prototype.cerrarSesionesInactivas = function() {

    var that = this;
    
    var cron = new this.cronJob({
        cronTime: '*/5 * * * *',
        //cronTime: '* * * * * *',
        onTick: function() {
            G.auth.closeInactiveSessions(function(sesiones_cerradas){
                that.e_auth.onCerrarSesion(sesiones_cerradas);
            });
        },
        start: false
    });
    cron.start();
};



AutenticacionCronJobs.$inject = ["e_auth"];

module.exports = AutenticacionCronJobs;
