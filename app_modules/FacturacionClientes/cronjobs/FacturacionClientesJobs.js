//m_facturacion_clientes,m_dispensacion_hc,m_e008,m_usuarios,m_sincronizacion,e_facturacion_clientes,
var FacturacionClientesJobs = function(c_facturacion_clientes) {
    
    this.cronJob = require('cron').CronJob;
    /*this.m_facturacion_clientes = m_facturacion_clientes;
    this.m_dispensacion_hc = m_dispensacion_hc;
    this.m_e008 = m_e008;
    this.m_usuarios = m_usuarios;
    this.m_sincronizacion = m_sincronizacion;
    this.e_facturacion_clientes = e_facturacion_clientes;*/
    this.c_facturacion_clientes = c_facturacion_clientes;

    console.log("Modulo Cron Jobs Facturacion Clientes Cargado... ");
    
   
     
};



FacturacionClientesJobs.prototype.ejecutarJobProcesarDespachos = function() {
 

    var that = this;
    
    var cron = new this.cronJob({
        cronTime: '*/1 * * * *',
        //cronTime: '*/5 * * * * *',
        
        onTick: function() {
            that.c_facturacion_clientes.generarFacturasAgrupadasEnProceso();
            /*G.auth.closeInactiveSessions(function(sesiones_cerradas){
                //that.e_auth.onCerrarSesion(sesiones_cerradas);
            });*/
            console.log("CADA MINUTO Y Dios sigue siendo Bueno")
        },
        start: false
    });
    cron.start();
};


//"m_facturacion_clientes","m_dispensacion_hc", "m_e008","m_usuarios","m_sincronizacion","e_facturacion_clientes",
FacturacionClientesJobs.$inject = ["c_facturacion_clientes"];

module.exports = FacturacionClientesJobs;


/*
 * @Author: Andres M. Gonzalez
 * +Descripcion: Metodo que da inicio al crontab
 * @param {type} callback
 * @returns {void}
 */
/*FacturacionClientesJobs.prototype.procesarDespachos = function() { //AddTemporalesReporteDrArias    
    var that = this;
 
    var job = new G.cronJob('11 25 00 * * *', function () {
        __procesarDespachos(that,'0');
    });
    
    jobInicio = new G.cronJob('00 01 * * * *', function () {
        __procesarDespachos(that,'1');
    });
  
    jobInicio.start();
    job.start();
};*/

/*
 * @Author: Andres M. Gonzalez
 * +Descripcion: funcion para realizar el insert del dia anterior al actual
 * @param {type} callback
 * @returns {void} 
 */
/*function __procesarDespachos(that,swCopia){
    
    
    console.log("EJECUTANDO JOB DE FACTURAS EN PROCESO OK (Dios es Bueno)")*/
    /*var numeroRegistros = '0';
    G.Q.ninvoke(that.m_drArias,"conteoTemporalesReporteDrArias").then(function(result){ 
          numeroRegistros=result[0].numero;
            if(numeroRegistros === '0'){
              return G.Q.ninvoke(that.m_drArias, "addTemporalesReporteDrArias");
             }else{
                 console.log('para proceso');
              jobInicio.stop();
              return;
             }           
        }).then(function(datos){           
            if(numeroRegistros === '0'){
             return G.Q.ninvoke(that.m_drArias, "conteoTemporalesReporteDrArias");
            }else
             return [{numero:'1'}];            
        }).then(function(datos){
            var numeroRegistrosfinal=datos[0].numero;
            if(numeroRegistrosfinal !== '0' && numeroRegistros === '0'){
             console.log("SE CREO LA COPIA DE temporal_reporte_dr_arias CORRECTAMENTE: ",numeroRegistrosfinal);
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
        });*/
//}
 
/*FacturacionClientesJobs.$inject = ["m_facturacion_clientes","m_dispensacion_hc", "m_e008","m_usuarios","m_sincronizacion","e_facturacion_clientes"];
module.exports = FacturacionClientesJobs;*/
