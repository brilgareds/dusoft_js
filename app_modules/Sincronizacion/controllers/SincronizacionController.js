/* global G, fetch */
'use strict';

let that;

let Sincronizacion = function () {

};

Sincronizacion.prototype.facturacionElectronica = function (req, callback) {
    var that = this;

    G.Q.nfcall(__jsonFacturaAjdunto, req).then(function (resultado) {

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

        var pdf = resultado.result.ConsultaResultadoValidacionDocumentosResponse.documento;
        var y = G.base64.base64Decode(pdf, G.dirname + "/public/reports/doc_dian/" + req.factura + ".pdf");
        callback(false, req.factura + ".pdf");

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
    var tmp = {lastRequest: {}};
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
        ConsultaResultadoValidacionDocumentosPeticion: {
            tipoDocumento: obj.tipoDocumento, //obj.tipoDocumento,//factura
            numeroDocumento: obj.factura, //prefijo_nofactura
            tipoRespuesta: obj.tipoRespuesta
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
                    baseGravable: obj.baseGravableIVA.split(",", 1) //decimal -
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

    if (obj.productos.length > 0) {
        crearNotaCredito.notaCreditoElectronicaCanonica.productos = obj.productos;
    } else {
        crearNotaCredito.notaCreditoElectronicaCanonica.productos = {cantidad: 0, descripcion: "no aplica", identificador: "0", valorUnitario: 0};
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
                    baseGravable: obj.baseGravableIVA.split(",", 1) //decimal -
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

    if (obj.productos.length > 0) {
        crearNotaDebito.notaDebitoElectronicaCanonica.productos = obj.productos;
    } else {
        crearNotaDebito.notaDebitoElectronicaCanonica.productos = {cantidad: 0, descripcion: "no aplica", identificador: "0", valorUnitario: 0};
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

Sincronizacion.$inject = [];

module.exports = Sincronizacion;
