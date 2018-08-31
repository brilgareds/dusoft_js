var Sincronizacion = function (m_sincronizacion, m_clientes) {

    this.m_sincronizacion = m_sincronizacion;
    this.m_clientes = m_clientes;
};


__envioFactura();
//Sincronizacion.prototype.adquirientesMasivo();


function __envioRequiriente() {
    var obj = {};
    obj.x = "prueba";
    obj.funcion = "crearAdquirienteConUsuarioACliente";
    __jsonFacturacionRequirientes(obj, function (respuesta) {
        obj.parametros = respuesta;
        obj.url =  G.constants.WS().FACTURACION_ELECTRONICA.ADQUIRIENTE;
//        console.log("__jsonFacturacionRequiientes",obj);
        __requirienteFacturacion(obj, function (respuesta) {

//            console.log("__requirienteFacturacion",respuesta);
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
        __requirienteFacturacion(obj, function (respuesta) {

            console.log("__requirienteFacturacion",respuesta);
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
function __requirienteFacturacion(obj, callback) {
    var url = obj.url;
    var resultado;
    obj.error = false;


    var password = G.constants.CREDENCIALESCERTICAMARA().CONTRASENA; // optional password
    var username = G.constants.CREDENCIALESCERTICAMARA().USUARIO; // optional password  
    var tmp = {};

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
        G.logError(G.xmlformatter(tmp.lastRequest));

        console.log('El resultado ------------->', result, 'raw', raw, 'soapHeader', soapHeader);

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
                    valor: "ObservaciÃ³n" //String
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
                    valor: "ObservaciÃ³n" //String
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

function __jsonFactura(obj, callback) {

    var crearFacturaElectronica = {
        attributes: {
            xmlns: 'http://contrato.factura.webservices.servicios.certifactura.certicamara.com/'
        },
        facturaElectronicaCanonica: {
            attributes: {
                xmlns: ''
            },
            codigoMoneda: "COP", //String -
            descripcion: "", //String OPCIONAL-
            descuentos: {//OPCIONAL
                prontoPago: { 
                    fecha:'20-08-2019' , //string -
                    valorPagar: '10000000'//decimal -
                }
            },
            fechaExpedicion: "31-08-2018", //String OPCIONAL  DD/MM/YYYY -
            fechaVencimiento: "30-09-2018", //String OPCIONAL DD/MM/YYYY -
            icoterms:'', //String OPCIONAL -
            identificacionReceptor: {
                codigoDocumentoDian: 31, //int -
                numeroIdentificacion: "165529923" //String -
            },
            identificadorConsecutivo: 13, //long -
            identificadorResolucion: "100", //String -
            mediosPago: "20", //String OPCIONAL -
            nombreSucursal: "", //String -
            numeracionResolucionWS: {
                desde: 1, //long -
                hasta: 10000, //long -
                prefijo: "DUA"//String -
            },
            perfilEmision: "CLIENTE", //String -
            perfilUsuario: "CLIENTE", //String -
            productos: {//OPCIONAL
                atributosAdicionalesProd:{
                    atributoAdicionalProd:[{
                        nombreAtributo: "FechaVencimientoProd", //String 
                        valor: '01-08-2020' //Fecha dd-MM-yyyy HH24:mm:ss
                    }, {
                        nombreAtributo: "loteProd", //String
                        valor: "20181" //String
                    }, {
                        nombreAtributo: "codigoCumProd", //String
                        valor: "102018" //String
                    }, {
                        nombreAtributo: "codigoInvimaProd", //String
                        valor: "IN34444" //String
                    }, {
                        nombreAtributo: "valorTotalProd", //String
                        valor: 12300000 //decimal
                    }]}
                ,
                cantidad: 1, //decimal OPCIONAL -
                descripcion: "GUANTES DE 6 DEDOS", //String OPCIONAL -
                identificador: "000001", //String -
                imprimible: true, //boolean -
 /*               impuestoAlConsumo: { //-
                    nombre: obj.x, //String -
                    porcentual: obj.x, //decimal -
                    valor: obj.x //decimal -
                },
                impuestoICA: { // -
                    nombre: obj.x, //String -
                   // porcentual: obj.x, //decimal *
                    valor: obj.x //decimal -
                },
                impuestoIVA: {
                    nombre: obj.x, //String -
                    porcentual: obj.x, //decimal -
                    valor: obj.x //decimal -
                },*/
                listaImpuestosDeducciones: {// OPCIONAL -
                    nombre: "IVA19", //String -
                    //porcentual: obj.x, //decimal 
                    baseGravable: 100, //decimal  -
                    valor: 1000 //decimal -
                },
                pagable: true, //boolean -
                valorUnitario: 123900 //decimal -
            },
            subtotalFactura: 12340000, //decimal OPCIONAL -
            subtotalesImpuestosDeduccion: {// OPCIONAL
                nombre: "ReteFuente", //String -
                valor: 123000, //decimal -
                baseGravable: 123000 //decimal -
            },
            tipoFactura: 1, //numeric -
            totalFactura: 1239000//decimal OPCIONAL -
        },
        facturaEspecializada: {
            attributes: {
                xmlns: ''
            },
            AtributosAdicionales:{ 
                AtributoAdicional:[{// OPCIONAL
                    nombreAtributo: "mensajeContribuyente", //String
                    valor: "SOMOS GRANDES CONTRIBUYENTES NO SOMOS AUTORETENEDORES", //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "mensajeResolucion", //String
                    valor: "AUTORIZADOS POR LA DIAN PARA FACTURACIÓN POR COMPUTADOR SEGÚN RESOLUCIÓN No 18762005427955 DE CALI FECHA 27 DE OCTUBRE DE 2017 DEL 67278 AL 100000. SOMOS GRANDES CONTRIBUYENTES, NO EFECTUAR RETENCION DE IVA RES. Na 15633 DEL 18/12/2007 - ACT ECONOMICA 201-08 ICA EN CALI 3.3 X 100", //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "nombreAdquirente", //String
                    valor: "Hombre con 6 dedos", //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "vendedor", //String
                    valor: "TATIANA CAICEDO", //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "numeroPedido", //String
                    valor: "3235612", //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "Descuento", //String
                    valor: 123000, //decimal
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "totalenLetras", //String
                    valor: "ciento ventitresmil pesos colombianos", //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "observacionesPedido", //String
                    valor: "Primera Prueba", //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "observacionesDespacho", //String
                    valor: "OK", //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "elaboradoPor", //String
                    valor: "German Galvis", //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "tipoFormato", //String
                    valor: "1", //String
                    tipo: "Texto"
                }, {// OPCIONAL
                    nombreAtributo: "condiciones", //String
                    valor: "CREDITO", //String
                    tipo: "Texto"
                }]
        }
    }
    };
    callback(crearFacturaElectronica);
}


Sincronizacion.$inject = ["m_sincronizacion", "m_clientes"];
module.exports = Sincronizacion;