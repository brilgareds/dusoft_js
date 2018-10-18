module.exports = function (app, di_container) {

    var c_caja_general = di_container.get("c_caja_general");
    var c_sincronizacion = di_container.get("c_sincronizacion");

    app.post('/api/Sincronizacion/facturacionElectronica', function (req, res) {
        c_sincronizacion.facturacionElectronica(req, res);
    });

    app.post('/api/CajaGeneral/listarCajaGeneral', function (req, res) {
        c_caja_general.listarCajaGeneral(req, res);
    });

    app.post('/api/CajaGeneral/listarGrupos', function (req, res) {
        c_caja_general.listarGrupos(req, res);
    });

    app.post('/api/CajaGeneral/insertarTmpDetalleConceptos', function (req, res) {
        c_caja_general.insertarTmpDetalleConceptos(req, res);
    });

    app.post('/api/CajaGeneral/listarConceptosDetalle', function (req, res) {
        c_caja_general.listarConceptosDetalle(req, res);
    });

    app.post('/api/CajaGeneral/eliminarTmpDetalleConceptos', function (req, res) {
        c_caja_general.eliminarTmpDetalleConceptos(req, res);
    });

    app.post('/api/CajaGeneral/guardarFacturaCajaGenral', function (req, res) {
        c_caja_general.guardarFacturaCajaGeneral(req, res);
    });

    app.post('/api/CajaGeneral/listarFacturasGeneradasNotas', function (req, res) {
        c_caja_general.listarFacturasGeneradasNotas(req, res);
    });

    app.post('/api/CajaGeneral/imprimirFacturaNotas', function (req, res) {
        c_caja_general.imprimirFacturaNotas(req, res);
    });

    app.post('/api/CajaGeneral/sincronizarFacturaNotas', function (req, res) {
        c_caja_general.sincronizarFacturaNotas(req, res);
    });

    app.post('/api/CajaGeneral/listarPrefijos', function (req, res) {
        c_caja_general.listarPrefijos(req, res);
    });

    app.post('/api/CajaGeneral/insertarFacFacturasConceptosNotas', function (req, res) {
        c_caja_general.insertarFacFacturasConceptosNotas(req, res);
    });

    app.post('/api/CajaGeneral/listarFacConceptosNotas', function (req, res) {
        c_caja_general.listarFacConceptosNotas(req, res);
    });

    app.post('/api/CajaGeneral/imprimirFacturaNotasDetalle', function (req, res) {
        c_caja_general.imprimirFacturaNotasDetalle(req, res);
    });

    app.post('/api/CajaGeneral/imprimirNota', function (req, res) {
        c_caja_general.imprimirNota(req, res);
    });

    app.post('/api/CajaGeneral/listarNotas', function (req, res) {
        c_caja_general.listarNotas(req, res);
    });

    app.post('/api/CajaGeneral/consultarImpuestosTercero', function (req, res) {
        c_caja_general.consultarImpuestosTercero(req, res);
    });

    app.post('/api/CajaGeneral/generarSincronizacionDian', function (req, res) {
        c_caja_general.generarSincronizacionDian(req, res);
    });
};