
class Facturas {
    constructor () {
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
        this.totalCargos = 0;
        this.totalAnticipos = 0;
        this.totalAnticipos = 0;
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
        this.fechaEnvio = '';
        this.descripcionGeneral = '';
        this.resolucion = {};
    }


    // GET
    get Tipodocumento() {
        return this.tipoDocumento;
    }

    get Versiondocumento() {
        return this.versionDocumento;
    }

    get Registrar() {
        return this.registrar;
    }

    get Control() {
        return this.control;
    }

    get Codigotipodocumento() {
        return this.codigoTipoDocumento;
    }

    get Tipooperacion() {
        return this.tipoOperacion;
    }

    get Prefijodocumento() {
        return this.prefijoDocumento;
    }

    get Numerodocumento() {
        return this.numeroDocumento;
    }

    get Fechaemision() {
        return this.fechaEmision;
    }

    get Horaemision() {
        return this.horaEmision;
    }

    get Periodofacturacion() {
        return this.periodoFacturacion;
    }

    get Numerolineas() {
        return this.numeroLineas;
    }

    get Subtotal() {
        return this.subtotal;
    }

    get Totalbaseimponible() {
        return this.totalBaseImponible;
    }

    get Totalcargos() {
        return this.totalCargos;
    }

    get Totalanticipos() {
        return this.totalAnticipos;
    }

    get Totalanticipos() {
        return this.totalAnticipos;
    }

    get Total() {
        return this.total;
    }

    get Codigomoneda() {
        return this.codigoMoneda;
    }

    get Tasacambio() {
        return this.tasaCambio;
    }

    get Pago() {
        return this.pago;
    }

    get Listaproductos() {
        return this.listaProductos;
    }

    get Listadescripciones() {
        return this.listaDescripciones;
    }

    get Listadocumentosreferenciados() {
        return this.listaDocumentosReferenciados;
    }

    get Notasreferenciadas() {
        return this.notasReferenciadas;
    }

    get Documentosanexos() {
        return this.documentosAnexos;
    }

    get Listaanticipos() {
        return this.listaAnticipos;
    }

    get Listacargosdescuentos() {
        return this.listaCargosDescuentos;
    }

    get Gruposimpuestos() {
        return this.gruposImpuestos;
    }

    get Gruposdeducciones() {
        return this.gruposDeducciones;
    }

    get Facturador() {
        return this.facturador;
    }

    get Adquiriente() {
        return this.adquiriente;
    }

    get Autorizado() {
        return this.autorizado;
    }

    get Entrega() {
        return this.entrega;
    }

    get Urlanexos() {
        return this.urlAnexos;
    }

    get Base64() {
        return this.base64;
    }

    get Posicionxcufe() {
        return this.posicionXCufe;
    }

    get Posicionycufe() {
        return this.posicionYCufe;
    }

    get Rotacioncufe() {
        return this.rotacionCufe;
    }

    get Fuentecufe() {
        return this.fuenteCufe;
    }

    get Posicionxqr() {
        return this.posicionXQr;
    }

    get Posicionyqr() {
        return this.posicionYQr;
    }

    get Fechaenvio() {
        return this.fechaEnvio;
    }

    get Descripciongeneral() {
        return this.descripcionGeneral;
    }

    get Resolucion() {
        return this.resolucion;
    }

    // SET

    set Tipodocumento(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'String') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.tipoDocumento = nuevoValor;
        return respuesta;
    }

    set Versiondocumento(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'String') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.versionDocumento = nuevoValor;
        return respuesta;
    }

    set Registrar(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'boolean') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.registrar = nuevoValor;
        return respuesta;
    }

    set Control(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'String') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.control = nuevoValor;
        return respuesta;
    }

    set Codigotipodocumento(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'String') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.codigoTipoDocumento = nuevoValor;
        return respuesta;
    }

    set Tipooperacion(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'String') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.tipoOperacion = nuevoValor;
        return respuesta;
    }

    set Prefijodocumento(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'String') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.prefijoDocumento = nuevoValor;
        return respuesta;
    }

    set Numerodocumento(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Float') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.numeroDocumento = nuevoValor;
        return respuesta;
    }

    set Fechaemision(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'String') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.fechaEmision = nuevoValor;
        return respuesta;
    }

    set Horaemision(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'String') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.horaEmision = nuevoValor;
        return respuesta;
    }

    set Periodofacturacion(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Object') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.periodoFacturacion = nuevoValor;
        return respuesta;
    }

    set Numerolineas(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Float') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.numeroLineas = nuevoValor;
        return respuesta;
    }

    set Subtotal(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Float') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.subtotal = nuevoValor;
        return respuesta;
    }

    set Totalbaseimponible(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Float') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.totalBaseImponible = nuevoValor;
        return respuesta;
    }

    set Totalcargos(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Float') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.totalCargos = nuevoValor;
        return respuesta;
    }

    set Totalanticipos(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Float') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.totalAnticipos = nuevoValor;
        return respuesta;
    }

    set Totalanticipos(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Float') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.totalAnticipos = nuevoValor;
        return respuesta;
    }

    set Total(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Float') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.total = nuevoValor;
        return respuesta;
    }

    set Codigomoneda(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'String') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.codigoMoneda = nuevoValor;
        return respuesta;
    }

    set Tasacambio(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Object') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.tasaCambio = nuevoValor;
        return respuesta;
    }

    set Pago(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Object') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.pago = nuevoValor;
        return respuesta;
    }

    set Listaproductos(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Array') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.listaProductos = nuevoValor;
        return respuesta;
    }

    set Listadescripciones(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Array') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.listaDescripciones = nuevoValor;
        return respuesta;
    }

    set Listadocumentosreferenciados(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Array') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.listaDocumentosReferenciados = nuevoValor;
        return respuesta;
    }

    set Notasreferenciadas(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Object') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.notasReferenciadas = nuevoValor;
        return respuesta;
    }

    set Documentosanexos(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Array') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.documentosAnexos = nuevoValor;
        return respuesta;
    }

    set Listaanticipos(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Array') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.listaAnticipos = nuevoValor;
        return respuesta;
    }

    set Listacargosdescuentos(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Array') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.listaCargosDescuentos = nuevoValor;
        return respuesta;
    }

    set Gruposimpuestos(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Array') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.gruposImpuestos = nuevoValor;
        return respuesta;
    }

    set Gruposdeducciones(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Array') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.gruposDeducciones = nuevoValor;
        return respuesta;
    }

    set Facturador(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Object') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.facturador = nuevoValor;
        return respuesta;
    }

    set Adquiriente(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Object') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.adquiriente = nuevoValor;
        return respuesta;
    }

    set Autorizado(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Object') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.autorizado = nuevoValor;
        return respuesta;
    }

    set Entrega(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Object') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.entrega = nuevoValor;
        return respuesta;
    }

    set Urlanexos(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'String') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.urlAnexos = nuevoValor;
        return respuesta;
    }

    set Base64(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'String') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.base64 = nuevoValor;
        return respuesta;
    }

    set Posicionxcufe(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Integer') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.posicionXCufe = nuevoValor;
        return respuesta;
    }

    set Posicionycufe(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Integer') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.posicionYCufe = nuevoValor;
        return respuesta;
    }

    set Rotacioncufe(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Integer') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.rotacionCufe = nuevoValor;
        return respuesta;
    }

    set Fuentecufe(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'String') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.fuenteCufe = nuevoValor;
        return respuesta;
    }

    set Posicionxqr(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Integer') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.posicionXQr = nuevoValor;
        return respuesta;
    }

    set Posicionyqr(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Integer') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.posicionYQr = nuevoValor;
        return respuesta;
    }

    set Fechaenvio(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'String') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.fechaEnvio = nuevoValor;
        return respuesta;
    }

    set Descripciongeneral(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'String') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.descripcionGeneral = nuevoValor;
        return respuesta;
    }

    set Resolucion(nuevoValor) {
        let respuesta = {status: false, msj: '', errorCount: 0};
        if (nuevoValor.length() > 20) {
            respuesta.errorCount++;
            respuesta.msj += 'tamaño no permitido (' + nuevoValor.length() + '), ';
        }
        if (typeOf(nuevoValor) === 'Object') {
            respuesta.errorCount++;
            respuesta.msj += 'tipo valor no permitido (' + typeOf(nuevoValor) + '), ';
        }
        if (respuesta.errorCount > 0) {
            respuesta.msj.substring(0, respuesta.msj.length - 2);
        } else {
            respuesta.status = true;
            respuesta.msj = 'ok';
        }
        this.resolucion = nuevoValor;
        return respuesta;
    }

    // FUNCIONES
    
}

module.exports = new Facturas;
