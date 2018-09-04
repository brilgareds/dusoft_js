var Sincronizacion = function (m_sincronizacion, m_clientes) {

    this.m_sincronizacion = m_sincronizacion;
    this.m_clientes = m_clientes;
};


//__envioFactura();
//Sincronizacion.prototype.adquirientesMasivo();


function __envioRequiriente() {
    var obj = {};
    obj.x = "prueba";
    obj.funcion = "crearAdquirienteConUsuarioACliente";
    __jsonFacturacionRequirientes(obj, function (respuesta) {
        obj.parametros = respuesta;
        obj.url =  G.constants.WS().FACTURACION_ELECTRONICA.ADQUIRIENTE;
//        console.log("__jsonFacturacionRequiientes",obj);
        __FacturacionDian(obj, function (respuesta) {

//            console.log("__FacturacionDian",respuesta);
        });
    });
}

function __envioFactura() {
    console.log("ENTRO");
    var obj = {};
    obj.x = '';
    obj.funcion = "crearFacturaElectronica";
    __jsonFactura(obj, function (respuesta) {
        obj.parametros = respuesta;
        obj.url =  G.constants.WS().FACTURACION_ELECTRONICA.FACTURA;
        console.log("__jsonFactura",obj);
        __FacturacionDian(obj, function (respuesta) {

            console.log("__FacturacionDian",respuesta);
        });
    });
}


//function __adquirientesMasivo(){
Sincronizacion.prototype.adquirientesMasivo = function (req, res) {
    var that = this;
    G.Q.ninvoke(that.m_clientes, 'listar_adquirientes').then(function (resultado) {
        console.log("AAAAAAAA", resultado);
    }).fail(function (err) {
        console.log("Error adquirientesMasivo ", err);
    }).done();
};

Sincronizacion.prototype.facturacionElectronica = function (req, callback) {
    var that = this;
    console.log("********************* facturacionElectronica ********************");
    console.log("********************* facturacionElectronica ********************");
    console.log("********************* facturacionElectronica ********************");
    console.log("********************* facturacionElectronica ********************");
    
    G.Q.nfcall(__jsonFactura,req).then(function (resultado) {
        
        console.log("ENTRO",resultado);
        var obj = {};
        obj.x = '';
        obj.funcion = "crearFacturaElectronica";    
        obj.parametros = resultado;
        obj.url =  G.constants.WS().FACTURACION_ELECTRONICA.FACTURA;
        
        console.log("obj.url ",obj.url);
        console.log("obj.url ",obj.url);
        console.log("obj.url ",obj.url);
        console.log("obj.url ",obj.url);
        
       return G.Q.nfcall(__FacturacionDian,obj);
       
    }).then(function (resultado) {
        
         callback(false,resultado);
         
    }).fail(function (err) {
        console.log("Error facturacionElectronica ", err);
         callback(err);
    }).done();
   
};

function __jsonFacturacionRequirientes(obj, callback) {

    var crearAdquirienteConUsuarioACliente = {
        attributes: {
            xmlns: 'http://contrato.adquiriente.cliente.webservices.servicios.certifactura.certicamara.com/'
        },
        adquiriente: {
            attributes: {
                xmlns: ''
            },
            acuerdoFisicoFacturacionElectronica: false, //boolean
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
            codigoDepartamento: '11', // string Dane
//            codigoPais: obj.x, //string Dane Opcional,
            direccion: 'cra7 NO 9 - 9', // string obligatorio
            emailPrincipal: 'desarrollo2@duanaltda.com', // string
//            emailSecundarios: '', // string maximo 10 correos separados por coma Opcional
            enviarCorreoCertificado: true, //boolean
            enviarCorreoDeBienvenida: true, //boolean
            enviarFisico: true, //boolean Opcional
            enviarNotificaciones: true, //boolean
            enviarPlataformaFacturacion: true, //boolean
            fax: '', //string Opcional
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
            registradoEnCatalogo: true, //boolean
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
            generarContrasena: true, //boolean
            nombreUsuario: 'consentimiento2128'
        }
    };
    callback(crearAdquirienteConUsuarioACliente);
}

/*
 * Andres Mauricio Gonzalez
 * obj  { parametros : (informacion que se envian al ws),funcion: (nombre de la funcion que ejecuta el ws)}
 */
function __FacturacionDian(obj, callback) {
    var url = obj.url;
    var resultado ={};
    obj.error = false;
     

    var password = G.constants.CREDENCIALESCERTICAMARA().CONTRASENA; // optional password
    var username = G.constants.CREDENCIALESCERTICAMARA().USUARIO; // optional password  
    var tmp = {};
console.log("Eror password ",password);
console.log("Eror username ",username);
    //Se invoca el ws
 
    G.Q.nfcall(G.soap.createClient, url).then(function (client) {
//        


        // var wsSecurity = new G.soap.WSSecurityCert(privateKey, publicKey, password);
        tmp = client;
        var options = {
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
        resultado.result=result;
        resultado.lastRequest=G.xmlformatter(tmp.lastRequest);
        G.logError(G.xmlformatter(tmp.lastRequest));
        
        console.log('El resultado ------------->',G.xmlformatter(tmp.lastRequest));
//        console.log('El resultado ------------->', result, 'raw', raw, 'soapHeader', soapHeader);

    }).then(function () {

        callback(false, resultado);

    }).fail(function (err) {
console.log('El resultado ------------->',G.xmlformatter(tmp.lastRequest));
        obj.error = true;
        obj.tipo = '0';
//        console.log("err ", err);
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
                    nombreAtributo: "observacionProd", //String
                    valor: "Observación" //String
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
            AtributosAdicionales: [{
                    nombreAtributo: "conceptoNota", //String
                    valor: "Concepto de Nota", //String
                    tipo: "String" //String
                }, {
                    nombreAtributo: "TipoNota", //String
                    valor: "Tipo Nota", //String
                    tipo: "String" //String
                }, {
                    nombreAtributo: "descuento", //String
                    valor: 0.00, //Decimal
                    tipo: "Decimal" //String
                }, {
                    nombreAtributo: "valorTotal", //String
                    valor: 0.00, //Decimal
                    tipo: "Decimal" //String
                }, {
                    nombreAtributo: "elaborado", //String
                    valor: "Elaborador por", //String
                    tipo: "String" //String
                }, {
                    nombreAtributo: "valorLetras", //String
                    valor: "Valor en Letras", //String
                    tipo: "String" //String
                }]
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
                    nombreAtributo: "observacionProd", //String
                    valor: "Observación" //String
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
            AtributosAdicionales: [{
                    nombreAtributo: "conceptoNota", //String
                    valor: "Concepto de Nota", //String
                    tipo: "String" //String
                }, {
                    nombreAtributo: "TipoNota", //String
                    valor: "Tipo Nota", //String
                    tipo: "String" //String
                }, {
                    nombreAtributo: "descuento", //String
                    valor: 0.00, //Decimal
                    tipo: "Decimal" //String
                }, {
                    nombreAtributo: "valorTotal", //String
                    valor: 0.00, //Decimal
                    tipo: "Decimal" //String
                }, {
                    nombreAtributo: "elaborado", //String
                    valor: "Elaborador por", //String
                    tipo: "String" //String
                }, {
                    nombreAtributo: "valorLetras", //String
                    valor: "Valor en Letras", //String
                    tipo: "String" //String
                }]
        }
    };
    callback(crearNotaDebito);
}

function codigoDocumentoDian(codigoDocumentoDian) {
    switch (codigoDocumentoDian) {
        case 'CE':
            return 22;
            break;
        case 'NIT':
            return 31;
            break;
        case 'RC':
            return 11;
            break;
        case 'PA':
            return 41;
            break;
        case 'TI':
            return 12;
            break;
        case 'CC':
            return 13;
            break;
    }
}

function mediosPago(mediosPago) {
    switch (mediosPago) {
        case 1: //EFECTIVO
            return '10';
            break;
        case 2: //CREDITO
            return '42';
            break;
        case 3: //CHEQUE
            return '20';
            break;
    }
}

function __jsonFactura(obj, callback) {
//    console.log("obj ",obj);
    
    var formato = 'DD-MM-YYYY';     
    var crearFacturaElectronica = {
        attributes: {
            xmlns: 'http://contrato.factura.webservices.servicios.certifactura.certicamara.com/'
        },
        facturaElectronicaCanonica: {
            attributes: {
                xmlns: ''
            },
            codigoMoneda: obj.codigoMoneda, //String -
            descripcion: "", //String OPCIONAL-
            descuentos: {//OPCIONAL
//                prontoPago: { 
//                    fecha:'' , //string -
//                    valorPagar: ''//decimal -
//                }
            },
            fechaExpedicion: G.moment(obj.fechaExpedicion).format(formato), //String OPCIONAL  DD/MM/YYYY -
            fechaVencimiento: G.moment(obj.fechaVencimiento).format(formato), //String OPCIONAL DD/MM/YYYY -
            icoterms:'', //String OPCIONAL -
            identificacionReceptor: {
                codigoDocumentoDian: codigoDocumentoDian(obj.codigoDocumentoDian), //int -
                numeroIdentificacion: obj.numeroIdentificacion//String -
            },
            identificadorConsecutivo: obj.identificadorConsecutivo, //long -
            identificadorResolucion: obj.identificadorResolucion, //String -
            mediosPago: mediosPago(obj.mediosPago), //String OPCIONAL -
            nombreSucursal: obj.nombreSucursal, //String -
            numeracionResolucionWS: {
                desde: obj.desde, //long -
                hasta: obj.hasta, //long -
                prefijo: obj.prefijo//String -
            },
            perfilEmision: "CLIENTE", //String -
            perfilUsuario: "CLIENTE", //String -
            productos: obj.productos,//OPCIONAL
            subtotalFactura: obj.subtotalFactura, //decimal OPCIONAL -
            subtotalesImpuestosDeduccion: [
            {// OPCIONAL
                nombre: "ReteFuente", //String -
                valor: obj.ReteFuente, //decimal -
                baseGravable: obj.baseGravableReteFuente.replace(".","") //decimal -
            },
            {// OPCIONAL
                nombre: "IVA", //String -
                valor: obj.IVA, //decimal -
                baseGravable: obj.baseGravableIVA //decimal -
            },
            {// OPCIONAL
                nombre: "ReteICA", //String -
                valor: obj.ReteICA, //decimal -
                baseGravable: obj.baseGravableReteICA.replace(".", "") //decimal -
            },
            {// OPCIONAL
                nombre: "ReteIVA", //String -
                valor: obj.ReteIVA, //decimal -
                baseGravable: obj.baseGravableReteIVA.replace(".", "") //decimal -
            }
        ],
            tipoFactura: obj.tipoFactura, //numeric -
            totalFactura: obj.totalFactura //decimal OPCIONAL -
        },
        facturaEspecializada: {
            attributes: {
                xmlns: ''
            },
            AtributosAdicionales:{ 
                AtributoAdicional:[{// OPCIONAL
                    nombreAtributo: "mensajeContribuyente", //String
                    valor: obj.mensajeContribuyente, //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "mensajeResolucion", //String
                    valor: obj.mensajeResolucion, //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "nombreAdquirente", //String
                    valor: obj.nombreAdquirente, //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "vendedor", //String
                    valor: obj.vendedor, //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "numeroPedido", //String
                    valor: obj.numeroPedido, //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "Descuento", //String
                    valor: 0, //decimal
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "totalenLetras", //String
                    valor: obj.totalenLetras, //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "observacionesPedido", //String
                    valor: obj.observacionesPedido, //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "observacionesDespacho", //String
                    valor: obj.observacionesDespacho, //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "elaboradoPor", //String
                    valor: obj.elaboradoPor, //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "tipoFormato", //String
                    valor: obj.tipoFormato, //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "condiciones", //String
                    valor: obj.condiciones, //String
                    tipo: "Texto"
                }]
        }
    }
    };
    callback(false,crearFacturaElectronica);
}


Sincronizacion.$inject = ["m_sincronizacion", "m_clientes"];
module.exports = Sincronizacion;