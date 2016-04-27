var TemporalesCronjob = function() {
   var that = this;
   //Cronjob solo corren en modo produccion
    //if(G.program.prod){
        console.log("iniciando cronjob de temporales");
        that.iniciar();
    //}

};

TemporalesCronjob.prototype.iniciar = function(req, res){
    var that = this;
    //El cronjob correra todos los dias a media noche
    //var job = new G.cronJob('*/59 */59 */23 * * *', function () {
    var job = new G.cronJob('* * * * * *', function () {
        console.log("corriendo crontab para borrar temporales");
        G.utils.limpiarDirectorio(G.dirname + "/public/reports/");
        G.utils.limpiarDirectorio(G.dirname + "/files/tmp/");
        
    });
    job.start();
    
};


module.exports = TemporalesCronjob;