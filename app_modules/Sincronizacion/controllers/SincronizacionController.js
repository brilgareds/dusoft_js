var Sincronizacion = function(m_sincronizacion,m_terceros) {

    this.m_sincronizacion = m_sincronizacion;
    this.m_terceros = m_terceros; 
};



//__envio();
__adquirinetesMasivo();


function __envio() {
    var obj = {};
    obj.x = "prueba";
    obj.funcion = "crearAdquirienteConUsuarioACliente";
    __jsonFacturacionRequirientes(obj, function (respuesta) {
        obj.parametros = respuesta;
//        console.log("__jsonFacturacionRequiientes",obj);
        __requirienteFacturacion(obj, function (respuesta) {

//            console.log("__requirienteFacturacion",respuesta);
        });
    });
}


function __adquirinetesMasivo(){
    var that = this;
    console.log("AAAAAAAA",that.m_sincronizacion);
    G.Q.ninvoke(that.m_terceros, 'listar_adquirientes').then(function (resultado) {
       console.log("AAAAAAAA",resultado);
    }).fail(function (err) {
       console.log("Error ",err);
    }).done();
};

function __jsonFacturacionRequirientes(obj,callback){

    var crearAdquirienteConUsuarioACliente = {
        attributes: {
            xmlns: 'http://contrato.adquiriente.cliente.webservices.servicios.certifactura.certicamara.com/'
        },
        adquiriente: {
            attributes: {
                xmlns: ''
            },
            acuerdoFisicoFacturacionElectronica:false, //boolean
            adjuntarPdfNotificaciones: true, //boolean
            adjuntarXmlNotificaciones: true, //boolean
            apellidos: 'GONZALEZ', //String - obligatorio si campo naturaleza = 'NATURAL'
//            camposDinamicosAdquirientes: {
//                nombreCampo: obj.x,
//                valor: obj.x
//            },
            cantidadDiasAceptacionAutomatica: 3, // int
//            ciudadExtranjera: obj.x, // opcional
            codigoCiudad: '11001', // string Dane
            codigoDepartamento: '11',// string Dane
//            codigoPais: obj.x, //string Dane Opcional,
            direccion: 'cra7 NO 9 - 9', // string obligatorio
            emailPrincipal: 'desarrollo2@duanaltda.com',// string
//            emailSecundarios: '', // string maximo 10 correos separados por coma Opcional
            enviarCorreoCertificado: true, //boolean
            enviarCorreoDeBienvenida: true, //boolean
            enviarFisico: true, //boolean Opcional
            enviarNotificaciones: true,//boolean
            enviarPlataformaFacturacion: true,//boolean
            fax: '',//string Opcional
            formatoFactura: 'ORIGINAL XML',
//            idClienteCreador: '',
            identificacionAdquirienteWS: {
                codigoDian: 13,
//                digitoDeVerificacion: ,
                numeroIdentificacion: 94151793
            },
            naturaleza: 'NATURAL', //[JURIDICA o NATURAL]
            nombre: 'consentimiento2128', //String - obligatorio si campo naturaleza = 'NATURAL'
            observaciones: '', // string opcinal
//            razonSocial: '',
            registradoEnCatalogo: true,//boolean
            telefono: 4321871,
            tipoEstablecimiento: 'E-99;E-11',
            tipoObligacion: 'O-99;O-11',
            tipoUsuarioAduanero: 'A-1;A-2',
            tiposRepresentacion: 'R-99-PN;R-12-PN'
        },
        usuario: {
            attributes: {
                xmlns: ''
            },
            contrasena: '',
            generarContrasena: true,//boolean
            nombreUsuario: 'consentimiento2128'
        }
    };
    callback(crearAdquirienteConUsuarioACliente);
}

/*
 * Andres Mauricio Gonzalez
 * obj  { parametros : (informacion que se envian al ws),funcion: (nombre de la funcion que ejecuta el ws)}
 */
function __requirienteFacturacion(obj, callback) {
    var url = G.constants.WS().FACTURACION_ELECTRONICA.CERTICAMARA;
    var resultado;

    obj.error = false;


    var password = 'cosmitet202'; // optional password
    var username = 'admin_cosmitet'; // optional password  
    var tmp = {};

    //Se invoca el ws
    G.Q.nfcall(G.soap.createClient, url).then(function (client) {
//        


     // var wsSecurity = new G.soap.WSSecurityCert(privateKey, publicKey, password);
     tmp = client;
      var options ={
            passwordType: 'PasswordText',
            hasTimeStamp: false,
            hasTokenCreated: true,
            hasNonce: true,
            mustUnderstand: 1,
            actor: ''
        }
        client.setSecurity(new G.soap.WSSecurity(username, password, options));


        //client.setSecurity(wsSecurity);
        //console.log('el xml --> ', client.wsdl);
        return G.Q.ninvoke(client, obj.funcion, obj.parametros);



    }).spread(function (result, raw, soapHeader) {
        G.logError(G.xmlformatter(tmp.lastRequest));

        console.log('El resultado ------------->', result, 'raw', raw, 'soapHeader', soapHeader);
  
    }).then(function () {

        callback(false, obj);

    }).fail(function (err) {

        obj.error = true;
        obj.tipo = '0';
        //console.log("err ", err);
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
            productos: {//OPCIONAL
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
                listaImpuestosDeducciones: {// OPCIONAL
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
            productos: {//OPCIONAL
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
                listaImpuestosDeducciones: {// OPCIONAL
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
            descuentos: {//OPCIONAL
                prontoPago: {
                    fecha: obj.x, //string
                    valorPagar: obj.x //decimal
                }
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
            productos: {//OPCIONAL
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
                listaImpuestosDeducciones: {// OPCIONAL
                    nombre: obj.x, //String
                    porcentual: obj.x, //decimal
                    valor: obj.x //decimal
                },
                pagable: obj.x, //boolean
                valorUnitario: obj.x //decimal
            },
            subtotalFactura: obj.x, //decimal OPCIONAL
            subtotalesImpuestosDeduccion: {// OPCIONAL
                nombre: obj.x, //String
                valor: obj.x, //decimal
                baseGravable: obj.x //decimal
            },
            tipoFactura: obj.x, //numeric
            totalFactura: obj.x //decimal OPCIONAL
        },
        facturaEspecializada: {
            AtributosAdicionales: {// OPCIONAL
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

        var wsSecurity = new G.soap.WSSecurityCert({privateKey: G.fs.readFileSync(G.dirname + G.settings.certificados_cervicamara + "preproduccionv4_certifactura_co.key", 'utf8'),
            publicKey: G.fs.readFileSync(G.dirname + G.settings.certificados_cervicamara + "preproduccionv4_certifactura_co.cer", 'utf8'),
            keyPassword: '', // optional password
            password: 'cosmitet202', // optional password
            username: 'admin_cosmitet'});

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
           // console.log("result.return.msj[$value] ", result.return.msj["$value"]);
        }

    }).then(function () {

        callback(false, obj);

    }).fail(function (err) {

        obj.error = true;
        obj.tipo = '0';
       // console.log("err ", err);
        G.logError(err);

        callback(err);

    }).done();
}

Sincronizacion.$inject = ["m_sincronizacion","m_terceros"];
module.exports = Sincronizacion;