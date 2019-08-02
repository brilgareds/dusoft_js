
function Facturas() {
    // PROPIEDADES
    this.tipoDocumento = '';
    this.versionDocumento = '';
    this.registrar = false;
    this.control = '';
    this.codigoTipoDocumento = '';
    this.tipoOperacion = '';
    this.prefijoDocumento = '';
    this.numeroDocumento = 0;
    this.fechaEmision = '';
    this.horaEmision = '';
    this.periodoFacturacion = {};
    this.numeroLineas = 0;
    this.subtotal = 0;
    this.totalBaseImponible = 0;
    this.subtotalMasTributos = 0;
    this.totalDescuentos = 0;
    this.totalCargos = 0;
    this.totalAnticipos = 0;
    this.redondeo = 0;
    this.total = 0;
    this.codigoMoneda = '';
    this.tasaCambio = {};
    this.pago = {};
    this.listaProductos = [];
    this.listaDescripciones = [];
    this.listaDocumentosReferenciados = [];
    this.notasReferenciadas = {};
    this.documentosAnexos = [];
    this.listaAnticipos = [];
    this.listaCargosDescuentos = [];
    this.gruposImpuestos = [];
    this.gruposDeducciones = [];
    this.facturador = {};
    this.adquiriente = {};
    this.autorizado = {};
    this.entrega = {};
    this.urlAnexos = '';
    this.base64 = '';
    this.posicionXCufe = 0;
    this.posicionYCufe = 0;
    this.rotacionCufe = 0;
    this.fuenteCufe = '';
    this.posicionXQr = 0;
    this.posicionYQr = 0;

    this.fechaEnvio = '';           // Campo de Factura
    this.descripcionGeneral = '';   // Campo de Factura
    this.resolucion = {};           // Campo de Factura
    this.listaCorrecciones = [];    // Campo de Nota
}


// GET
Facturas.prototype.get_Tipodocumento = function () {
    return this.tipoDocumento;
};

Facturas.prototype.get_Versiondocumento = function () {
    return this.versionDocumento;
};

Facturas.prototype.get_Registrar = function () {
    return this.registrar;
};

Facturas.prototype.get_Control = function () {
    return this.control;
};

Facturas.prototype.get_Codigotipodocumento = function () {
    return this.codigoTipoDocumento;
};

Facturas.prototype.get_Tipooperacion = function () {
    return this.tipoOperacion;
};

Facturas.prototype.get_Prefijodocumento = function () {
    return this.prefijoDocumento;
};

Facturas.prototype.get_Numerodocumento = function () {
    return this.numeroDocumento;
};

Facturas.prototype.get_Fechaemision = function () {
    return this.fechaEmision;
};

Facturas.prototype.get_Horaemision = function () {
    return this.horaEmision;
};

Facturas.prototype.get_Periodofacturacion = function () {
    return this.periodoFacturacion;
};

Facturas.prototype.get_Numerolineas = function () {
    return this.numeroLineas;
};

Facturas.prototype.get_Subtotal = function () {
    return this.subtotal;
};

Facturas.prototype.get_Totalbaseimponible = function () {
    return this.totalBaseImponible;
};

Facturas.prototype.get_Totalcargos = function () {
    return this.totalCargos;
};

Facturas.prototype.get_SubtotalMasTributos = function () {
    return this.subtotalMasTributos;
};

Facturas.prototype.get_TotalDescuentos = function () {
    return this.totalDescuentos;
};

Facturas.prototype.get_Totalanticipos = function () {
    return this.totalAnticipos;
};

Facturas.prototype.get_Redondeo = function () {
    return this.redondeo;
};

Facturas.prototype.get_Total = function () {
    return this.total;
};

Facturas.prototype.get_Codigomoneda = function () {
    return this.codigoMoneda;
};

Facturas.prototype.get_Tasacambio = function () {
    return this.tasaCambio;
};

Facturas.prototype.get_Pago = function () {
    return this.pago;
};

Facturas.prototype.get_Listaproductos = function () {
    return this.listaProductos;
};

Facturas.prototype.get_Listadescripciones = function () {
    return this.listaDescripciones;
};

Facturas.prototype.get_Listadocumentosreferenciados = function () {
    return this.listaDocumentosReferenciados;
};

Facturas.prototype.get_Notasreferenciadas = function () {
    return this.notasReferenciadas;
};

Facturas.prototype.get_Documentosanexos = function () {
    return this.documentosAnexos;
};

Facturas.prototype.get_Listaanticipos = function () {
    return this.listaAnticipos;
};

Facturas.prototype.get_Listacargosdescuentos = function () {
    return this.listaCargosDescuentos;
};

Facturas.prototype.get_Gruposimpuestos = function () {
    return this.gruposImpuestos;
};

Facturas.prototype.get_Gruposdeducciones = function () {
    return this.gruposDeducciones;
};

Facturas.prototype.get_Facturador = function () {
    return this.facturador;
};

Facturas.prototype.get_Adquiriente = function () {
    return this.adquiriente;
};

Facturas.prototype.get_Autorizado = function () {
    return this.autorizado;
};

Facturas.prototype.get_Entrega = function () {
    return this.entrega;
};

Facturas.prototype.get_Urlanexos = function () {
    return this.urlAnexos;
};

Facturas.prototype.get_Base64 = function () {
    return this.base64;
};

Facturas.prototype.get_Posicionxcufe = function () {
    return this.posicionXCufe;
};

Facturas.prototype.get_Posicionycufe = function () {
    return this.posicionYCufe;
};

Facturas.prototype.get_Rotacioncufe = function () {
    return this.rotacionCufe;
};

Facturas.prototype.get_Fuentecufe = function () {
    return this.fuenteCufe;
};

Facturas.prototype.get_Posicionxqr = function () {
    return this.posicionXQr;
};

Facturas.prototype.get_Posicionyqr = function () {
    return this.posicionYQr;
};

Facturas.prototype.get_Fechaenvio = function () {
    return this.fechaEnvio;
};

Facturas.prototype.get_Descripciongeneral = function () {
    return this.descripcionGeneral;
};

Facturas.prototype.get_Resolucion = function () {
    return this.resolucion;
};

// SET

Facturas.prototype.set_Tipodocumento = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.tipoDocumento = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Versiondocumento = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.versionDocumento = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Registrar = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'boolean') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.registrar = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Control = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.control = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Codigotipodocumento = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.codigoTipoDocumento = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Tipooperacion = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.tipoOperacion = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Prefijodocumento = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.prefijoDocumento = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Numerodocumento = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.numeroDocumento = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Fechaemision = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.fechaEmision = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Horaemision = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.horaEmision = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Periodofacturacion = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.periodoFacturacion = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Numerolineas = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.numeroLineas = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Subtotal = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.subtotal = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Totalbaseimponible = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.totalBaseImponible = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_SubtotalMasTributos = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.subtotalMasTributos = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_TotalDescuentos = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.totalDescuentos = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Totalcargos = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.totalCargos = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Totalanticipos = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.totalAnticipos = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Redondeo = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.redondeo = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Total = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.total = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Codigomoneda = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.codigoMoneda = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Tasacambio = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.tasaCambio = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Pago = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.pago = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Listaproductos = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Array') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.listaProductos = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Listadescripciones = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Array') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.listaDescripciones = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Listadocumentosreferenciados = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Array') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.listaDocumentosReferenciados = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Notasreferenciadas = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.notasReferenciadas = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Documentosanexos = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Array') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.documentosAnexos = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Listaanticipos = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Array') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.listaAnticipos = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Listacargosdescuentos = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Array') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.listaCargosDescuentos = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Gruposimpuestos = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Array') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.gruposImpuestos = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Gruposdeducciones = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Array') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.gruposDeducciones = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Facturador = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.facturador = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Adquiriente = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.adquiriente = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Autorizado = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.autorizado = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Entrega = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.entrega = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Urlanexos = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.urlAnexos = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Base64 = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.base64 = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Posicionxcufe = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Integer') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.posicionXCufe = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Posicionycufe = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Integer') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.posicionYCufe = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Rotacioncufe = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Integer') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.rotacionCufe = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Fuentecufe = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.fuenteCufe = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Posicionxqr = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Integer') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.posicionXQr = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Posicionyqr = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Integer') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.posicionYQr = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Fechaenvio = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.fechaEnvio = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Descripciongeneral = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.descripcionGeneral = nuevoValor;
    return respuesta;
};

Facturas.prototype.set_Resolucion = function (nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_ > 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.resolucion = nuevoValor;
    return respuesta;
};

Facturas.prototype.get_ListaCorrecciones = function () {
    return this.listaCorrecciones;
};

Facturas.prototype.set_ListaCorrecciones = function (value) {
    this.listaCorrecciones = value;
};


module.exports = new Facturas;
