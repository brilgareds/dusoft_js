var Sincronizacion = function(m_sincronizacion) {
    this.m_sincronizacion = m_sincronizacion;
};
__envio();
function __envio(){
    var obj = {};
    obj.x="prueba";
    obj.funcion="crearAdquirienteConUsuarioACliente";
    __jsonFacturacionRequirientes(obj,function(respuesta){
        obj.parametros=respuesta;
//        console.log("__jsonFacturacionRequiientes",obj);
        __requirienteFacturacion(obj,function(respuesta){
//            console.log("__requirienteFacturacion",respuesta);
        });
    });
}


function __jsonFacturacionRequirientes(obj,callback){
    
    var crearAdquirienteConUsuarioACliente ={
        adquiriente: {
          acuerdoFisicoFacturacionElectronica: obj.x,
          adjuntarPdfNotificaciones: obj.x,
          adjuntarXmlNotificaciones: obj.x,
          apellidos: obj.x,
          camposDinamicosAdquirientes: {
            nombreCampo: obj.x,
            valor: obj.x
          },
          cantidadDiasAceptacionAutomatica: obj.x,
          ciudadExtranjera: obj.x,
          codigoCiudad: obj.x,
          codigoDepartamento: obj.x,
          codigoPais: obj.x,
          direccion: obj.x,
          emailPrincipal: obj.x,
          emailSecundarios: obj.x,
          enviarCorreoCertificado: obj.x,
          enviarCorreoDeBienvenida: obj.x,
          enviarFisico: obj.x,
          enviarNotificaciones: obj.x,
          enviarPlataformaFacturacion: obj.x,
          fax: obj.x,
          formatoFactura: obj.x,
          idClienteCreador: obj.x,
          identificacionAdquirienteWS: {
            codigoDian: obj.x,
            digitoDeVerificacion: obj.x,
            numeroIdentificacion: obj.x
          },
          naturaleza: obj.x,
          nombre: obj.x,
          observaciones: obj.x,
          razonSocial: obj.x,
          registradoEnCatalogo: obj.x,
          telefono: obj.x,
          tipoEstablecimiento: obj.x,
          tipoObligacion: obj.x,
          tipoUsuarioAduanero: obj.x,
          tiposRepresentacion: obj.x
        },
        usuario: {
          contrasena: 'cosmitet202',
          generarContrasena: false,
          nombreUsuario: 'admin_cosmitet'
        }
      };
    callback(crearAdquirienteConUsuarioACliente);
}

/*
 * Andres Mauricio Gonzalez
 * obj  { parametros : (informacion que se envian al ws),funcion: (nombre de la funcion que ejecuta el ws)}
 */
function __requirienteFacturacion(obj, callback){
    var url =  G.constants.WS().FACTURACION_ELECTRONICA.CERTICAMARA;
    var resultado;
 
    obj.error = false;
  var privateKey = G.fs.readFileSync(G.dirname+G.settings.certificados_cervicamara+"preproduccionv4_certifactura_co.key"); 
  var publicKey = G.fs.readFileSync(G.dirname+G.settings.certificados_cervicamara+"preproduccionv4_certifactura_co.cer");
  var publicKey2 = G.fs.readFileSync(G.dirname+G.settings.certificados_cervicamara+"Intermedia_Rapid.cer");
//  var password = ''; // optional password
  var password = 'cosmitet202'; // optional password
  var username = 'admin_cosmitet'; // optional password  
  var wsdlOptions = {
  valueKey: 'theVal'
};
    //Se invoca el ws
    G.Q.nfcall(G.soap.createClient, url,wsdlOptions).then(function(client) {
//        
      var wsSecurity = new G.soap.WSSecurityCert(privateKey, publicKey, password);
//      
     client.setSecurity(wsSecurity);
var datos ={
    adquirente: obj.parametros,
};
        return G.Q.ninvoke(client,obj.funcion, datos);
        
    }).spread(function(result,raw,soapHeader){
//console.log("result.return.msj[$value] ",result);
//console.log("result.return.msj[$value] ",raw);
console.log("result.return.msj[$value] ",soapHeader);
        if(!result.return.msj["$value"]){
            throw {msj:"Se ha generado un error", status:403, obj:{}}; 
        } else {            
//            obj.fechaMaxima = result.return.msj["$value"];
                  console.log("result.return.msj[$value] ",result.return.msj["$value"]);
        }
        
    }).then(function(){
        
        callback(false, obj);    
        
    }).fail(function(err) {    
        
        obj.error = true;
        obj.tipo = '0';
        console.log("err ", err);
        G.logError(err);
        
        callback(err);
       
    }).done();
}



Sincronizacion.$inject = ["m_sincronizacion"];
module.exports = Sincronizacion;