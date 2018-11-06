var Sincronizacion = function (m_sincronizacion, m_clientes) {

    this.m_sincronizacion = m_sincronizacion;
    this.m_clientes = m_clientes;
};

/*
 //function __envioRequiriente() {
 //    var obj = {};
 //    obj.x = "prueba";
 //    obj.funcion = "crearAdquirienteConUsuarioACliente";
 //    __jsonFacturacionRequirientes(obj, function (respuesta) {
 //        obj.parametros = respuesta;
 //        obj.url =  G.constants.WS().FACTURACION_ELECTRONICA.ADQUIRIENTE;
 //        __FacturacionDian(obj, function (respuesta) {
 //            
 //        });
 //    });
 //}
 //
 //function __jsonFacturacionRequirientes(obj, callback) {
 //
 //    var crearAdquirienteConUsuarioACliente = {
 //        attributes: {
 //            xmlns: 'http://contrato.adquiriente.cliente.webservices.servicios.certifactura.certicamara.com/'
 //        },
 //        adquiriente: {
 //            attributes: {
 //                xmlns: ''
 //            },
 //            acuerdoFisicoFacturacionElectronica: false, //boolean
 //            adjuntarPdfNotificaciones: true, //boolean
 //            adjuntarXmlNotificaciones: true, //boolean
 //            apellidos: 'GONZALEZ', //String - obligatorio si campo naturaleza = 'NATURAL'
 ////            camposDinamicosAdquirientes: {
 ////                nombreCampo: obj.x,
 ////                valor: obj.x
 ////            },
 //            cantidadDiasAceptacionAutomatica: 3, // int
 ////            ciudadExtranjera: obj.x, // opcional
 //            codigoCiudad: '11001', // string Dane
 //            codigoDepartamento: '11', // string Dane
 ////            codigoPais: obj.x, //string Dane Opcional,
 //            direccion: 'cra7 NO 9 - 9', // string obligatorio
 //            emailPrincipal: 'desarrollo2@duanaltda.com', // string
 ////            emailSecundarios: '', // string maximo 10 correos separados por coma Opcional
 //            enviarCorreoCertificado: true, //boolean
 //            enviarCorreoDeBienvenida: true, //boolean
 //            enviarFisico: true, //boolean Opcional
 //            enviarNotificaciones: true, //boolean
 //            enviarPlataformaFacturacion: true, //boolean
 //            fax: '', //string Opcional
 //            formatoFactura: 'ORIGINAL XML',
 ////            idClienteCreador: '',
 //            identificacionAdquirienteWS: {
 //                codigoDian: 13,
 ////                digitoDeVerificacion: ,
 //                numeroIdentificacion: 94151793
 //            },
 //            naturaleza: 'NATURAL', //[JURIDICA o NATURAL]
 //            nombre: 'consentimiento2128', //String - obligatorio si campo naturaleza = 'NATURAL'
 //            observaciones: '', // string opcinal
 ////            razonSocial: '',
 //            registradoEnCatalogo: true, //boolean
 //            telefono: 4321871,
 //            tipoEstablecimiento: 'E-99;E-11',
 //            tipoObligacion: 'O-99;O-11',
 //            tipoUsuarioAduanero: 'A-1;A-2',
 //            tiposRepresentacion: 'R-99-PN;R-12-PN'
 //        },
 //        usuario: {
 //            attributes: {
 //                xmlns: ''
 //            },
 //            contrasena: '',
 //            generarContrasena: true, //boolean
 //            nombreUsuario: 'consentimiento2128'
 //        }
 //    };
 //    callback(crearAdquirienteConUsuarioACliente);
 //}
 //
 //
 //function __envioFactura() {
 //    var obj = {};
 //    obj.x = '';
 //    obj.funcion = "crearFacturaElectronica";
 //    __jsonFactura(obj, function (respuesta) {
 //        obj.parametros = respuesta;
 //        obj.url =  G.constants.WS().FACTURACION_ELECTRONICA.FACTURA;
 //        __FacturacionDian(obj, function (respuesta) {
 //
 //            console.log("__FacturacionDian",respuesta);
 //        });
 //    });
 //}
 ////function __adquirientesMasivo(){
 //Sincronizacion.prototype.adquirientesMasivo = function (req, res) {
 //    var that = this;
 //    G.Q.ninvoke(that.m_clientes, 'listar_adquirientes').then(function (resultado) {
 //    }).fail(function (err) {
 //        console.log("Error adquirientesMasivo ", err);
 //    }).done();
 //};*/

Sincronizacion.prototype.facturacionElectronica = function (req, callback) {
    var that = this;

    G.Q.nfcall(__jsonFactura, req).then(function (resultado) {

        var obj = {};
        obj.x = '';
        obj.funcion = "crearFacturaElectronica";
        obj.parametros = resultado;
        obj.url = G.constants.WS().FACTURACION_ELECTRONICA.FACTURA;


        return G.Q.nfcall(__FacturacionDian, obj);

    }).then(function (resultado) {

        callback(false, resultado);

    }).fail(function (err) {

        callback(false, err);

    }).done();

};

Sincronizacion.prototype.facturacionElectronicaNotaDebito = function (req, callback) {

    var that = this;

    G.Q.nfcall(__jsonNotaDebito, req).then(function (resultado) {

        var obj = {};
        obj.funcion = "crearNotaDebitoElectronica";
        obj.parametros = resultado;
        obj.url = G.constants.WS().FACTURACION_ELECTRONICA.NOTA_DEBITO;

        return G.Q.nfcall(__FacturacionDian, obj);

    }).then(function (resultado) {
        callback(false, resultado);

    }).fail(function (err) {
        callback(false, err);

    }).done();
};

Sincronizacion.prototype.facturacionElectronicaNotaCredito = function (req, callback) {
    var that = this;

    G.Q.nfcall(__jsonNotaCredito, req).then(function (resultado) {
        
        var obj = {};
        obj.x = '';
        obj.funcion = "crearNotaCreditoElectronica";
        obj.parametros = resultado;
        obj.url = G.constants.WS().FACTURACION_ELECTRONICA.NOTA_CREDITO;


        return G.Q.nfcall(__FacturacionDian, obj);

    }).then(function (resultado) {

        callback(false, resultado);

    }).fail(function (err) {

        callback(false, err);

    }).done();

};

/*
 * Andres Mauricio Gonzalez
 * obj  { parametros : (informacion que se envian al ws),funcion: (nombre de la funcion que ejecuta el ws)}
 */
function __FacturacionDian(obj, callback) {
    var url = obj.url;
    var resultado = {};
    obj.error = false;


    var password = G.constants.CREDENCIALESCERTICAMARA().CONTRASENA; // optional password
    var username = G.constants.CREDENCIALESCERTICAMARA().USUARIO; // optional password  
    var tmp = {};
    //Se invoca el ws

    G.Q.nfcall(G.soap.createClient, url).then(function (client) {
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

        return G.Q.ninvoke(client, obj.funcion, obj.parametros);

    }).spread(function (result, raw, soapHeader) {
        resultado.result = result;
        resultado.lastRequest = G.xmlformatter(tmp.lastRequest);
        G.logError(G.xmlformatter(tmp.lastRequest));
    }).then(function () {
        resultado.sw_factura_dian = '1';
        callback(false, resultado);

    }).fail(function (err) {
        err.lastRequest = G.xmlformatter(tmp.lastRequest);
        obj.error = true;
        obj.tipo = '0';
        G.logError(err);
        err.sw_factura_dian = '0';
        callback(err);

    }).done();
}

function __jsonNotaCredito(obj, callback) {
    var formato = 'DD-MM-YYYY';
    var crearNotaCredito = {
        attributes: {
            xmlns: 'http://contrato.nota.webservices.servicios.certifactura.certicamara.com/'
        },
        notaCreditoElectronicaCanonica: {
            attributes: {
                xmlns: ''
            },
            codigoMoneda: obj.codigoMoneda, //String
            conceptoNota: obj.conceptoNota, //numeric
            fechaExpedicion: G.moment(obj.fechaExpedicion).format(formato), //String
//            fechaVencimiento: obj.fechaVencimiento, //String OPCIONAL
            identificacionReceptor: {
                codigoDocumentoDian: codigoDocumentoDian(obj.codigoDocumentoDian), //int
                numeroIdentificacion: obj.numeroIdentificacion //String
            },
            identificadorFactura: obj.identificadorFactura, //long
//            nombreSucursal: obj.nombreSucursal, //String
            numeroNota: obj.numeroNota, //numeric
            observaciones: obj.observaciones, //String OPCIONAL
            perfilEmision: obj.perfilEmision, //String
            perfilUsuario: obj.perfilUsuario, //String
//            productos: obj.productos,
            subtotalNotaCreditoElectronica: obj.subtotalNotaCreditoElectronica.replace(",", "."), //decimal OPCIONAL
            subtotalesImpuestosDeduccion: [
                {// OPCIONAL
                    nombre: "ReteFuente", //String -
                    valor: obj.ReteFuente.replace(",", "."), //decimal -
                    baseGravable: obj.baseGravableReteFuente.replace(".", "") //decimal -
                },
                {// OPCIONAL
                    nombre: "IVA", //String -
                    valor: obj.IVA.replace(",", "."), //decimal -
                    baseGravable: obj.baseGravableIVA.split(",",1) //decimal -
                },
                {// OPCIONAL
                    nombre: "ReteICA", //String -
                    valor: obj.ReteICA.replace(",", "."), //decimal -
                    baseGravable: obj.baseGravableReteICA.replace(".", "") //decimal -
                },
                {// OPCIONAL
                    nombre: "ReteIVA", //String -
                    valor: obj.ReteIVA.replace(",", "."), //decimal -
                    baseGravable: obj.baseGravableReteIVA.replace(".", "") //decimal -
                }
            ],
            tipoFactura: obj.tipoFactura, //numeric
            totalNotaCreditoElectronica: obj.totalNotaCreditoElectronica.replace(",", ".") //decimal
        },
        notaEspecializada: {
            attributes: {
                xmlns: ''
            },
            AtributosAdicionales: {
                AtributoAdicional: [{
                        nombreAtributo: "conceptoNota", //String
                        valor: obj.conceptoNotaAdicional, //String
                        tipo: "Texto" //String
                    }, {
                        nombreAtributo: "TipoNota", //String
                        valor: obj.TipoNota, //String
                        tipo: "Texto" //String
                    }, {
                        nombreAtributo: "Descuento", //String
                        valor: obj.descuento, //Decimal
                        tipo: "Texto" //String
                    }, {
//                        nombreAtributo: "valorTotal", //String
//                        valor: obj.valorTotal, //Decimal
//                        tipo: "Texto" //String
//                    }, {
                        nombreAtributo: "elaboradoPor", //String
                        valor: obj.elaboradoPor, //String
                        tipo: "Texto" //String
                    }, {
                        nombreAtributo: "totalenLetras", //String
                        valor: obj.totalenLetras, //String
                        tipo: "Texto" //String
                    }]
            }
        }
    };
    
    if(obj.productos.length > 0){
        crearNotaCredito.notaCreditoElectronicaCanonica.productos = obj.productos;
    }
    
    callback(false, crearNotaCredito);
}

function __jsonNotaDebito(obj, callback) {
    var formato = 'DD-MM-YYYY';
    var crearNotaDebito = {
        attributes: {
            xmlns: 'http://contrato.nota.webservices.servicios.certifactura.certicamara.com/'
        },
        notaDebitoElectronicaCanonica: {
            attributes: {
                xmlns: ''
            },
            codigoMoneda: obj.codigoMoneda, //String
            conceptoNota: obj.conceptoNota, //numeric
            fechaExpedicion: G.moment(obj.fechaExpedicion).format(formato), //String
//            fechaVencimiento: obj.fechaVencimiento, //String OPCIONAL
            identificacionReceptor: {
                codigoDocumentoDian: codigoDocumentoDian(obj.codigoDocumentoDian), //int
                numeroIdentificacion: obj.numeroIdentificacion //String
            },
            identificadorFactura: obj.identificadorFactura, //long
//            nombreSucursal: obj.nombreSucursal, //String
            numeroNota: obj.numeroNota, //numeric
            observaciones: obj.observaciones, //String OPCIONAL
            perfilEmision: obj.perfilEmision, //String
            perfilUsuario: obj.perfilUsuario, //String
            productos: obj.productos,
            subtotalNotaDebitoElectronica: obj.subtotalNotaDebitoElectronica.replace(",", "."), //decimal OPCIONAL
            subtotalesImpuestosDeduccion: [
                {// OPCIONAL
                    nombre: "ReteFuente", //String -
                    valor: obj.ReteFuente.replace(",", "."), //decimal -
                    baseGravable: obj.baseGravableReteFuente.replace(".", "") //decimal -
                },
                {// OPCIONAL
                    nombre: "IVA", //String -
                    valor: obj.IVA.replace(",", "."), //decimal -
                    baseGravable: obj.baseGravableIVA.split(",",1) //decimal -
                },
                {// OPCIONAL
                    nombre: "ReteICA", //String -
                    valor: obj.ReteICA.replace(",", "."), //decimal -
                    baseGravable: obj.baseGravableReteICA.replace(".", "") //decimal -
                },
                {// OPCIONAL
                    nombre: "ReteIVA", //String -
                    valor: obj.ReteIVA.replace(",", "."), //decimal -
                    baseGravable: obj.baseGravableReteIVA.replace(".", "") //decimal -
                }
            ],
            tipoFactura: obj.tipoFactura, //numeric
            totalNotaDebitoElectronica: obj.totalNotaDebitoElectronica.replace(",", ".") //decimal
        },
        notaEspecializada: {
            attributes: {
                xmlns: ''
            },
            AtributosAdicionales: {
                AtributoAdicional: [{
                        nombreAtributo: "conceptoNota", //String
                        valor: obj.conceptoNotaAdicional, //String
                        tipo: "Texto" //String
                    }, {
                        nombreAtributo: "TipoNota", //String
                        valor: obj.TipoNota, //String
                        tipo: "Texto" //String
                    }, {
                        nombreAtributo: "Descuento", //String
                        valor: 0, //Decimal
                        tipo: "Texto" //String
                    }, {
//                        nombreAtributo: "valorTotal", //String
//                        valor: obj.valorTotal, //Decimal
//                        tipo: "Texto" //String
//                    }, {
                        nombreAtributo: "elaboradoPor", //String
                        valor: obj.elaboradoPor, //String
                        tipo: "Texto" //String
                    }, {
                        nombreAtributo: "totalenLetras", //String
                        valor: obj.totalenLetras, //String
                        tipo: "Texto" //String
                    }]
            }
        }
    };
    callback(false, crearNotaDebito);
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
            icoterms: '', //String OPCIONAL -
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
            productos: obj.productos, //OPCIONAL
            subtotalFactura: obj.subtotalFactura, //decimal OPCIONAL -
            subtotalesImpuestosDeduccion: [
                {// OPCIONAL
                    nombre: "ReteFuente", //String -
                    valor: obj.ReteFuente, //decimal -
                    baseGravable: obj.baseGravableReteFuente.replace(".", "") //decimal -
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
            AtributosAdicionales: {
                AtributoAdicional: [{// OPCIONAL
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
                        valor: obj.observacionesPedido.replace("\n"," "), //String
                        tipo: "Texto"
                    }, {// OPCIONAL
                        nombreAtributo: "observacionesDespacho", //String
                        valor: obj.observacionesDespacho.replace("\n"," "), //String
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
    callback(false, crearFacturaElectronica);
}


Sincronizacion.$inject = ["m_sincronizacion", "m_clientes"];
module.exports = Sincronizacion;