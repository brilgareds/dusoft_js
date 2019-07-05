
var ReporteDrAriasJobs = function (m_drArias) {
    var that = this;
    
    that.m_drArias = m_drArias;
   
//     if (G.program.prod) {
            that.iniciar();
//     }
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
  
    var job = new G.cronJob('0 0 1 * *', function () {
        __insertTotalesMensual(that);
    });
    job.start();
    
};

function __insertTotalesMensual(that){
   var meses = new Array ("ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE");
   var fecha = new Date();
   var mes = meses[fecha.getMonth()];
  G.Q.ninvoke(that.m_drArias,"listarTotalizadosBodegas").then(function(result){ 
      G.Q.nfcall(__insertarTotalizadosBodegasMes,that,result,0,mes);
  }).fail(function(err){
       console.log("Error creando lista Totalizados Bodegas ", err);
       return true;
   });  
}

function __insertarTotalizadosBodegasMes(that,bodegas,index,mes,callback){
    
    var bodega = bodegas[index];
    if(!bodega){
        callback(false,true);
        return;
    }
    
    var obj = {nombre_bodega : bodega.descripcion, total:bodega.total, mes:mes};
    console.log("result:::",bodega);
    G.Q.ninvoke(that.m_drArias,"insertTotalizadosBodegasMes",obj).then(function(result){ 
      console.log("result:::",result);
      index++;
       __insertarTotalizadosBodegasMes(that,bodegas,index,mes,callback);
       
    }).fail(function(err){
       callback(err);
       return true;
   });
}

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
            if(parseInt(numeroRegistros) === 0){
              return G.Q.ninvoke(that.m_drArias, "addTemporalesReporteDrArias");
             }else{
             
              jobInicio.stop();
              return;
             }           
        }).then(function(datos){    
            if(parseInt(numeroRegistros) === 0){
             return G.Q.ninvoke(that.m_drArias, "conteoTemporalesReporteDrArias");
            }else
             return [{numero:'1'}];            
        }).then(function(datos){
            var numeroRegistrosfinal=datos[0].numero;
            if(parseInt(numeroRegistrosfinal) !== 0 && parseInt(numeroRegistros) === 0){
            
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
