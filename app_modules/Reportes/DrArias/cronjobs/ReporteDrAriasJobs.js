
var ReporteDrAriasJobs = function(m_drArias) {
    var that = this;
    that.m_drArias = m_drArias;
    if(G.program.prod){
        that.iniciar();
    }
};




/*
 * @Author: Andres M. Gonzalez
 * +Descripcion: Metodo que da inicio al crontab
 * @param {type} callback
 * @returns {void}
 */
ReporteDrAriasJobs.prototype.iniciar = function() { //AddTemporalesReporteDrArias
    
    var that = this;
    var job = new G.cronJob('00 10 00 * * *', function () {
        G.Q.ninvoke(that.m_drArias, "borrarTemporalesReporteDrArias").then(function(result){           
            console.log("Finaliza eliminacion del primer mes en tabla temporal_reporte_dr_arias");
             return G.Q.ninvoke(that.m_drArias, "addTemporalesReporteDrArias");              
        }).then(function(result){
            console.log("Se Insertaron los datos correctamente en tabla temporal_reporte_dr_arias");
        }).fail(function(err){
            console.log("error borrando primer mes en tabla temporal_reporte_dr_arias ", err);
        });
    });
    
    job.start();
};

ReporteDrAriasJobs.$inject = ["m_drArias"];

module.exports = ReporteDrAriasJobs;
