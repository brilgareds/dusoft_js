module.exports = function(app, di_container) {

    var c_movimientos_bodega = di_container.get("c_movimientos_bodega");

    // Consultar documentos del usuario
    app.post('/api/movBodegas/consultarDocumentosUsuario', function(req, res) {
        c_movimientos_bodega.consultarDocumentosUsuario(req, res);
    });
    
    // Actualizar bodegas_doc_id en documento temporal.
    app.post('/api/movBodegas/actualizarTipoDocumentoTemporal', function(req, res) {
        c_movimientos_bodega.actualizarTipoDocumentoTemporal(req, res);
    });
    
    /*app.post('/api/movBodegas/imprimirDocumentoDespacho', function(req, res) {
        c_movimientos_bodega.imprimirDocumentoDespacho(req, res);
    });*/
    

};