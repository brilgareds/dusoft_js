module.exports = function (app, di_container) {

    // ======== Rutas para Documentos Temporales I008 =============

    var c_i008 = di_container.get("c_i008");
    
    app.post('/api/movBodegas/I008/listarTraslados', function (req, res) {
        c_i008.listarTraslados(req, res);
    });

    app.post('/api/movBodegas/I008/listarProductosTraslados', function (req, res) {
        c_i008.listarProductosTraslados(req, res);
    });

    app.post('/api/movBodegas/I008/newDocTemporal', function (req, res) {
        c_i008.newDocTemporal(req, res);
    });
       
    app.post('/api/movBodegas/I008/eliminarGetDocTemporal', function (req, res) {
        c_i008.eliminarGetDocTemporal(req, res);
    });
    
    app.post('/api/movBodegas/I008/agregarItem', function (req, res) {
        c_i008.agregarItem(req, res);
    });
    
    app.post('/api/movBodegas/I008/listarProductosValidados', function (req, res) {
        c_i008.listarProductosValidados(req, res);
    });
    
    app.post('/api/movBodegas/I008/eliminarItem', function (req, res) {
        c_i008.eliminarItem(req, res);
    });
    
    app.post('/api/movBodegas/I008/listarDocumentoId', function (req, res) {
        c_i008.listarDocumentoId(req, res);
    });

    app.post('/api/movBodegas/I008/crearDocumento', function (req, res) {
        c_i008.crearDocumento(req, res);
    });
    
    app.post('/api/movBodegas/I008/crearHtmlDocumento', function (req, res) {
        c_i008.crearHtmlDocumento(req, res);
    });

};