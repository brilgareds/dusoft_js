/* global G */
'use strict';

let that;

let Sincronizacion = function (m_adquiriente, m_autorizado, m_centro_costo, m_condiciones_entrega, m_contacto,
    m_direccion, m_documentos_anexos, m_entrega, m_facturador, m_facturas, m_grupo_deducciones, m_grupo_impuestos,
    m_items, m_lista_anticipos, m_lista_caracteristicas, m_lista_cargos_descuentos, m_lista_correcciones,
    m_lista_deducciones, m_lista_documentos_referenciados, m_lista_impuestos, m_lista_participantes_consorcio,
    m_mandatorio, m_notas_referenciadas, m_numeracion, m_pago, m_periodo_facturacion, m_productos, m_resolucion,
    m_sucursal, m_tasa_cambio, m_transportista, m_sincronizacion, m_clientes) {

    this.m_adquiriente = m_adquiriente;
    this.m_autorizado = m_autorizado;
    this.m_centro_costo = m_centro_costo;
    this.m_condiciones_entrega = m_condiciones_entrega;
    this.m_contacto = m_contacto;
    this.m_direccion = m_direccion;
    this.m_documentos_anexos = m_documentos_anexos;
    this.m_entrega = m_entrega;
    this.m_facturador = m_facturador;
    this.m_facturas = m_facturas;
    this.m_grupo_deducciones = m_grupo_deducciones;
    this.m_grupo_impuestos = m_grupo_impuestos;
    this.m_items = m_items;
    this.m_lista_anticipos = m_lista_anticipos;
    this.m_lista_caracteristicas = m_lista_caracteristicas;
    this.m_lista_cargos_descuentos = m_lista_cargos_descuentos;
    this.m_lista_correcciones = m_lista_correcciones;
    this.m_lista_deducciones = m_lista_deducciones;
    this.m_lista_documentos_referenciados = m_lista_documentos_referenciados;
    this.m_lista_impuestos = m_lista_impuestos;
    this.m_lista_participantes_consorcio = m_lista_participantes_consorcio;
    this.m_mandatorio = m_mandatorio;
    this.m_notas_referenciadas = m_notas_referenciadas;
    this.m_numeracion = m_numeracion;
    this.m_pago = m_pago;
    this.m_periodo_facturacion = m_periodo_facturacion;
    this.m_productos = m_productos;
    this.m_resolucion = m_resolucion;
    this.m_sucursal = m_sucursal;
    this.m_tasa_cambio = m_tasa_cambio;
    this.m_transportista = m_transportista;
    this.m_sincronizacion = m_sincronizacion;
    this.m_clientes = m_clientes;
    that = this;

    // that.test();
};

// const promesa = new Promise((resolve, reject) => { resolve(true); });

Sincronizacion.prototype.test = function () {
    let count = 0;
    let cantidadFunciones = 2;

    const p1 = new Promise((resolve, reject) => {
        G.Q.ninvoke(_productos)
    });
    const p2 = new Promise((resolve, reject) => {

    });
    const p3 = new Promise((resolve, reject) => {

    });
    const p4 = new Promise((resolve, reject) => {

    });

    Promise.all([p1, p2, p3, p4])
        .then(values => {
            console.log(values);
        }, reason => {
            console.log(reason)
        });





    new Promise(() => {
        console.log('test 1');
        console.log('count: ', count, 'cantidadFunciones: ', cantidadFunciones);
        new Promise(() => {
            count++;
            console.log('test 2');
            console.log('count: ', count, 'cantidadFunciones: ', cantidadFunciones);
            if (count === cantidadFunciones) {
                console.log('Deberia de salir aqui!!');
                return true;
            }
        }).catch(error => {
            console.log('error: ', error);
            throw error;
        });

        new Promise(() => {
            count++;
            console.log('test 3');
            console.log('count: ', count, 'cantidadFunciones: ', cantidadFunciones);
            if (count === cantidadFunciones) { return true; }
        }).catch(error => {
            console.log('error: ', error);
            throw error;
        });

        new Promise(() => {
            count++;
            if (count === cantidadFunciones) { return true; }
        }).catch(error => {
            console.log('error: ', error);
            throw error;
        });

        new Promise(() => {
            count++;
            if (count === cantidadFunciones) { return true; }
        }).catch(error => {
            console.log('error: ', error);
            throw error;
        });
    }).then(response => {

        console.log('fine!!');
    }).catch(error => {

        console.log('error: ', error);
    });

    // console.log('Eyyyy', this.m_pago);
    // // console.log(JSON.parse(this.m_pago));
    // // console.log(this.m_pago.codigoMedioPago);
    // this.m_pago.setId(7);
    // console.log('El valor final es: ', this.m_pago.getId());
    //console.log('\nEooo', this.m_pago);
    // Sincronizacion.codigoMedioPago('Easd');
    // Sincronizacion.fechaVencimiento('asdasdasd');
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

//    G.Q.nfcall(__jsonFactura, req).then(function (resultado) { // facturacion anterior sin adjunto de pdf
    G.Q.nfcall(__jsonFacturaAjdunto, req).then(function (resultado) {

        var obj = {};
        obj.x = '';
//        obj.funcion = "crearFacturaElectronica";  // facturacion anterior sin adjunto de pdf
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


Sincronizacion.prototype.consultaFacturacionElectronica = function (req, callback) {
    
    var obj = {};
       
    G.Q.nfcall(__jsonConsultaDocumento, req).then(function (resultado) {
        
        var obj = {};
        obj.x = '';
        obj.funcion = "consultaDocumentos";
        obj.parametros = resultado;
        obj.url = G.constants.WS().FACTURACION_ELECTRONICA.CONSULTA_FACTURA;

        return G.Q.nfcall(__FacturacionDian, obj);

    }).then(function (resultado) {
        
      var pdf =resultado.result.ConsultaResultadoValidacionDocumentosResponse.documento;
      var y = G.base64.base64Decode(pdf, G.dirname + "/public/reports/doc_dian/"+req.factura+".pdf");
      callback(false, req.factura+".pdf");

    }).fail(function (err) {
        
        callback(err.root.Envelope.Body.Fault.faultstring.$value);

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
        };
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

function __jsonConsultaDocumento(obj, callback) {
  
    var crearFactura = {
        ConsultaResultadoValidacionDocumentosPeticion:{
            tipoDocumento : obj.tipoDocumento,//obj.tipoDocumento,//factura
            numeroDocumento : obj.factura,//prefijo_nofactura
            tipoRespuesta : obj.tipoRespuesta 
       }
    };
        
    callback(false, crearFactura);
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
            identificacionReceptor: {
                codigoDocumentoDian: codigoDocumentoDian(obj.codigoDocumentoDian), //int
                numeroIdentificacion: obj.numeroIdentificacion //String
            },
            identificadorFactura: obj.identificadorFactura, //long
            numeroNota: obj.numeroNota, //numeric
            observaciones: obj.observaciones, //String OPCIONAL
            perfilEmision: obj.perfilEmision, //String
            perfilUsuario: obj.perfilUsuario, //String
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
                        nombreAtributo: "coordXQr", //String
                        valor: obj.coordXQr, //String
                        tipo: "Texto" //String
                    }, {
                        nombreAtributo: "coordYQr", //String
                        valor: obj.coordYQr, //String
                        tipo: "Texto" //String
                    }, {
                        nombreAtributo: "coordXCufe", //String
                        valor: obj.coordXCufe, //Decimal
                        tipo: "Texto" //String
                    }, {
                        nombreAtributo: "coordYCufe", //String
                        valor: obj.coordYCufe, //Decimal
                        tipo: "Texto" //String
                    }, {
                        nombreAtributo: "rotCufe", //String
                        valor: 0, //String
                        tipo: "Texto" //String
                    }, {
                        nombreAtributo: "pdf", //String
                        valor: obj.pdf, //String
                        tipo: "Texto" //String
                    }]
            }
        }
    };
    
    if(obj.productos.length > 0){
        crearNotaCredito.notaCreditoElectronicaCanonica.productos = obj.productos;
    }else{
        crearNotaCredito.notaCreditoElectronicaCanonica.productos = {cantidad:0,descripcion:"no aplica",identificador:"0",valorUnitario:0};
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
            identificacionReceptor: {
                codigoDocumentoDian: codigoDocumentoDian(obj.codigoDocumentoDian), //int
                numeroIdentificacion: obj.numeroIdentificacion //String
            },
            identificadorFactura: obj.identificadorFactura, //long
            numeroNota: obj.numeroNota, //numeric
            observaciones: obj.observaciones, //String OPCIONAL
            perfilEmision: obj.perfilEmision, //String
            perfilUsuario: obj.perfilUsuario, //String
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
                        nombreAtributo: "coordXQr", //String
                        valor: obj.coordXQr, //String
                        tipo: "Texto" //String
                    }, {
                        nombreAtributo: "coordYQr", //String
                        valor: obj.coordYQr, //String
                        tipo: "Texto" //String
                    }, {
                        nombreAtributo: "coordXCufe", //String
                        valor: obj.coordXCufe, //Decimal
                        tipo: "Texto" //String
                    }, {
                        nombreAtributo: "coordYCufe", //String
                        valor: obj.coordYCufe, //Decimal
                        tipo: "Texto" //String
                    }, {
                        nombreAtributo: "rotCufe", //String
                        valor: 0, //String
                        tipo: "Texto" //String
                    }, {
                        nombreAtributo: "pdf", //String
                        valor: obj.pdf, //String
                        tipo: "Texto" //String
                    }]
            }
        }
    };
    
        if(obj.productos.length > 0){
        crearNotaDebito.notaDebitoElectronicaCanonica.productos = obj.productos;
        }else{
        crearNotaDebito.notaDebitoElectronicaCanonica.productos = {cantidad:0,descripcion:"no aplica",identificador:"0",valorUnitario:0};
    }

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
            descuentos: {},
            fechaExpedicion: G.moment(obj.fechaExpedicion).format(formato), //String OPCIONAL  DD/MM/YYYY -
//            fechaVencimiento: G.moment(obj.fechaVencimiento).format(formato), //String OPCIONAL DD/MM/YYYY -
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

     if(obj.fechaVencimiento){
        crearFacturaElectronica.facturaElectronicaCanonica.fechaVencimiento = G.moment(obj.fechaVencimiento).format(formato); //String OPCIONAL DD/MM/YYYY -
    }

    callback(false, crearFacturaElectronica);
}

function __jsonFacturaAjdunto(obj, callback) {

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
            descuentos: {
            },
            fechaExpedicion: G.moment(obj.fechaExpedicion).format(formato), //String OPCIONAL  DD/MM/YYYY -
            fechaVencimiento: G.moment(obj.fechaVencimiento).format(formato), //String OPCIONAL DD/MM/YYYY -
            identificacionReceptor: {
                codigoDocumentoDian: codigoDocumentoDian(obj.codigoDocumentoDian), //int -
                numeroIdentificacion: obj.numeroIdentificacion//String -
            },
            identificadorConsecutivo: obj.identificadorConsecutivo, //long -
            identificadorResolucion: obj.identificadorResolucion, //String -
            mediosPago: mediosPago(obj.mediosPago), //String OPCIONAL -
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
            totalFactura: obj.totalFactura.replace(".", "") //decimal OPCIONAL -
        },
        facturaEspecializada: {
            attributes: {
                xmlns: ''
            },
            AtributosAdicionales: {
                AtributoAdicional: [{
                        nombreAtributo: "coordXQr",
                        valor: obj.coordXQr,
                        tipo: "Texto"
                    }, {
                        nombreAtributo: "coordYQr",
                        valor: obj.coordYQr,
                        tipo: "Texto"
                    }, {
                        nombreAtributo: "coordXCufe",
                        valor: obj.coordXCufe,
                        tipo: "Texto"
                    }, {
                        nombreAtributo: "coordYCufe",
                        valor: obj.coordYCufe,
                        tipo: "Texto"
                    }, {
                        nombreAtributo: "rotCufe",
                        valor: 0,
                        tipo: "Texto"
                    }, {
                        nombreAtributo: "pdf",
                        valor: obj.pdf,
                        tipo: "Texto"
                    }]
            }
        }
    };
    callback(false, crearFacturaElectronica);
}

Sincronizacion.$inject = ['m_adquiriente', 'm_autorizado', 'm_centro_costo', 'm_condiciones_entrega', 'm_contacto',
    'm_direccion', 'm_documentos_anexos', 'm_entrega', 'm_facturador', 'm_facturas', 'm_grupo_deducciones',
    'm_grupo_impuestos', 'm_items', 'm_lista_anticipos', 'm_lista_caracteristicas', 'm_lista_cargos_descuentos',
    'm_lista_correcciones', 'm_lista_deducciones', 'm_lista_documentos_referenciados', 'm_lista_impuestos',
    'm_lista_participantes_consorcio', 'm_mandatorio', 'm_notas_referenciadas', 'm_numeracion', 'm_pago',
    'm_periodo_facturacion', 'm_productos', 'm_resolucion', 'm_sucursal', 'm_tasa_cambio', 'm_transportista',
    'm_sincronizacion', 'm_clientes'];

module.exports = Sincronizacion;
