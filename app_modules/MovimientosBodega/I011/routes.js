module.exports = function (app, di_container) {

    // ======== Rutas para Documentos Temporales E009 =============

    var c_e009 = di_container.get("c_e009");

    // Generar Documento temporal de despacho clientes
    app.post('/api/movBodegas/E009/documentoTemporalClientes', function (req, res) {
        c_e009.documentoTemporalClientes(req, res);
    });

    app.post('/api/movBodegas/E009/listarBodegas', function (req, res) {
        c_e009.listarBodegas(req, res);
    });

    app.post('/api/movBodegas/E009/newDocTemporal', function (req, res) {
        c_e009.newDocTemporal(req, res);
    });

    app.post('/api/movBodegas/E009/listarProductos', function (req, res) {
        c_e009.listarProductos(req, res);
    });

    app.post('/api/movBodegas/E009/eliminarGetDocTemporal', function (req, res) {
        c_e009.eliminarGetDocTemporal(req, res);
    });

    app.post('/api/movBodegas/E009/eliminarItem', function (req, res) {
        c_e009.eliminarItem(req, res);
    });

    app.post('/api/movBodegas/E009/agregarItem', function (req, res) {
        c_e009.agregarItem(req, res);
    });

    app.post('/api/movBodegas/E009/consultarDetalleDevolucion', function (req, res) {
        c_e009.consultarDetalleDevolucion(req, res);
    });

    app.post('/api/movBodegas/E009/crearDocumento', function (req, res) {
        c_e009.crearDocumento(req, res);
    });

};