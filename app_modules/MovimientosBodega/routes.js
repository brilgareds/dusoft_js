module.exports = function(app, di_container) {

    // ======== Rutas para Documentos E008 =============

    var c_e008 = di_container.get("c_e008");

    // Generar Documento temporal de despacho clientes
    app.post('/api/movBodegas/E008/documentoTemporalClientes', function(req, res) {
        c_e008.documentoTemporalClientes(req, res);
    });

    // Generar Documento temporal de despacho farmacias
    app.post('/api/movBodegas/E008/documentoTemporalFarmacias', function(req, res) {
        c_e008.documentoTemporalFarmacias(req, res);
    });

    // Ingresar Detalle Documento temporal de farmacias/clientes
    app.post('/api/movBodegas/E008/detalleDocumentoTemporal', function(req, res) {
        c_e008.detalleDocumentoTemporal(req, res);
    });

    // Consultar Documento Temporal Clientes
    app.post('/api/movBodegas/E008/consultarDocumentoTemporalClientes', function(req, res) {
        c_e008.consultarDocumentoTemporalClientes(req, res);
    });
    
    // Consultar Documento Temporal Farmacias
    app.post('/api/movBodegas/E008/consultarDocumentoTemporalFarmacias', function(req, res) {
        c_e008.consultarDocumentoTemporalFarmacias(req, res);
    });

    // Eliminar Documento Temporal Clientes
    app.post('/api/movBodegas/E008/eliminarDocumentoTemporal', function(req, res) {
        c_e008.eliminarDocumentoTemporal(req, res);
    });
    
    // Eliminar Documento Temporal Clientes
    app.post('/api/movBodegas/E008/eliminarDocumentoTemporal', function(req, res) {
        c_e008.eliminarDocumentoTemporal(req, res);
    });

    // Eliminar Documento Temporal
    app.post('/api/movBodegas/E008/eliminarProductoDocumentoTemporal', function(req, res) {
        c_e008.eliminarProductoDocumentoTemporal(req, res);
    });

    // ======== FIN Rutas para Documentos E008 =============    
};