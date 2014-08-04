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
        
    // Consultar TODOS los documentos temporales de despacho clientes 
    app.post('/api/movBodegas/E008/consultarDocumentosTemporalesClientes', function(req, res) {
        c_e008.consultarDocumentosTemporalesClientes(req, res);
    });
    
    // Consultar TODOS los documentos temporales de despacho farmacias  
    app.post('/api/movBodegas/E008/consultarDocumentosTemporalesFarmacias', function(req, res) {
        c_e008.consultarDocumentosTemporalesFarmacias(req, res);
    });
            
    // Consultar los documentos temporales de despacho CLIENTES que un operario de bodega ha creado
    app.post('/api/movBodegas/E008/consultarDocumentoTemporalClientesPorUsuario', function(req, res) {
        c_e008.consultarDocumentosTemporalesClientesPorUsuario(req, res);
    });
    
    // Consultar los documentos temporales de despacho FARMACIAS que un operario de bodega ha creado
    app.post('/api/movBodegas/E008/consultarDocumentosTemporalesFarmaciasPorUsuario', function(req, res) {
        c_e008.consultarDocumentosTemporalesFarmaciasPorUsuario(req, res);
    });

    // Consultar Documento Temporal Clientes x numero de pedido
    app.post('/api/movBodegas/E008/consultarDocumentoTemporalClientes', function(req, res) {
        c_e008.consultarDocumentoTemporalClientes(req, res);
    });
    
    // Consultar Documento Temporal Farmacias x numero de pedido
    app.post('/api/movBodegas/E008/consultarDocumentoTemporalFarmacias', function(req, res) {
        c_e008.consultarDocumentoTemporalFarmacias(req, res);
    });
    
    // Eliminar Producto Documento Temporal CLIENTES / FARMACIAS
    app.post('/api/movBodegas/E008/eliminarProductoDocumentoTemporal', function(req, res) {
        c_e008.eliminarProductoDocumentoTemporal(req, res);
    });
    
    // Eliminar Documento Temporal Despacho Clientes
    app.post('/api/movBodegas/E008/eliminarDocumentoTemporalClientes', function(req, res) {
        c_e008.eliminarDocumentoTemporalClientes(req, res);
    });

    // Eliminar Documento Temporal Clientes
    app.post('/api/movBodegas/E008/eliminarDocumentoTemporalFarmacias', function(req, res) {
        c_e008.eliminarDocumentoTemporalFarmacias(req, res);
    });
    
    // Ingresar Justificacion de productos pendientes en despachos CLIENTES y FARMACIAS
    app.post('/api/movBodegas/E008/justificacionPendientes', function(req, res) {
        c_e008.justificacionPendientes(req, res);
    });
    
    // ======== FIN Rutas para Documentos E008 =============    
};