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
          generarContrasena: true,
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

    //Se invoca el ws
    G.Q.nfcall(G.soap.createClient, url).then(function(client) {
//        
      var wsSecurity = new G.soap.WSSecurityCert(privateKey, publicKey, password);
      var options ={
          passwordType:'PasswordDigest',
          hasTimeStamp:true,
          hasTokenCreated:false
      }
     // client.setSecurity(new G.soap.WSSecurity(username, password,options));

        client.setSecurity(wsSecurity);

        return G.Q.ninvoke(client,obj.funcion, obj.parametros);
        
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

function __jsonNotaCredito(obj, callback) {

    var crearNotaCredito = {
        notaCreditoElectronicaCanonica: {
            codigoMoneda: obj.x, //String
            conceptoNota: obj.x, //numeric
            fechaExpedicion: obj.x, //String
            fechaVencimiento: obj.x, //String OPCIONAL
            identificacionReceptor: {
                codigoDocumentoDian: obj.x, //int
                numeroIdentificacion: obj.x //String
            },
            identificadorFactura: obj.x, //long
            nombreSucursal: obj.x, //String OPCIONAL
            numeroNota: obj.x, //numeric
            observaciones: obj.x, //String OPCIONAL
            perfilEmision: obj.x, //String
            perfilUsuario: obj.x, //String
            productos: { //OPCIONAL
                atributosAdicionalesProd: {
                    nombreAtributo: obj.x, //String
                    valor: obj.x //String
                },
                cantidad: obj.x, //decimal OPCIONAL
                descripcion: obj.x, //String OPCIONAL
                identificador: obj.x, //String
                imprimible: obj.x, //boolean
                impuestoAlConsumo: {
                    nombre: obj.x, //String
                    porcentual: obj.x, //decimal
                    valor: obj.x //decimal
                },
                impuestoICA: {
                    nombre: obj.x, //String
                    porcentual: obj.x, //decimal
                    valor: obj.x //decimal
                },
                impuestoIVA: {
                    nombre: obj.x, //String
                    porcentual: obj.x, //decimal
                    valor: obj.x //decimal
                },
                listaImpuestosDeducciones: { // OPCIONAL
                    nombre: obj.x, //String
                    porcentual: obj.x, //decimal
                    valor: obj.x //decimal
                },
                pagable: obj.x, //boolean
                valorUnitario: obj.x //decimal
            },
            subtotalNotaCreditoElectronica: obj.x, //decimal OPCIONAL
            subtotalesImpuestosDeduccion: { // OPCIONAL
                nombre: obj.x, //String
                valor: obj.x, //decimal
                baseGravable: obj.x //decimal
            },
            tipoFactura: obj.x, //numeric
            totalNotaCreditoElectronica: obj.x //decimal
        },
        notaEspecializada: {
            AtributosAdicionales: {
                nombreAtributo: obj.x, //String
                valor: obj.x, //String
                tipo: obj.x //String
            }
        }
    };
    callback(crearNotaCredito);
}

function __jsonNotaDebito(obj, callback) {

    var crearNotaDebito = {
        notaDebitoElectronicaCanonica: {
            codigoMoneda: obj.x, //String
            conceptoNota: obj.x, //numeric
            fechaExpedicion: obj.x, //String
            fechaVencimiento: obj.x, //String OPCIONAL
            identificacionReceptor: {
                codigoDocumentoDian: obj.x, //int
                numeroIdentificacion: obj.x //String
            },
            identificadorFactura: obj.x, //long
            nombreSucursal: obj.x, //String
            numeroNota: obj.x, //numeric
            observaciones: obj.x, //String OPCIONAL
            perfilEmision: obj.x, //String
            perfilUsuario: obj.x, //String
            productos: { //OPCIONAL
                atributosAdicionalesProd: {
                    nombreAtributo: obj.x, //String
                    valor: obj.x //String
                },
                cantidad: obj.x, //decimal OPCIONAL
                descripcion: obj.x, //String OPCIONAL
                identificador: obj.x, //String
                imprimible: obj.x, //boolean
                impuestoAlConsumo: {
                    nombre: obj.x, //String
                    porcentual: obj.x, //decimal
                    valor: obj.x //decimal
                },
                impuestoICA: {
                    nombre: obj.x, //String
                    porcentual: obj.x, //decimal
                    valor: obj.x //decimal
                },
                impuestoIVA: {
                    nombre: obj.x, //String
                    porcentual: obj.x, //decimal
                    valor: obj.x //decimal
                },
                listaImpuestosDeducciones: { // OPCIONAL
                    nombre: obj.x, //String
                    porcentual: obj.x, //decimal
                    valor: obj.x //decimal
                },
                pagable: obj.x, //boolean
                valorUnitario: obj.x //decimal
            },
            subtotalNotaCreditoElectronica: obj.x, //decimal OPCIONAL
            subtotalesImpuestosDeduccion: {// OPCIONAL
                nombre: obj.x, //String
                valor: obj.x, //decimal
                baseGravable: obj.x //decimal
            },
            tipoFactura: obj.x, //numeric
            totalNotaCreditoElectronica: obj.x //decimal
        },
        notaEspecializada: {
            AtributosAdicionales: {
                nombreAtributo: obj.x, //String
                valor: obj.x, //String
                tipo: obj.x //String
            }
        }
    };
    callback(crearNotaDebito);
}

function __jsonFactura(obj, callback) {

    var crearFacturaElectronica = {
        facturaElectronicaCanonica: {
            codigoMoneda: obj.x, //String
            descripción: obj.x, //String OPCIONAL
            descuentos: { //OPCIONAL
                fecha: obj.x, //string
                valorPagar: obj.x //decimal
            },
            fechaExpedicion: obj.x, //String OPCIONAL
            fechaVencimiento: obj.x, //String OPCIONAL
            icoterms: obj.x, //String OPCIONAL
            identificacionReceptor: {
                codigoDocumentoDian: obj.x, //int
                numeroIdentificacion: obj.x //String
            },
            identificadorConsecutivo: obj.x, //long
            identificadorResolucion: obj.x, //String
            mediosPago: obj.x, //String OPCIONAL
            nombreSucursal: obj.x, //String
            numeracionResolucionWS: {
                desde: obj.x, //long
                hasta: obj.x, //long
                prefijo: obj.x //String
            },
            perfilEmision: obj.x, //String
            perfilUsuario: obj.x, //String
            productos: { //OPCIONAL
                atributosAdicionalesProd: {
                    nombreAtributo: obj.x, //String
                    valor: obj.x //String
                },
                cantidad: obj.x, //decimal OPCIONAL
                descripcion: obj.x, //String OPCIONAL
                identificador: obj.x, //String
                imprimible: obj.x, //boolean
                impuestoAlConsumo: {
                    nombre: obj.x, //String
                    porcentual: obj.x, //decimal
                    valor: obj.x //decimal
                },
                impuestoICA: {
                    nombre: obj.x, //String
                    porcentual: obj.x, //decimal
                    valor: obj.x //decimal
                },
                impuestoIVA: {
                    nombre: obj.x, //String
                    porcentual: obj.x, //decimal
                    valor: obj.x //decimal
                },
                listaImpuestosDeducciones: { // OPCIONAL
                    nombre: obj.x, //String
                    porcentual: obj.x, //decimal
                    valor: obj.x //decimal
                },
                pagable: obj.x, //boolean
                valorUnitario: obj.x //decimal
            },
            subtotalFactura: obj.x, //decimal OPCIONAL
            subtotalesImpuestosDeduccion: { // OPCIONAL
                nombre: obj.x, //String
                valor: obj.x, //decimal
                baseGravable: obj.x //decimal
            },
            tipoFactura: obj.x, //numeric
            totalFactura: obj.x //decimal OPCIONAL
        },
        facturaEspecializada: {
            AtributosAdicionales: { // OPCIONAL
                nombreAtributo: obj.x, //String
                valor: obj.x, //String
                tipo: obj.x //String
            }
        }
    };
    callback(crearFacturaElectronica);
}

/*
 * German Andres Galvis 23/07/2018
 * obj  { parametros : (informacion que se envian al ws),funcion: (nombre de la funcion que ejecuta el ws)}
 */
function __notaCreditoWs(obj, callback) {
    var url = G.constants.WS().FACTURACION_ELECTRONICA.NOTA_CREDITO;
    var resultado;

    obj.error = false;
    var privateKey = G.fs.readFileSync(G.dirname + G.settings.certificados_cervicamara + "preproduccionv4_certifactura_co.key");
    var publicKey = G.fs.readFileSync(G.dirname + G.settings.certificados_cervicamara + "preproduccionv4_certifactura_co.cer");
    var publicKey2 = G.fs.readFileSync(G.dirname + G.settings.certificados_cervicamara + "Intermedia_Rapid.cer");
    var publicKey3 = G.fs.readFileSync(G.dirname + G.settings.certificados_cervicamara + "Raiz_Rapid.cer");
    
    //Se invoca el ws
    G.Q.nfcall(G.soap.createClient, url).then(function (client) {
       
        var wsSecurity = new G.soap.WSSecurityCert({privateKey: G.fs.readFileSync(G.dirname+G.settings.certificados_cervicamara+"preproduccionv4_certifactura_co.key", 'utf8'),
                                             publicKey: G.fs.readFileSync(G.dirname+G.settings.certificados_cervicamara+"preproduccionv4_certifactura_co.cer", 'utf8'),
                                             keyPassword : '', // optional password
                                             password : 'cosmitet202', // optional password
                                             username :'admin_cosmitet'});
      
        client.setSecurity(wsSecurity);
        
        var datos = {
            notaCreditoElectronicaCanonica: obj.parametros.notaCreditoElectronicaCanonica,
            notaEspecializada: obj.parametros.notaEspecializada
        };
        return G.Q.ninvoke(client, obj.funcion, datos);

    }).spread(function (result, raw, soapHeader) {
        if (!result.return.msj["$value"]) {
            throw {msj: "Se ha generado un error", status: 403, obj: {}};
        } else {
            console.log("result.return.msj[$value] ", result.return.msj["$value"]);
        }

    }).then(function () {

        callback(false, obj);

    }).fail(function (err) {

        obj.error = true;
        obj.tipo = '0';
        console.log("err ", err);
        G.logError(err);

        callback(err);

    }).done();
}

Sincronizacion.$inject = ["m_sincronizacion"];
module.exports = Sincronizacion;