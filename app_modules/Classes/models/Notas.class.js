
function Notas() {
    // PROPIEDADES
    this.tipoDocumento = '';
    this.versionDocumento = '';
    this.registrar = false;
    this.control = '';
    this.cvcc = '';
    this.formato = '';
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
Notas.prototype.get_Tipodocumento = function() {
    return this.tipoDocumento;
};

Notas.prototype.get_Versiondocumento = function() {
    return this.versionDocumento;
};

Notas.prototype.get_Registrar = function() {
    return this.registrar;
};

Notas.prototype.get_Control = function() {
    return this.control;
};

Notas.prototype.get_Cvcc = function() {
    return this.cvcc;
};

Notas.prototype.get_Formato = function() {
    return this.formato;
};

Notas.prototype.get_Codigotipodocumento = function() {
    return this.codigoTipoDocumento;
};

Notas.prototype.get_Tipooperacion = function() {
    return this.tipoOperacion;
};

Notas.prototype.get_Prefijodocumento = function() {
    return this.prefijoDocumento;
};

Notas.prototype.get_Numerodocumento = function() {
    return this.numeroDocumento;
};

Notas.prototype.get_Fechaemision = function() {
    return this.fechaEmision;
};

Notas.prototype.get_Horaemision = function() {
    return this.horaEmision;
};

Notas.prototype.get_Periodofacturacion = function() {
    return this.periodoFacturacion;
};

Notas.prototype.get_Numerolineas = function() {
    return this.numeroLineas;
};

Notas.prototype.get_Subtotal = function() {
    return this.subtotal;
};

Notas.prototype.get_Totalbaseimponible = function() {
    return this.totalBaseImponible;
};

Notas.prototype.get_Totalcargos = function() {
    return this.totalCargos;
};

Notas.prototype.get_SubtotalMasTributos = function() {
    return this.subtotalMasTributos;
};

Notas.prototype.get_TotalDescuentos = function() {
    return this.totalDescuentos;
};

Notas.prototype.get_Totalanticipos = function() {
    return this.totalAnticipos;
};

Notas.prototype.get_Redondeo = function() {
    return this.redondeo;
};

Notas.prototype.get_Total = function() {
    return this.total;
};

Notas.prototype.get_Codigomoneda = function() {
    return this.codigoMoneda;
};

Notas.prototype.get_Tasacambio = function() {
    return this.tasaCambio;
};

Notas.prototype.get_Pago = function() {
    return this.pago;
};

Notas.prototype.get_Listaproductos = function() {
    return this.listaProductos;
};

Notas.prototype.get_Listadescripciones = function() {
    return this.listaDescripciones;
};

Notas.prototype.get_Listadocumentosreferenciados = function() {
    return this.listaDocumentosReferenciados;
};

Notas.prototype.get_Notasreferenciadas = function() {
    return this.notasReferenciadas;
};

Notas.prototype.get_Documentosanexos = function() {
    return this.documentosAnexos;
};

Notas.prototype.get_Listaanticipos = function() {
    return this.listaAnticipos;
};

Notas.prototype.get_Listacargosdescuentos = function() {
    return this.listaCargosDescuentos;
};

Notas.prototype.get_Gruposimpuestos = function() {
    return this.gruposImpuestos;
};

Notas.prototype.get_Gruposdeducciones = function() {
    return this.gruposDeducciones;
};

Notas.prototype.get_Facturador = function() {
    return this.facturador;
};

Notas.prototype.get_Adquiriente = function() {
    return this.adquiriente;
};

Notas.prototype.get_Autorizado = function() {
    return this.autorizado;
};

Notas.prototype.get_Entrega = function() {
    return this.entrega;
};

Notas.prototype.get_Urlanexos = function() {
    return this.urlAnexos;
};

Notas.prototype.get_Base64 = function() {
    return this.base64;
};

Notas.prototype.get_Posicionxcufe = function() {
    return this.posicionXCufe;
};

Notas.prototype.get_Posicionycufe = function() {
    return this.posicionYCufe;
};

Notas.prototype.get_Rotacioncufe = function() {
    return this.rotacionCufe;
};

Notas.prototype.get_Fuentecufe = function() {
    return this.fuenteCufe;
};

Notas.prototype.get_Posicionxqr = function() {
    return this.posicionXQr;
};

Notas.prototype.get_Posicionyqr = function() {
    return this.posicionYQr;
};

Notas.prototype.get_Fechaenvio = function() {
    return this.fechaEnvio;
};

Notas.prototype.get_Descripciongeneral = function() {
    return this.descripcionGeneral;
};

Notas.prototype.get_Resolucion = function() {
    return this.resolucion;
};

// SET

Notas.prototype.set_Tipodocumento = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.tipoDocumento = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Versiondocumento = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.versionDocumento = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Registrar = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'boolean') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.registrar = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Control = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.control = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Cvcc = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 23) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.cvcc = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Formato = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length === 4) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.formato = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Codigotipodocumento = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.codigoTipoDocumento = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Tipooperacion = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.tipoOperacion = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Prefijodocumento = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.prefijoDocumento = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Numerodocumento = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.numeroDocumento = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Fechaemision = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.fechaEmision = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Horaemision = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.horaEmision = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Periodofacturacion = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.periodoFacturacion = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Numerolineas = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.numeroLineas = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Subtotal = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.subtotal = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Totalbaseimponible = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.totalBaseImponible = nuevoValor;
    return respuesta;
};

Notas.prototype.set_SubtotalMasTributos = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.subtotalMasTributos = nuevoValor;
    return respuesta;
};

Notas.prototype.set_TotalDescuentos = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.totalDescuentos = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Totalcargos = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.totalCargos = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Totalanticipos = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.totalAnticipos = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Redondeo = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};

    if (!nuevoValor || !(typeof nuevoValor === 'Float')) {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.redondeo = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Total = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Float') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.total = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Codigomoneda = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.codigoMoneda = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Tasacambio = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.tasaCambio = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Pago = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.pago = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Listaproductos = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Array') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.listaProductos = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Listadescripciones = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Array') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.listaDescripciones = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Listadocumentosreferenciados = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Array') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.listaDocumentosReferenciados = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Notasreferenciadas = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.notasReferenciadas = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Documentosanexos = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Array') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.documentosAnexos = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Listaanticipos = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Array') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.listaAnticipos = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Listacargosdescuentos = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Array') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.listaCargosDescuentos = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Gruposimpuestos = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Array') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.gruposImpuestos = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Gruposdeducciones = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Array') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.gruposDeducciones = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Facturador = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.facturador = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Adquiriente = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.adquiriente = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Autorizado = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.autorizado = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Entrega = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.entrega = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Urlanexos = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.urlAnexos = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Base64 = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.base64 = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Posicionxcufe = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Integer') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.posicionXCufe = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Posicionycufe = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Integer') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.posicionYCufe = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Rotacioncufe = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Integer') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.rotacionCufe = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Fuentecufe = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.fuenteCufe = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Posicionxqr = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Integer') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.posicionXQr = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Posicionyqr = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Integer') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.posicionYQr = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Fechaenvio = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.fechaEnvio = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Descripciongeneral = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'String') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.descripcionGeneral = nuevoValor;
    return respuesta;
};

Notas.prototype.set_Resolucion = function(nuevoValor) {
    let respuesta = {status: false, msj: '', errorCount: 0};
    if (nuevoValor.length > 20) {
        respuesta.errorCount++;
        respuesta.msj += 'tamaño no permitido (' + nuevoValor.length + '), ';
    }
    if (typeof nuevoValor === 'Object') {
        respuesta.errorCount++;
        respuesta.msj += 'tipo valor no permitido (' + typeof nuevoValor + '), ';
    }
    if (respuesta.errorCount_> 0) {
        respuesta.msj.substring(0, respuesta.msj.length - 2);
    } else {
        respuesta.status = true;
        respuesta.msj = 'ok';
    }
    this.resolucion = nuevoValor;
    return respuesta;
};

Notas.prototype.get_ListaCorrecciones = function() {
    return this.listaCorrecciones;
};

Notas.prototype.set_ListaCorrecciones = function(value) {
    this.listaCorrecciones = value;
};

module.exports = new Notas;