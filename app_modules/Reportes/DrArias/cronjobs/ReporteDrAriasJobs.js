
var ReporteDrAriasJobs = function (m_drArias) {
    var that = this;
    var ip = require('ip');

    that.m_drArias = m_drArias;
   
    if (ip.address() === '10.0.2.158') {

       // if (G.program.prod) {
            that.iniciar();
       // }
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
    
//    var job = new G.cronJob('00 10 00 * * *', function () {
//        __InsertarDrArias(that,'0');
//             });
//    
//    jobInicio = new G.cronJob('00 30 * * * *', function () {
//        __InsertarDrArias(that,'1');
//    });
    
    var job = new G.cronJob('00 00 06 * * *', function () {
        __InsertarMedipol(that,2,function(result){
              
        });
    });

   // jobInicio.start();
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

/*
 * @Author: Andres M. Gonzalez
 * +Descripcion: funcion para realizar el insert el dia n medipol
 * @param {type} callback
 * @returns {void} 
 */
function __InsertarMedipol(that,dias,callback){
    
    if(dias === 1){
       callback(false,true);
       return true; 
    }
   
    var formFecha = G.moment().subtract(dias, 'days');
    var control = formFecha.format('DD/MM/YYYY');
    var fecha = formFecha.format('YYYY-MM-DD');
    var lengthDataWS = -1;
    
    var data ={
       fecha : fecha, 
       control : control
    };
   
    G.Q.nfcall(__wsMedipol,data).then(function(result){ 
     lengthDataWS = result.resultado.length;
     
     return G.Q.nfcall(__InsertarProctosMedipol,that,data,result.resultado ,0);
    
    }).then(function(datos){
       if(datos !== lengthDataWS){
           console.log("Diferencia en el ws y lo que se inserto ne db");
       }
     dias--;
     __InsertarMedipol(that,dias,callback);
     return;
    
    }).fail(function(err){
        console.log("Error __InsertarMedipol", err);
        callback(false);
    });
}

/*
 * @Author: Andres M. Gonzalez
 * +Descripcion: funcion para realizar el insert el dia n medipol
 * @param {type} callback
 * @returns {void} 
 */
function __InsertarProctosMedipol(that,data,productos,index,callback){
    var producto = productos[index];

    if(!producto){
     
        callback(false,index-1);
        return;
    }
    
    producto = producto.split("@");
        
    var parametros = { 
        empresa_id : producto[0],
        bodega : producto[1],
        codigo_producto : producto[2],
        producto : producto[3],
        laboratorio : producto[4],
        molecula : producto[5],
        cantidad_total_despachada : producto[6],
        existencia_farmacia : producto[7],
        existencia_bd : producto[8],
        mes : '2',
        fecha : data.control,
        centro_utilidad : producto[1],
        nivel : '0',
        tipo_producto : 'Normales'
    };
    
    G.Q.ninvoke(that.m_drArias,"insertRotacionMedipol",parametros).then(function(result){ 
        
        index++;
        __InsertarProctosMedipol(that,data,productos,index,callback);
         
    }).fail(function(err){
            console.log("Error __InsertarProctosMedipol", err);
            return true;
    });
}

/*
 * @Author: Andres M. Gonzalez
 * +Descripcion: funcion para actualizar tabla rotacion_diaria_medipol
 * @param {type} callback
 * @returns {void} 
 */
function __wsMedipol(data,callback){
    
    var url = G.constants.WS().MEDIPOL.ROTACION;
    var obj  = {};
    
    var parametros  = {
        fecha: data.fecha,
        control: data.control
    };

    obj.error = false;

    G.Q.nfcall(G.soap.createClient, url).then(function(client) {
         
        return G.Q.ninvoke(client, "devolver_plano_rotacion_dia", parametros);

    }).spread(function(result, raw, soapHeader) {

        if (!result.return["$value"]) {
            throw {msj: "Se ha generado un error", status: 403, obj: {}};
        } else {
            obj.resultado = result.return["$value"].split("\n");
        }

    }).then(function() {
        
        callback(false, obj);

    }).fail(function(err) {
        console.log("Error __wsMedipol ", err);
        obj.error = true;
        obj.tipo = '0';
        callback(err);

    }).done();
};


ReporteDrAriasJobs.$inject = ["m_drArias"];

module.exports = ReporteDrAriasJobs;
