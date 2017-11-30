
var ReporteDrAriasJobs = function(m_drArias) {
    var that = this;
   var ip = require('ip');;

    that.m_drArias = m_drArias;
    if(ip.address()==='10.0.2.229'){
	
	if(G.program.prod){
	    that.iniciar();
	}
    }
};


var jobInicio;

/*
 * @Author: Andres M. Gonzalez
 * +Descripcion: Metodo que da inicio al crontab
 * @param {type} callback
 * @returns {void}
 */
ReporteDrAriasJobs.prototype.iniciar = function() { //AddTemporalesReporteDrArias    
    var that = this;
 
    var job = new G.cronJob('00 10 00 * * *', function () {
        __InsertarDrArias(that,'0');
    });
    
    jobInicio = new G.cronJob('00 30 * * * *', function () {
        __InsertarDrArias(that,'1');
    });
  
    jobInicio.start();
    job.start();
};

/*
 * @Author: Andres M. Gonzalez
 * +Descripcion: funcion para realizar el insert del dia anterior al actual
 * @param {type} callback
 * @returns {void} 
 */
function __InsertarDrArias(that,swCopia){
    
    var numeroRegistros = '0';
    G.Q.ninvoke(that.m_drArias,"conteoTemporalesReporteDrArias").then(function(result){ 
          numeroRegistros=result[0].numero;
            if(parsetInt(numeroRegistros) === 0){
              return G.Q.ninvoke(that.m_drArias, "addTemporalesReporteDrArias");
             }else{
             
              jobInicio.stop();
              return;
             }           
        }).then(function(datos){           
            if(parsetInt(numeroRegistros) === 0){
             return G.Q.ninvoke(that.m_drArias, "conteoTemporalesReporteDrArias");
            }else
             return [{numero:'1'}];            
        }).then(function(datos){
            var numeroRegistrosfinal=datos[0].numero;
            if(parsetInt(numeroRegistrosfinal) !== 0 && parsetInt(numeroRegistros) === 0){
            
             var update={};
             update.numero=datos[0].numero;
             update.swCopia=swCopia;            
             G.Q.ninvoke(that.m_drArias, "guardarControlCopias",update);             
            }
             jobInicio.stop();
             return;   
        }).fail(function(err){
            console.log("Error creando copia a la tabla temporal_reporte_dr_arias ", err);
            return true;
        });
}

ReporteDrAriasJobs.$inject = ["m_drArias"];

module.exports = ReporteDrAriasJobs;
