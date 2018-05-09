module.exports = function (app, di_container) {

    // ======== Rutas para Documentos Temporales E017 =============

    var c_e017 = di_container.get("c_e017");

    app.post('/api/movBodegas/E017/listarBodegas', function (req, res) {
        c_e017.listarBodegas(req, res);
    });

    app.post('/api/movBodegas/E017/listarBodegaId', function (req, res) {
        c_e017.listarBodegaId(req, res);
    });

    app.post('/api/movBodegas/E017/crearDocumento', function (req, res) {
        c_e017.crearDocumento(req, res);
    });
    
    app.post('/api/movBodegas/E017/newDocTemporal', function (req, res) {
        c_e017.newDocTemporal(req, res);
    });
 
    app.post('/api/movBodegas/E017/eliminarGetDocTemporal', function (req, res) {
        c_e017.eliminarGetDocTemporal(req, res);
    });
    
    app.post('/api/movBodegas/E017/consultarProductosTraslados', function (req, res) {
        c_e017.consultarProductosTraslados(req, res);
    });

    app.post('/api/movBodegas/E017/listarProductos', function (req, res) {
        c_e017.listarProductos(req, res);
    });

    app.post('/api/movBodegas/E017/eliminarItem', function (req, res) {
        c_e017.eliminarItem(req, res);
    });

    app.post('/api/movBodegas/E017/agregarItem', function (req, res) {
        c_e017.agregarItem(req, res);
    });
    
    app.post('/api/movBodegas/E017/crearHtmlDocumento', function (req, res) {
        c_e017.crearHtmlDocumento(req, res);
    });

};