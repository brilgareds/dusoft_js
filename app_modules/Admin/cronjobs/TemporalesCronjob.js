var TemporalesCronjob = function() {
   var that = this;
   that.iniciar();

};

TemporalesCronjob.prototype.iniciar = function(req, res){
    var that = this;
    //El cronjob correra todos los dias a media noche
    var job = new G.cronJob('*/59 */59 */23 * * *', function () {
        console.log("corriendo crontab para borrar temporales");
        G.utils.limpiarDirectorio(G.dirname + "/public/reports/");
        G.utils.limpiarDirectorio(G.dirname + "/files/tmp/");
        
    });
    job.start();
    
};


module.exports = TemporalesCronjob;