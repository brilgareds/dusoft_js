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
    
    // Borrar producto del temporal.
    app.post('/api/movBodegas/eliminar_producto_movimiento_bodega_temporal', function(req, res) {
        c_movimientos_bodega.eliminar_producto_movimiento_bodega_temporal(req, res);
    });
    //
    app.post('/api/movBodegas/addItemDocTemporal', function(req, res) {       
        c_movimientos_bodega.addItemDocTemporal(req, res);
    });
    
    app.post('/api/movBodegas/crearDocumento', function(req, res) {       
        c_movimientos_bodega.crearDocumento(req, res);
    });
    
    app.post('/api/movBodegas/obtenerDocumetosTemporales', function(req, res) {       
        c_movimientos_bodega.obtenerDocumetosTemporales(req, res);
    });
    
    app.post('/api/movBodegas/getTiposDocumentosBodegaUsuario', function(req, res) {       
        c_movimientos_bodega.getTiposDocumentosBodegaUsuario(req, res);
    });
    
    /*app.post('/api/movBodegas/imprimirDocumentoDespacho', function(req, res) {
        c_movimientos_bodega.imprimirDocumentoDespacho(req, res);
    });*/
    

};