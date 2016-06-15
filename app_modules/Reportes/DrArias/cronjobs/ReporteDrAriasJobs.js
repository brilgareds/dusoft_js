
var ReporteDrAriasJobs = function(m_drArias) {
    var that = this;
    that.m_drArias = m_drArias;
//    if(G.program.prod){
        that.iniciar();
//    }
};




/*
 * @Author: Andres M. Gonzalez
 * +Descripcion: Metodo que da inicio al crontab
 * @param {type} callback
 * @returns {void}
 */
//ReporteDrAriasJobs.prototype.iniciar = function() { //AddTemporalesReporteDrArias
//    
//    var that = this;
//    console.log("Iniciando crontab de Dr Arias 1 KKKKKKKKKKKKKKKKK >>>>>>>>>>>wwww");
//    var job = new G.cronJob('* * * * *', function () {
//        console.log("Iniciando crontab Dr Arias 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
////        G.Q.ninvoke(that.m_drArias, "borrarTemporalesReporteDrArias").then(function(result){           
////            console.log("Finaliza eliminacion del primer mes en tabla temporal_reporte_dr_arias");
////             return G.Q.ninvoke(that.m_drArias, "addTemporalesReporteDrArias");              
////        }).then(function(result){
////            console.log("Se Inserto los datos correctamente WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
////        }).fail(function(err){
////            console.log("error borrando primer mes en tabla temporal_reporte_dr_arias ", err);
////        });
//    });
//    
//    job.start();
//};

ReporteDrAriasJobs.prototype.iniciar = function(req, res){
    var that = this;
    //El cronjob correra todos los dias a media noche
    console.log("corriendo crontab para borrar temporales code 1 >>>>>>>>>>>>>>>>>>>>>>");
   // var job = new G.cronJob('*/59 */59 */23 * * *', function () {
    var job = new G.cronJob('*/5 * * * * *', function () {
        console.log("corriendo crontab para borrar temporales code 2 >>>>>>>>>>>>>>>>>>>>>>");
        return;
        G.utils.limpiarDirectorio(G.dirname + "/public/reports/");
        G.utils.limpiarDirectorio(G.dirname + "/files/tmp/");
        
    });
    job.start();
    
};


ReporteDrAriasJobs.$inject = ["m_drArias"];

module.exports = ReporteDrAriasJobs;
