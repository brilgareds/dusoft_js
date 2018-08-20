module.exports = function (app, di_container) {

    var c_i007 = di_container.get("c_i007");

    app.post('/api/movBodegas/I007/listarTiposTerceros', function (req, res) {
        c_i007.listarTiposTerceros(req, res);
    });

    app.post('/api/movBodegas/I007/listarTerceros', function (req, res) {
        c_i007.listarTerceros(req, res);
    });

    app.post('/api/movBodegas/I007/listarPrestamos', function (req, res) {
        c_i007.listarPrestamos(req, res);
    });

    app.post('/api/movBodegas/I007/listarProductos', function (req, res) {
        c_i007.listarProductos(req, res);
    });
    
    app.post('/api/movBodegas/I007/listarProductosTraslado', function (req, res) {
        c_i007.consultarProductosTraslado(req, res);
    });

    app.post('/api/movBodegas/I007/newDocTemporal', function (req, res) {
        c_i007.newDocTemporal(req, res);
    });

    app.post('/api/movBodegas/I007/eliminarGetDocTemporal', function (req, res) {
        c_i007.eliminarGetDocTemporal(req, res);
    });

    app.post('/api/movBodegas/I007/agregarItem', function (req, res) {
        c_i007.agregarItem(req, res);
    });

    app.post('/api/movBodegas/I007/eliminarItem', function (req, res) {
        c_i007.eliminarItem(req, res);
    });

    app.post('/api/movBodegas/I007/listarTerceroId', function (req, res) {
        c_i007.listarTerceroId(req, res);
    });

    app.post('/api/movBodegas/I007/listarPrestamoId', function (req, res) {
        c_i007.listarPrestamoId(req, res);
    });

     app.post('/api/movBodegas/I007/crearDocumento', function (req, res) {
     c_i007.crearDocumento(req, res);
     });
     
     app.post('/api/movBodegas/I007/crearHtmlDocumento', function (req, res) {
     c_i007.crearHtmlDocumento(req, res);
     });

};